'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getCareerData, CareerData } from '../lib/data/registry';
import MaintenanceScreen from '../components/MaintenanceScreen';
import { useRouter } from 'next/navigation';

interface PlanContextType {
  materias: any;
  detalles: any;
  stats: any;
  user: any;
  loading: boolean;
  careerId: string;
  careerData: CareerData;
  todasLasCarreras: string[];
  setCarreraActiva: (id: string) => void;
  agregarCarrera: (id: string) => Promise<void>;
  borrarCarrera: (id: string) => Promise<void>; 
  cambiarEstadoMateria: (id: string, accion: string) => void;
  actualizarDetalleMateria: (id: string, info: any) => void;
  reiniciarProgreso: () => Promise<void>;
  marcarMultiplesAprobadas: (ids: string[]) => Promise<void>;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  const [careerId, setCareerId] = useState('');
  const [todasLasCarreras, setTodasLasCarreras] = useState<string[]>([]);
  const careerData = getCareerData(careerId || 'utn-sistemas-2023');

  const [materias, setMaterias] = useState<any>({});
  const [detalles, setDetalles] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [stats, setStats] = useState({
    aprobadas: 0, cursadas: 0, cursando: 0, porcentaje: 0, promedio: 0, totalMaterias: 36
  });

  const upsertMateria = async (materiaId: string, estado: string, info: any = {}) => {
    if (!user) return;
    await supabase.from('usuario_materias').upsert({
      user_id: user.id,
      materia_id: materiaId,
      estado: estado,
      nota_final: info.notaFinal || null,
      dificultad: info.dificultad || null,
      comision: info.comision || null,
      horarios_custom: info.horariosCustom || null, // 🔥 RECUPERAMOS EL GUARDADO DE HORARIOS 
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,materia_id' });
  };

  const evaluarCorrelativas = (estadosActuales: any, currentData: CareerData) => {
    const { ALL, ELECTIVAS } = currentData;
    let estados = { ...estadosActuales };
    let huboCambios = true;

    while (huboCambios) {
      huboCambios = false;
      let hAprobadaIng = 0; let hCursadaIng = 0;

      if (ELECTIVAS) {
        Object.values(ELECTIVAS).flat().forEach((el: any) => {
          if (estados[el.id] === 'aprobada') hAprobadaIng += el.annualHours || 0;
          else if (estados[el.id] === 'cursada') hCursadaIng += el.annualHours || 0;
        });
      }

      ALL.forEach((m: any) => {
        const idStr = m.id.toString();
        const estadoActual = estados[idStr];

        if (m.isElectivePlaceholder) {
          const target = m.targetHours || 10;
          let newState = 'available';
          if (hAprobadaIng >= target) newState = 'aprobada';
          else if ((hAprobadaIng + hCursadaIng) >= target) newState = 'cursada';
          if (estadoActual !== newState) { estados[idStr] = newState; huboCambios = true; }
          return;
        }

        const reqCursadaOK = m.correlCursada?.every((reqId: any) => ['cursada', 'aprobada'].includes(estados[reqId.toString()])) ?? true;
        const reqAprobadaOK = m.correlAprobada?.every((reqId: any) => estados[reqId.toString()] === 'aprobada') ?? true;
        const cumple = reqCursadaOK && reqAprobadaOK;

        if (!cumple && estadoActual !== 'disabled') { estados[idStr] = 'disabled'; huboCambios = true; }
        else if (cumple && (estadoActual === 'disabled' || !estadoActual)) { estados[idStr] = 'available'; huboCambios = true; }
      });
    }
    return estados;
  };

  const calcularEstadisticas = (currentMaterias: any, currentDetalles: any, currentData: CareerData) => {
    const { ALL } = currentData;
    const core = ALL.filter((s: any) => !s.isElectivePlaceholder && s.annualHours === undefined);
    const electivas = ALL.filter((s: any) => s.annualHours !== undefined);

    // 🔥 FIX DEL CONTADOR: Ignoramos explícitamente a 'ELEC' y cualquier placeholder
    const ap = ALL.filter(s => currentMaterias[s.id] === 'aprobada' && !s.isElectivePlaceholder && s.id !== 'ELEC').length;
    const cu = ALL.filter(s => currentMaterias[s.id] === 'cursada' && !s.isElectivePlaceholder && s.id !== 'ELEC').length;
    const cur = ALL.filter(s => currentMaterias[s.id] === 'cursando' && !s.isElectivePlaceholder && s.id !== 'ELEC').length;

    const total = core.length + electivas.filter(s => ['cursada', 'aprobada'].includes(currentMaterias[s.id])).length;
    const pct = total > 0 ? Math.round((ap / total) * 100) : 0;

    const notas = ALL.filter(s => currentMaterias[s.id] === 'aprobada' && currentDetalles[s.id]?.notaFinal && !s.isElectivePlaceholder && s.id !== 'ELEC')
                     .map(s => currentDetalles[s.id].notaFinal);
    const promedio = notas.length > 0 ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2) : 0;

    setStats({ aprobadas: ap, cursadas: cu, cursando: cur, porcentaje: pct, promedio: Number(promedio), totalMaterias: total });
  };

  const cargarDatosUsuario = async (userId: string) => {
    try {
      const [{ data: carreras }, { data: progreso }, { data: eventos }] = await Promise.all([
        supabase.from('usuario_carreras').select('carrera_id').eq('user_id', userId),
        supabase.from('usuario_materias').select('*').eq('user_id', userId),
        supabase.from('usuario_eventos').select('*').eq('user_id', userId)
      ]);

      if (!carreras || carreras.length === 0) {
        router.replace('/onboarding');
        return;
      }

      const ids = carreras.map(c => c.carrera_id);
      setTodasLasCarreras(ids);
      
      let activeId = localStorage.getItem('active_career_id');
      if (!activeId || !ids.includes(activeId)) {
        activeId = ids[0];
        localStorage.setItem('active_career_id', activeId);
      }
      setCareerId(activeId);

      const matObj: any = {};
      const detObj: any = {};

      progreso?.forEach(m => {
        matObj[m.materia_id] = m.estado;
        detObj[m.materia_id] = {
          notaFinal: m.nota_final,
          dificultad: m.dificultad,
          comision: m.comision,
          horariosCustom: m.horarios_custom || [], // 🔥 RECUPERAMOS LA LECTURA DE HORARIOS
          eventos: eventos?.filter(e => e.materia_id === m.materia_id) || []
        };
      });

      const currentData = getCareerData(activeId);
      const matEvaluadas = evaluarCorrelativas(matObj, currentData);
      
      setMaterias(matEvaluadas);
      setDetalles(detObj);
      calcularEstadisticas(matEvaluadas, detObj, currentData);
      setLoading(false);
    } catch (e) {
      setIsOffline(true);
    }
  };

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted && session?.user) {
        setUser(session.user);
        cargarDatosUsuario(session.user.id);
      } else if (isMounted) {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && isMounted && session?.user) {
        setUser((prevUser: any) => {
          if (prevUser?.id !== session.user.id) {
            cargarDatosUsuario(session.user.id);
          }
          return session.user;
        });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const setCarreraActiva = (id: string) => {
    setCareerId(id);
    localStorage.setItem('active_career_id', id);
    const currentData = getCareerData(id);
    const matEvaluadas = evaluarCorrelativas(materias, currentData);
    setMaterias(matEvaluadas);
    calcularEstadisticas(matEvaluadas, detalles, currentData);
  };

  const agregarCarrera = async (nuevaId: string) => {
    if (!user || todasLasCarreras.includes(nuevaId)) return;
    await supabase.from('usuario_carreras').insert({ user_id: user.id, carrera_id: nuevaId });
    setTodasLasCarreras(prev => [...prev, nuevaId]);
    setCarreraActiva(nuevaId);
  };

  const borrarCarrera = async (idAEliminar: string) => {
    if (!user) return;
    await supabase.from('usuario_carreras').delete().match({ user_id: user.id, carrera_id: idAEliminar });
    
    const nuevasCarreras = todasLasCarreras.filter(id => id !== idAEliminar);
    setTodasLasCarreras(nuevasCarreras);
    
    if (careerId === idAEliminar && nuevasCarreras.length > 0) {
      setCarreraActiva(nuevasCarreras[0]);
    }
  };

  const cambiarEstadoMateria = async (id: string, accion: string) => {
    let nuevasMaterias = { ...materias };
    const actual = materias[id] || 'available';

    if (accion === 'cycle_cursada') {
      nuevasMaterias[id] = actual === 'cursando' ? 'cursada' : actual === 'cursada' ? 'available' : 'cursando';
    } else if (accion === 'toggle_aprobada') {
      nuevasMaterias[id] = actual === 'aprobada' ? 'available' : 'aprobada';
    } else {
      nuevasMaterias[id] = accion.replace('set_', '');
    }

    nuevasMaterias = evaluarCorrelativas(nuevasMaterias, careerData);
    setMaterias(nuevasMaterias);
    calcularEstadisticas(nuevasMaterias, detalles, careerData);
    await upsertMateria(id, nuevasMaterias[id], detalles[id] || {});
  };

  const actualizarDetalleMateria = async (id: string, info: any) => {
    const nuevosDetalles = { ...detalles, [id]: info };
    setDetalles(nuevosDetalles);
    calcularEstadisticas(materias, nuevosDetalles, careerData);
    await upsertMateria(id, materias[id], info);
  };

  const marcarMultiplesAprobadas = async (ids: string[]) => {
    let nuevasMaterias = { ...materias };
    for (const id of ids) {
      if (nuevasMaterias[id] !== 'disabled') nuevasMaterias[id] = 'aprobada';
    }
    nuevasMaterias = evaluarCorrelativas(nuevasMaterias, careerData);
    setMaterias(nuevasMaterias);
    calcularEstadisticas(nuevasMaterias, detalles, careerData);
    
    const rows = ids.map(id => ({ user_id: user.id, materia_id: id, estado: 'aprobada', updated_at: new Date().toISOString() }));
    await supabase.from('usuario_materias').upsert(rows, { onConflict: 'user_id,materia_id' });
  };

  const reiniciarProgreso = async () => {
    if (!user) return;
    setMaterias({}); setDetalles({});
    await supabase.from('usuario_materias').delete().eq('user_id', user.id);
    await supabase.from('usuario_eventos').delete().eq('user_id', user.id);
    cargarDatosUsuario(user.id);
  };

  if (isOffline) return <MaintenanceScreen />;

  return (
    <PlanContext.Provider value={{ 
      materias, detalles, stats, user, loading, careerId, careerData, todasLasCarreras,
      setCarreraActiva, agregarCarrera, borrarCarrera, cambiarEstadoMateria, actualizarDetalleMateria, reiniciarProgreso, marcarMultiplesAprobadas
    }}>
      {children}
    </PlanContext.Provider>
  );
}

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) throw new Error('usePlan debe usarse dentro de PlanProvider');
  return context;
};