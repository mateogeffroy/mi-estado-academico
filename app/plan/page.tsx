'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePlan } from '../../src/context/PlanContext';
import ConfirmModal from '../../src/components/ConfirmModal';
import SimuladorModal from '../../src/components/SimuladorModal';
import AdBanner from '../../src/components/AdBanner'; 

const NOMBRES_CARRERAS: Record<string, string> = {
  'utn-sistemas-2023': 'Ingeniería en Sistemas',
  'utn-civil-2023': 'Ingeniería Civil',
  'utn-industrial-2008': 'Ingeniería Industrial',
  'utn-mecanica-2023': 'Ingeniería Mecánica',
  'utn-quimica-2008': 'Ingeniería Química',
  'utn-electrica-2023': 'Ingeniería Eléctrica',
  'unlp-apu-2021': 'APU (UNLP)',
  'unlp-sistemas-2021': 'Lic. en Sistemas (UNLP)',
  'unlp-informatica-2021': 'Lic. en Informática (UNLP)',
  'unlp-psicologia-2012': 'Psicología (UNLP)',
  'unlp-computacion-2024': 'Ing. en Computación (UNLP)',
  'unlp-sonido-2023': 'Tec. en Sonido (UNLP)',
};

export default function PlanDeEstudios() {
  // 🔥 Incorporamos las funciones multi-carrera
  const { materias, detalles, cambiarEstadoMateria, actualizarDetalleMateria, reiniciarProgreso, marcarMultiplesAprobadas, stats, careerData, todasLasCarreras, careerId, setCarreraActiva } = usePlan();
  const { SUBJECTS, ELECTIVAS, getSubjectById, ALL } = careerData;
  const maxLevel = Math.max(...SUBJECTS.map((s: any) => s.level || 1));
  const levels = Array.from({ length: maxLevel }, (_, i) => i + 1);

  const [showScroll, setShowScroll] = useState(false);
  
  const [tooltip, setTooltip] = useState({ visible: false, content: null as React.ReactNode, x: 0, y: 0 });
  const [menu, setMenu] = useState({ isOpen: false, x: 0, y: 0, subjectId: null as string | null });
  const [blockedShake, setBlockedShake] = useState<string | null>(null);

  const [isSimuladorOpen, setIsSimuladorOpen] = useState(false);

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

    const handleScrollAndMove = () => {
      setShowScroll(window.scrollY > 200);
      setTooltip(prev => prev.visible ? { ...prev, visible: false } : prev);
      setMenu(prev => prev.isOpen ? { ...prev, isOpen: false } : prev);

      const footer = document.querySelector('footer');
      const statBar = document.getElementById('stat-bar-container');
      
      if (footer && statBar) {
        const rect = footer.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          const overlap = window.innerHeight - rect.top;
          statBar.style.transform = `translateY(-${overlap}px)`;
        } else {
          statBar.style.transform = `translateY(0px)`;
        }
      }
    };

    window.addEventListener('click', handleClickOutside);
    window.addEventListener('touchstart', handleClickOutside, { passive: true });
    
    window.addEventListener('scroll', handleScrollAndMove, { passive: true });
    window.addEventListener('touchmove', handleScrollAndMove, { passive: true });
    window.addEventListener('wheel', handleScrollAndMove, { passive: true });
    window.addEventListener('resize', handleScrollAndMove);
    
    handleScrollAndMove();
    
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('scroll', handleScrollAndMove);
      window.removeEventListener('touchmove', handleScrollAndMove);
      window.removeEventListener('wheel', handleScrollAndMove);
      window.removeEventListener('resize', handleScrollAndMove);
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
    if (subject.isElectivePlaceholder) return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
        <div>Requiere: {subject.targetHours} hs anuales<br />Aprobando electivas de {subject.level}° nivel.</div>
      </div>
    );
    if (subject.isOutdated) return (
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 8px', borderRadius: '6px', width: 'fit-content' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
        Materia fuera del plan.
      </div>
    );

    let hasTitle = false;
    const lines: React.ReactNode[] = [];

    const getCheckIcon = (ok: boolean) => ok 
      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

    // 🔥 FIX: Convertimos los IDs a String para que el filtro sea perfecto
    const aprobadasRequeridasStr = (subject.correlAprobada || []).map(String);
    const cursadasFiltradas = (subject.correlCursada || []).filter(
      (cid: any) => !aprobadasRequeridasStr.includes(String(cid))
    );

    if (cursadasFiltradas.length > 0) {
      hasTitle = true;
      lines.push(<div key="t1" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Correlativas</div>);
      lines.push(<b key="s1" style={{ display: 'block', marginBottom: '2px', opacity: 0.9 }}>Cursada(s):</b>);
      cursadasFiltradas.forEach((cid: any) => {
        const s = getSubjectById(cid);
        const cleanName = s ? s.name.replace(/\s*\(.*?\)/g, '') : cid;
        const ok = materias[cid] === 'cursada' || materias[cid] === 'aprobada';
        lines.push(<div key={`c-${cid}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>{getCheckIcon(ok)} <span style={{ opacity: ok ? 1 : 0.7 }}>{cleanName}</span></div>);
      });
    }

    if (aprobadasRequeridasStr.length > 0) {
      if (!hasTitle) lines.push(<div key="t2" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Correlativas</div>);
      lines.push(<b key="s2" style={{ display: 'block', marginTop: '6px', marginBottom: '2px', opacity: 0.9 }}>Aprobada(s):</b>);
      subject.correlAprobada.forEach((cid: any) => {
        const s = getSubjectById(cid);
        const cleanName = s ? s.name.replace(/\s*\(.*?\)/g, '') : cid;
        const ok = materias[cid] === 'aprobada';
        lines.push(<div key={`a-${cid}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>{getCheckIcon(ok)} <span style={{ opacity: ok ? 1 : 0.7 }}>{cleanName}</span></div>);
      });
    }

    if (lines.length === 0) return <div style={{ fontStyle: 'italic', opacity: 0.8 }}>Sin correlatividades</div>;
    return <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>{lines}</div>;
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

    let displayHours = subject.hours;
    
    const isUnlp = careerData.careerInfo.id.includes('unlp');
    if (isUnlp && ['1S', '2S', 'Ingreso'].includes(displayHours)) {
      displayHours = '';
    }

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

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'aprobada':
          return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
        case 'cursada':
          return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
        case 'cursando':
          return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
        case 'disabled':
          return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
        default:
          return null;
      }
    };

    let durationBadges = null;

    if (!subject.isElectivePlaceholder) {
      const isCardColored = estadoActual === 'aprobada' || estadoActual === 'cursada' || estadoActual === 'cursando';
      
      const duracionesSet = new Set<string>();
      if (estadoActual !== 'disabled') {
        if (subject.duration === 'C') {
          duracionesSet.add('1');
          duracionesSet.add('2');
        } else if (subject.duration) {
          duracionesSet.add(subject.duration);
        }

        (subject.comisiones || []).forEach((c: any) => {
          if (c.duration === 'C') {
            duracionesSet.add('1');
            duracionesSet.add('2');
          } else if (c.duration) {
            duracionesSet.add(c.duration);
          }
        });
      }

      const duracionesUnicas = Array.from(duracionesSet);

      if (duracionesUnicas.length === 0 && !subject.isOutdated && estadoActual !== 'disabled') {
        duracionesUnicas.push('A');
      }

      const hasTrackBadges = subject.isApu || subject.isProfesorado;

      if (duracionesUnicas.length > 0 || hasTrackBadges) {
        durationBadges = (
          <div style={{ marginTop: '6px', marginBottom: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {duracionesUnicas.sort().map(dur => {
              let label = 'Anual';
              let pillBg = 'rgba(59, 130, 246, 0.85)'; 
              let pillColor = '#ffffff'; 
              
              const usaCuatrimestres = careerData.careerInfo.id.includes('psicologia') || careerData.careerInfo.id.includes('sonido');

              if (dur === '1') {
                label = (isUnlp && !usaCuatrimestres) ? '1S' : '1C';
                pillBg = 'rgba(34, 197, 94, 0.85)'; 
              } else if (dur === '2') {
                label = (isUnlp && !usaCuatrimestres) ? '2S' : '2C';
                pillBg = 'rgba(244, 63, 94, 0.85)'; 
              } else if (dur === 'Ingreso') {
                label = 'Ingreso';
                pillBg = 'rgba(168, 85, 247, 0.85)'; 
              }

              const finalBg = isCardColored ? 'rgba(0, 0, 0, 0.6)' : pillBg;
              const finalColor = isCardColored ? 'rgba(255, 255, 255, 0.95)' : pillColor;

              return (
                <span key={dur} style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: finalBg, color: finalColor, padding: '4px 12px',
                  borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', 
                  letterSpacing: '0.3px', pointerEvents: 'none',
                  border: isCardColored ? '1px solid rgba(255,255,255,0.1)' : 'none', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)', 
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontVariantNumeric: 'tabular-nums lining-nums',
                }}>
                  {label}
                </span>
              );
            })}

            {subject.isApu && (
              <span key="apu" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                background: isCardColored ? 'rgba(0, 0, 0, 0.6)' : 'rgba(6, 182, 212, 0.85)', 
                color: isCardColored ? 'rgba(255, 255, 255, 0.95)' : '#ffffff', 
                padding: '4px 12px',
                borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', 
                letterSpacing: '0.3px', pointerEvents: 'none',
                border: isCardColored ? '1px solid rgba(255,255,255,0.1)' : 'none', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)', 
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}>
                APU
              </span>
            )}

            {subject.isProfesorado && (
              <span key="prof" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                background: isCardColored ? 'rgba(0, 0, 0, 0.6)' : 'rgba(245, 158, 11, 0.85)', 
                color: isCardColored ? 'rgba(255, 255, 255, 0.95)' : '#ffffff', 
                padding: '4px 12px',
                borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', 
                letterSpacing: '0.3px', pointerEvents: 'none',
                border: isCardColored ? '1px solid rgba(255,255,255,0.1)' : 'none', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)', 
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}>
                Profesorado
              </span>
            )}
          </div>
        );
      }
    }

    return (
      <div
        key={subject.id}
        className={`subject-card ${estadoActual} ${isShaking ? 'highlight-blocked' : ''}`}
        onClick={(e) => handleMateriaClick(e, subject, estadoActual)} 
        onContextMenu={(e) => handleContextMenu(e, subject.id, estadoActual)}
        onMouseMove={(e) => handleMouseMove(e, subject)}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: estadoActual === 'disabled' ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column' }}
      >
        <div className="subject-num">{subject.num}</div>
        <div className="subject-name">{subject.name}</div>
        {durationBadges}
        {displayHours && <div className="subject-hours" style={{ marginTop: durationBadges ? '0' : '10px' }}>{displayHours}</div>}
        <div className="subject-status-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {getStatusIcon(estadoActual)}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        .subject-card:hover, .subject-card.aprobada:hover, .subject-card.cursada:hover, .subject-card.available:hover { transform: none !important; }
        .subject-card.highlight-blocked { border-color: #ef4444 !important; box-shadow: 0 0 15px rgba(239, 68, 68, 0.6) !important; animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; z-index: 50; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .action-menu { background: var(--panel); border: 1px solid var(--border); border-radius: 8px; padding: 6px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); min-width: 140px; animation: fadeIn 0.2s ease-out; flex-direction: column; gap: 4px; }
        .action-btn { background: transparent; color: var(--text-strong); border: none; padding: 10px 12px; text-align: left; border-radius: 4px; font-family: 'Syne', sans-serif; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.2s; width: 100%; }
        .action-btn:hover { background: var(--glass-hover); }
        .subject-status-icon { position: absolute; bottom: 10px; right: 10px; opacity: 0.8; }
        
        .mobile-ad-container { width: 100%; max-width: 800px; margin: 0 auto; padding: 0 16px; }
        @media (min-width: 1450px) { .mobile-ad-container { display: none; } }

        .scatter-ad-left, .scatter-ad-right {
          position: absolute;
          width: 160px;
          height: 600px;
          display: none;
          z-index: 10;
        }
        @media (min-width: 1450px) {
          .scatter-ad-left, .scatter-ad-right { display: block; }
        }
        .scatter-ad-left { right: 100%; margin-right: 40px; }
        .scatter-ad-right { left: 100%; margin-left: 40px; }

        /* 🔥 Estilos para el selector de carrera 🔥 */
        .career-selector { background: var(--panel); border: 1px solid var(--border); color: var(--text-strong); padding: 8px 12px; border-radius: 8px; font-size: 0.85rem; font-weight: bold; outline: none; cursor: pointer; transition: all 0.2s; max-width: 250px; text-overflow: ellipsis; white-space: nowrap; }
        .career-selector:hover { border-color: var(--cursando); }

        .plan-stats-bar-override {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }
        .stats-row-1 {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-shrink: 0;
        }
        .stats-row-2 {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1; 
        }
        .stats-progress-wrapper {
          flex: 1; 
          display: flex;
          align-items: center;
          width: 100%;
        }
        
        @media (max-width: 900px) {
          .career-selector { display: none; } /* En móviles ocultamos el select largo de la navbar del plan para que no estalle */
          
          .plan-stats-bar-override {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
            padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px)) !important;
            height: auto !important;
            overflow: visible !important;
          }
          .stats-row-1 {
            width: 100%;
            justify-content: space-between !important;
            gap: 5px !important;
          }
          .stats-row-2 {
            width: 100%;
            justify-content: space-between !important;
            gap: 12px !important;
          }
          .plan-stats-bar-override .stat:nth-child(4) {
            display: flex !important;
          }
          .stats-row-1 .stat-val { font-size: 0.95rem !important; }
          .stats-row-1 .stat-label { font-size: 0.6rem !important; letter-spacing: -0.5px; }
        }
      `}</style>

      <main id="main-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '130px', gap: '40px' }}>
        
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
            
            <div className="header-titles">
              <h1 className="logo">Plan de <span>estudios</span></h1>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              
            {todasLasCarreras?.length > 1 ? (
              <select 
                value={careerId}
                onChange={(e) => setCarreraActiva(e.target.value)}
                className="career-selector"
                title="Cambiar carrera actual"
              >
                {todasLasCarreras.map(id => (
                  <option key={id} value={id}>{NOMBRES_CARRERAS[id] || id}</option>
                ))}
              </select>
            ) : todasLasCarreras?.length === 1 ? (
              <div 
                className="career-selector" 
                style={{ pointerEvents: 'none', border: '1px solid transparent', background: 'var(--glass-bg)', display: 'inline-block' }}
              >
                {NOMBRES_CARRERAS[careerId] || careerId}
              </div>
            ) : null}

              <button 
                onClick={() => setIsSimuladorOpen(true)}
                style={{ 
                  background: 'rgba(59, 130, 246, 0.1)', 
                  border: '1px solid rgba(59, 130, 246, 0.3)', 
                  color: 'var(--cursando)', 
                  padding: '8px 12px', 
                  borderRadius: '8px', 
                  fontSize: '0.85rem', 
                  fontWeight: 'bold', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'var(--cursando)'; e.currentTarget.style.color = '#fff'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'; e.currentTarget.style.color = 'var(--cursando)'; }}
                title="Proyectá qué materias destrabás"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m12 16 4-4-4-4"/><path d="M8 12h8"/></svg>
                ¿Qué destrabo?
              </button>

              <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
                <button className="btn-secondary" style={{ whiteSpace: 'nowrap', padding: '8px 12px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 19-7-7 7-7"/>
                    <path d="M19 12H5"/>
                  </svg>
                  <span className="desktop-only" style={{ display: 'inline' }}>Volver al inicio</span>
                  <span className="mobile-only" style={{ display: 'inline' }}>Volver</span>
                </button>
              </Link>
            </div>
            
          </div>
        </div>

        {/* ... EL RESTO DEL CÓDIGO QUEDA IGUAL ... */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {levels.map((lvl, index) => {
              const materiasObligatorias = SUBJECTS.filter((s: any) => s.level === lvl && !s.isElective && !s.isElectivePlaceholder);
              const electivas = ELECTIVAS[lvl as keyof typeof ELECTIVAS] || [];
              const placeholders = SUBJECTS.filter((s: any) => s.level === lvl && s.isElectivePlaceholder);

              return (
                <div key={lvl} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="level-section" style={{ marginBottom: 0 }}>
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
                </div>
              );
            })}
          </div>
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> Desmarcar
            </button>
          </div>
        )}

        <button 
          id="btn-scroll-top" 
          className={`scroll-top-btn ${showScroll ? 'visible' : ''}`} 
          onClick={scrollToTop} 
          title="Volver arriba"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
        </button>

        {tooltip.visible && (
          <div className="tooltip show" style={{ left: tooltip.x, top: tooltip.y, textAlign: 'left', zIndex: 9999 }}>{tooltip.content}</div>
        )}

        <div id="stat-bar-container" className="stats-bar plan-stats-bar-override" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, width: '100%', zIndex: 900, background: 'var(--bg)', borderTop: '1px solid var(--border)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          
          <div className="stats-row-1">
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
              <span className="stat-val" style={{ color: 'var(--muted)' }}>
                {careerData?.careerInfo?.creditosTotales || SUBJECTS.length}
              </span>
              <span className="stat-label">total materias</span>
            </div>
          </div>

          <div className="stats-row-2">
            <span style={{ color: 'var(--text-strong)', fontSize: '0.85rem', fontWeight: 'bold', flexShrink: 0 }}>{stats.porcentaje}%</span>
            
            <div className="stats-progress-wrapper">
              <div className="progress-bar" style={{ width: '100%', height: '6px' }}>
                <div className="progress-fill" style={{ width: `${stats.porcentaje}%` }}></div>
              </div>
            </div>

            <button 
              className="btn-secondary" 
              style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '6px 12px', flexShrink: 0 }} 
              onClick={handleReiniciarClick}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
              </svg> 
              Reiniciar
            </button>
          </div>

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

        <SimuladorModal 
          isOpen={isSimuladorOpen}
          onClose={() => setIsSimuladorOpen(false)}
          materias={materias}
          ALL={ALL}
        />

      </main>
    </>
  );
}