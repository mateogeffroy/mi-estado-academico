'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePlan } from '../src/context/PlanContext';
import { ALL } from '../src/lib/data';
import AnimatedList from '../src/components/AnimatedList';
import CountUp from '../src/components/CountUp';
import GradeModal from '../src/components/GradeModal';

export default function Dashboard() {
  // 1. Extraemos el 'user' del contexto
  const { materias, stats, detalles, actualizarDetalleMateria, user } = usePlan();
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState<{id: string, name: string} | null>(null);

  // 2. Agarramos el primer nombre para el saludo
  const primerNombre = user?.user_metadata?.full_name?.split(' ')[0] || 'Estudiante';

  // Filtrado para Historial: solo obligatorias y electivas reales
  const aprobadasOrdenadas = ALL.filter((s: any) => 
    materias[s.id] === 'aprobada' && 
    !s.isElectivePlaceholder && 
    s.id !== 'SEM' &&          
    s.id !== 'PPS'              
  ).sort((a, b) => parseInt(a.id) - parseInt(b.id));

  return (
    <main style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px' }}>
      
      {/* ========================================================= */}
      {/* SECCIÓN 1: HERO / PROGRESO AL ENTRAR (IMPACTO VISUAL) */}
      {/* ========================================================= */}
      <section id="progreso" style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        paddingTop: '100px',
      }}>
        <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', padding: '0 20px' }}>
          
          <div style={{ textAlign: 'center' }}>
            {/* EL SALUDO PERSONALIZADO */}
            <h2 style={{ fontSize: '2.2rem', color: 'white', margin: '0 0 15px 0', fontWeight: 600, animation: 'fadeIn 0.5s ease-out' }}>
              ¡Hola, <span style={{ color: 'var(--cursando)' }}>{primerNombre}</span>! 👋
            </h2>
            
            <h1 style={{ color: 'white', fontSize: '4rem', fontWeight: 900, marginBottom: '10px', lineHeight: 1.1 }}>
              MI ESTADO <span style={{ color: 'var(--cursando)' }}>ACADÉMICO</span>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1.2rem' }}>Registrá tu progreso hacia el título.</p>
          </div>
          
          {/* Tarjeta de Stats */}
          <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '24px', padding: '40px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', gap: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '6rem', fontWeight: 900, color: 'white', lineHeight: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                <CountUp from={0} to={stats.porcentaje} duration={0.2} />
                <span style={{ fontSize: '3rem', marginLeft: '5px', color: 'var(--muted)' }}>%</span>
              </div>
              <div style={{ color: 'var(--cursando)', fontSize: '1rem', marginTop: '10px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>Completado</div>
            </div>
            
            <div style={{ width: '1px', height: '140px', background: 'var(--border)', display: 'none', '@media (minWidth: 768px)': { display: 'block' } } as any}></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '1.2rem', textAlign: 'center' }}>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Materias Aprobadas</div>
                <div style={{ color: 'var(--aprobada)', fontSize: '2.2rem', fontWeight: 900 }}>{stats.aprobadas}</div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Materias Cursadas</div>
                <div style={{ color: 'var(--cursada, #eab308)', fontSize: '2.2rem', fontWeight: 900 }}>{stats.cursadas}</div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Materias en Curso</div>
                <div style={{ color: 'var(--cursando)', fontSize: '2.2rem', fontWeight: 900 }}>{stats.cursando}</div>
              </div>
            </div>
          </div>

          {/* Botones de Navegación Rápida */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/plan" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Plan de Estudios
              </button>
            </Link>
            
            <Link href="/cursada" style={{ textDecoration: 'none' }}>
              <button style={{ 
                padding: '16px 32px', 
                fontSize: '1.1rem', 
                borderRadius: '12px', 
                fontWeight: 'bold', 
                background: 'var(--panel)', 
                border: '1px solid var(--border)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                cursor: 'pointer', 
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                transition: 'all 0.2s' 
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--cursando)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} 
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Ver Mi Cursada
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECCIÓN 2: HISTORIAL DE FINALES APROBADOS */}
      {/* ========================================================= */}
      <section id="aprobadas" style={{ scrollMarginTop: '100px', padding: '0 20px' }}>
        <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', background: 'var(--panel)', borderRadius: '24px', padding: '30px', border: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--aprobada)', marginBottom: '20px', fontSize: '1.3rem', fontWeight: 700 }}>
            Materias aprobadas
          </h3>
          {aprobadasOrdenadas.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', fontStyle: 'italic', padding: '20px' }}>Todavía no tenés materias aprobadas en el historial.</p>
          ) : (
            <AnimatedList 
              items={aprobadasOrdenadas} 
              displayScrollbar={true}
              renderItem={(m) => (
                <div 
                  className="list-row" 
                  style={{ cursor: 'pointer', padding: '15px', borderRadius: '8px', transition: 'background 0.2s', borderBottom: '1px solid rgba(255,255,255,0.02)' }} 
                  onClick={() => {
                    // Chau window.prompt, hola Modal custom!
                    setSelectedMateria({ id: m.id, name: m.name });
                    setIsGradeModalOpen(true);
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
          )}

          {/* Resumen del Promedio General */}
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--muted)', fontSize: '1.2rem', fontWeight: 'bold' }}>Promedio General</span>
            <span style={{ color: 'white', fontSize: '2.5rem', fontWeight: 900 }}>{stats.promedio}</span>
          </div>

        </div>
      </section>

      <GradeModal 
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        materiaName={selectedMateria?.name || ''}
        onSubmit={(nota) => {
          if (selectedMateria) {
            actualizarDetalleMateria(selectedMateria.id, { 
              ...detalles[selectedMateria.id], 
              notaFinal: nota 
            });
          }
        }}
      />
    </main>
  );
}