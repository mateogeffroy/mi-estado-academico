'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePlan } from '../src/context/PlanContext';
import CountUp from '../src/components/CountUp';
import { supabase } from '../src/lib/supabase';

export default function Dashboard() {
  const { stats, user, careerData, careerId } = usePlan();
  
  const [nombreDinamico, setNombreDinamico] = useState('');
  
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasViewedTour = localStorage.getItem('mea_tutorial_home_v1');
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

  useEffect(() => {
    // 🔥 LÓGICA DE AUTO-SCROLL ACTUALIZADA 🔥
    // Eliminamos el auto-scroll de los pasos 2, 3 y 4 (botones de navegación rápida)
    
    if (tourStep === 5) {
      // Mantenemos el scroll al blog para ver el resaltado mentre el diálogo está centrado
      document.getElementById('tour-sec-blog')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (tourStep === 6 || tourStep === 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [tourStep]);

  const closeTour = () => {
    setTourStep(0);
    localStorage.setItem('mea_tutorial_home_v1', 'true');
  };

  const skipTour = () => {
    setTourStep(6); 
  };

  const primerNombre = nombreDinamico || user?.user_metadata?.full_name?.split(' ')[0] || 'Estudiante';

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
      targetCareers: ['utn-sistemas-2023'] 
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
          pointer-events: none !important; 
          border-radius: inherit;
        }

        /* 🔥 CSS DEL TOUR ACTUALIZADO PARA POSICIONAMIENTO CONDICIONAL 🔥 */
        /* Estilo base centrado para pasos 1, 5, 6 */
        .tour-dialog {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
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
          bottom: auto; /* Nos aseguramos que no interfiera el bottom viejo */
        }

        /* Clase para pasos 2, 3, 4: Modal arriba de la página, sin autoscroll */
        .tour-dialog-top {
          top: 30px; /* Posicionamiento alto en la ventana */
          transform: translateX(-50%); /* Solo centrado horizontal */
          bottom: auto;
        }

        /* Eliminamos el override viejo que forzaba el bottom en mobile/desktop */
        @media (min-width: 1024px) {
          /* No longer used for dialog positioning, default is centered */
        }
      `}</style>

      {tourStep > 0 && (
        <>
          <div className="tour-overlay" />
          
          {/* 🔥 JSX DEL TOUR ACTUALIZADO PARA APLICAR CLASES CONDICIONALES 🔥 */}
          <div className={`tour-dialog ${[2, 3, 4].includes(tourStep) ? 'tour-dialog-top' : ''}`}>
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
                  Acá podés visualizar tu plan de estudios completo, ver las correlatividades claras y marcar tus materias como <strong>aprobadas</strong>, <strong>cursadas</strong> o <strong>cursando</strong>.
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
                  Las materias que marcaste como <strong>cursando</strong> vienen acá. Podés seleccionar sus comisiones, registrar eventos (parciales/TPs) y tu horario semanal se arma solo.
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--aprobada)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Mi Perfil
                </h3>
                {/* 🔥 TEXTO EXPLICATIVO DEL PERFIL ACTUALIZADO 🔥 */}
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  En tu <strong>Perfil</strong> vas a encontrar el listado completo de tus materias <strong>Aprobadas</strong>, donde podés usar el sistema de <strong>estrellas</strong> para calificar el nivel de dificultad de cada una.<br /><br />
                  Además, desde acá tenés la posibilidad de modificar tu nombre y cambiar de carrera en cualquier momento.
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
                  En este espacio publico artículos, guías y novedades sobre la plataforma para tu carrera. ¡Próximamente la comunidad va a poder subir sus propios posteos!
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
        
        <div className="section-row">
          <section id="progreso" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px', marginBottom: '40px', width: '100%' }}>
            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px', padding: '0 16px' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: 'clamp(1rem, 4vw, 1.6rem)', color: 'var(--text-strong)', margin: '0 0 8px 0', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  ¡Hola, <span style={{ color: 'var(--cursando)' }}>{primerNombre}</span>! <span className="wave">👋</span>
                </h2>
              </div>

              <div className="premium-card no-hover-card" style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '24px', padding: 'clamp(5px, 5vw, 25px)', paddingTop: 'clamp(20px, 8vw, 20px)' }}>
                <div style={{ textAlign: 'center', flex: '1 1 160px' }}>
                  <div style={{ fontSize: 'clamp(3rem, 14vw, 6rem)', fontWeight: 900, color: 'var(--text-strong)', lineHeight: 0.9, display: 'flex', alignItems: 'baseline', justifyContent: 'center', fontVariantNumeric: 'tabular-nums' }}>
                    <CountUp from={0} to={stats.porcentaje} duration={0.2} />
                    <span style={{ fontSize: 'clamp(1.5rem, 6vw, 3rem)', marginLeft: '5px', color: 'var(--muted)' }}>%</span>
                  </div>
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

              {/* 🔥 BOTONES CON IDs ÚNICOS CORREGIDOS 🔥 */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', textAlign: 'center' }}>
                  <span style={{ color: 'var(--text-strong)' }}>Navegación</span> <span style={{ color: 'var(--cursando)' }}>Rápida</span>
                </h3>
                
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                  <Link href="/plan" style={{ textDecoration: 'none', flex: '1 1 160px', maxWidth: '280px' }}>
                    <button id="tour-btn-plan" className={`${tourStep === 2 ? 'tour-highlighted' : ''}`} style={{ width: '100%', padding: '14px', fontSize: '0.95rem', borderRadius: '12px', fontWeight: 'bold', background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text-strong)', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>Plan de Estudios</button>
                  </Link>
                  <Link href="/cursada" style={{ textDecoration: 'none', flex: '1 1 160px', maxWidth: '280px' }}>
                    <button id="tour-btn-cursada" className={`${tourStep === 3 ? 'tour-highlighted' : ''}`} style={{ width: '100%', padding: '14px', fontSize: '0.95rem', borderRadius: '12px', fontWeight: 'bold', background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text-strong)', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>Mi Cursada</button>
                  </Link>
                  <Link href="/perfil" style={{ textDecoration: 'none', flex: '1 1 160px', maxWidth: '280px' }}>
                    {/* 🔥 ID CORREGIDO AQUÍ (era tour-btn-cursada) 🔥 */}
                    <button id="tour-btn-perfil" className={`${tourStep === 4 ? 'tour-highlighted' : ''}`} style={{ width: '100%', padding: '14px', fontSize: '0.95rem', borderRadius: '12px', fontWeight: 'bold', background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text-strong)', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>Mi Perfil</button>
                  </Link>
                </div>
              </div>

            </div>
          </section>
        </div>

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
      </main>
    </>
  );
}