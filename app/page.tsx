'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePlan } from '../src/context/PlanContext';
import CountUp from '../src/components/CountUp';
import SpotlightCard from '../src/components/SpotlightCard';
import { supabase } from '../src/lib/supabase';

export default function Dashboard() {
  const { stats, user, careerData, careerId, materias, detalles } = usePlan();
  const { ALL } = careerData;
  
  // --- ESTADOS DEL HOME ORIGINAL ---
  const [nombreDinamico, setNombreDinamico] = useState('');
  const [tourStep, setTourStep] = useState(0);

  // --- ESTADOS DE MI CURSADA ---
  const [hoveredDayData, setHoveredDayData] = useState<{ day: number, events: string[] } | null>(null);
  const [viewDate, setViewDate] = useState(new Date());  
  const [filtroCuatri, setFiltroCuatri] = useState('Ambos');

  useEffect(() => {
    const fetchDirectName = async () => {
      const { data } = await supabase.auth.getUser();
      const metaName = data.user?.user_metadata?.full_name;
      if (metaName) {
        setNombreDinamico(metaName.split(' ')[0]);
      }
    };
    fetchDirectName();

    const filtroGuardado = localStorage.getItem('filtroCuatrimestre');
    if (filtroGuardado) {
      setFiltroCuatri(filtroGuardado);
    }
  }, []);

  // Lógica del Tutorial
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasViewedTour = localStorage.getItem('mea_tutorial_home_v2'); // Cambié la key para forzar el tour nuevo
      if (!hasViewedTour) {
        setTimeout(() => setTourStep(1), 600); 
      }
    }
  }, []);

  const closeTour = () => {
    setTourStep(0);
    localStorage.setItem('mea_tutorial_home_v2', 'true');
  };

  const skipTour = () => setTourStep(5); 

  const primerNombre = nombreDinamico || user?.user_metadata?.full_name?.split(' ')[0] || 'Estudiante';

  // --- LÓGICA DE DATOS DE CURSADA ---
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

  const getEventColor = (tipo: string) => {
    const t = tipo.toLowerCase();
    if (t.includes('parcial')) return '#3b82f6'; 
    if (t.includes('trabajo') || t.includes('tp') || t.includes('práctico')) return '#ef4444'; 
    if (t.includes('exposi')) return '#22c55e'; 
    return 'var(--cursando)'; 
  };

  // Calendario Lógica
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

  // Horarios Semanales Lógica
  const horariosSemanales: Record<string, any[]> = { 'Lunes': [], 'Martes': [], 'Miércoles': [], 'Jueves': [], 'Viernes': [], 'Sábado': [] };
  
  cursando.forEach((m: any) => {
    const tieneComisiones = m.comisiones && m.comisiones.length > 0;
    const nombreMateriaLimpio = m.name.replace(/\s*\([^)]*\)/g, '').trim();

    if (tieneComisiones) {
      const comisionId = detalles[m.id]?.comision;
      if (comisionId) {
        const comisionData = m.comisiones.find((c: any) => c.id === comisionId);
        if (comisionData && comisionData.dias) {
          const duracion = comisionData.duration || 'A';
          if (filtroCuatri === '1' && duracion === '2') return; 
          if (filtroCuatri === '2' && duracion === '1') return; 

          let cuatrimestre = '(Anual)';
          let colorFondo = 'rgba(30, 58, 138, 0.3)'; let colorBorde = '#3b82f6'; 
          if (duracion === '1') { cuatrimestre = '(1° Cuatr.)'; colorFondo = 'rgba(34, 197, 94, 0.15)'; colorBorde = '#22c55e'; }
          else if (duracion === '2') { cuatrimestre = '(2° Cuatr.)'; colorFondo = 'rgba(244, 63, 94, 0.15)'; colorBorde = '#f43f5e'; }

          comisionData.dias.forEach((dia: any) => {
            let nombreDiaLimpio = dia.nombre.split(' ')[0]; 
            if (horariosSemanales[nombreDiaLimpio]) {
              horariosSemanales[nombreDiaLimpio].push({ id: `${m.id}-${dia.nombre}`, materiaLimpia: nombreMateriaLimpio, cuatrimestre, inicio: dia.inicio, fin: dia.fin, comision: comisionId, colorFondo, colorBorde });
            }
          });
        }
      }
    } else {
      const horariosCustom = detalles[m.id]?.horariosCustom;
      if (horariosCustom && horariosCustom.length > 0) {
        horariosCustom.forEach((horario: any) => {
          const hDur = horario.duracion || 'Anual';
          let dCode = 'A';
          if (hDur.includes('1º')) dCode = '1';
          if (hDur.includes('2º')) dCode = '2';

          if (filtroCuatri === '1' && dCode === '2') return; 
          if (filtroCuatri === '2' && dCode === '1') return; 

          let cuatrimestre = '(Anual)';
          let colorFondo = 'rgba(30, 58, 138, 0.3)'; let colorBorde = '#3b82f6'; 
          if (dCode === '1') { cuatrimestre = '(1º Cuatr.)'; colorFondo = 'rgba(34, 197, 94, 0.15)'; colorBorde = '#22c55e'; }
          else if (dCode === '2') { cuatrimestre = '(2º Cuatr.)'; colorFondo = 'rgba(244, 63, 94, 0.15)'; colorBorde = '#f43f5e'; }

          let nombreDiaLimpio = horario.dia.split(' ')[0]; 
          if (horariosSemanales[nombreDiaLimpio]) {
            horariosSemanales[nombreDiaLimpio].push({ id: `${m.id}-${horario.id}`, materiaLimpia: nombreMateriaLimpio, cuatrimestre, inicio: horario.inicio, fin: horario.fin, comision: 'Pers.', colorFondo, colorBorde });
          }
        });
      }
    }
  });

  Object.keys(horariosSemanales).forEach(dia => horariosSemanales[dia].sort((a, b) => a.inicio.localeCompare(b.inicio)));
  const ordenDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diasMostrar = ordenDias.filter(dia => horariosSemanales[dia].length > 0);

  return (
    <>
      <style>{`
        .wave { animation: wave-animation 2.5s infinite; transform-origin: 70% 70%; display: inline-block; }
        @keyframes wave-animation { 0% { transform: rotate( 0.0deg) } 10% { transform: rotate(14.0deg) } 20% { transform: rotate(-8.0deg) } 30% { transform: rotate(14.0deg) } 40% { transform: rotate(-4.0deg) } 50% { transform: rotate(10.0deg) } 60% { transform: rotate( 0.0deg) } 100% { transform: rotate( 0.0deg) } }
        
        .tour-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--overlay-bg); z-index: 9998; backdrop-filter: blur(3px); transition: opacity 0.3s ease; }
        .tour-dialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 420px; background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 24px; z-index: 10000; box-shadow: 0 20px 40px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 16px; text-align: center; }
        .tour-dialog-top { top: 30px; transform: translateX(-50%); }
        .tour-highlighted { position: relative !important; z-index: 9999 !important; box-shadow: 0 0 0 6px var(--bg), 0 0 0 10px var(--cursando) !important; pointer-events: none !important; border-radius: inherit; }

        .calendar-nav-btn { background: transparent; border: none; color: var(--text-strong); display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 8px; opacity: 0.6; transition: transform 0.2s ease, opacity 0.2s ease; }
        .calendar-nav-btn:hover { opacity: 1; transform: scale(1.15); }
        .calendar-tooltip-card { position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: var(--panel); border: 1px solid var(--border); padding: 12px; border-radius: 8px; min-width: 180px; box-shadow: 0 10px 30px rgba(0,0,0,0.7); z-index: 100; text-align: left; }
        .calendar-tooltip-card::after { content: ''; position: absolute; top: 100%; left: 50%; margin-left: -6px; border-width: 6px; border-style: solid; border-color: var(--border) transparent transparent transparent; }
        .horario-grid { display: flex; flex-wrap: wrap; gap: 15px; }
        .horario-grid > div { flex: 1 1 calc(33.333% - 15px); min-width: 250px; }
      `}</style>

      {tourStep > 0 && (
        <>
          <div className="tour-overlay" />
          <div className={`tour-dialog ${[2, 3].includes(tourStep) ? 'tour-dialog-top' : ''}`}>
            {tourStep === 1 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.3rem' }}>¡Bienvenido/a!</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>Te preparamos un recorrido rápido para que sepas cómo sacarle el máximo provecho a la plataforma.</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={skipTour} className="btn-secondary" style={{ flex: 1, padding: '12px', borderRadius: '10px' }}>Omitir</button>
                  <button onClick={() => setTourStep(2)} className="btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px' }}>Siguiente</button>
                </div>
              </>
            )}
            {tourStep === 2 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.2rem' }}>Plan de Estudios</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>Acá podés visualizar tu plan, ver correlatividades y marcar materias como aprobadas, cursadas o cursando.</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={skipTour} className="btn-secondary" style={{ flex: 1, padding: '12px', borderRadius: '10px' }}>Omitir</button>
                  <button onClick={() => setTourStep(3)} className="btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px' }}>Siguiente</button>
                </div>
              </>
            )}
            {tourStep === 3 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.2rem' }}>Tu Nuevo Dashboard</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>¡Ahora tu horario semanal, próximos parciales y calendario viven directamente en la pantalla principal!</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={skipTour} className="btn-secondary" style={{ flex: 1, padding: '12px', borderRadius: '10px' }}>Omitir</button>
                  <button onClick={() => setTourStep(4)} className="btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px' }}>Siguiente</button>
                </div>
              </>
            )}
            {tourStep === 4 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.2rem' }}>Mi Perfil</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>En tu Perfil vas a encontrar el listado de materias Aprobadas para calificar su dificultad, y todas tus configuraciones.</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={skipTour} className="btn-secondary" style={{ flex: 1, padding: '12px', borderRadius: '10px' }}>Omitir</button>
                  <button onClick={() => setTourStep(5)} className="btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px' }}>Siguiente</button>
                </div>
              </>
            )}
            {tourStep === 5 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.3rem' }}>¡Todo listo!</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>Si la plataforma te resulta útil, podés apoyar el proyecto invitándome un Cafecito. ¡Éxitos!</p>
                <button onClick={closeTour} className="btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '10px', marginTop: '10px' }}>Comenzar a usar</button>
              </>
            )}
          </div>
        </>
      )}

      <main style={{ paddingBottom: '80px', display: 'flex', flexDirection: 'column', gap: '40px', minHeight: '100vh', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* --- HEADER COMPACTO CON ESTADÍSTICAS --- */}
        <section style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginTop: '30px', background: 'var(--panel)', padding: '24px 30px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ flex: '1 1 300px' }}>
            <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', color: 'var(--text-strong)', margin: '0 0 12px 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
              ¡Hola, <span style={{ color: 'var(--cursando)' }}>{primerNombre}</span>! <span className="wave">👋</span>
            </h2>
            <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem' }}>
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                 <span style={{color: 'var(--aprobada)', fontWeight: 800, fontSize: '1.2rem'}}>{stats.aprobadas}</span>
                 <span style={{color: 'var(--muted)'}}>Aprobadas</span>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                 <span style={{color: 'var(--cursada)', fontWeight: 800, fontSize: '1.2rem'}}>{stats.cursadas}</span>
                 <span style={{color: 'var(--muted)'}}>Cursadas</span>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                 <span style={{color: 'var(--cursando)', fontWeight: 800, fontSize: '1.2rem'}}>{stats.cursando}</span>
                 <span style={{color: 'var(--muted)'}}>En Curso</span>
               </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg)', padding: '12px 24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-strong)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              <CountUp from={0} to={stats.porcentaje} duration={0.2} />
              <span style={{ fontSize: '1.4rem', color: 'var(--muted)', marginLeft: '2px' }}>%</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: 1.3, fontWeight: 700 }}>
              Progreso<br/>Académico
            </div>
          </div>
        </section>

        {/* --- GRID DE HORARIOS Y CONTENIDO --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
          
          {/* Horario Semanal */}
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--cursando)', fontSize: '1.4rem', margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Horario Semanal
              </h3>
              <div style={{ display: 'flex', background: 'var(--panel)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border)', width: 'fit-content' }}>
                {['1', 'Ambos', '2'].map((opcion) => (
                  <div key={opcion} onClick={() => { setFiltroCuatri(opcion); localStorage.setItem('filtroCuatrimestre', opcion); }}
                    style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease',
                      color: filtroCuatri === opcion ? '#fff' : 'var(--muted)',
                      background: filtroCuatri === opcion ? 'var(--cursando)' : 'transparent',
                      boxShadow: filtroCuatri === opcion ? '0 2px 10px rgba(0,0,0,0.2)' : 'none'
                    }}>
                    {opcion === '1' ? '1º Cuatri' : opcion === '2' ? '2º Cuatri' : 'Ambos'}
                  </div>
                ))}
              </div>
            </div>
            
            {diasMostrar.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)', background: 'var(--panel)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                No tenés horarios asignados para este filtro. Modificá tus materias en curso.
              </div>
            ) : (
              <div className="horario-grid">
                {diasMostrar.map((dia) => (
                  <div key={dia} style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ background: 'var(--glass-bg)', padding: '15px', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-strong)', borderBottom: '1px solid var(--border)' }}>{dia}</div>
                    <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px', minHeight: '120px' }}>
                      {horariosSemanales[dia].map((clase: any) => (
                        <div key={clase.id} style={{ background: clase.colorFondo, padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '45px 3px 1fr', gap: '12px', alignItems: 'stretch' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: 'Space Mono, monospace', fontSize: '0.8rem', color: 'var(--muted)', padding: '2px 0' }}>
                              <span style={{ color: 'var(--text-strong)', fontWeight: 'bold' }}>{clase.inicio}</span>
                              <span style={{ fontSize: '0.7rem', opacity: 0.6, margin: 'auto 0' }}>a</span>
                              <span style={{ color: 'var(--text-strong)', fontWeight: 'bold' }}>{clase.fin}</span>
                            </div>
                            <div style={{ background: clase.colorBorde, borderRadius: '4px', width: '100%', opacity: 0.9 }}></div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2px 0' }}>
                              <div style={{ fontWeight: 'bold', color: 'var(--text-strong)', fontSize: '0.95rem', lineHeight: 1.2 }}>
                                {clase.materiaLimpia} <span style={{ fontSize: '0.75rem', color: clase.colorBorde, whiteSpace: 'nowrap' }}>{clase.cuatrimestre}</span>
                              </div>
                              <div style={{ color: 'var(--muted)', fontSize: '0.85rem', fontFamily: 'Space Mono, monospace', marginTop: '6px' }}>Com. {clase.comision}</div>
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

          {/* Próximos Parciales & Calendario */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '40px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3 style={{ color: 'var(--cursando)', fontSize: '1.4rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Próximos Parciales
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {proximosEventos.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)', background: 'var(--panel)', borderRadius: '12px', border: '1px dashed var(--border)' }}>No tenés eventos próximos agendados.</div>
                ) : (
                  proximosEventos.map(evento => (
                    <Link href={`/materia/${evento.materiaId}`} key={evento.id} style={{ textDecoration: 'none' }}>
                      <div className="event-card-modern" style={{ background: 'var(--panel)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-strong)' }}>{evento.materia}</div>
                          <div style={{ fontSize: '0.85rem', color: getEventColor(evento.tipo), marginTop: '4px', fontWeight: 'bold' }}>{evento.tipo}: {evento.nombre}</div>
                        </div>
                        <div style={{ background: 'var(--glass-bg)', padding: '8px 12px', borderRadius: '8px', fontFamily: 'Space Mono', fontSize: '1rem', color: 'var(--text-strong)', fontWeight: 'bold' }}>{formatearFecha(evento.fecha)}</div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '24px', padding: 'clamp(15px, 5vw, 30px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <button onClick={handlePrevMonth} className="calendar-nav-btn" title="Mes anterior"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
                <h2 style={{ color: 'var(--text-strong)', fontSize: '1.3rem', margin: 0, fontWeight: 'bold', textTransform: 'capitalize' }}>{nombreMesActual}</h2>
                <button onClick={handleNextMonth} className="calendar-nav-btn" title="Mes siguiente"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'clamp(4px, 1.5vw, 10px)', textAlign: 'center', fontSize: 'clamp(0.65rem, 2vw, 0.8rem)', color: 'var(--muted)', marginBottom: '15px', fontWeight: 'bold' }}>
                <span>DOM</span><span>LUN</span><span>MAR</span><span>MIE</span><span>JUE</span><span>VIE</span><span>SAB</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'clamp(4px, 1.5vw, 10px)', textAlign: 'center' }}>
                {Array.from({ length: primerDiaDelMes }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: diasDelMes }, (_, i) => {
                  const dia = i + 1; const esHoy = dia === currentDay; const eventosDelDia = eventosPorDia[dia]; const tieneEvento = !!eventosDelDia; const isHovered = hoveredDayData?.day === dia;
                  return (
                    <div key={dia} className="calendar-day"
                      onMouseEnter={() => { if (tieneEvento && window.innerWidth > 900) setHoveredDayData({ day: dia, events: eventosDelDia }); }}
                      onMouseLeave={() => { if (window.innerWidth > 900) setHoveredDayData(null); }}
                      onClick={(e) => { if (window.innerWidth <= 900 && tieneEvento) { e.stopPropagation(); setHoveredDayData(prev => prev?.day === dia ? null : { day: dia, events: eventosDelDia }); } }}
                      style={{ position: 'relative', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(0.85rem, 3vw, 1rem)', borderRadius: '12px', background: esHoy ? 'var(--cursando)' : (tieneEvento ? 'var(--glass-bg)' : 'transparent'), color: esHoy ? '#fff' : 'var(--text-strong)', fontWeight: esHoy || tieneEvento ? 'bold' : 'normal', border: tieneEvento && !esHoy ? '1px solid var(--cursando)' : '1px solid transparent', cursor: tieneEvento ? 'pointer' : 'default', transition: 'all 0.2s ease' }}>
                      {dia}
                      {isHovered && tieneEvento && (
                        <div className="calendar-tooltip-card">
                          <div style={{ color: 'var(--text-strong)', borderBottom: '1px solid var(--border)', paddingBottom: '6px', marginBottom: '8px', fontSize: '0.95rem' }}>{`${nombreMesActual.split(' ')[0]} ${dia}`}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {eventosDelDia.map((evStr, idx) => {
                              const [mName, eType, eName] = evStr.split('|');
                              return (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                                  <div style={{ fontSize: '0.9rem', color: 'var(--text-strong)', lineHeight: 1.2 }}>{mName}</div>
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

          {/* Gestionar Materias */}
          <div>
            <h3 style={{ color: 'var(--cursando)', fontSize: '1.4rem', marginBottom: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              Gestionar Materias
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
              {cursando.length === 0 ? (
                 <div style={{ gridColumn: '1 / -1', padding: '30px', textAlign: 'center', color: 'var(--muted)', background: 'var(--panel)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                   No tenés materias marcadas como "Cursando" actualmente.
                 </div>
              ) : (
                cursando.map((m: any) => {
                  const tieneComisiones = m.comisiones && m.comisiones.length > 0;
                  const comisionSeleccionada = detalles[m.id]?.comision;
                  const horariosCustom = detalles[m.id]?.horariosCustom;

                  return (
                    <Link href={`/materia/${m.id}`} key={m.id} style={{ textDecoration: 'none', height: '100%' }}>
                      <SpotlightCard className="premium-card" spotlightColor="rgba(0, 229, 255, 0.15)">
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'Space Mono', textTransform: 'uppercase', letterSpacing: '1px' }}>{m.level ? `Nivel ${m.level}` : 'Electiva'}</div>
                        <div style={{ fontWeight: '700', color: 'var(--text-strong)', marginTop: '10px', fontSize: '1.25rem', lineHeight: 1.3, flexGrow: 1, fontFamily: 'Syne, sans-serif' }}>{m.name}</div>
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', fontSize: '0.9rem', fontWeight: 'bold', minHeight: '1.2rem' }}>
                          {tieneComisiones ? (
                            comisionSeleccionada ? <span style={{ color: 'var(--cursando)' }}>Comisión: {comisionSeleccionada}</span> : <span style={{ color: '#ef4444' }}>No hay comisión</span>
                          ) : (
                            horariosCustom && horariosCustom.length > 0 ? <span style={{ color: '#f59e0b' }}>Horario Personalizado</span> : <span style={{ color: '#ef4444' }}>Sin horario asignado</span>
                          )}
                        </div>
                      </SpotlightCard>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}