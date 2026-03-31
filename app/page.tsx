'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePlan } from '../src/context/PlanContext';
import AnimatedList from '../src/components/AnimatedList';
import CountUp from '../src/components/CountUp';
import GradeModal from '../src/components/GradeModal';
import { supabase } from '../src/lib/supabase';
import AdBanner from '../src/components/AdBanner'; 

export default function Dashboard() {
  const { materias, stats, detalles, actualizarDetalleMateria, user, careerData, careerId } = usePlan();
  const { ALL, careerInfo } = careerData;
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState<{ id: string; name: string } | null>(null);
  
  const [nombreDinamico, setNombreDinamico] = useState('');
  
  // 🔥 LÓGICA DEL TUTORIAL DE INICIO
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
  }, []);

  // Verifica si es la primera vez que entra para lanzar el tutorial
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasViewedTour = localStorage.getItem('mea_tutorial_home_v1');
      if (!hasViewedTour) {
        setTimeout(() => setTourStep(1), 600); // Pequeño delay para que cargue la UI
      }
    }
  }, []);

  // Escucha el botón "?" del LayoutClient para reiniciar el tutorial manualmente
  useEffect(() => {
    const handleStartTour = () => {
      setTourStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('start-home-tour', handleStartTour);
    return () => window.removeEventListener('start-home-tour', handleStartTour);
  }, []);

  // Maneja el scroll automático hacia los elementos resaltados
  useEffect(() => {
    if (tourStep === 2) document.getElementById('tour-btn-plan')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (tourStep === 3) document.getElementById('tour-btn-cursada')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (tourStep === 4) document.getElementById('tour-sec-aprobadas')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (tourStep === 5) document.getElementById('tour-sec-blog')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (tourStep === 6 || tourStep === 1) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tourStep]);

  const closeTour = () => {
    setTourStep(0);
    localStorage.setItem('mea_tutorial_home_v1', 'true');
  };

  const skipTour = () => {
    setTourStep(6); // Va directo al mensaje final
  };

  const primerNombre = nombreDinamico || user?.user_metadata?.full_name?.split(' ')[0] || 'Estudiante';

  const aprobadasOrdenadas = ALL.filter((s: any) =>
    materias[s.id] === 'aprobada' &&
    !s.isElectivePlaceholder &&
    s.id !== 'SEM' &&
    s.id !== 'PPS'
  ).sort((a, b) => parseInt(a.id) - parseInt(b.id));

  const NOVEDADES = [
    {
      id: 'como-se-hizo',
      href: '/blog/como-se-hizo',
      tag: 'Desarrollo',
      tagColor: 'var(--cursando)',
      titulo: 'Detrás del código: Cómo construí Mi Estado Académico',
      descripcion: 'Un repaso por las tecnologías, desafíos y la historia de cómo nació esta herramienta para alumnos de la UTN.',
      iconColor: 'var(--cursando)',
      targetCareers: ['utn-sistemas-2023'] 
    },
    {
      id: 'correlatividades',
      href: '/blog/correlatividades',
      tag: 'Guía UTN',
      tagColor: 'var(--aprobada)',
      titulo: 'Correlatividades UTN: El mapa para no trabarte',
      descripcion: 'Elegir mal una materia te puede costar un año. Analizamos los cuellos de botella del Plan 2023 de Sistemas.',
      iconColor: 'var(--aprobada)',
      targetCareers: ['utn-sistemas-2023'] 
    },
    {
      id: 'creando-frontend',
      href: '/blog/creando-frontend',
      tag: 'Desarrollo',
      tagColor: 'var(--cursando)',
      titulo: 'Creando Frontends Premium con Antigravity + Skills',
      descripcion: 'Una guía metodológica para transformar los diseños aburridos de IA en interfaces estéticas y originales utilizando skills de desarrollo.',
      iconColor: 'var(--cursando)',
      targetCareers: ['utn-sistemas-2023'] // O las carreras que quieras
    },
  ];

  const novedadesFiltradas = NOVEDADES.filter(post => 
    post.targetCareers.includes(careerId)
  );

  return (
    <>
      <style>{`
        .wave {
          animation-name: wave-animation;
          animation-duration: 2.5s;
          animation-iteration-count: infinite;
          transform-origin: 70% 70%;
          display: inline-block;
        }
        @keyframes wave-animation {
            0% { transform: rotate( 0.0deg) }
           10% { transform: rotate(14.0deg) }
           20% { transform: rotate(-8.0deg) }
           30% { transform: rotate(14.0deg) }
           40% { transform: rotate(-4.0deg) }
           50% { transform: rotate(10.0deg) }
           60% { transform: rotate( 0.0deg) }
          100% { transform: rotate( 0.0deg) }
        }

        .no-hover-card:hover {
          transform: none !important;
          border-color: var(--glass-border) !important;
          box-shadow: none !important;
        }

        @media (min-width: 1350px) {
          .section-row {
            min-height: auto !important;
          }
        }

        /* 🔥 ESTILOS DEL TUTORIAL (SPOTLIGHT) 🔥 */
        .tour-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: var(--overlay-bg);
          z-index: 9998;
          backdrop-filter: blur(3px);
          transition: opacity 0.3s ease;
        }

        .tour-highlighted {
          position: relative !important;
          z-index: 9999 !important;
          box-shadow: 0 0 0 6px var(--bg), 0 0 0 10px var(--cursando) !important;
          pointer-events: none !important; /* Evita clics accidentales durante el tour */
          border-radius: inherit;
        }

        .tour-dialog {
          position: fixed;
          bottom: 8%;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 420px;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          z-index: 10000;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: center;
        }

        /* En resoluciones altas, acercamos el popup un poco más al centro para que no quede tan lejos */
        @media (min-width: 1024px) {
          .tour-dialog { bottom: 15%; }
        }
      `}</style>

      {/* OVERLAY Y CUADRO DE DIÁLOGO DEL TUTORIAL */}
      {tourStep > 0 && (
        <>
          <div className="tour-overlay" />
          
          <div className="tour-dialog">
            {tourStep === 1 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.3rem' }}>¡Bienvenido/a!</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  Te preparamos un recorrido rápido para que sepas cómo sacarle el máximo provecho a la plataforma.
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={skipTour} style={{ flex: 1, padding: '12px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '10px', fontWeight: 'bold' }}>Omitir</button>
                  <button onClick={() => setTourStep(2)} className="btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', fontWeight: 'bold' }}>Siguiente</button>
                </div>
              </>
            )}

            {tourStep === 2 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
                  Plan de Estudios
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  Acá podés visualizar tu plan de estudios completo, ver las correlatividades claras y marcar tus materias como <strong>aprobadas</strong>, <strong>cursadas</strong> o <strong>cursando</strong>. Esta última opción habilita funcionalidades exclusivas para organizar tu cursada.
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={skipTour} style={{ flex: 1, padding: '12px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '10px', fontWeight: 'bold' }}>Omitir</button>
                  <button onClick={() => setTourStep(3)} className="btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', fontWeight: 'bold' }}>Siguiente</button>
                </div>
              </>
            )}

            {tourStep === 3 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Mi Cursada
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  En esta sección podés seleccionar las comisiones de las materias que marcaste como <strong>cursando</strong>, registrar eventos como examenes o exposiciones y ver tu horario semanal armarse solo.
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={skipTour} style={{ flex: 1, padding: '12px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '10px', fontWeight: 'bold' }}>Omitir</button>
                  <button onClick={() => setTourStep(4)} className="btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', fontWeight: 'bold' }}>Siguiente</button>
                </div>
              </>
            )}

            {tourStep === 4 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--aprobada)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Materias Aprobadas
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  Acá vas a ver tu progreso. Podés ingresar las notas finales de las materias marcadas como <strong>aprobadas</strong> para ver tu promedio general.
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={skipTour} style={{ flex: 1, padding: '12px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '10px', fontWeight: 'bold' }}>Omitir</button>
                  <button onClick={() => setTourStep(5)} className="btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', fontWeight: 'bold' }}>Siguiente</button>
                </div>
              </>
            )}

            {tourStep === 5 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
                  Blog y Novedades
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  En este espacio voy a publicar blogs y novedades sobre la plataforma. ¡Próximamente la comunidad va a poder subir sus propios posteos!
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={skipTour} style={{ flex: 1, padding: '12px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '10px', fontWeight: 'bold' }}>Omitir</button>
                  <button onClick={() => setTourStep(6)} className="btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', fontWeight: 'bold' }}>Siguiente</button>
                </div>
              </>
            )}

            {tourStep === 6 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.3rem' }}>¡Gracias por registrarte!</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  Si la plataforma te resulta útil, podés apoyar el proyecto invitándome un Cafecito. ¡Éxitos!
                </p>
                <button onClick={closeTour} className="btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '10px', fontWeight: 'bold', marginTop: '10px' }}>
                  Comenzar a usar
                </button>
              </>
            )}
          </div>
        </>
      )}


      <main style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '80px' }}>
        
        {/* ============================================================
            SECCIÓN 1: HERO
            ============================================================ */}
        <div className="section-row">
          <section id="progreso" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px', marginBottom: '40px', width: '100%' }}>
            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px', padding: '0 16px' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: 'clamp(1rem, 4vw, 1.6rem)', color: 'var(--text-strong)', margin: '0 0 8px 0', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  ¡Hola, <span style={{ color: 'var(--cursando)' }}>{primerNombre}</span>! <span className="wave">👋</span>
                </h2>
                
                {/* TÍTULO APILADO EN DOS RENGLONES */}
                <h1 className="logo-landing" style={{ fontWeight: 900, marginBottom: '10px', lineHeight: 1.1, letterSpacing: '-1px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>MI ESTADO</span>
                  <span style={{ color: 'var(--cursando)', whiteSpace: 'nowrap' }}>ACADÉMICO</span>
                </h1>
                
                <p style={{ color: 'var(--muted)', fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)' }}>Tu herramienta para gestionar tu cursada.</p>
              </div>

              <div className="premium-card no-hover-card" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '24px', padding: 'clamp(16px, 5vw, 36px)' }}>
                <div style={{ textAlign: 'center', flex: '1 1 160px' }}>
                  <div style={{ fontSize: 'clamp(3rem, 14vw, 6rem)', fontWeight: 900, color: 'var(--text-strong)', lineHeight: 0.9, display: 'flex', alignItems: 'baseline', justifyContent: 'center', fontVariantNumeric: 'tabular-nums' }}>
                    <CountUp from={0} to={stats.porcentaje} duration={0.2} />
                    <span style={{ fontSize: 'clamp(1.5rem, 6vw, 3rem)', marginLeft: '5px', color: 'var(--muted)' }}>%</span>
                  </div>
                  <div style={{ color: 'var(--cursando)', fontSize: '0.8rem', marginTop: '10px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>Completado</div>
                </div>

                <div className="desktop-only" style={{ width: '1px', height: '120px', background: 'var(--border)', flexShrink: 0 }} />

                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', flex: '1 1 260px' }}>
                  {[ { label: 'Aprobadas', value: stats.aprobadas, color: 'var(--aprobada)' }, { label: 'Cursadas', value: stats.cursadas, color: 'var(--cursada)' }, { label: 'En Curso', value: stats.cursando, color: 'var(--cursando)' } ].map(({ label, value, color }) => (
                    <div key={label} style={{ textAlign: 'center', minWidth: '80px' }}>
                      <div style={{ color: 'var(--muted)', fontSize: '0.72rem', marginBottom: '4px' }}>{label}</div>
                      <div style={{ color, fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/plan" style={{ textDecoration: 'none', flex: '1 1 160px', maxWidth: '280px' }}>
                  <button id="tour-btn-plan" className={`btn-primary ${tourStep === 2 ? 'tour-highlighted' : ''}`} style={{ width: '100%', padding: '14px', fontSize: '0.95rem', borderRadius: '12px', fontWeight: 'bold' }}>Plan de Estudios</button>
                </Link>
                <Link href="/cursada" style={{ textDecoration: 'none', flex: '1 1 160px', maxWidth: '280px' }}>
                  <button id="tour-btn-cursada" className={`${tourStep === 3 ? 'tour-highlighted' : ''}`} style={{ width: '100%', padding: '14px', fontSize: '0.95rem', borderRadius: '12px', fontWeight: 'bold', background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text-strong)', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>Mi Cursada</button>
                </Link>
              </div>
            </div>
          </section>

        </div>

        {/* ============================================================
            SECCIÓN 2: HISTORIAL DE APROBADAS
            ============================================================ */}
        <div className="section-row">

          <section style={{ padding: '0 12px', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            <div id="tour-sec-aprobadas" className={`${tourStep === 4 ? 'tour-highlighted' : ''}`} style={{ width: '100%', background: 'var(--panel)', borderRadius: '20px', padding: 'clamp(16px, 5vw, 28px)', border: '1px solid var(--border)' }}>
              <h3 style={{ color: 'var(--aprobada)', marginBottom: '16px', fontSize: '1.1rem', fontWeight: 700 }}>Materias aprobadas</h3>
              {aprobadasOrdenadas.length === 0 ? (
                <p style={{ color: 'var(--muted)', textAlign: 'center', fontStyle: 'italic', padding: '20px' }}>Todavía no tenés materias aprobadas.</p>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <AnimatedList items={aprobadasOrdenadas} renderItem={(m) => (
                    <div className="list-row" style={{ cursor: 'pointer', padding: '12px', marginBottom: '8px' }} onClick={() => { setSelectedMateria({ id: m.id, name: m.name }); setIsGradeModalOpen(true); }}>
                      <span style={{ flex: 1, fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-strong)' }}>{m.name}</span>
                      <span style={{ color: detalles[m.id]?.notaFinal ? 'var(--aprobada)' : 'var(--muted)', fontWeight: 'bold', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                        {detalles[m.id]?.notaFinal ? `Nota: ${detalles[m.id].notaFinal}` : '—'}
                      </span>
                    </div>
                  )} />
                </div>
              )}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--muted)', fontSize: '1rem', fontWeight: 'bold' }}>Promedio</span>
                <span style={{ color: 'var(--text-strong)', fontSize: '2rem', fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{stats.promedio}</span>
              </div>
            </div>
          </section>

        </div>

        {/* ============================================================
            SECCIÓN 3: BLOG (Condicional)
            ============================================================ */}
        {novedadesFiltradas.length > 0 && (
          <div className="section-row">

            <section style={{ padding: '0 12px', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
              <div id="tour-sec-blog" className={`${tourStep === 5 ? 'tour-highlighted' : ''}`} style={{ background: 'var(--bg)', borderRadius: '20px', padding: tourStep === 5 ? '20px' : '0' }}>
                <h3 style={{ color: 'var(--text-strong)', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
                  Blog y Novedades
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                  
                  {novedadesFiltradas.map((post) => (
                    <Link key={post.id} href={post.href} style={{ textDecoration: 'none' }}>
                      <article className="premium-card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid var(--border)' }}>
                        <div style={{ opacity: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <div style={{ color: post.tagColor, fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' }}>
                            {post.tag}
                          </div>
                          <h4 style={{ color: 'var(--text-strong)', margin: '0 0 12px 0', fontSize: '1.1rem', lineHeight: '1.3' }}>
                            {post.titulo}
                          </h4>
                          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 20px 0', flex: 1 }}>
                            {post.descripcion}
                          </p>
                          <div style={{ color: 'var(--text-strong)', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            Leer artículo 
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={post.iconColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}

                </div>
              </div>
            </section>

          </div>
        )}

        <GradeModal isOpen={isGradeModalOpen} onClose={() => setIsGradeModalOpen(false)} materiaName={selectedMateria?.name || ''} onSubmit={(nota) => { if (selectedMateria) { actualizarDetalleMateria(selectedMateria.id, { ...detalles[selectedMateria.id], notaFinal: nota }); } }} />
      </main>
    </>
  );
}