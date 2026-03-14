'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePlan } from '../../src/context/PlanContext';
import { ALL } from '../../src/lib/data';
import SpotlightCard from '../../src/components/SpotlightCard';

export default function CursadaPage() {
  const { materias, detalles } = usePlan();
  const [hoveredDayData, setHoveredDayData] = useState<{ day: number, events: string[] } | null>(null);

  const [viewDate, setViewDate] = useState(new Date());

  const cursando = ALL.filter((s: any) => materias[s.id] === 'cursando');

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

  // --- FUNCIÓN INTELIGENTE DE COLORES PARA EVENTOS ---
  const getEventColor = (tipo: string) => {
    const t = tipo.toLowerCase();
    if (t.includes('parcial')) return '#3b82f6'; // Azul
    if (t.includes('trabajo') || t.includes('tp') || t.includes('práctico')) return '#ef4444'; // Rojo
    if (t.includes('exposi')) return '#22c55e'; // Verde
    return 'var(--cursando)'; // Por defecto (amarillo/naranja)
  };

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  
  const realToday = new Date();
  const isCurrentMonth = realToday.getMonth() === currentMonth && realToday.getFullYear() === currentYear;
  const currentDay = isCurrentMonth ? realToday.getDate() : null;

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const nombreMesActual = `${meses[currentMonth]} ${currentYear}`;

  const diasDelMes = new Date(currentYear, currentMonth + 1, 0).getDate();
  const primerDiaDelMes = new Date(currentYear, currentMonth, 1).getDay();

  const eventosPorDia: Record<number, string[]> = {};
  
  Object.keys(detalles || {}).forEach(materiaId => {
    const detalleMateria = detalles[materiaId];
    if (detalleMateria?.eventos) {
      const materiaData = ALL.find((m: any) => m.id == materiaId);
      detalleMateria.eventos.forEach((ev: any) => {
        const [evYear, evMonth, evDay] = ev.fecha.split('-');
        if (parseInt(evYear) === currentYear && parseInt(evMonth) - 1 === currentMonth) {
          const dia = parseInt(evDay);
          if (!eventosPorDia[dia]) eventosPorDia[dia] = [];
          eventosPorDia[dia].push(`${materiaData?.name || 'Materia'}|${ev.tipo}|${ev.nombre}`); 
        }
      });
    }
  });

  const handlePrevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.calendar-day')) {
        setHoveredDayData(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('touchstart', handleClickOutside, { passive: true });
    
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const horariosSemanales: Record<string, any[]> = { 'Lunes': [], 'Martes': [], 'Miércoles': [], 'Jueves': [], 'Viernes': [], 'Sábado': [] };
  
  cursando.forEach((m: any) => {
    const comisionId = detalles[m.id]?.comision;
    if (comisionId && m.comisiones) {
      const comisionData = m.comisiones.find((c: any) => c.id === comisionId);
      if (comisionData && comisionData.dias) {
        
        let cuatrimestre = 'Anual';
        let colorFondo = 'rgba(30, 58, 138, 0.3)'; 
        let colorBorde = '#3b82f6'; 
        
        const nameLower = m.name.toLowerCase();
        if (nameLower.includes('1°') || nameLower.includes('1er')) {
          cuatrimestre = '(1° Cuatr.)';
          colorFondo = 'rgba(20, 83, 45, 0.4)'; 
          colorBorde = '#22c55e'; 
        } else if (nameLower.includes('2°') || nameLower.includes('2do')) {
          cuatrimestre = '(2° Cuatr.)';
          colorFondo = 'rgba(136, 19, 55, 0.4)'; 
          colorBorde = '#f43f5e'; 
        }

        const nombreMateriaLimpio = m.name.replace(/\s*\([^)]*\)/g, '').trim();

        comisionData.dias.forEach((dia: any) => {
          let nombreDiaLimpio = dia.nombre.split(' ')[0]; 
          if (horariosSemanales[nombreDiaLimpio]) {
            horariosSemanales[nombreDiaLimpio].push({
              id: `${m.id}-${dia.nombre}`,
              materiaLimpia: nombreMateriaLimpio,
              cuatrimestre: cuatrimestre,
              inicio: dia.inicio,
              fin: dia.fin,
              comision: comisionId,
              colorFondo,
              colorBorde
            });
          }
        });
      }
    }
  });

  Object.keys(horariosSemanales).forEach(dia => {
    horariosSemanales[dia].sort((a, b) => a.inicio.localeCompare(b.inicio));
  });

  const ordenDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diasMostrar = ordenDias.filter(dia => horariosSemanales[dia].length > 0);

  return (
    <>
      <style>{`
        .calendar-nav-btn {
          background: transparent;
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 8px;
          opacity: 0.6;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .calendar-nav-btn:hover {
          opacity: 1;
          transform: scale(1.15);
        }
        .calendar-nav-btn:active {
          transform: scale(0.9);
        }
        
        .calendar-tooltip-card {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: var(--panel);
          border: 1px solid var(--border);
          padding: 12px;
          border-radius: 8px;
          min-width: 180px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.7);
          z-index: 100;
          text-align: left;
        }
        .calendar-tooltip-card::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -6px;
          border-width: 6px;
          border-style: solid;
          border-color: var(--border) transparent transparent transparent;
        }
      `}</style>
      <main style={{ paddingBottom: '80px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '60px', minHeight: '100vh' }}>
        
        {/* --- ENCABEZADO --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '0 10px' }}>
          <div className="header-titles">
            <h1 className="logo" style={{ lineHeight: '1.1' }}>
              Mi <br />
              <span>Cursada</span>
            </h1>
          </div>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary" style={{ textAlign: 'center', lineHeight: '1.4', padding: '8px 16px' }}>
              ← Volver al <br /> Dashboard
            </button>
          </Link>
        </div>

        {/* --- HORARIO SEMANAL --- */}
        <div>
          <h3 style={{ color: 'var(--cursando)', fontSize: '1.4rem', marginBottom: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🕒 Horario Semanal
          </h3>
          
          {diasMostrar.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)', background: 'var(--panel)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
              No tenés horarios guardados. Entrá a tus materias en curso y seleccioná una comisión.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${100 / diasMostrar.length}%, 1fr))`, gap: '15px', display: 'flex', flexWrap: 'wrap' } as any}>
              {diasMostrar.map((dia) => (
                <div key={dia} style={{ flex: '1 1 250px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', textAlign: 'center', fontWeight: 'bold', color: 'white', borderBottom: '1px solid var(--border)' }}>
                    {dia}
                  </div>
                  <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px', minHeight: '120px' }}>
                    {horariosSemanales[dia].map((clase: any) => (
                      <div key={clase.id} style={{ 
                        background: clase.colorFondo, 
                        padding: '12px', 
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.03)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                      }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '45px 3px 1fr', gap: '12px', alignItems: 'stretch' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: 'Space Mono, monospace', fontSize: '0.8rem', color: 'var(--muted)', padding: '2px 0' }}>
                            <span style={{ color: 'white', fontWeight: 'bold' }}>{clase.inicio}</span>
                            <span style={{ fontSize: '0.7rem', opacity: 0.6, margin: 'auto 0' }}>a</span>
                            <span style={{ color: 'white', fontWeight: 'bold' }}>{clase.fin}</span>
                          </div>
                          <div style={{ background: clase.colorBorde, borderRadius: '4px', width: '100%', opacity: 0.9 }}></div>
                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2px 0' }}>
                            <div style={{ fontWeight: 'bold', color: 'white', fontSize: '0.95rem', lineHeight: 1.2 }}>
                              {clase.materiaLimpia} <span style={{ fontSize: '0.75rem', color: clase.colorBorde, whiteSpace: 'nowrap' }}>{clase.cuatrimestre}</span>
                            </div>
                            <div style={{ color: 'var(--muted)', fontSize: '0.85rem', fontFamily: 'Space Mono, monospace', marginTop: '6px' }}>
                              Com. {clase.comision}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- AGENDA Y CALENDARIO --- */}
        {/* 🔥 SOLUCIÓN #2: minmax ajustado a 320px máximo para que no desborde en iPhone 11 Pro */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '40px', alignItems: 'flex-start' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ color: 'var(--cursando)', fontSize: '1.4rem', fontWeight: 'bold' }}>📅 Próximos Parciales</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {proximosEventos.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)', background: 'var(--panel)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                  No tenés eventos próximos agendados.
                </div>
              ) : (
                proximosEventos.map(evento => (
                  <Link href={`/materia/${evento.materiaId}`} key={evento.id} style={{ textDecoration: 'none' }}>
                    <div className="event-card-modern">
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'white' }}>{evento.materia}</div>
                        <div style={{ fontSize: '0.85rem', color: getEventColor(evento.tipo), marginTop: '4px', fontWeight: 'bold' }}>{evento.tipo}: {evento.nombre}</div>
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

          {/* 🔥 SOLUCIÓN #2: Padding dinámico con clamp() */}
          <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '24px', padding: 'clamp(15px, 5vw, 30px)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <button onClick={handlePrevMonth} className="calendar-nav-btn" title="Mes anterior">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              
              <h2 style={{ color: 'white', fontSize: '1.3rem', margin: 0, fontWeight: 'bold', textTransform: 'capitalize' }}>
                {nombreMesActual}
              </h2>
              
              <button onClick={handleNextMonth} className="calendar-nav-btn" title="Mes siguiente">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>

            {/* 🔥 SOLUCIÓN #2: Gaps y tamaños de fuente dinámicos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'clamp(4px, 1.5vw, 10px)', textAlign: 'center', fontSize: 'clamp(0.65rem, 2vw, 0.8rem)', color: 'var(--muted)', marginBottom: '15px', fontWeight: 'bold' }}>
              <span>DOM</span><span>LUN</span><span>MAR</span><span>MIE</span><span>JUE</span><span>VIE</span><span>SAB</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'clamp(4px, 1.5vw, 10px)', textAlign: 'center' }}>
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
                    className="calendar-day"
                    onMouseEnter={() => { if (tieneEvento && window.innerWidth > 900) setHoveredDayData({ day: dia, events: eventosDelDia }); }}
                    onMouseLeave={() => { if (window.innerWidth > 900) setHoveredDayData(null); }}
                    onClick={(e) => {
                      if (window.innerWidth <= 900 && tieneEvento) {
                        e.stopPropagation();
                        setHoveredDayData(prev => prev?.day === dia ? null : { day: dia, events: eventosDelDia });
                      }
                    }}
                    style={{ 
                      position: 'relative', 
                      aspectRatio: '1', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'clamp(0.85rem, 3vw, 1rem)', /* 🔥 SOLUCIÓN #2 */
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
                        <div style={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', marginBottom: '8px', fontSize: '0.95rem' }}>
                          {`${nombreMesActual.split(' ')[0]} ${dia}`}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {eventosDelDia.map((evStr, idx) => {
                            const [mName, eType, eName] = evStr.split('|');
                            return (
                              <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '0.9rem', color: 'white', lineHeight: 1.2 }}>{mName}</div>
                                <div style={{ fontSize: '0.8rem', color: getEventColor(eType), fontWeight: 'bold' }}>{eType}: {eName}</div>
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

        {/* --- MATERIAS EN CURSO --- */}
        <div id="gestionar-materias" style={{ scrollMarginTop: '120px' }}>
          <h3 style={{ color: 'var(--cursando)', fontSize: '1.4rem', marginBottom: '20px', fontWeight: 'bold' }}>🎓 Gestionar Materias</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
            {cursando.length === 0 ? (
               <div style={{ gridColumn: '1 / -1', padding: '30px', textAlign: 'center', color: 'var(--muted)', background: 'var(--panel)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                 No tenés materias marcadas como "Cursando" actualmente.
               </div>
            ) : (
              cursando.map((m: any) => (
                <Link href={`/materia/${m.id}`} key={m.id} style={{ textDecoration: 'none', height: '100%' }}>
                  <SpotlightCard className="premium-card" spotlightColor="rgba(0, 229, 255, 0.15)">
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'Space Mono', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {m.level ? `Nivel ${m.level}` : 'Electiva'}
                    </div>
                    <div style={{ fontWeight: '800', color: 'white', marginTop: '10px', fontSize: '1.3rem', lineHeight: 1.3, flexGrow: 1 }}>
                      {m.name}
                    </div>
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', color: 'var(--cursando)', fontWeight: 'bold' }}>
                      → Configurar comisión y parciales
                    </div>
                  </SpotlightCard>
                </Link>
              ))
            )}
          </div>
        </div>

      </main>
    </>
  );
}