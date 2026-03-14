'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
// 🔥 IMPORTAMOS ELECTIVAS
import { ALL, ELECTIVAS } from '../lib/data'; 

interface PlanContextType {
  materias: any;
  detalles: any; // Notas, eventos, comisiones
  stats: any;
  user: any;
  loading: boolean;
  cambiarEstadoMateria: (id: string, accion: string) => void;
  actualizarDetalleMateria: (id: string, info: any) => void;
  reiniciarProgreso: () => Promise<void>;
  marcarMultiplesAprobadas: (ids: string[]) => Promise<void>;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [materias, setMaterias] = useState<any>({});
  const [detalles, setDetalles] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    aprobadas: 0,
    cursadas: 0,
    cursando: 0,
    porcentaje: 0,
    promedio: 0,
    totalMaterias: 36
  });

  // =========================================================================
  // 🔥 EL MOTOR DE CORRELATIVAS Y ELECTIVAS (CLON EXACTO DE TU SCRIPT VIEJO)
  // =========================================================================
  const evaluarCorrelativas = (estadosActuales: any) => {
    let estados = { ...estadosActuales };
    let huboCambios = true;

    while (huboCambios) {
      huboCambios = false;

      // 1. CALCULAMOS LAS BOLSAS DE HORAS USANDO EL OBJETO ELECTIVAS
      let globalCursadaHoursAnalista = 0;
      let globalAprobadaHoursAnalista = 0;
      let globalCursadaHoursIngenieria = 0;
      let globalAprobadaHoursIngenieria = 0;

      [3, 4, 5].forEach(lvl => {
        const electivasNivel = ELECTIVAS[lvl as keyof typeof ELECTIVAS] || [];
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

      // 2. EVALUAMOS CADA MATERIA
      ALL.forEach((m: any) => {
        const idStr = m.id.toString();
        const estadoActual = estados[idStr];

        // A. Los Placeholders evalúan la bolsa de horas
        if (m.isElectivePlaceholder) {
          const thresholds: any = { 3: 4, 4: 10, 5: 20 };
          const target = thresholds[m.level] || m.targetHours || 0;
          
          const aprobadaHours = m.level === 3 ? globalAprobadaHoursAnalista : globalAprobadaHoursIngenieria;
          const cursadaHours = m.level === 3 ? globalCursadaHoursAnalista : globalCursadaHoursIngenieria;
          const totalActive = aprobadaHours + cursadaHours;

          let newState = 'available';
          if (aprobadaHours >= target) newState = 'aprobada';
          else if (totalActive >= target) newState = 'cursada';

          if (estadoActual !== newState) {
            estados[idStr] = newState;
            huboCambios = true;
          }
          return; 
        }

        // B. Lógica normal de las demás materias
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

        if (!cumple && estadoActual !== 'disabled') {
          estados[idStr] = 'disabled';
          huboCambios = true; 
        } else if (cumple && (estadoActual === 'disabled' || !estadoActual)) {
          estados[idStr] = 'available';
          huboCambios = true;
        }
      });
    }
    return estados;
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase
          .from('progreso_usuarios')
          .select('estado_materias, detalles_materias')
          .eq('id_usuario', session.user.id)
          .single();

        if (data) {
          const materiasAutocorregidas = evaluarCorrelativas(data.estado_materias || {});
          const d = data.detalles_materias || {};
          setMaterias(materiasAutocorregidas);
          setDetalles(d);
          calcularEstadisticas(materiasAutocorregidas, d);
        }
      }
      setLoading(false);
    };
    getSession();
  }, []);

  const calcularEstadisticas = (currentMaterias: any, currentDetalles: any) => {
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

    setStats({
      aprobadas: ap, cursadas: cu, cursando: cur, porcentaje: pct, promedio: Number(promedio), totalMaterias: total || 36
    });
  };

  const cambiarEstadoMateria = async (id: string, accion: string) => {
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

    nuevoEstadoMateria = evaluarCorrelativas(nuevoEstadoMateria);
    setMaterias(nuevoEstadoMateria);
    calcularEstadisticas(nuevoEstadoMateria, detalles);

    if (user) {
      await supabase.from('progreso_usuarios').update({ estado_materias: nuevoEstadoMateria }).eq('id_usuario', user.id);
    }
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

    nuevoEstadoMateria = evaluarCorrelativas(nuevoEstadoMateria);
    setMaterias(nuevoEstadoMateria);
    calcularEstadisticas(nuevoEstadoMateria, detalles);

    if (user) {
      await supabase.from('progreso_usuarios').update({ estado_materias: nuevoEstadoMateria }).eq('id_usuario', user.id);
    }
  };

  const actualizarDetalleMateria = async (id: string, info: any) => {
    const nuevosDetalles = { ...detalles, [id]: info };
    setDetalles(nuevosDetalles);
    calcularEstadisticas(materias, nuevosDetalles);

    if (user) {
      await supabase.from('progreso_usuarios').update({ detalles_materias: nuevosDetalles }).eq('id_usuario', user.id);
    }
  };

  const reiniciarProgreso = async () => {
    setMaterias({}); setDetalles({}); calcularEstadisticas({}, {});
    if (user) {
      await supabase.from('progreso_usuarios').update({ estado_materias: {}, detalles_materias: {} }).eq('id_usuario', user.id);
    }
  };

  return (
    <PlanContext.Provider value={{ 
      materias, detalles, stats, user, loading, 
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