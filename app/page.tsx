'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePlan } from '../src/context/PlanContext';
import CountUp from '../src/components/CountUp';
import SpotlightCard from '../src/components/SpotlightCard';
import HorarioCalendar from '../src/components/HorarioCalendar';
import MiniCalendar from '../src/components/MiniCalendar';
import { supabase } from '../src/lib/supabase';

export default function Dashboard() {
  const { stats, user, careerData, materias, detalles } = usePlan();
  const { ALL } = careerData;
  
  const [nombreDinamico, setNombreDinamico] = useState('');
  const [filtroCuatri, setFiltroCuatri] = useState('1');
  const [tourStep, setTourStep] = useState(0);

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
    if (filtroGuardado && filtroGuardado !== 'Ambos') {
      setFiltroCuatri(filtroGuardado);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasViewedTour = localStorage.getItem('mea_tutorial_home_v3');
      if (!hasViewedTour) {
        setTimeout(() => setTourStep(1), 600); 
      }
    }
  }, []);

  useEffect(() => {
    const handleStartTour = () => {
      setTourStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('start-home-tour', handleStartTour);
    return () => window.removeEventListener('start-home-tour', handleStartTour);
  }, []);

  const closeTour = () => {
    setTourStep(0);
    localStorage.setItem('mea_tutorial_home_v3', 'true');
  };

  const skipTour = () => {
    setTourStep(0);
    localStorage.setItem('mea_tutorial_home_v3', 'true');
  };

  const primerNombre = nombreDinamico || user?.user_metadata?.full_name?.split(' ')[0] || 'Estudiante';

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
              horariosSemanales[nombreDiaLimpio].push({ id: `${m.id}-${dia.nombre}`, materiaId: m.id, materiaLimpia: nombreMateriaLimpio, cuatrimestre, inicio: dia.inicio, fin: dia.fin, comision: comisionId, colorFondo, colorBorde });
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
            horariosSemanales[nombreDiaLimpio].push({ id: `${m.id}-${horario.id}`, materiaId: m.id, materiaLimpia: nombreMateriaLimpio, cuatrimestre, inicio: horario.inicio, fin: horario.fin, comision: 'Pers.', colorFondo, colorBorde });
          }
        });
      }
    }
  });

  const ordenDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diasMostrar = ordenDias.filter(dia => horariosSemanales[dia].length > 0);

  return (
    <>
      <style>{`
        .wave { animation: wave-animation 2.5s infinite; transform-origin: 70% 70%; display: inline-block; }
        @keyframes wave-animation { 0% { transform: rotate( 0.0deg) } 10% { transform: rotate(14.0deg) } 20% { transform: rotate(-8.0deg) } 30% { transform: rotate(14.0deg) } 40% { transform: rotate(-4.0deg) } 50% { transform: rotate(10.0deg) } 60% { transform: rotate( 0.0deg) } 100% { transform: rotate( 0.0deg) } }
        
        .tour-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--overlay-bg); z-index: 9998; backdrop-filter: blur(3px); transition: opacity 0.3s ease; }
        .tour-dialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 420px; background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 24px; z-index: 10000; box-shadow: 0 20px 40px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 16px; text-align: center; }

        /* =======================================================
           ESTILOS RESPONSIVOS: MARGENES Y FUENTES
           ======================================================= */
        
        .dashboard-main {
          padding-bottom: 80px; display: flex; flex-direction: column; gap: clamp(20px, 3vh, 40px); 
          max-width: 1200px; margin: 0 auto; padding-left: clamp(12px, 2vw, 20px); padding-right: clamp(12px, 2vw, 20px);
        }

        .dashboard-top-bar {
          display: flex; align-items: center; justify-content: space-between;
          gap: clamp(10px, 2vw, 20px); margin-top: clamp(0px, 1vh, 10px); background: var(--panel);
          padding: clamp(14px, 2vh, 24px) clamp(20px, 3vw, 35px); border-radius: 20px; border: 1px solid var(--border);
          flex-wrap: nowrap; overflow: hidden;
        }

        .dashboard-greeting {
          font-size: clamp(1.2rem, 2.5vw, 2rem); color: var(--text-strong); margin: 0;
          font-weight: 700; display: flex; align-items: center; gap: 8px; white-space: nowrap; flex-shrink: 0;
        }

        /* Modificado: Quitamos el sub-grupo para que los 4 stats sean hermanos y se distribuyan parejo */
        .dashboard-stats-wrapper {
          display: flex; align-items: center; justify-content: flex-start; flex: 1;
          gap: clamp(10px, 1.5vw, 24px); flex-wrap: nowrap;
        }

        .top-stat-item { display: flex; align-items: baseline; gap: clamp(4px, 0.8vw, 8px); white-space: nowrap; }
        .top-stat-val { font-weight: 800; font-size: clamp(1.2rem, 2vw, 1.5rem); line-height: 1; }
        .top-stat-label { color: var(--muted); font-size: clamp(0.55rem, 0.8vw, 0.75rem); text-transform: uppercase; letter-spacing: 1px; font-weight: bold; }

        .dashboard-progress { 
          display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; 
          margin-left: auto; /* En desktop, lo empuja hacia la derecha del todo */
        }
        .prog-val { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 900; color: var(--text-strong); font-variant-numeric: tabular-nums; line-height: 1; display: flex; align-items: baseline; }
        .prog-label { font-size: clamp(0.55rem, 0.8vw, 0.75rem); color: var(--muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-top: 6px; text-align: center; line-height: 1.2; }

        .schedule-header {
          display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; 
          gap: 20px; margin-bottom: clamp(12px, 2.5vh, 25px);
        }
        
        .schedule-toggle {
          display: flex; background: var(--panel); padding: 4px; border-radius: 12px; border: 1px solid var(--border);
        }

        /* 📱 COMPORTAMIENTO MÓVIL ESTRICTO (< 600px) 📱 */
        @media (max-width: 600px) {
          .dashboard-top-bar { 
            flex-direction: column; 
            align-items: center; 
            gap: 12px; 
            padding: 16px 16px; 
          }
          
          .dashboard-greeting { 
            font-size: 1.3rem; 
            width: 100%; 
            justify-content: center; 
          }
          
          .dashboard-stats-wrapper { 
            width: 100%; 
            justify-content: space-between; /* Espacia los 4 elementos uniformemente */
            gap: 0px; 
          }
          .dashboard-progress { 
            margin-left: 0; /* Quita el empuje a la derecha para que participe del space-between */
            align-items: center; 
          }
          
          .top-stat-item { flex-direction: column; align-items: center; gap: 0px; }
          
          /* Igualamos los tamaños de los números */
          .top-stat-val { font-size: 1.1rem; } 
          .prog-val { font-size: 1.1rem; } 
          
          /* Igualamos los tamaños de los textos */
          .top-stat-label { font-size: 0.5rem; } 
          .prog-label { font-size: 0.5rem; margin-top: 2px; }

          .schedule-header { flex-direction: column; justify-content: center; gap: 14px; margin-bottom: 12px; }
          .schedule-toggle { justify-content: center; width: 100%; max-width: 320px; }
          .schedule-toggle > div { flex: 1; text-align: center; } 
        }
        
        /* 💻 COMPORTAMIENTO TABLET (601px - 900px) 💻 */
        @media (max-width: 900px) {
          /* Sobrescribir globals.css: Forzamos la fecha a la derecha en móviles */
          .event-card-modern {
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
          }

          .dashboard-top-bar { padding: 14px 16px; gap: 12px; }
          .dashboard-stats-wrapper { gap: 12px; }
          .top-stat-item { flex-direction: column; align-items: center; gap: 2px; }
          .top-stat-val { font-size: 1.3rem; }
          .top-stat-label { font-size: 0.55rem; }
          .prog-val { font-size: 2rem; }
          .prog-label { font-size: 0.55rem; }
        }

        @media (max-height: 800px) {
          .dashboard-main { gap: 15px; }
          .dashboard-top-bar { padding: 12px 20px; }
          .dashboard-greeting { font-size: 1.4rem; }
          .top-stat-val { font-size: 1.2rem; }
          .prog-val { font-size: 1.8rem; }
          .schedule-header { margin-bottom: 12px; }
        }
      `}</style>

      {/* Tutorial Overlay */}
      {tourStep > 0 && (
        <>
          <div className="tour-overlay" />
          <div className="tour-dialog">
            {tourStep === 1 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.3rem' }}>¡Bienvenido/a a bordo!</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  Tu interfaz principal (el <strong>Home</strong>) ahora es un Dashboard inteligente. Todo lo que apruebes o curses se va a reflejar automáticamente acá.
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={skipTour} className="btn-secondary" style={{ flex: 1 }}>Omitir</button>
                  <button onClick={() => setTourStep(2)} className="btn-primary" style={{ flex: 1 }}>Siguiente</button>
                </div>
              </>
            )}
            {tourStep === 2 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.2rem' }}>Plan de Estudios</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  Es el corazón de la app. Al ir a tu <strong>Plan de Estudios</strong>, podés destrabar correlatividades y poner tus materias en estado "Aprobada" o "Cursando".
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={skipTour} className="btn-secondary" style={{ flex: 1 }}>Omitir</button>
                  <button onClick={() => setTourStep(3)} className="btn-primary" style={{ flex: 1 }}>Siguiente</button>
                </div>
              </>
            )}
            {tourStep === 3 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.2rem' }}>Armá tu Horario</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  Las materias que pongas en <strong>"Cursando"</strong> aparecerán en tu Home. Al entrar a cada una, vas a poder elegir la comisión real para que se dibuje sola en tu grilla de horarios.
                </p>
                <button onClick={closeTour} className="btn-primary" style={{ width: '100%', marginTop: '10px', padding: '12px' }}>
                  ¡Entendido, a organizar!
                </button>
              </>
            )}
          </div>
        </>
      )}

      <main className="dashboard-main">
        
        {/* --- CABECERA DE ESTADÍSTICAS --- */}
        <section className="dashboard-top-bar">
          <h2 className="dashboard-greeting">
            ¡Hola, <span style={{ color: 'var(--cursando)' }}>{primerNombre}</span>! <span className="wave">👋</span>
          </h2>
          
          {/* Ahora los 4 elementos son hermanos directos para repartirse parejo en mobile */}
          <div className="dashboard-stats-wrapper">
             <div className="top-stat-item">
               <span className="top-stat-val" style={{ color: 'var(--aprobada)' }}>{stats.aprobadas}</span>
               <span className="top-stat-label">Aprobadas</span>
             </div>
             <div className="top-stat-item">
               <span className="top-stat-val" style={{ color: 'var(--cursada)' }}>{stats.cursadas}</span>
               <span className="top-stat-label">Cursadas</span>
             </div>
             <div className="top-stat-item">
               <span className="top-stat-val" style={{ color: 'var(--cursando)' }}>{stats.cursando}</span>
               <span className="top-stat-label">En Curso</span>
             </div>
             
             <div className="dashboard-progress">
               <div className="prog-val">
                 <CountUp from={0} to={stats.porcentaje} duration={0.2} />
                 <span style={{ fontSize: '0.6em', color: 'var(--muted)', marginLeft: '2px' }}>%</span>
               </div>
               <div className="prog-label">
                 Progreso
               </div>
             </div>
          </div>
        </section>

        {/* --- DASHBOARD PRINCIPAL --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Horario Semanal */}
          <div id="seccion-horarios">
            <HorarioCalendar 
              horarios={horariosSemanales} 
              isEmpty={diasMostrar.length === 0}
              title={
                <h3 style={{ color: 'var(--cursando)', fontSize: '1.4rem', margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Horario Semanal
                </h3>
              }
              action={
                <div className="schedule-toggle" style={{ display: 'flex', background: 'var(--panel)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  {['1', '2'].map((opcion) => (
                    <div key={opcion} onClick={() => { setFiltroCuatri(opcion); localStorage.setItem('filtroCuatrimestre', opcion); }}
                      style={{ padding: '8px 20px', fontSize: '0.85rem', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', transition: '0.3s',
                        color: filtroCuatri === opcion ? '#fff' : 'var(--muted)',
                        background: filtroCuatri === opcion ? 'var(--cursando)' : 'transparent'
                      }}>
                      {opcion === '1' ? '1º Cuatri' : '2º Cuatri'}
                    </div>
                  ))}
                </div>
              }
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '40px' }}>
            
            {/* Próximos Eventos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ color: 'var(--cursando)', fontSize: '1.3rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                Próximos Parciales / TPs
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {proximosEventos.length === 0 ? (
                  <div style={{ padding: '20px', color: 'var(--muted)', background: 'var(--panel)', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>Sin eventos agendados</div>
                ) : (
                  proximosEventos.map(evento => (
                    <Link href={`/materia/${evento.materiaId}`} key={evento.id} style={{ textDecoration: 'none' }}>
                      <div className="event-card-modern" style={{ background: 'var(--panel)', padding: '16px', borderRadius: '15px', border: '1px solid var(--border)' }}>
                        <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
                          <div style={{ fontWeight: 'bold', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{evento.materia}</div>
                          <div style={{ fontSize: '0.8rem', color: getEventColor(evento.tipo), fontWeight: 700, marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{evento.tipo}: {evento.nombre}</div>
                        </div>
                        <div style={{ background: 'var(--bg)', padding: '8px 12px', borderRadius: '8px', fontFamily: 'Space Mono', fontWeight: 'bold', flexShrink: 0, color: '#ffffff' }}>
                          {formatearFecha(evento.fecha)}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Calendario Integrado */}
            <MiniCalendar detalles={detalles} ALL={ALL} />
            
          </div>

          {/* Acceso Rápido */}
          <div>
            <h3 style={{ color: 'var(--text-strong)', fontSize: '1.3rem', marginBottom: '20px', fontWeight: 'bold' }}>Materias</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {cursando.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '30px', textAlign: 'center', color: 'var(--muted)', background: 'var(--panel)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                  No tenés materias marcadas como "Cursando" actualmente.
                </div>
              ) : (
                cursando.map((m: any) => {
                  const comisionSeleccionada = detalles[m.id]?.comision;
                  const horariosCustom = detalles[m.id]?.horariosCustom;
                  
                  return (
                    <Link href={`/materia/${m.id}`} key={m.id} style={{ textDecoration: 'none' }}>
                      <SpotlightCard className="premium-card" spotlightColor="rgba(59, 130, 246, 0.1)">
                        <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'Space Mono', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          NIVEL {m.level}
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--text-strong)', marginTop: '8px', fontSize: '1.15rem' }}>
                          {m.name}
                        </div>
                        
                        <div style={{ marginTop: '16px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                          {m.comisiones && m.comisiones.length > 0 ? (
                            comisionSeleccionada ? (
                              <span style={{ color: 'var(--cursando)' }}>Comisión: {comisionSeleccionada}</span>
                            ) : (
                              <span style={{ color: '#ef4444' }}>No hay comisión</span>
                            )
                          ) : (
                            horariosCustom && horariosCustom.length > 0 ? (
                              <span style={{ color: '#f59e0b' }}>Horario Personalizado</span>
                            ) : (
                              <span style={{ color: '#ef4444' }}>Sin horario asignado</span>
                            )
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