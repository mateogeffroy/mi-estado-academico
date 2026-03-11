'use client';

import Link from 'next/link';
import { usePlan } from '../src/context/PlanContext';
import { ALL } from '../src/lib/data';
import AnimatedList from '../src/components/AnimatedList';
import CountUp from '../src/components/CountUp';

export default function Dashboard() {
  const { materias, stats } = usePlan();

  const cursando = ALL.filter((s: any) => materias[s.id] === 'cursando');
  const aprobadas = ALL.filter((s: any) => materias[s.id] === 'aprobada');

  // Mock data para eventos próximos (esto se reemplazará con la BDD luego)
  const proximosEventos = [
    { id: 1, materia: 'Ingeniería de Software', tipo: '1er Parcial', fecha: '15/05' },
    { id: 2, materia: 'Redes de Datos', tipo: 'Entrega TP1', fecha: '20/05' },
    { id: 3, materia: 'Legislación', tipo: 'Recuperatorio', fecha: '02/06' },
  ];

  return (
    <main style={{ display: 'flex', flexDirection: 'column', gap: '60px', paddingBottom: '100px' }}>
      
      {/* SECCIÓN NUEVA: AGENDA Y CALENDARIO */}
      <section id="agenda" style={{ scrollMarginTop: '120px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        
        {/* Lado Izquierdo: Próximos Eventos */}
        <div>
          <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '1.2rem', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            Eventos
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {proximosEventos.map(evento => (
              <div key={evento.id} style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{evento.materia}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--cursando)' }}>{evento.tipo}</div>
                </div>
                <div style={{ fontFamily: 'Space Mono', fontSize: '0.9rem', color: 'var(--muted)' }}>{evento.fecha}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lado Derecho: Calendario Estático */}
        <div>
          <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '1.2rem', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            Marzo 2026
          </h2>
          <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '12px', padding: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '10px' }}>
              <span>D</span><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center' }}>
              {Array.from({ length: 31 }, (_, i) => (
                <div key={i} style={{ 
                  padding: '8px 0', 
                  fontSize: '0.8rem', 
                  borderRadius: '4px',
                  background: (i + 1 === 11) ? 'var(--cursando)' : 'transparent', // Resaltamos el día de hoy (11 de marzo)
                  color: (i + 1 === 11) ? 'black' : 'var(--text)',
                  fontWeight: (i + 1 === 11) ? 'bold' : 'normal',
                  border: (i + 1 === 15 || i + 1 === 20) ? '1px solid var(--cursando)' : 'none' // Días con eventos mock
                }}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CURSANDO */}
      <section id="cursando" style={{ scrollMarginTop: '120px' }}>
        <h2 style={{ color: 'var(--cursando)', marginBottom: '25px', fontSize: '1.3rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px', fontWeight: 700 }}>
          Materias en curso
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
          {cursando.map(m => (
            <div key={m.id} className="dash-card" style={{ background: 'var(--panel)', border: '1px solid var(--cursando)', borderRadius: '10px', padding: '20px', cursor: 'pointer' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'Space Mono' }}>
                {m.level ? `Nivel ${m.level}` : 'Electiva'}
              </div>
              <div style={{ fontWeight: '700', color: 'white', marginTop: '6px', fontSize: '1rem' }}>{m.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN PROGRESO Y LOGROS */}
      <section id="progreso" style={{ scrollMarginTop: '120px' }}>
        <h2 style={{ color: 'white', marginBottom: '25px', fontSize: '1.3rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          Resumen
        </h2>
        
        <div style={{ maxWidth: '550px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '12px', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4.5rem', fontWeight: 900, color: 'white', lineHeight: 1, display: 'flex', alignItems: 'baseline' }}>
                <CountUp from={0} to={stats.porcentaje} duration={1} />
                <span style={{ fontSize: '2rem', marginLeft: '2px' }}>%</span>
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '10px' }}>Completado</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '1rem' }}>
              <div style={{ display: 'flex', gap: '30px', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>Aprobadas:</span> <b style={{ color: 'var(--aprobada)' }}>{stats.aprobadas}</b>
              </div>
              <div style={{ display: 'flex', gap: '30px', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>Cursadas:</span> <b style={{ color: 'var(--cursada)' }}>{stats.cursadas}</b>
              </div>
            </div>
          </div>

          <div id="aprobadas">
            <h3 style={{ color: 'var(--aprobada)', marginBottom: '15px', fontSize: '1.1rem', fontWeight: 600 }}>
              Materias aprobadas <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>({aprobadas.length})</span>
            </h3>
            <AnimatedList 
              items={aprobadas.slice().reverse()} 
              displayScrollbar={true}
              renderItem={(m) => (
                <div className="list-row">
                  <span className="row-name" style={{ width: '100%' }}>{m.name}</span>
                  <span className="row-note" style={{ whiteSpace: 'nowrap' }}>Nota: -</span>
                </div>
              )}
            />
          </div>

          <Link href="/plan" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.1rem', fontWeight: 700 }}>
              Ir al Plan de Estudios Completo 🚀
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}