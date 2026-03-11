'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePlan } from '../../src/context/PlanContext';
import { SUBJECTS, ELECTIVAS, getSubjectById } from '../../src/lib/data';

export default function PlanDeEstudios() {
  const { materias, cambiarEstadoMateria, stats } = usePlan();
  const levels = [1, 2, 3, 4, 5];

  const [showScroll, setShowScroll] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, content: null as React.ReactNode, x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const marcarNivel = (lvl: number) => {
    const obligatorias = SUBJECTS.filter((s: any) =>
      s.level === lvl && !s.isElective && !s.isElectivePlaceholder && !s.isSeminario && s.id !== 'PPS'
    );
    obligatorias.forEach((m: any) => {
      if (materias[m.id] !== 'aprobada') cambiarEstadoMateria(m.id, 'aprobada');
    });
  };

  // --- LÓGICA DEL TOOLTIP ---
  const buildTooltipContent = (subject: any) => {
    if (subject.isElectivePlaceholder) {
      return (
        <>
          🎯 Requiere: {subject.targetHours} hs anuales<br />
          Aprobando electivas de {subject.level}° nivel.
        </>
      );
    }
    if (subject.isOutdated) {
      return (
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 6px', borderRadius: '4px', display: 'inline-block' }}>
          ⚠️ Materia fuera del plan. Solo marcar si fue cursada/aprobada históricamente.
        </span>
      );
    }

    let hasTitle = false;
    const lines: JSX.Element[] = [];

    if (subject.correlCursada?.length) {
      hasTitle = true;
      lines.push(<div key="t1" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correlativas</div>);
      lines.push(<b key="s1">Cursada(s):</b>);
      subject.correlCursada.forEach((cid: any) => {
        const s = getSubjectById(cid);
        const cleanName = s ? s.name.replace(/\s*\(.*?\)/g, '') : cid;
        const ok = materias[cid] === 'cursada' || materias[cid] === 'aprobada';
        lines.push(<div key={`c-${cid}`}>{ok ? '✅' : '❌'} {cleanName}</div>);
      });
    }

    if (subject.correlAprobada?.length) {
      if (!hasTitle) {
        lines.push(<div key="t2" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correlativas</div>);
      }
      lines.push(<b key="s2" style={{ display: 'block', marginTop: '4px' }}>Aprobada(s):</b>);
      subject.correlAprobada.forEach((cid: any) => {
        const s = getSubjectById(cid);
        const cleanName = s ? s.name.replace(/\s*\(.*?\)/g, '') : cid;
        const ok = materias[cid] === 'aprobada';
        lines.push(<div key={`a-${cid}`}>{ok ? '✅' : '❌'} {cleanName}</div>);
      });
    }

    if (lines.length === 0) return <>Sin correlatividades</>;

    return <>{lines}</>;
  };

  const handleMouseMove = (e: React.MouseEvent, subject: any) => {
    let x = e.clientX + 12;
    let y = e.clientY + 12;

    // Evitar que el tooltip se salga de la pantalla por la derecha o abajo
    if (x + 220 > window.innerWidth) x = e.clientX - 230;
    if (y + 150 > window.innerHeight) y = e.clientY - 160;
    if (x < 12) x = 12;
    if (y < 12) y = 12;

    setTooltip({
      visible: true,
      content: buildTooltipContent(subject),
      x,
      y
    });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  // --- RENDERIZADO DE MATERIAS ---
  const renderCard = (subject: any) => (
    <div
      key={subject.id}
      className={`subject-card ${materias[subject.id] || 'disabled'}`}
      onClick={() => cambiarEstadoMateria(subject.id, 'aprobada')}
      onContextMenu={(e) => { 
        e.preventDefault(); 
        cambiarEstadoMateria(subject.id, 'cursada'); 
      }}
      onMouseMove={(e) => handleMouseMove(e, subject)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="subject-num">{subject.num}</div>
      <div className="subject-name">{subject.name}</div>
      <div className="subject-hours">{subject.hours}</div>
      <div className="subject-status-icon">
        {materias[subject.id] === 'aprobada' ? '✅' : 
         materias[subject.id] === 'cursada' ? '📖' : 
         materias[subject.id] === 'cursando' ? '✍️' :
         materias[subject.id] === 'available' ? '' : '🔒'}
      </div>
    </div>
  );

  return (
    <main id="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div className="header-titles">
          <h1 className="logo">Plan de estudios <span>dinámico</span></h1>
        </div>
        <Link href="/">
          <button className="btn-secondary">← Volver al Dashboard</button>
        </Link>
      </div>

      {levels.map(lvl => {
        const materiasObligatorias = SUBJECTS.filter((s: any) => s.level === lvl && !s.isElective && !s.isElectivePlaceholder);
        const electivas = ELECTIVAS[lvl as keyof typeof ELECTIVAS] || [];
        const placeholders = SUBJECTS.filter((s: any) => s.level === lvl && s.isElectivePlaceholder);

        return (
          <div key={lvl} className="level-section">
            <div className="level-header" style={{ color: `var(--n${lvl})` }}>
              <div className="level-badge" style={{ borderColor: `var(--n${lvl})` }}>Nivel {lvl}</div>
              <button className="mark-all-btn" onClick={() => marcarNivel(lvl)}>Marcar todas</button>
              <div className="level-line" style={{ backgroundColor: `var(--n${lvl})` }}></div>
            </div>
            
            <div className="subject-grid">
              {materiasObligatorias.map(renderCard)}
              {placeholders.map(renderCard)}
            </div>

            {electivas.length > 0 && (
              <>
                <div className="electivas-level-label" style={{ marginTop: '24px' }}>Electivas</div>
                <div className="subject-grid">
                  {electivas.map(renderCard)}
                </div>
              </>
            )}
          </div>
        );
      })}

      <button 
        id="btn-scroll-top" 
        className={`scroll-top-btn ${showScroll ? 'visible' : ''}`} 
        onClick={scrollToTop} 
        title="Volver arriba"
      >
        ↑
      </button>

      {/* Tooltip renderizado condicionalmente */}
      {tooltip.visible && (
        <div 
          className="tooltip show" 
          style={{ left: tooltip.x, top: tooltip.y, textAlign: 'left', zIndex: 9999 }}
        >
          {tooltip.content}
        </div>
      )}
      {/* Barra de Estadísticas Inferior */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-val" style={{ color: 'var(--aprobada)' }}>{stats.aprobadas}</span>
          <span className="stat-label">aprobadas</span>
        </div>
        <div className="stat">
          <span className="stat-val" style={{ color: 'var(--cursada)' }}>{stats.cursadas}</span>
          <span className="stat-label">cursadas</span>
        </div>
        <div className="stat">
          <span className="stat-val" style={{ color: 'var(--muted)' }}>{stats.total}</span>
          <span className="stat-label">total materias</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${stats.porcentaje}%` }}></div>
        </div>
        <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{stats.porcentaje}%</span>
        
        <button 
          className="btn-secondary" 
          style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '6px 12px', marginLeft: 'auto', flex: '0 1 auto' }} 
          onClick={() => {
            if(confirm('¿Estás seguro de que querés borrar todo tu progreso?')) {
              // Por ahora, recargar la página limpia el estado de React en memoria
              window.location.reload(); 
            }
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg> 
          Reiniciar
        </button>
      </div>
    </main>
  );
}