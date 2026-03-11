'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { ALL, SUBJECTS, ELECTIVAS, getSubjectById } from '../lib/data';
import { supabase } from '../lib/supabase';
import { useRouter, usePathname } from 'next/navigation';

const PlanContext = createContext<any>(null);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [materias, setMaterias] = useState<any>(() => {
    const initialState: any = {};
    ALL.forEach((s: any) => initialState[s.id] = 'disabled');
    SUBJECTS.filter((s: any) => s.level === 1).forEach((s: any) => initialState[s.id] = 'available');
    return initialState;
  });
  const router = useRouter();
  const pathname = usePathname();

  const [stats, setStats] = useState({ aprobadas: 0, cursadas: 0, total: 0, porcentaje: 0 });

  const calcularDisponibilidad = (currentState: any) => {
    const newState = { ...currentState };

    ALL.forEach((s: any) => {
      if (s.isElectivePlaceholder) return;

      const cursadaOk = s.correlCursada.every((cid: any) => newState[cid] === 'cursada' || newState[cid] === 'aprobada');
      const aprobadaOk = s.correlAprobada.every((cid: any) => newState[cid] === 'aprobada');
      const isAvailable = cursadaOk && aprobadaOk;

      if (newState[s.id] === 'disabled' && isAvailable) newState[s.id] = 'available';
      if (newState[s.id] === 'available' && !isAvailable) newState[s.id] = 'disabled';
    });

    return newState;
  };

  const calcularElectivas = (currentState: any) => {
    const newState = { ...currentState };
    let hrsAprobadasAnalista = 0, hrsCursadasAnalista = 0;
    let hrsAprobadasIng = 0, hrsCursadasIng = 0;

    [3, 4, 5].forEach(lvl => {
      if (!ELECTIVAS[lvl as keyof typeof ELECTIVAS]) return;
      ELECTIVAS[lvl as keyof typeof ELECTIVAS].forEach((el: any) => {
        if (newState[el.id] === 'aprobada') {
          hrsAprobadasIng += el.annualHours;
          if (!el.onlyIngenieria) hrsAprobadasAnalista += el.annualHours;
        } else if (newState[el.id] === 'cursada') {
          hrsCursadasIng += el.annualHours;
          if (!el.onlyIngenieria) hrsCursadasAnalista += el.annualHours;
        }
      });
    });

    const thresholds: any = { 3: 4, 4: 10, 5: 20 };
    [3, 4, 5].forEach(lvl => {
      const placeholder = ALL.find((s: any) => s.isElectivePlaceholder && s.level === lvl);
      if (!placeholder) return;

      const target = thresholds[lvl];
      const hrsAp = lvl === 3 ? hrsAprobadasAnalista : hrsAprobadasIng;
      const hrsCu = lvl === 3 ? hrsCursadasAnalista : hrsCursadasIng;
      const totalActive = hrsAp + hrsCu;

      if (hrsAp >= target) newState[placeholder.id] = 'aprobada';
      else if (totalActive >= target) newState[placeholder.id] = 'cursada';
      else newState[placeholder.id] = 'available';
    });

    return newState;
  };

  const calcularEstadisticas = (currentState: any) => {
    const coreSubjects = ALL.filter((s: any) => typeof s.id === 'number' || s.id === 'SEM' || s.id === 'PPS');
    const realElectives = ALL.filter((s: any) => s.annualHours !== undefined);

    const ap = coreSubjects.filter((s: any) => currentState[s.id] === 'aprobada').length +
               realElectives.filter((s: any) => currentState[s.id] === 'aprobada').length;

    const cu = coreSubjects.filter((s: any) => currentState[s.id] === 'cursada').length +
               realElectives.filter((s: any) => currentState[s.id] === 'cursada').length;

    const electivasTomadas = realElectives.filter((s: any) => currentState[s.id] === 'cursada' || currentState[s.id] === 'aprobada').length;
    const total = coreSubjects.length + electivasTomadas;

    setStats({
      aprobadas: ap,
      cursadas: cu,
      total: total,
      porcentaje: total === 0 ? 0 : Math.round((ap / total) * 100)
    });
  };

  const isAnalistaReady = (currentState: any) => {
    const lvl123 = ALL.filter((s: any) => typeof s.id === 'number' && s.level <= 3);
    const coreSubjectsAnalistaReady = lvl123.every((s: any) => currentState[s.id] === 'aprobada');
    
    let horasElectivasAnalista = 0;
    ALL.forEach((s: any) => {
      if (s.annualHours && currentState[s.id] === 'aprobada' && !s.onlyIngenieria) {
        horasElectivasAnalista += s.annualHours;
      }
    });

    return coreSubjectsAnalistaReady && horasElectivasAnalista >= 4;
  };

  const verificarHitos = (currentState: any) => {
    const newState = { ...currentState };
    const analistaReady = isAnalistaReady(newState);

    // Si pierde los requisitos pero la tenía aprobada, se la bajamos a cursada
    if (!analistaReady && newState['SEM'] === 'aprobada') {
      newState['SEM'] = 'cursada';
    }

    return newState;
  };

  const cambiarEstadoMateria = (id: any, nuevoEstado: string) => {
    setMaterias((prev: any) => {
      let stateActualizado = { ...prev };
      const subject: any = getSubjectById(id);

      if (subject?.isSeminario) {
        if (nuevoEstado === 'aprobada') {
          // Si hace click izquierdo, verificamos si tiene permisos para aprobarla
          if (isAnalistaReady(stateActualizado)) {
            stateActualizado[id] = stateActualizado[id] === 'aprobada' ? 'available' : 'aprobada';
          } else {
            // Si no cumple, el click izquierdo funciona como "cursada" de forma silenciosa
            stateActualizado[id] = stateActualizado[id] === 'cursada' ? 'available' : 'cursada';
          }
        } else {
          // Si hace click derecho (cursada)
          stateActualizado[id] = stateActualizado[id] === nuevoEstado ? 'available' : nuevoEstado;
        }
      } else {
        // Comportamiento normal para el resto de materias
        if (stateActualizado[id] === nuevoEstado) {
          stateActualizado[id] = 'available'; 
        } else {
          stateActualizado[id] = nuevoEstado;
        }
      }

      stateActualizado = calcularDisponibilidad(stateActualizado);
      stateActualizado = calcularElectivas(stateActualizado);
      stateActualizado = verificarHitos(stateActualizado); 
      calcularEstadisticas(stateActualizado);

      // Guardar en la nube silenciosamente
      if (user) {
        supabase.from('progreso_usuarios').update({ estado_materias: stateActualizado }).eq('id_usuario', user.id).then();
      }

      return stateActualizado;
    });
  };

  // --- INICIO SESIÓN Y CARGA DE DATOS ---
  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      const { data, error } = await supabase.from('progreso_usuarios').select('estado_materias').eq('id_usuario', userId).single();
      
      if (data && data.estado_materias) {
        // Si hay datos en la nube, los cargamos y recalculamos
        setMaterias(data.estado_materias);
        let stateRecargado = calcularDisponibilidad(data.estado_materias);
        stateRecargado = calcularElectivas(stateRecargado);
        stateRecargado = verificarHitos(stateRecargado);
        calcularEstadisticas(stateRecargado);
      } else if (error && error.code === 'PGRST116') {
        // Si no existe el usuario, lo creamos con las materias en blanco
        const estadoInicialBase = calcularDisponibilidad(materias); // El estado inicial que se carga por defecto
        await supabase.from('progreso_usuarios').insert({
          id_usuario: userId,
          estado_materias: estadoInicialBase
        });
      }
      setLoadingAuth(false);
    };

    // 1. Revisamos si ya hay sesión activa
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
        if (pathname === '/login') {
          router.push('/'); // <-- Cambio acá
        }
      } else {
        if (pathname !== '/login') {
          router.push('/login'); // <-- Cambio acá
        }
      }
    });

    // 2. Escuchamos cambios de sesión (cuando el usuario se loguea o desloguea)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
        if (pathname === '/login') {
          router.push('/'); // <-- Cambio acá
        }
      } else {
        if (pathname !== '/login') {
          router.push('/login'); // <-- Cambio acá
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PlanContext.Provider value={{ materias, stats, cambiarEstadoMateria }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  return useContext(PlanContext);
}