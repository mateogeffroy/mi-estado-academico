'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ALL } from '../lib/data';

interface PlanContextType {
  materias: any;
  detalles: any; // Notas y eventos
  stats: any;
  user: any;
  loading: boolean;
  cambiarEstadoMateria: (id: string, accion: string) => void;
  actualizarDetalleMateria: (id: string, info: any) => void;
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

  // 1. Carga inicial de datos desde Supabase (estado y detalles por separado)
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
          const m = data.estado_materias || {};
          const d = data.detalles_materias || {};
          setMaterias(m);
          setDetalles(d);
          calcularEstadisticas(m, d);
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
    
    // 2. Electivas Aprobadas: Identificamos cuáles de las aprobadas reales NO tienen 'level' (son de las listas E)
    const electivasAprobadas = aprobadasReales.filter(s => !s.level).length;

    // 3. Cursadas y Cursando (también filtrando placeholders por prolijidad)
    const cursadas = ALL.filter(s => currentMaterias[s.id] === 'cursada' && !s.isElectivePlaceholder).length;
    const cursando = ALL.filter(s => currentMaterias[s.id] === 'cursando' && !s.isElectivePlaceholder).length;
    
    // 4. Promedio: Solo sobre aprobadas reales que tengan notaFinal cargada
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
      // FÓRMULA UTN: Aprobadas Reales / (36 obligatorias base + electivas que elegiste cursar)
      porcentaje: Math.round((aprobadasTotales / (36 + electivasAprobadas)) * 100),
      promedio: Number(promedio)
    });
  };

  // 3. Gestión del Plan de Estudios (Sin interrupciones de prompts)
  const cambiarEstadoMateria = async (id: string, accion: string) => {
    let nuevoEstadoMateria = { ...materias };
    const estadoActual = materias[id] || 'available';

    if (accion === 'aprobada') { // Click Izquierdo: Toggle Aprobada/Disponible
      nuevoEstadoMateria[id] = (estadoActual === 'aprobada') ? 'available' : 'aprobada';
    } else { // Click Derecho: Ciclo Cursando -> Cursada -> Disponible
      if (estadoActual === 'available' || estadoActual === 'disabled' || estadoActual === 'aprobada') {
        nuevoEstadoMateria[id] = 'cursando';
      } else if (estadoActual === 'cursando') {
        nuevoEstadoMateria[id] = 'cursada';
      } else {
        nuevoEstadoMateria[id] = 'available';
      }
    }

    setMaterias(nuevoEstadoMateria);
    calcularEstadisticas(nuevoEstadoMateria, detalles);

    if (user) {
      await supabase
        .from('progreso_usuarios')
        .update({ estado_materias: nuevoEstadoMateria })
        .eq('id_usuario', user.id);
    }
  };

  // 4. Gestión desde el Dashboard (Carga de notas y eventos)
  const actualizarDetalleMateria = async (id: string, info: any) => {
    // Si la materia se marca con nota, nos aseguramos de no perder eventos previos si existen
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

  return (
    <PlanContext.Provider value={{ 
      materias, detalles, stats, user, loading, 
      cambiarEstadoMateria, actualizarDetalleMateria 
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