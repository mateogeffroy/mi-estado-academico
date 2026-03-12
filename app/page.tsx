'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePlan } from '../src/context/PlanContext';
import { ALL } from '../src/lib/data';
import AnimatedList from '../src/components/AnimatedList';
import CountUp from '../src/components/CountUp';
import SpotlightCard from '../src/components/SpotlightCard';

export default function Dashboard() {
  const { materias, stats, detalles, actualizarDetalleMateria } = usePlan();

  // ── ESTADO PARA EL TOOLTIP PERSONALIZADO ──
  const [hoveredDayData, setHoveredDayData] = useState<{ day: number, events: string[] } | null>(null);

  // 1. Filtrado para materias en curso
  const cursando = ALL.filter((s: any) => materias[s.id] === 'cursando');

  // 2. Filtrado para Historial: solo obligatorias y electivas reales
  const aprobadasOrdenadas = ALL.filter((s: any) => 
    materias[s.id] === 'aprobada' && 
    !s.isElectivePlaceholder && 
    s.id !== 'SEM' &&           
    s.id !== 'PPS'              
  ).sort((a, b) => parseInt(a.id) - parseInt(b.id));

  // 3. Lógica para obtener los próximos eventos reales
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
    <main style={{ display: 'flex', flexDirection: 'column', paddingBottom: '0' }}>
      
      {/* SECCIÓN 1: AGENDA Y CALENDARIO (FULL SCREEN) */}
      <section id="agenda" style={{ 
        minHeight: 'calc(100vh - 100px)', // Centrado perfecto descontando el header
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        scrollMarginTop: '100px' // Para que al hacer clic en nav posicione bien
      }}>
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px', alignItems: 'flex-start', padding: '0 20px' }}>
          
          {/* Lado Izquierdo: Lista de Eventos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: '10px' }}>Tu Agenda.</h1>
              <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>No dejes que las fechas te sorprendan.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {proximosEventos.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                  No tenés eventos próximos agendados.
                </div>
              ) : (
                proximosEventos.map(evento => (
                  <Link href={`/materia/${evento.materiaId}`} key={evento.id} style={{ textDecoration: 'none' }}>
                    <div className="event-card-modern">
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'white' }}>{evento.materia}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--cursando)', marginTop: '4px' }}>{evento.tipo}: {evento.nombre}</div>
                      </div>
                      <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 15px', borderRadius: '8px', fontFamily: 'Space Mono', fontSize: '1.1rem', color: 'white', fontWeight: 'bold' }}>
                        {formatearFecha(evento.fecha)}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Lado Derecho: Calendario Dinámico */}
          <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '24px', padding: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <h2 style={{ color: 'white', marginBottom: '25px', fontSize: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
              {nombreMesActual}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '15px', fontWeight: 'bold' }}>
              <span>DOM</span><span>LUN</span><span>MAR</span><span>MIE</span><span>JUE</span><span>VIE</span><span>SAB</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center' }}>
              {Array.from({ length: primerDiaDelMes }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: diasDelMes }, (_, i) => {
                const dia = i + 1;
                const esHoy = dia === currentDay;
                const eventosDelDia = eventosPorDia[dia];
                const tieneEvento = !!eventosDelDia;
                const isHovered = hoveredDayData?.day === dia;

                return (
                  <div 
                    key={dia} 
                    onMouseEnter={() => { if (tieneEvento) setHoveredDayData({ day: dia, events: eventosDelDia }); }}
                    onMouseLeave={() => setHoveredDayData(null)}
                    style={{ 
                      position: 'relative', 
                      aspectRatio: '1', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem', 
                      borderRadius: '12px',
                      background: esHoy ? 'var(--cursando)' : (tieneEvento ? 'rgba(255,255,255,0.03)' : 'transparent'), 
                      color: esHoy ? 'black' : 'var(--text)',
                      fontWeight: esHoy || tieneEvento ? 'bold' : 'normal',
                      border: tieneEvento && !esHoy ? '1px solid var(--cursando)' : '1px solid transparent',
                      cursor: tieneEvento ? 'pointer' : 'default',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {dia}
                    {isHovered && tieneEvento && (
                      <div className="calendar-tooltip-card">
                        <div className="tooltip-title">{`${nombreMesActual.split(' ')[0]} ${dia}`}</div>
                        <div className="tooltip-event-list">
                          {eventosDelDia.map((evStr, idx) => {
                            const [mName, eType] = evStr.split('|');
                            return (
                              <div key={idx} className="tooltip-event-item">
                                <div className="tooltip-materia-name">{mName}</div>
                                <div className="tooltip-event-type">{eType}</div>
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

      {/* SECCIÓN 2: CURSANDO (FULL SCREEN) */}
      <section id="cursando" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        scrollMarginTop: '100px',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ color: 'var(--cursando)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '10px' }}>
              Materias en curso
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>Seleccioná una para gestionar sus parciales y trabajos prácticos.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
            {cursando.map(m => (
              <Link href={`/materia/${m.id}`} key={m.id} style={{ textDecoration: 'none', height: '100%' }}>
                <SpotlightCard className="premium-card" spotlightColor="rgba(0, 229, 255, 0.15)">
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'Space Mono', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {m.level ? `Nivel ${m.level}` : 'Electiva'}
                  </div>
                  <div style={{ fontWeight: '800', color: 'white', marginTop: '10px', fontSize: '1.3rem', lineHeight: 1.3, flexGrow: 1 }}>
                    {m.name}
                  </div>
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', color: 'var(--cursando)', fontWeight: 'bold' }}>
                    → Ir al panel
                  </div>
                </SpotlightCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: PROGRESO Y LOGROS (FULL SCREEN) */}
      <section id="progreso" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        scrollMarginTop: '100px',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', padding: '0 20px' }}>
          
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800, marginBottom: '10px' }}>
              Resumen Académico
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>Tu progreso hacia el título de Analista.</p>
          </div>
          
          <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '24px', padding: '40px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '6rem', fontWeight: 900, color: 'white', lineHeight: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                <CountUp from={0} to={stats.porcentaje} duration={1.5} />
                <span style={{ fontSize: '3rem', marginLeft: '5px', color: 'var(--muted)' }}>%</span>
              </div>
              <div style={{ color: 'var(--cursando)', fontSize: '1rem', marginTop: '15px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>Completado</div>
            </div>
            
            <div style={{ width: '1px', height: '100px', background: 'var(--border)' }}></div> {/* Divisor vertical */}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '1.2rem' }}>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Aprobadas</div>
                <div style={{ color: 'var(--aprobada)', fontSize: '2rem', fontWeight: 900 }}>{stats.aprobadas}</div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Promedio</div>
                <div style={{ color: 'white', fontSize: '2rem', fontWeight: 900 }}>{stats.promedio}</div>
              </div>
            </div>
          </div>

          <div id="aprobadas" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '30px', border: '1px solid var(--border)' }}>
            <h3 style={{ color: 'var(--aprobada)', marginBottom: '20px', fontSize: '1.3rem', fontWeight: 700 }}>
              ✅ Historial de Finales
            </h3>
            <AnimatedList 
              items={aprobadasOrdenadas} 
              displayScrollbar={true}
              renderItem={(m) => (
                <div 
                  className="list-row" 
                  style={{ cursor: 'pointer', padding: '15px', borderRadius: '8px', transition: 'background 0.2s' }} 
                  onClick={() => {
                    const nota = window.prompt(`Cargar nota para ${m.name}:`);
                    if (nota && !isNaN(Number(nota))) {
                      actualizarDetalleMateria(m.id, { ...detalles[m.id], notaFinal: parseInt(nota) });
                    }
                  }}
                >
                  <span className="row-name" style={{ width: '100%', fontSize: '1.1rem' }}>{m.name}</span>
                  <span className="row-note" style={{ 
                    whiteSpace: 'nowrap', 
                    color: detalles[m.id]?.notaFinal ? 'var(--aprobada)' : 'var(--muted)',
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}>
                    {detalles[m.id]?.notaFinal ? `Nota: ${detalles[m.id].notaFinal}` : 'Nota: -'}
                  </span>
                </div>
              )}
            />
          </div>

        </div>
      </section>
    </main>
  );
}