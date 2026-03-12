'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePlan } from '../src/context/PlanContext';
import { ALL } from '../src/lib/data';
import AnimatedList from '../src/components/AnimatedList';
import CountUp from '../src/components/CountUp';

export default function Dashboard() {
  const { materias, stats, detalles, actualizarDetalleMateria } = usePlan();

  // ── ESTADO PARA EL TOOLTIP PERSONALIZADO ──
  const [hoveredDayData, setHoveredDayData] = useState<{ day: number, events: string[] } | null>(null);

  // 1. Filtrado para materias en curso
  const cursando = ALL.filter((s: any) => materias[s.id] === 'cursando');

  // 2. Filtrado para Historial: solo obligatorias y electivas reales (afuera placeholders)
  const aprobadasOrdenadas = ALL.filter((s: any) => 
    materias[s.id] === 'aprobada' && 
    !s.isElectivePlaceholder && 
    s.id !== 'SEM' &&           
    s.id !== 'PPS'              
  ).sort((a, b) => parseInt(a.id) - parseInt(b.id));

  // 3. Lógica para obtener los próximos eventos reales (Lista Izquierda)
  const obtenerProximosEventos = () => {
    let eventosMapeados: any[] = [];
    const hoyStr = new Date().toISOString().split('T')[0];

    Object.keys(detalles || {}).forEach(materiaId => {
      const detalleMateria = detalles[materiaId];
      if (detalleMateria?.eventos && detalleMateria.eventos.length > 0) {
        const materiaData = ALL.find((m: any) => m.id == materiaId);
        detalleMateria.eventos.forEach((ev: any) => {
          if (ev.fecha >= hoyStr) {
            eventosMapeados.push({
              id: ev.id,
              materiaId: materiaId,
              materia: materiaData?.name || 'Materia Desconocida',
              nombre: ev.nombre,
              tipo: ev.tipo,
              fecha: ev.fecha
            });
          }
        });
      }
    });

    eventosMapeados.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    return eventosMapeados.slice(0, 5);
  };

  const proximosEventos = obtenerProximosEventos();

  const formatearFecha = (fechaISO: string) => {
    const partes = fechaISO.split('-');
    if (partes.length === 3) return `${partes[2]}/${partes[1]}`;
    return fechaISO;
  };

  // --- 4. LÓGICA DEL CALENDARIO DINÁMICO ---
  const hoy = new Date();
  const currentMonth = hoy.getMonth();
  const currentYear = hoy.getFullYear();
  const currentDay = hoy.getDate();

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const nombreMesActual = `${meses[currentMonth]} ${currentYear}`;

  const diasDelMes = new Date(currentYear, currentMonth + 1, 0).getDate();
  const primerDiaDelMes = new Date(currentYear, currentMonth, 1).getDay();

  // Guardamos los nombres de los eventos formateados por día
  const eventosPorDia: Record<number, string[]> = {};
  
  Object.keys(detalles || {}).forEach(materiaId => {
    const detalleMateria = detalles[materiaId];
    if (detalleMateria?.eventos) {
      const materiaData = ALL.find((m: any) => m.id == materiaId);
      detalleMateria.eventos.forEach((ev: any) => {
        const [evYear, evMonth, evDay] = ev.fecha.split('-');
        if (parseInt(evYear) === currentYear && parseInt(evMonth) - 1 === currentMonth) {
          const dia = parseInt(evDay);
          if (!eventosPorDia[dia]) {
            eventosPorDia[dia] = [];
          }
          eventosPorDia[dia].push(`${materiaData?.name || 'Materia'}|${ev.nombre}`); 
        }
      });
    }
  });

  return (
    <main style={{ display: 'flex', flexDirection: 'column', gap: '60px', paddingBottom: '100px' }}>
      
      {/* SECCIÓN 1: AGENDA Y CALENDARIO */}
      <section id="agenda" style={{ scrollMarginTop: '120px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        
        {/* Lado Izquierdo: Lista de Eventos */}
        <div>
          <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '1.2rem', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            📅 Próximos Eventos
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {proximosEventos.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', background: 'var(--panel)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                No tenés eventos próximos agendados.
              </div>
            ) : (
              proximosEventos.map(evento => (
                <Link href={`/materia/${evento.materiaId}`} key={evento.id} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border 0.2s', cursor: 'pointer' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'white' }}>{evento.materia}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--cursando)' }}>{evento.tipo}: {evento.nombre}</div>
                    </div>
                    <div style={{ fontFamily: 'Space Mono', fontSize: '1rem', color: 'var(--muted)' }}>
                      {formatearFecha(evento.fecha)}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Lado Derecho: Calendario Dinámico con Tooltip Personalizado */}
        <div>
          <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '1.2rem', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            {nombreMesActual}
          </h2>
          <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '12px', padding: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '10px' }}>
              <span>D</span><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center' }}>
              
              {/* Celdas vacías para alinear el primer día del mes */}
              {Array.from({ length: primerDiaDelMes }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Días reales del mes */}
              {Array.from({ length: diasDelMes }, (_, i) => {
                const dia = i + 1;
                const esHoy = dia === currentDay;
                const eventosDelDia = eventosPorDia[dia];
                const tieneEvento = !!eventosDelDia;

                // Lógica local para saber si ESTA celda está hovereada
                const isHovered = hoveredDayData?.day === dia;

                return (
                  <div 
                    key={dia} 
                    onMouseEnter={() => {
                      if (tieneEvento) setHoveredDayData({ day: dia, events: eventosDelDia });
                    }}
                    onMouseLeave={() => setHoveredDayData(null)}
                    style={{ 
                      position: 'relative', // CLAVE: ancla el tooltip a esta celda
                      padding: '8px 0', 
                      fontSize: '0.8rem', 
                      borderRadius: '4px',
                      background: esHoy ? 'var(--cursando)' : 'transparent', 
                      color: esHoy ? 'black' : 'var(--text)',
                      fontWeight: esHoy ? 'bold' : 'normal',
                      border: tieneEvento && !esHoy ? '1px solid var(--cursando)' : '1px solid transparent',
                      cursor: tieneEvento ? 'pointer' : 'default' 
                    }}
                  >
                    {dia}

                    {/* RENDERIZAMOS EL TOOLTIP ACÁ ADENTRO */}
                    {isHovered && tieneEvento && (
                      <div className="calendar-tooltip-card">
                        <div className="tooltip-title">
                          {`${nombreMesActual.split(' ')[0]} ${dia}`}
                        </div>
                        <div className="tooltip-event-list">
                          {eventosDelDia.map((eventString, index) => {
                            const [materiaName, eventType] = eventString.split('|');
                            return (
                              <div key={index} className="tooltip-event-item">
                                <div className="tooltip-materia-name">{materiaName}</div>
                                <div className="tooltip-event-type">{eventType}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: CURSANDO */}
      <section id="cursando" style={{ scrollMarginTop: '120px' }}>
        <h2 style={{ color: 'var(--cursando)', marginBottom: '25px', fontSize: '1.3rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px', fontWeight: 700 }}>
          ✍️ Materias en curso
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
          {cursando.map(m => (
            <Link href={`/materia/${m.id}`} key={m.id} style={{ textDecoration: 'none' }}>
              <div className="dash-card" style={{ background: 'var(--panel)', border: '1px solid var(--cursando)', borderRadius: '10px', padding: '20px', cursor: 'pointer' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'Space Mono' }}>
                  {m.level ? `Nivel ${m.level}` : 'Electiva'}
                </div>
                <div style={{ fontWeight: '700', color: 'white', marginTop: '6px', fontSize: '1rem' }}>{m.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECCIÓN 3: PROGRESO Y LOGROS */}
      <section id="progreso" style={{ scrollMarginTop: '120px' }}>
        <h2 style={{ color: 'white', marginBottom: '25px', fontSize: '1.3rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px', textAlign: 'center' }}>
          📊 Resumen Académico
        </h2>
        
        <div style={{ maxWidth: '550px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '12px', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4.5rem', fontWeight: 900, color: 'white', lineHeight: 1, display: 'flex', alignItems: 'baseline' }}>
                <CountUp from={0} to={stats.porcentaje} duration={1} />
                <span style={{ fontSize: '2rem', marginLeft: '2px' }}>%</span>
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '10px' }}>Completado</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '1rem' }}>
              <div style={{ display: 'flex', gap: '30px', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>Aprobadas:</span> <b style={{ color: 'var(--aprobada)' }}>{stats.aprobadas}</b>
              </div>
              <div style={{ display: 'flex', gap: '30px', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>Promedio:</span> <b style={{ color: 'white' }}>{stats.promedio}</b>
              </div>
            </div>
          </div>

          <div id="aprobadas">
            <h3 style={{ color: 'var(--aprobada)', marginBottom: '15px', fontSize: '1.1rem', fontWeight: 600 }}>
              ✅ Historial de Finales
            </h3>
            <AnimatedList 
              items={aprobadasOrdenadas} 
              displayScrollbar={true}
              renderItem={(m) => (
                <div 
                  className="list-row" 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => {
                    const nota = window.prompt(`Cargar nota para ${m.name}:`);
                    if (nota && !isNaN(Number(nota))) {
                      actualizarDetalleMateria(m.id, { ...detalles[m.id], notaFinal: parseInt(nota) });
                    }
                  }}
                >
                  <span className="row-name" style={{ width: '100%' }}>{m.name}</span>
                  <span className="row-note" style={{ 
                    whiteSpace: 'nowrap', 
                    color: detalles[m.id]?.notaFinal ? 'var(--aprobada)' : 'var(--muted)',
                    fontWeight: 'bold'
                  }}>
                    {detalles[m.id]?.notaFinal ? `Nota: ${detalles[m.id].notaFinal}` : 'Nota: -'}
                  </span>
                </div>
              )}
            />
          </div>

          <Link href="/plan" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.1rem', fontWeight: 700 }}>
              Ir al Plan de Estudios Completo 🚀
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}