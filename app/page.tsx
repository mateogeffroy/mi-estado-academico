'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePlan } from '../src/context/PlanContext';
import { ALL } from '../src/lib/data';
import AnimatedList from '../src/components/AnimatedList';
import CountUp from '../src/components/CountUp';
import GradeModal from '../src/components/GradeModal';
import { supabase } from '../src/lib/supabase';
import AdBanner from '../src/components/AdBanner';

export default function Dashboard() {
  const { materias, stats, detalles, actualizarDetalleMateria, user } = usePlan();
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState<{ id: string; name: string } | null>(null);
  
  const [nombreDinamico, setNombreDinamico] = useState('');

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

  const primerNombre = nombreDinamico || user?.user_metadata?.full_name?.split(' ')[0] || 'Estudiante';

  const aprobadasOrdenadas = ALL.filter((s: any) =>
    materias[s.id] === 'aprobada' &&
    !s.isElectivePlaceholder &&
    s.id !== 'SEM' &&
    s.id !== 'PPS'
  ).sort((a, b) => parseInt(a.id) - parseInt(b.id));

  return (
    <main style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '80px' }}>
      
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
        /* Eliminamos el bloque .mobile-ad-container de acá porque pisaba las reglas de globals.css */
      `}</style>

      {/* ANUNCIO TOP (Móvil) */}
      <div className="mobile-ad-container" style={{ marginTop: '10px' }}>
        <AdBanner dataAdSlot="MOB_TOP" dataAdFormat="horizontal" />
      </div>

      {/* ============================================================
          SECCIÓN 1: HERO
          ============================================================ */}
      <div className="section-row">
        <div className="ad-wrapper-left">
          <div className="desktop-side-ad">
            <AdBanner dataAdSlot="HERO_L" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
        </div>

        <section
          id="progreso"
          style={{
            /* Eliminamos minHeight: 50vh y justifyContent para que el anuncio no lo catapulte abajo */
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '20px'
          }}
        >
          <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px', padding: '0 16px' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(1rem, 4vw, 1.6rem)', color: 'white', margin: '0 0 8px 0', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                ¡Hola, <span style={{ color: 'var(--cursando)' }}>{primerNombre}</span>! <span className="wave">👋</span>
              </h2>
              <h1 className="logo-landing" style={{ color: 'white', fontWeight: 900, marginBottom: '10px', lineHeight: 1, letterSpacing: '-1px' }}>
                MI ESTADO <span style={{ color: 'var(--cursando)' }}>ACADÉMICO</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)' }}>Registrá tu progreso hacia el título.</p>
            </div>

            <div className="premium-card" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '24px', padding: 'clamp(16px, 5vw, 36px)' }}>
              <div style={{ textAlign: 'center', flex: '1 1 160px' }}>
                <div style={{ fontSize: 'clamp(3rem, 14vw, 6rem)', fontWeight: 900, color: 'white', lineHeight: 0.9, display: 'flex', alignItems: 'baseline', justifyContent: 'center', fontVariantNumeric: 'tabular-nums' }}>
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
                <button className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '0.95rem', borderRadius: '12px', fontWeight: 'bold' }}>Plan de Estudios</button>
              </Link>
              <Link href="/cursada" style={{ textDecoration: 'none', flex: '1 1 160px', maxWidth: '280px' }}>
                <button style={{ width: '100%', padding: '14px', fontSize: '0.95rem', borderRadius: '12px', fontWeight: 'bold', background: 'var(--panel)', border: '1px solid var(--border)', color: 'white', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>Ver Mi Cursada</button>
              </Link>
            </div>
          </div>
        </section>

        <div className="ad-wrapper-right">
          <div className="desktop-side-ad">
            <AdBanner dataAdSlot="HERO_R" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
        </div>
      </div>

      <div className="mobile-ad-container">
        <AdBanner dataAdSlot="MOB_MID" dataAdFormat="horizontal" />
      </div>

      {/* ============================================================
          SECCIÓN 2: HISTORIAL DE APROBADAS
          ============================================================ */}
      <div className="section-row">
        <div className="ad-wrapper-left">
          <div className="desktop-side-ad">
            <AdBanner dataAdSlot="APROB_L" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
        </div>

        <section id="aprobadas" style={{ padding: '0 12px', width: '100%', maxWidth: '800px' }}>
          <div style={{ width: '100%', background: 'var(--panel)', borderRadius: '20px', padding: 'clamp(16px, 5vw, 28px)', border: '1px solid var(--border)' }}>
            <h3 style={{ color: 'var(--aprobada)', marginBottom: '16px', fontSize: '1.1rem', fontWeight: 700 }}>Materias aprobadas</h3>
            {aprobadasOrdenadas.length === 0 ? (
              <p style={{ color: 'var(--muted)', textAlign: 'center', fontStyle: 'italic', padding: '20px' }}>Todavía no tenés materias aprobadas.</p>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <AnimatedList items={aprobadasOrdenadas} renderItem={(m) => (
                  <div className="list-row" style={{ cursor: 'pointer', padding: '12px', marginBottom: '8px' }} onClick={() => { setSelectedMateria({ id: m.id, name: m.name }); setIsGradeModalOpen(true); }}>
                    <span style={{ flex: 1, fontSize: '0.92rem', fontWeight: 600 }}>{m.name}</span>
                    <span style={{ color: detalles[m.id]?.notaFinal ? 'var(--aprobada)' : 'var(--muted)', fontWeight: 'bold', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                      {detalles[m.id]?.notaFinal ? `Nota: ${detalles[m.id].notaFinal}` : '—'}
                    </span>
                  </div>
                )} />
              </div>
            )}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)', fontSize: '1rem', fontWeight: 'bold' }}>Promedio</span>
              <span style={{ color: 'white', fontSize: '2rem', fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{stats.promedio}</span>
            </div>
          </div>
        </section>

        <div className="ad-wrapper-right">
          <div className="desktop-side-ad">
            <AdBanner dataAdSlot="APROB_R" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
        </div>
      </div>

      <div className="mobile-ad-container">
        <AdBanner dataAdSlot="PENDIENTE_CENTRO" dataAdFormat="horizontal" />
      </div>

      {/* ============================================================
          SECCIÓN 3: BLOG
          ============================================================ */}
      <div className="section-row">
        <div className="ad-wrapper-left">
          <div className="desktop-side-ad">
            <AdBanner dataAdSlot="BLOG_L" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
        </div>

        <section id="blog" style={{ padding: '0 12px', marginTop: '10px', width: '100%', maxWidth: '800px' }}>
          <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
            Blog y Novedades
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <Link href="/blog/como-se-hizo" style={{ textDecoration: 'none' }}>
              <article className="premium-card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid var(--border)' }}>
                <div style={{ opacity: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ color: 'var(--cursando)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' }}>Desarrollo</div>
                  <h4 style={{ color: 'white', margin: '0 0 12px 0', fontSize: '1.1rem', lineHeight: '1.3' }}>Detrás del código: Cómo construí Mi Estado Académico</h4>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 20px 0', flex: 1 }}>Un repaso por las tecnologías, desafíos y la historia de cómo nació esta herramienta para los alumnos de la UTN.</p>
                  <div style={{ color: 'white', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>Leer artículo <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></div>
                </div>
              </article>
            </Link>
            <Link href="/blog/correlatividades" style={{ textDecoration: 'none' }}>
              <article className="premium-card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid var(--border)' }}>
                <div style={{ opacity: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ color: 'var(--aprobada)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' }}>Guía UTN</div>
                  <h4 style={{ color: 'white', margin: '0 0 12px 0', fontSize: '1.1rem', lineHeight: '1.3' }}>Correlatividades UTN: El mapa para no trabarte</h4>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 20px 0', flex: 1 }}>Elegir mal una materia te puede costar un año. Analizamos los cuellos de botella del Plan 2023 de Sistemas.</p>
                  <div style={{ color: 'white', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>Leer artículo <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--aprobada)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></div>
                </div>
              </article>
            </Link>
          </div>
        </section>

        <div className="ad-wrapper-right">
          <div className="desktop-side-ad">
            <AdBanner dataAdSlot="BLOG_R" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
        </div>
      </div>

      <GradeModal isOpen={isGradeModalOpen} onClose={() => setIsGradeModalOpen(false)} materiaName={selectedMateria?.name || ''} onSubmit={(nota) => { if (selectedMateria) { actualizarDetalleMateria(selectedMateria.id, { ...detalles[selectedMateria.id], notaFinal: nota }); } }} />
    </main>
  );
}