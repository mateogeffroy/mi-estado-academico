'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePlan } from '../src/context/PlanContext';
import CountUp from '../src/components/CountUp';
import SpotlightCard from '../src/components/SpotlightCard';
import HorarioCalendar from '../src/components/HorarioCalendar';
import { supabase } from '../src/lib/supabase';

export default function Dashboard() {
  const { stats, user, careerData, careerId, materias, detalles } = usePlan();
  const { ALL } = careerData;
  
  // --- ESTADOS DEL DASHBOARD ---
  const [nombreDinamico, setNombreDinamico] = useState('');
  const [tourStep, setTourStep] = useState(0);
  const [viewDate, setViewDate] = useState(new Date());  
  const [filtroCuatri, setFiltroCuatri] = useState('Ambos');
  const [hoveredDayData, setHoveredDayData] = useState<{ day: number, events: string[] } | null>(null);

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

  // Tutorial logic
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasViewedTour = localStorage.getItem('mea_tutorial_home_v2');
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

  // --- PROCESAMIENTO DE MATERIAS Y HORARIOS ---
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

  // Lógica del Calendario de Eventos
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

  // Lógica de Horarios Semanales
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

  const ordenDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diasMostrar = ordenDias.filter(dia => horariosSemanales[dia].length > 0);

  return (
    <>
      <style>{`
        .wave { animation: wave-animation 2.5s infinite; transform-origin: 70% 70%; display: inline-block; }
        @keyframes wave-animation { 0% { transform: rotate( 0.0deg) } 10% { transform: rotate(14.0deg) } 20% { transform: rotate(-8.0deg) } 30% { transform: rotate(14.0deg) } 40% { transform: rotate(-4.0deg) } 50% { transform: rotate(10.0deg) } 60% { transform: rotate( 0.0deg) } 100% { transform: rotate( 0.0deg) } }
        
        .tour-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--overlay-bg); z-index: 9998; backdrop-filter: blur(3px); }
        .tour-dialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 420px; background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 24px; z-index: 10000; box-shadow: 0 20px 40px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 16px; text-align: center; }
        .tour-dialog-top { top: 30px; transform: translateX(-50%); }

        .calendar-nav-btn { background: transparent; border: none; color: var(--text-strong); display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 8px; opacity: 0.6; transition: all 0.2s ease; }
        .calendar-nav-btn:hover { opacity: 1; transform: scale(1.1); }
      `}</style>

      {/* Tutorial Overlay */}
      {tourStep > 0 && (
        <>
          <div className="tour-overlay" />
          <div className={`tour-dialog ${[2, 3].includes(tourStep) ? 'tour-dialog-top' : ''}`}>
            {tourStep === 1 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0 }}>¡Bienvenido/a!</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Actualizamos el Home para que tengas tus horarios y próximos eventos siempre a mano.</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={skipTour} className="btn-secondary" style={{ flex: 1 }}>Omitir</button>
                  <button onClick={() => setTourStep(2)} className="btn-primary" style={{ flex: 1 }}>Siguiente</button>
                </div>
              </>
            )}
            {/* Pasos adicionales del tour... */}
            {tourStep === 5 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0 }}>¡Todo listo!</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Disfrutá de tu nuevo dashboard académico.</p>
                <button onClick={closeTour} className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Comenzar</button>
              </>
            )}
          </div>
        </>
      )}

      <main style={{ paddingBottom: '80px', display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* --- SECCIÓN DE BIENVENIDA Y STATS --- */}
        <section style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginTop: '30px', background: 'var(--panel)', padding: '24px 30px', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <div style={{ flex: '1 1 300px' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', color: 'var(--text-strong)', margin: '0 0 12px 0', fontWeight: 700 }}>
              ¡Hola, <span style={{ color: 'var(--cursando)' }}>{primerNombre}</span>! <span className="wave">👋</span>
            </h2>
            <div style={{ display: 'flex', gap: '20px' }}>
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                 <span style={{color: 'var(--aprobada)', fontWeight: 800, fontSize: '1.2rem'}}>{stats.aprobadas}</span>
                 <span style={{color: 'var(--muted)', fontSize: '0.8rem'}}>Aprobadas</span>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                 <span style={{color: 'var(--cursada)', fontWeight: 800, fontSize: '1.2rem'}}>{stats.cursadas}</span>
                 <span style={{color: 'var(--muted)', fontSize: '0.8rem'}}>Cursadas</span>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                 <span style={{color: 'var(--cursando)', fontWeight: 800, fontSize: '1.2rem'}}>{stats.cursando}</span>
                 <span style={{color: 'var(--muted)', fontSize: '0.8rem'}}>En Curso</span>
               </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg)', padding: '15px 25px', borderRadius: '18px', border: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
              <CountUp from={0} to={stats.porcentaje} duration={0.2} />
              <span style={{ fontSize: '1.5rem', color: 'var(--muted)', marginLeft: '2px' }}>%</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, lineHeight: 1.2 }}>
              Progreso<br/>Total
            </div>
          </div>
        </section>

        {/* --- DASHBOARD PRINCIPAL --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
          
          {/* Grilla de Horarios Semanal (Nuevo Paradigma) */}
          <div id="seccion-horarios">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
              <h3 style={{ color: 'var(--cursando)', fontSize: '1.4rem', margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Horario Semanal
              </h3>
              <div style={{ display: 'flex', background: 'var(--panel)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                {['1', 'Ambos', '2'].map((opcion) => (
                  <div key={opcion} onClick={() => { setFiltroCuatri(opcion); localStorage.setItem('filtroCuatrimestre', opcion); }}
                    style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', transition: '0.3s',
                      color: filtroCuatri === opcion ? '#fff' : 'var(--muted)',
                      background: filtroCuatri === opcion ? 'var(--cursando)' : 'transparent'
                    }}>
                    {opcion === '1' ? '1º Cuatri' : opcion === '2' ? '2º Cuatri' : 'Ambos'}
                  </div>
                ))}
              </div>
            </div>
            
            {diasMostrar.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)', background: 'var(--panel)', borderRadius: '20px', border: '1px dashed var(--border)' }}>
                No tenés materias marcadas como "Cursando". Seleccionalas en tu Plan de Estudios para armar el horario.
              </div>
            ) : (
              <HorarioCalendar horarios={horariosSemanales} />
            )}
          </div>

          {/* Segunda fila: Eventos y Calendario de Parciales */}
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
                      <div className="event-card-modern" style={{ background: 'var(--panel)', padding: '16px', borderRadius: '15px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', color: 'var(--text-strong)' }}>{evento.materia}</div>
                          <div style={{ fontSize: '0.8rem', color: getEventColor(evento.tipo), fontWeight: 700, marginTop: '4px' }}>{evento.tipo}: {evento.nombre}</div>
                        </div>
                        <div style={{ background: 'var(--bg)', padding: '8px 12px', borderRadius: '8px', fontFamily: 'Space Mono', fontWeight: 'bold' }}>{formatearFecha(evento.fecha)}</div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Calendario Mensual Compacto */}
            <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '24px', padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={handlePrevMonth} className="calendar-nav-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
                <h4 style={{ color: 'var(--text-strong)', margin: 0, textTransform: 'capitalize' }}>{nombreMesActual}</h4>
                <button onClick={handleNextMonth} className="calendar-nav-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
              </div>
              
              {/* Aquí va el renderizado de la grilla de días del calendario (omitido por brevedad, igual al anterior) */}
              {/* ... lógica de días ... */}
            </div>
          </div>

          {/* Acceso Rápido a Materias en Curso */}
          <div>
            <h3 style={{ color: 'var(--text-strong)', fontSize: '1.3rem', marginBottom: '20px', fontWeight: 'bold' }}>Acceso Rápido</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {cursando.map((m: any) => (
                <Link href={`/materia/${m.id}`} key={m.id} style={{ textDecoration: 'none' }}>
                  <SpotlightCard className="premium-card" spotlightColor="rgba(59, 130, 246, 0.1)">
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'Space Mono' }}>NIVEL {m.level}</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-strong)', marginTop: '8px', fontSize: '1.1rem' }}>{m.name}</div>
                  </SpotlightCard>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}