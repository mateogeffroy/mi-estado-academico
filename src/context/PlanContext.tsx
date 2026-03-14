'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
// Ajustá estas rutas dependiendo de dónde esté exactamente tu archivo
import { supabase } from '../lib/supabase';
import { ALL } from '../lib/data';

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
    promedio: 0
  });

  // =========================================================================
  // 🔥 EL MOTOR DE CORRELATIVAS (EFECTO DOMINÓ)
  // =========================================================================
  const evaluarCorrelativas = (estadosActuales: any) => {
    let estados = { ...estadosActuales };
    let huboCambios = true;

    while (huboCambios) {
      huboCambios = false;

      ALL.forEach((m: any) => {
        // CORRECCIÓN: Ahora SOLO ignoramos los placeholders de las electivas.
        // El Seminario y la PPS sí entran al bucle para que se les quite el candado.
        if (m.isElectivePlaceholder) return;

        const idStr = m.id.toString();
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

        const estadoActual = estados[idStr];

        // EL CASTIGO: Si no cumple, se bloquea
        if (!cumple && estadoActual !== 'disabled') {
          estados[idStr] = 'disabled';
          huboCambios = true; 
        } 
        // EL PREMIO: Si cumple y estaba bloqueada, se habilita
        else if (cumple && (estadoActual === 'disabled' || !estadoActual)) {
          estados[idStr] = 'available';
          huboCambios = true;
        }
      });
    }
    return estados;
  };

  // =========================================================================
  // CARGA INICIAL
  // =========================================================================
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
          // Sanación automática al cargar
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
    const aprobadasReales = ALL.filter(s => 
      currentMaterias[s.id] === 'aprobada' && 
      !s.isElectivePlaceholder && 
      s.id !== 'SEM' && 
      s.id !== 'PPS'
    );

    const aprobadasTotales = aprobadasReales.length;
    const electivasAprobadas = aprobadasReales.filter(s => !s.level).length;

    const cursadas = ALL.filter(s => currentMaterias[s.id] === 'cursada' && !s.isElectivePlaceholder).length;
    const cursando = ALL.filter(s => currentMaterias[s.id] === 'cursando' && !s.isElectivePlaceholder).length;
    
    const notas = aprobadasReales
      .filter(s => currentDetalles[s.id]?.notaFinal)
      .map(s => currentDetalles[s.id].notaFinal);
    
    const promedio = notas.length > 0 
      ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2) 
      : 0;

    setStats({
      aprobadas: aprobadasTotales,
      cursadas,
      cursando,
      porcentaje: Math.round((aprobadasTotales / (36 + electivasAprobadas)) * 100),
      promedio: Number(promedio)
    });
  };

  // =========================================================================
  // GESTIÓN DE MATERIAS Y DETALLES
  // =========================================================================
  const cambiarEstadoMateria = async (id: string, accion: string) => {
    let nuevoEstadoMateria = { ...materias };
    const estadoActual = materias[id] || 'available';

    if (accion === 'aprobada') { 
      nuevoEstadoMateria[id] = (estadoActual === 'aprobada') ? 'available' : 'aprobada';
    } else { 
      if (estadoActual === 'available' || estadoActual === 'disabled' || estadoActual === 'aprobada') {
        nuevoEstadoMateria[id] = 'cursando';
      } else if (estadoActual === 'cursando') {
        nuevoEstadoMateria[id] = 'cursada';
      } else {
        nuevoEstadoMateria[id] = 'available';
      }
    }

    // Pasamos el plan por el validador en cascada
    nuevoEstadoMateria = evaluarCorrelativas(nuevoEstadoMateria);

    setMaterias(nuevoEstadoMateria);
    calcularEstadisticas(nuevoEstadoMateria, detalles);

    if (user) {
      await supabase
        .from('progreso_usuarios')
        .update({ estado_materias: nuevoEstadoMateria })
        .eq('id_usuario', user.id);
    }
  };

  // =========================================================================
  // GESTIÓN MÚLTIPLE (MARCAR TODO EL NIVEL)
  // =========================================================================
  const marcarMultiplesAprobadas = async (ids: string[]) => {
    let nuevoEstadoMateria = { ...materias };
    let huboCambios = false;

    // Aprobamos todas juntas en la copia de memoria
    ids.forEach(id => {
      const estadoActual = nuevoEstadoMateria[id] || 'available';
      if (estadoActual !== 'disabled' && estadoActual !== 'aprobada') {
        nuevoEstadoMateria[id] = 'aprobada';
        huboCambios = true;
      }
    });

    if (!huboCambios) return; // Si ya estaba todo aprobado, no hacemos nada

    // Pasamos el plan completo por el motor de correlativas
    nuevoEstadoMateria = evaluarCorrelativas(nuevoEstadoMateria);

    setMaterias(nuevoEstadoMateria);
    calcularEstadisticas(nuevoEstadoMateria, detalles);

    // Guardamos todo de un saque en Supabase
    if (user) {
      await supabase
        .from('progreso_usuarios')
        .update({ estado_materias: nuevoEstadoMateria })
        .eq('id_usuario', user.id);
    }
  };

  const actualizarDetalleMateria = async (id: string, info: any) => {
    const nuevosDetalles = { ...detalles, [id]: info };
    setDetalles(nuevosDetalles);
    calcularEstadisticas(materias, nuevosDetalles);

    if (user) {
      await supabase
        .from('progreso_usuarios')
        .update({ detalles_materias: nuevosDetalles })
        .eq('id_usuario', user.id);
    }
  };

  // =========================================================================
  // BOTÓN DE PÁNICO: REINICIAR TODO
  // =========================================================================
  const reiniciarProgreso = async () => {
    setMaterias({});
    setDetalles({});
    calcularEstadisticas({}, {});

    if (user) {
      await supabase
        .from('progreso_usuarios')
        .update({ estado_materias: {}, detalles_materias: {} })
        .eq('id_usuario', user.id);
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