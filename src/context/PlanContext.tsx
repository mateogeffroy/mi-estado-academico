'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { getCareerData, CareerData } from '../lib/data/registry';
import MaintenanceScreen from '../components/MaintenanceScreen';

interface PlanContextType {
  materias: any;
  detalles: any; // Notas, eventos, comisiones
  stats: any;
  user: any;
  loading: boolean;
  careerId: string; // 🔥 Sabe qué carrera cursa
  careerData: CareerData; // 🔥 Tiene todos los datos de la carrera (ALL, info, etc)
  cambiarEstadoMateria: (id: string, accion: string) => void;
  actualizarDetalleMateria: (id: string, info: any) => void;
  reiniciarProgreso: () => Promise<void>;
  marcarMultiplesAprobadas: (ids: string[]) => Promise<void>;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  // 🔥 ESTADO DE LA CARRERA ACTUAL (Por defecto UTN Sistemas)
  const [careerId, setCareerId] = useState('utn-sistemas-2023');
  const careerData = getCareerData(careerId);

  const [materias, setMaterias] = useState<any>({});
  const [detalles, setDetalles] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [stats, setStats] = useState({
    aprobadas: 0, cursadas: 0, cursando: 0, porcentaje: 0, promedio: 0, totalMaterias: 36
  });

  // 🔥 SISTEMA DE OPTIMIZACIÓN (DEBOUNCE) PARA SUPABASE
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdates = useRef<{ materias: any, detalles: any } | null>(null);

  const guardarEnBDOptimizado = (nuevasMaterias: any, nuevosDetalles: any) => {
    if (!user) return;
    
    // Guardamos la info pendiente
    pendingUpdates.current = { materias: nuevasMaterias, detalles: nuevosDetalles };

    // Si había un guardado programado, lo cancelamos
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    // Programamos el nuevo guardado para dentro de 1.5 segundos
    debounceTimer.current = setTimeout(async () => {
      const payload = pendingUpdates.current;
      if (payload) {
        await supabase.from('progreso_usuarios').update({ 
          estado_materias: payload.materias, 
          detalles_materias: payload.detalles 
        }).eq('id_usuario', user.id);
        console.log('✅ Guardado optimizado en BD ejecutado');
      }
    }, 1500);
  };

