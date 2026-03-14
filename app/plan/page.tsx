'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// Ajustá estas rutas dependiendo de cómo tengas tus carpetas
import { usePlan } from '../../src/context/PlanContext';
import { SUBJECTS, ELECTIVAS, getSubjectById, ALL } from '../../src/lib/data';
import ConfirmModal from '../../src/components/ConfirmModal';

export default function PlanDeEstudios() {
  const { materias, detalles, cambiarEstadoMateria, actualizarDetalleMateria, reiniciarProgreso, marcarMultiplesAprobadas, stats } = usePlan();
  const levels = [1, 2, 3, 4, 5];

  const [showScroll, setShowScroll] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, content: null as React.ReactNode, x: 0, y: 0 });

  // --- ESTADO PARA NUESTRO MODAL UNIVERSAL ---
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '' as React.ReactNode,
    confirmText: 'Confirmar',
    isDanger: false,
    onConfirm: () => {}
  });

  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

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
    
    // Filtramos solo los IDs de las materias que están listas para ser aprobadas
    const idsParaAprobar = obligatorias
      .filter((m: any) => {
        const estadoActual = materias[m.id] || (m.level === 1 ? 'available' : 'disabled');
        return estadoActual !== 'disabled' && estadoActual !== 'aprobada';
      })
      .map((m: any) => m.id.toString()); // Extraemos solo el ID

    // Si hay materias para aprobar, llamamos a la función masiva
    if (idsParaAprobar.length > 0) {
      marcarMultiplesAprobadas(idsParaAprobar);
    }
  };

  // --- LÓGICA DE INTERCEPCIÓN AL HACER CLIC EN UNA MATERIA ---
  const handleMateriaClick = (subjectId: string, estadoActual: string) => {
    if (estadoActual === 'disabled') return;

    // Chequeamos si la materia tiene eventos guardados
    const tieneEventos = detalles[subjectId]?.eventos?.length > 0;

    if (estadoActual === 'cursando' && tieneEventos) {
      setModalConfig({
        isOpen: true,
        title: 'Materia con eventos activos',
        message: 'Al marcar esta materia como Aprobada, se eliminarán todos los parciales y eventos que tenías agendados para su cursada. ¿Querés continuar?',
        confirmText: 'Sí, aprobar y limpiar',
        isDanger: false,
        onConfirm: () => {
          // Limpiamos los eventos y la comisión antes de aprobar
          const infoLimpia = { ...detalles[subjectId] };
          delete infoLimpia.eventos;
          delete infoLimpia.comision;
          actualizarDetalleMateria(subjectId, infoLimpia);

          cambiarEstadoMateria(subjectId, 'aprobada');
          closeModal();
        }
      });
    } else {
      cambiarEstadoMateria(subjectId, 'aprobada');
    }
  };

  // --- LÓGICA DE INTERCEPCIÓN PARA EL BOTÓN REINICIAR ---
  const handleReiniciarClick = () => {
    setModalConfig({
      isOpen: true,
      title: '¿Reiniciar progreso?',
      message: 'Estás a punto de borrar TODO tu progreso (materias, notas, eventos y configuraciones) de la base de datos de forma permanente. Esta acción no se puede deshacer.',
      confirmText: 'Sí, borrar todo',
      isDanger: true, // Botón rojo
      onConfirm: async () => {
        await reiniciarProgreso();
        window.location.reload(); 
      }
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

  const renderCard = (subject: any) => {
    const estadoActual = materias[subject.id] || (subject.level === 1 ? 'available' : 'disabled');

    return (
      <div
        key={subject.id}
        className={`subject-card ${estadoActual}`}
        // Usamos nuestro interceptor acá
        onClick={() => handleMateriaClick(subject.id, estadoActual)}
        onContextMenu={(e) => { 
          e.preventDefault(); 
          if (estadoActual !== 'disabled') {
            cambiarEstadoMateria(subject.id, 'cursada'); 
          }
        }}
        onMouseMove={(e) => handleMouseMove(e, subject)}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: estadoActual === 'disabled' ? 'not-allowed' : 'pointer' }}
      >
        <div className="subject-num">{subject.num}</div>
        <div className="subject-name">{subject.name}</div>
        <div className="subject-hours">{subject.hours}</div>
        <div className="subject-status-icon">
          {estadoActual === 'aprobada' ? '✅' : 
           estadoActual === 'cursada' ? '📖' : 
           estadoActual === 'cursando' ? '✍️' :
           estadoActual === 'available' ? '' : '🔒'}
        </div>
      </div>
    );
  };

  const cursandoCount = ALL.filter((s: any) => materias[s.id] === 'cursando').length;
  
  const electivasAprobadas = ALL.filter((s: any) => 
    materias[s.id] === 'aprobada' && 
    s.level && 
    ELECTIVAS[s.level as keyof typeof ELECTIVAS]?.some((e:any) => e.id === s.id)
  ).length;
  
  const totalMaterias = 36 + electivasAprobadas;

  return (
    <main id="main-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      <div style={{ flex: 1, paddingBottom: '40px' }}>
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
      </div>

      <button 
        id="btn-scroll-top" 
        className={`scroll-top-btn ${showScroll ? 'visible' : ''}`} 
        onClick={scrollToTop} 
        title="Volver arriba"
      >
        ↑
      </button>

      {tooltip.visible && (
        <div 
          className="tooltip show" 
          style={{ left: tooltip.x, top: tooltip.y, textAlign: 'left', zIndex: 9999 }}
        >
          {tooltip.content}
        </div>
      )}

      {/* --- BARRA DE ESTADÍSTICAS INFERIOR --- */}
      <div className="stats-bar" style={{ position: 'sticky', bottom: 0, zIndex: 900, background: 'var(--bg)' }}>
        <div className="stat">
          <span className="stat-val" style={{ color: 'var(--aprobada)' }}>{stats.aprobadas}</span>
          <span className="stat-label">aprobadas</span>
        </div>
        <div className="stat">
          <span className="stat-val" style={{ color: 'var(--cursada)' }}>{stats.cursadas}</span>
          <span className="stat-label">cursadas</span>
        </div>
        <div className="stat">
          <span className="stat-val" style={{ color: 'var(--cursando)' }}>{stats.cursando}</span>
          <span className="stat-label">cursando</span>
        </div>
        <div className="stat">
          <span className="stat-val" style={{ color: 'var(--muted)' }}>{36 + (ALL.filter((s: any) => materias[s.id] === 'aprobada' && s.level && ELECTIVAS[s.level as keyof typeof ELECTIVAS]?.some((e:any) => e.id === s.id)).length)}</span>
          <span className="stat-label">total materias</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${stats.porcentaje}%` }}></div>
        </div>
        <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{stats.porcentaje}%</span>
        
        {/* Botón de reiniciar conectado a nuestro ConfirmModal */}
        <button 
          className="btn-secondary" 
          style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '6px 12px', marginLeft: 'auto', flex: '0 1 auto' }} 
          onClick={handleReiniciarClick}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg> 
          Reiniciar
        </button>
      </div>

      {/* --- EL MODAL INYECTADO AL FINAL --- */}
      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        isDanger={modalConfig.isDanger}
        onConfirm={modalConfig.onConfirm}
        onCancel={closeModal}
      />

    </main>
  );
}