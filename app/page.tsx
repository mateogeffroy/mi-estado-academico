'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePlan } from '../src/context/PlanContext';
import { ALL } from '../src/lib/data';
import AnimatedList from '../src/components/AnimatedList';
import CountUp from '../src/components/CountUp';
import GradeModal from '../src/components/GradeModal';

export default function Dashboard() {
  const { materias, stats, detalles, actualizarDetalleMateria, user } = usePlan();
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState<{ id: string; name: string } | null>(null);

  const primerNombre = user?.user_metadata?.full_name?.split(' ')[0] || 'Estudiante';

  const aprobadasOrdenadas = ALL.filter((s: any) =>
    materias[s.id] === 'aprobada' &&
    !s.isElectivePlaceholder &&
    s.id !== 'SEM' &&
    s.id !== 'PPS'
  ).sort((a, b) => parseInt(a.id) - parseInt(b.id));

  return (
    <main style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '80px' }}>

      {/* ============================================================
          SECCIÓN 1: HERO
          ============================================================ */}
      <section
        id="progreso"
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '20px',
        }}
      >
        <div style={{
          maxWidth: '900px', width: '100%', margin: '0 auto',
          display: 'flex', flexDirection: 'column', gap: '28px',
          padding: '0 16px',
        }}>

          {/* Greeting + Title */}
          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              fontSize: 'clamp(1rem, 4vw, 1.6rem)',
              color: 'white', margin: '0 0 8px 0', fontWeight: 600,
              animation: 'fadeIn 0.5s ease-out',
            }}>
              ¡Hola, <span style={{ color: 'var(--cursando)' }}>{primerNombre}</span>! 👋
            </h2>

            <h1
              className="logo-landing"
              style={{
                color: 'white',
                fontWeight: 900,
                marginBottom: '10px',
                lineHeight: 1,
                letterSpacing: '-1px',
              }}
            >
              MI ESTADO <span style={{ color: 'var(--cursando)' }}>ACADÉMICO</span>
            </h1>

            <p style={{ color: 'var(--muted)', fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)' }}>
              Registrá tu progreso hacia el título.
            </p>
          </div>

          {/* Stats Card */}
          <div
            className="premium-card"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '24px',
              padding: 'clamp(16px, 5vw, 36px)',
            }}
          >
            {/* Big percentage */}
            <div style={{ textAlign: 'center', flex: '1 1 160px' }}>
              <div style={{
                fontSize: 'clamp(3rem, 14vw, 6rem)',
                fontWeight: 900, color: 'white',
                lineHeight: 0.9, display: 'flex',
                alignItems: 'baseline', justifyContent: 'center',
              }}>
                <CountUp from={0} to={stats.porcentaje} duration={0.2} />
                <span style={{ fontSize: 'clamp(1.5rem, 6vw, 3rem)', marginLeft: '5px', color: 'var(--muted)' }}>
                  %
                </span>
              </div>
              <div style={{
                color: 'var(--cursando)', fontSize: '0.8rem', marginTop: '10px',
                fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase',
              }}>
                Completado
              </div>
            </div>

            {/* Vertical divider (desktop only) */}
            <div
              className="desktop-only"
              style={{ width: '1px', height: '120px', background: 'var(--border)', flexShrink: 0 }}
            />

            {/* Mini stats */}
            <div style={{
              display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
              justifyContent: 'center', gap: '16px', flex: '1 1 260px',
            }}>
              {[
                { label: 'Aprobadas', value: stats.aprobadas,  color: 'var(--aprobada)'  },
                { label: 'Cursadas',  value: stats.cursadas,   color: 'var(--cursada)'   },
                { label: 'En Curso',  value: stats.cursando,   color: 'var(--cursando)'  },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: 'center', minWidth: '80px' }}>
                  <div style={{ color: 'var(--muted)', fontSize: '0.72rem', marginBottom: '4px' }}>
                    {label}
                  </div>
                  <div style={{ color, fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', fontWeight: 900 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/plan" style={{ textDecoration: 'none', flex: '1 1 160px', maxWidth: '280px' }}>
              <button
                className="btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '0.95rem', borderRadius: '12px', fontWeight: 'bold' }}
              >
                Plan de Estudios
              </button>
            </Link>
            <Link href="/cursada" style={{ textDecoration: 'none', flex: '1 1 160px', maxWidth: '280px' }}>
              <button style={{
                width: '100%', padding: '14px', fontSize: '0.95rem', borderRadius: '12px', fontWeight: 'bold',
                background: 'var(--panel)', border: '1px solid var(--border)', color: 'white', cursor: 'pointer',
                fontFamily: 'Syne, sans-serif',
              }}>
                Ver Mi Cursada
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================================
          SECCIÓN 2: HISTORIAL DE APROBADAS
          ============================================================ */}
      <section id="aprobadas" style={{ padding: '0 12px' }}>
        <div style={{
          maxWidth: '800px', width: '100%', margin: '0 auto',
          background: 'var(--panel)', borderRadius: '20px',
          padding: 'clamp(16px, 5vw, 28px)', border: '1px solid var(--border)',
        }}>
          <h3 style={{ color: 'var(--aprobada)', marginBottom: '16px', fontSize: '1.1rem', fontWeight: 700 }}>
            Materias aprobadas
          </h3>

          {aprobadasOrdenadas.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', fontStyle: 'italic', padding: '20px' }}>
              Todavía no tenés materias aprobadas.
            </p>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <AnimatedList
                items={aprobadasOrdenadas}
                renderItem={(m) => (
                  <div
                    className="list-row"
                    style={{ cursor: 'pointer', padding: '12px', marginBottom: '8px' }}
                    onClick={() => {
                      setSelectedMateria({ id: m.id, name: m.name });
                      setIsGradeModalOpen(true);
                    }}
                  >
                    <span style={{ flex: 1, fontSize: '0.92rem', fontWeight: 600 }}>{m.name}</span>
                    <span style={{
                      color: detalles[m.id]?.notaFinal ? 'var(--aprobada)' : 'var(--muted)',
                      fontWeight: 'bold',
                      flexShrink: 0,
                    }}>
                      {detalles[m.id]?.notaFinal ? `Nota: ${detalles[m.id].notaFinal}` : '—'}
                    </span>
                  </div>
                )}
              />
            </div>
          )}

          {/* Average */}
          <div style={{
            marginTop: '20px', paddingTop: '20px',
            borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ color: 'var(--muted)', fontSize: '1rem', fontWeight: 'bold' }}>Promedio</span>
            <span style={{ color: 'white', fontSize: '2rem', fontWeight: 900 }}>{stats.promedio}</span>
          </div>
        </div>
      </section>

      {/* ============================================================
          GRADE MODAL
          ============================================================ */}
      <GradeModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        materiaName={selectedMateria?.name || ''}
        onSubmit={(nota) => {
          if (selectedMateria) {
            actualizarDetalleMateria(selectedMateria.id, {
              ...detalles[selectedMateria.id],
              notaFinal: nota,
            });
          }
        }}
      />
    </main>
  );
}