  // =========================================================================
  // 🔥 MOTOR DE CORRELATIVAS (AHORA LEE DEL CAREERDATA DINÁMICO)
  // =========================================================================
  const evaluarCorrelativas = (estadosActuales: any, currentData: CareerData) => {
    const { ALL, ELECTIVAS } = currentData;
    let estados = { ...estadosActuales };
    let huboCambios = true;

    while (huboCambios) {
      huboCambios = false;

      let globalCursadaHoursAnalista = 0; let globalAprobadaHoursAnalista = 0;
      let globalCursadaHoursIngenieria = 0; let globalAprobadaHoursIngenieria = 0;

      // Evalúa bolsas de horas solo si la carrera tiene el objeto ELECTIVAS definido
      if (ELECTIVAS) {
        [3, 4, 5].forEach(lvl => {
          const electivasNivel = ELECTIVAS[lvl] || [];
          electivasNivel.forEach((el: any) => {
            if (estados[el.id.toString()] === 'aprobada') {
              globalAprobadaHoursIngenieria += el.annualHours || 0;
              if (!el.onlyIngenieria) globalAprobadaHoursAnalista += el.annualHours || 0;
            } else if (estados[el.id.toString()] === 'cursada') {
              globalCursadaHoursIngenieria += el.annualHours || 0;
              if (!el.onlyIngenieria) globalCursadaHoursAnalista += el.annualHours || 0;
            }
          });
        });
      }

      ALL.forEach((m: any) => {
        const idStr = m.id.toString();
        const estadoActual = estados[idStr];

        if (m.isElectivePlaceholder) {
          const thresholds: any = { 3: 4, 4: 10, 5: 20 };
          const target = thresholds[m.level] || m.targetHours || 0;
          const aprobadaHours = m.level === 3 ? globalAprobadaHoursAnalista : globalAprobadaHoursIngenieria;
          const cursadaHours = m.level === 3 ? globalCursadaHoursAnalista : globalCursadaHoursIngenieria;
          const totalActive = aprobadaHours + cursadaHours;

          let newState = 'available';
          if (aprobadaHours >= target) newState = 'aprobada';
          else if (totalActive >= target) newState = 'cursada';

          if (estadoActual !== newState) { estados[idStr] = newState; huboCambios = true; }
          return; 
        }

        let cumple = true;
        if (m.level === 1 && (!m.correlCursada || m.correlCursada.length === 0) && (!m.correlAprobada || m.correlAprobada.length === 0)) {
          cumple = true;
        } else {
          const reqCursadaOK = m.correlCursada?.every((reqId: number) => {
            const est = estados[reqId.toString()];
            return est === 'cursada' || est === 'aprobada';
          }) ?? true;
          const reqAprobadaOK = m.correlAprobada?.every((reqId: number) => {
            const est = estados[reqId.toString()];
            return est === 'aprobada';
          }) ?? true;
          cumple = reqCursadaOK && reqAprobadaOK;
        }

        if (!cumple && estadoActual !== 'disabled') { estados[idStr] = 'disabled'; huboCambios = true; } 
        else if (cumple && (estadoActual === 'disabled' || !estadoActual)) { estados[idStr] = 'available'; huboCambios = true; }
      });
    }
    return estados;
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        
        // 🔥 AÑADIMOS carrera_id A LA CONSULTA (En el futuro la leerá de acá)
        const { data, error } = await supabase
          .from('progreso_usuarios')
          .select('estado_materias, detalles_materias, carrera_id')
          .eq('id_usuario', session.user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { 
          console.error("Falla crítica de Supabase:", error);
          setIsOffline(true);
          setLoading(false);
          return; // Cortamos la ejecución acá
        }

        if (data) {
          // Si el usuario tiene una carrera asignada, la cargamos. Si no, UTN por defecto.
          const userCareerId = data.carrera_id || 'utn-sistemas-2023';
          setCareerId(userCareerId);
          
          const currentData = getCareerData(userCareerId);
          const materiasAutocorregidas = evaluarCorrelativas(data.estado_materias || {}, currentData);
          const d = data.detalles_materias || {};
          
          setMaterias(materiasAutocorregidas);
          setDetalles(d);
          calcularEstadisticas(materiasAutocorregidas, d, currentData);
        }
      }
      setLoading(false);
    };
    getSession();
  }, []);

  const calcularEstadisticas = (currentMaterias: any, currentDetalles: any, currentData: CareerData) => {
    const { ALL } = currentData;
    const coreSubjects = ALL.filter((s: any) => typeof s.id === 'number' || s.id === 'SEM' || s.id === 'PPS');
    const realElectives = ALL.filter((s: any) => s.annualHours !== undefined || s.hsAnuales !== undefined);

    const ap = coreSubjects.filter((s: any) => currentMaterias[s.id] === 'aprobada').length +
               realElectives.filter((s: any) => currentMaterias[s.id] === 'aprobada').length;
    const cu = coreSubjects.filter((s: any) => currentMaterias[s.id] === 'cursada').length +
               realElectives.filter((s: any) => currentMaterias[s.id] === 'cursada').length;
    const cur = coreSubjects.filter((s: any) => currentMaterias[s.id] === 'cursando').length +
                realElectives.filter((s: any) => currentMaterias[s.id] === 'cursando').length;

    const electivasTomadas = realElectives.filter((s: any) => currentMaterias[s.id] === 'cursada' || currentMaterias[s.id] === 'aprobada').length;
    const total = coreSubjects.length + electivasTomadas;
    const pct = total > 0 ? Math.round((ap / total) * 100) : 0;

    const aprobadasReales = ALL.filter((s: any) => currentMaterias[s.id] === 'aprobada' && !s.isElectivePlaceholder && s.id !== 'SEM' && s.id !== 'PPS');
    const notas = aprobadasReales.filter((s: any) => currentDetalles[s.id]?.notaFinal).map((s: any) => currentDetalles[s.id].notaFinal);
    const promedio = notas.length > 0 ? (notas.reduce((a: number, b: number) => a + b, 0) / notas.length).toFixed(2) : 0;

    setStats({ aprobadas: ap, cursadas: cu, cursando: cur, porcentaje: pct, promedio: Number(promedio), totalMaterias: total || 36 });
  };

  const cambiarEstadoMateria = (id: string, accion: string) => {
    let nuevoEstadoMateria = { ...materias };
    const estadoActual = materias[id] || 'available';

    if (accion === 'set_aprobada') nuevoEstadoMateria[id] = 'aprobada';
    else if (accion === 'set_cursada') nuevoEstadoMateria[id] = 'cursada';
    else if (accion === 'set_cursando') nuevoEstadoMateria[id] = 'cursando';
    else if (accion === 'set_available') nuevoEstadoMateria[id] = 'available';
    else if (accion === 'toggle_aprobada') nuevoEstadoMateria[id] = (estadoActual === 'aprobada') ? 'available' : 'aprobada';
    else if (accion === 'cycle_cursada') {
      if (estadoActual === 'cursando') nuevoEstadoMateria[id] = 'cursada';
      else if (estadoActual === 'cursada') nuevoEstadoMateria[id] = 'available';
      else nuevoEstadoMateria[id] = 'cursando';
    }

    nuevoEstadoMateria = evaluarCorrelativas(nuevoEstadoMateria, careerData);
    setMaterias(nuevoEstadoMateria);
    calcularEstadisticas(nuevoEstadoMateria, detalles, careerData);
    guardarEnBDOptimizado(nuevoEstadoMateria, detalles); // 🔥 Guardado optimizado
  };

  const marcarMultiplesAprobadas = async (ids: string[]) => {
    let nuevoEstadoMateria = { ...materias };
    let huboCambios = false;

    ids.forEach(id => {
      const estadoActual = nuevoEstadoMateria[id] || 'available';
      if (estadoActual !== 'disabled' && estadoActual !== 'aprobada') {
        nuevoEstadoMateria[id] = 'aprobada';
        huboCambios = true;
      }
    });

    if (!huboCambios) return;

    nuevoEstadoMateria = evaluarCorrelativas(nuevoEstadoMateria, careerData);
    setMaterias(nuevoEstadoMateria);
    calcularEstadisticas(nuevoEstadoMateria, detalles, careerData);
    guardarEnBDOptimizado(nuevoEstadoMateria, detalles);
  };

  const actualizarDetalleMateria = (id: string, info: any) => {
    const nuevosDetalles = { ...detalles, [id]: info };
    setDetalles(nuevosDetalles);
    calcularEstadisticas(materias, nuevosDetalles, careerData);
    guardarEnBDOptimizado(materias, nuevosDetalles);
  };

  const reiniciarProgreso = async () => {
    setMaterias({}); setDetalles({}); calcularEstadisticas({}, {}, careerData);
    if (user) await supabase.from('progreso_usuarios').update({ estado_materias: {}, detalles_materias: {} }).eq('id_usuario', user.id);
  };

  if (isOffline) {
    return <MaintenanceScreen />;
  }

  return (
    <PlanContext.Provider value={{ 
      materias, detalles, stats, user, loading, careerId, careerData,
      cambiarEstadoMateria, actualizarDetalleMateria, reiniciarProgreso, marcarMultiplesAprobadas
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