'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePlan } from '../../src/context/PlanContext';
import { SUBJECTS, ELECTIVAS, getSubjectById, ALL } from '../../src/lib/data';
import ConfirmModal from '../../src/components/ConfirmModal';

export default function PlanDeEstudios() {
  const { materias, detalles, cambiarEstadoMateria, actualizarDetalleMateria, reiniciarProgreso, marcarMultiplesAprobadas, stats } = usePlan();
  const levels = [1, 2, 3, 4, 5];

  const [showScroll, setShowScroll] = useState(false);
  
  const [tooltip, setTooltip] = useState({ visible: false, content: null as React.ReactNode, x: 0, y: 0 });
  const [menu, setMenu] = useState({ isOpen: false, x: 0, y: 0, subjectId: null as string | null });
  const [blockedShake, setBlockedShake] = useState<string | null>(null);

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
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.subject-card') || target.closest('.action-menu') || target.closest('.tooltip')) {
        return; 
      }
      setMenu(prev => prev.isOpen ? { ...prev, isOpen: false } : prev);
      setTooltip(prev => prev.visible ? { ...prev, visible: false } : prev);
    };
    
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('touchstart', handleClickOutside, { passive: true });

    const handleScrollAndMove = () => {
      setShowScroll(window.scrollY > 200);

      // Cierra popups al instante sin gastar recursos si ya están cerrados
      setTooltip(prev => prev.visible ? { ...prev, visible: false } : prev);
      setMenu(prev => prev.isOpen ? { ...prev, isOpen: false } : prev);
      setBlockedShake(null);

      // 🔥 MAGIA NEGRA PARA LA BARRA (CERO DELAY):
      // Movemos la barra pixel por pixel calculando cuánto del footer entró en pantalla
      const footer = document.querySelector('footer');
      const statBar = document.getElementById('stat-bar-container');
      
      if (footer && statBar) {
        const rect = footer.getBoundingClientRect();
        // Si el techo del footer (rect.top) sube por encima del piso de la pantalla (innerHeight)
        if (rect.top < window.innerHeight) {
          const overlap = window.innerHeight - rect.top;
          // Empujamos la barra hacia arriba de forma nativa (0 lag)
          statBar.style.transform = `translateY(-${overlap}px)`;
        } else {
          // Si el footer no se ve, la dejamos pegada abajo
          statBar.style.transform = `translateY(0px)`;
        }
      }
    };
    
    window.addEventListener('scroll', handleScrollAndMove, { passive: true });
    window.addEventListener('touchmove', handleScrollAndMove, { passive: true });
    window.addEventListener('wheel', handleScrollAndMove, { passive: true });
    window.addEventListener('resize', handleScrollAndMove);
    
    // Ejecutamos una vez al cargar por si arranca desde el fondo
    handleScrollAndMove();
    
    return () => {
      window.removeEventListener('scroll', handleScrollAndMove);
      window.removeEventListener('touchmove', handleScrollAndMove);
      window.removeEventListener('wheel', handleScrollAndMove);
      window.removeEventListener('resize', handleScrollAndMove);
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const marcarNivel = (lvl: number) => {
    const obligatorias = SUBJECTS.filter((s: any) =>
      s.level === lvl && !s.isElective && !s.isElectivePlaceholder && !s.isSeminario && s.id !== 'PPS'
    );
    const idsParaAprobar = obligatorias
      .filter((m: any) => {
        const estadoActual = materias[m.id] || (m.level === 1 ? 'available' : 'disabled');
        return estadoActual !== 'disabled' && estadoActual !== 'aprobada';
      })
      .map((m: any) => m.id.toString());

    if (idsParaAprobar.length > 0) {
      marcarMultiplesAprobadas(idsParaAprobar);
    }
  };

  const ejecutarCambioEstado = (subjectId: string, accion: string) => {
    const estadoActual = materias[subjectId] || 'available';
    const tieneEventos = detalles[subjectId]?.eventos?.length > 0;

    const isAprobando = accion === 'set_aprobada' || (accion === 'toggle_aprobada' && estadoActual !== 'aprobada');

    if (estadoActual === 'cursando' && isAprobando && tieneEventos) {
      setModalConfig({
        isOpen: true,
        title: 'Materia con eventos activos',
        message: 'Al marcar esta materia como Aprobada, se eliminarán todos los parciales y eventos que tenías agendados para su cursada. ¿Querés continuar?',
        confirmText: 'Sí, aprobar y limpiar',
        isDanger: false,
        onConfirm: () => {
          const infoLimpia = { ...detalles[subjectId] };
          delete infoLimpia.eventos;
          delete infoLimpia.comision;
          actualizarDetalleMateria(subjectId, infoLimpia);
          cambiarEstadoMateria(subjectId, accion);
          closeModal();
        }
      });
    } else {
      cambiarEstadoMateria(subjectId, accion);
    }
  };

  const handleMateriaClick = (e: React.MouseEvent, subject: any, estadoActual: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (estadoActual === 'disabled' || subject.isElectivePlaceholder) {
      if (estadoActual === 'disabled') {
        setBlockedShake(subject.id);
        setTimeout(() => setBlockedShake(prev => prev === subject.id ? null : prev), 400);
      }

      if (window.innerWidth <= 900) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        let posX = rect.left;
        if (posX + 220 > window.innerWidth) posX = window.innerWidth - 230; 
        if (posX < 12) posX = 12;

        let posY = rect.bottom + 8;
        if (posY + 150 > window.innerHeight) posY = rect.top - 160; 

        setTooltip({
          visible: true,
          content: buildTooltipContent(subject),
          x: posX,
          y: posY 
        });
        setMenu(prev => ({ ...prev, isOpen: false }));
      }
      return;
    }

    if (window.innerWidth <= 900) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      let menuX = rect.left;
      if (menuX + 180 > window.innerWidth) menuX = window.innerWidth - 190; 

      setMenu({
        isOpen: true,
        x: menuX,
        y: rect.bottom + window.scrollY + 5, 
        subjectId: subject.id
      });
      setTooltip(prev => ({ ...prev, visible: false }));
    } else {
      ejecutarCambioEstado(subject.id, 'toggle_aprobada');
    }
  };

  const handleContextMenu = (e: React.MouseEvent, subjectId: string, estadoActual: string) => {
    if (window.innerWidth <= 900 || estadoActual === 'disabled') return;
    e.preventDefault();
    ejecutarCambioEstado(subjectId, 'cycle_cursada');
  };

  const handleMenuAction = (e: React.MouseEvent, accionExacta: string) => {
    e.stopPropagation();
    if (menu.subjectId) {
      ejecutarCambioEstado(menu.subjectId, accionExacta);
    }
    setMenu(prev => ({ ...prev, isOpen: false }));
  };

  const handleReiniciarClick = () => {
    setModalConfig({
      isOpen: true,
      title: '¿Reiniciar progreso?',
      message: 'Estás a punto de borrar TODO tu progreso (materias, notas, eventos y configuraciones) de la base de datos de forma permanente. Esta acción no se puede deshacer.',
      confirmText: 'Sí, borrar todo',
      isDanger: true,
      onConfirm: async () => {
        await reiniciarProgreso();
        window.location.reload(); 
      }
    });
  };

  const buildTooltipContent = (subject: any) => {
    if (subject.isElectivePlaceholder) return <>🎯 Requiere: {subject.targetHours} hs anuales<br />Aprobando electivas de {subject.level}° nivel.</>;
    if (subject.isOutdated) return <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 6px', borderRadius: '4px', display: 'inline-block' }}>⚠️ Materia fuera del plan.</span>;

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
      if (!hasTitle) lines.push(<div key="t2" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correlativas</div>);
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
    if (window.innerWidth <= 900) return; 

    let x = e.clientX + 12;
    let y = e.clientY + 12;
    if (x + 220 > window.innerWidth) x = e.clientX - 230;
    if (y + 150 > window.innerHeight) y = e.clientY - 160;
    if (x < 12) x = 12;
    if (y < 12) y = 12;
    setTooltip({ visible: true, content: buildTooltipContent(subject), x, y });
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 900) setTooltip(prev => ({ ...prev, visible: false }));
  };

  const renderCard = (subject: any) => {
    let estadoActual = materias[subject.id];

    if (!estadoActual) {
      estadoActual = (subject.level === 1 || subject.isElective || subject.isElectivePlaceholder) ? 'available' : 'disabled';
    }

    let displayHours = `${subject.hours} hs`;

    if (subject.isElectivePlaceholder) {
      let globalCursadaHoursAnalista = 0;
      let globalAprobadaHoursAnalista = 0;
      let globalCursadaHoursIngenieria = 0;
      let globalAprobadaHoursIngenieria = 0;

      [3, 4, 5].forEach(lvl => {
        const electivasNivel = ELECTIVAS[lvl as keyof typeof ELECTIVAS] || [];
        electivasNivel.forEach((el: any) => {
          if (materias[el.id] === 'aprobada') {
            globalAprobadaHoursIngenieria += el.annualHours || 0;
            if (!el.onlyIngenieria) globalAprobadaHoursAnalista += el.annualHours || 0;
          } else if (materias[el.id] === 'cursada') {
            globalCursadaHoursIngenieria += el.annualHours || 0;
            if (!el.onlyIngenieria) globalCursadaHoursAnalista += el.annualHours || 0;
          }
        });
      });

      const thresholds: any = { 3: 4, 4: 10, 5: 20 };
      const target = thresholds[subject.level] || subject.targetHours || 0;
      const aprobadaHours = subject.level === 3 ? globalAprobadaHoursAnalista : globalAprobadaHoursIngenieria;
      const cursadaHours = subject.level === 3 ? globalCursadaHoursAnalista : globalCursadaHoursIngenieria;
      const totalActive = aprobadaHours + cursadaHours;

      if (aprobadaHours >= target) {
        displayHours = `Aprobado: ${aprobadaHours}/${target} hs`;
      } else if (totalActive >= target) {
        displayHours = `Cursado: ${totalActive}/${target} hs`;
      } else {
        displayHours = `Progreso: ${totalActive}/${target} hs`;
      }
    }

    const isShaking = blockedShake === subject.id;

    return (
      <div
        key={subject.id}
        className={`subject-card ${estadoActual} ${isShaking ? 'highlight-blocked' : ''}`}
        onClick={(e) => handleMateriaClick(e, subject, estadoActual)} 
        onContextMenu={(e) => handleContextMenu(e, subject.id, estadoActual)}
        onMouseMove={(e) => handleMouseMove(e, subject)}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: estadoActual === 'disabled' ? 'not-allowed' : 'pointer' }}
      >
        <div className="subject-num">{subject.num}</div>
        <div className="subject-name">{subject.name}</div>
        <div className="subject-hours">{displayHours}</div>
        <div className="subject-status-icon">
          {estadoActual === 'aprobada' ? '✅' : 
           estadoActual === 'cursada' ? '📖' : 
           estadoActual === 'cursando' ? '✍️' :
           estadoActual === 'available' ? '' : '🔒'}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        .subject-card:hover,
        .subject-card.aprobada:hover,
        .subject-card.cursada:hover,
        .subject-card.available:hover {
          transform: none !important;
        }

        .subject-card.highlight-blocked {
          border-color: #ef4444 !important;
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.6) !important;
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
          z-index: 50;
        }

        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        
        .action-menu {
          background: var(--panel); border: 1px solid var(--border); border-radius: 8px;
          padding: 6px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6); min-width: 140px;
          animation: fadeIn 0.2s ease-out; flex-direction: column; gap: 4px;
        }
        .action-btn {
          background: transparent; color: var(--text); border: none; padding: 10px 12px;
          text-align: left; border-radius: 4px; font-family: 'Syne', sans-serif;
          font-size: 0.85rem; cursor: pointer; display: flex; align-items: center;
          gap: 8px; transition: background 0.2s; width: 100%;
        }
        .action-btn:hover { background: var(--border); }
      `}</style>

      {/* Le devuelvo un paddingBottom de 80px para asegurarme de que la barra fija no tape la última materia */}
      <main id="main-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '80px' }}>
        
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

        {menu.isOpen && (
          <div id="action-menu" className="action-menu" style={{ position: 'absolute', top: menu.y, left: menu.x, zIndex: 1000, display: 'flex' }}>
            <button className="action-btn" onClick={(e) => handleMenuAction(e, 'set_aprobada')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Aprobada
            </button>
            <button className="action-btn" onClick={(e) => handleMenuAction(e, 'set_cursada')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg> Cursada
            </button>
            <button className="action-btn" onClick={(e) => handleMenuAction(e, 'set_cursando')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Cursando
            </button>
            <button className="action-btn" onClick={(e) => handleMenuAction(e, 'set_available')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> Desmarcar
            </button>
          </div>
        )}

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

        {/* 🔥 VOLVIÓ A POSITION: FIXED pero la animamos por JS */}
        <div id="stat-bar-container" className="stats-bar" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, width: '100%', zIndex: 900, background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
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
          <div className="progress-bar desktop-only">
            <div className="progress-fill" style={{ width: `${stats.porcentaje}%` }}></div>
          </div>
          <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{stats.porcentaje}%</span>
          
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
    </>
  );
}