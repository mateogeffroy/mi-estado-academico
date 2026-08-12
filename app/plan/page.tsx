'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePlan } from '../../src/context/PlanContext';
import { AccionMateria } from '../../src/application/useCases/actualizarProgreso';
import { Materia } from '../../src/domain/entities/Materia';
import { EstadoMateria } from '../../src/domain/entities/Progreso';
import ConfirmModal from '../../src/components/ConfirmModal';
import SimuladorModal from '../../src/components/SimuladorModal';
import MateriaDetailModal from '../../src/components/MateriaDetailModal';
import GradeModal from '../../src/components/GradeModal';
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
  const { materias, detalles, cambiarEstadoMateria, actualizarDetalleMateria, reiniciarProgreso, marcarMultiplesAprobadas, stats, careerData, todasLasCarreras, careerId, setCarreraActiva } = usePlan();
  const { SUBJECTS, ELECTIVAS, ALL } = careerData;
  const maxLevel = Math.max(...SUBJECTS.map((s: any) => s.level || 1));
  const levels = Array.from({ length: maxLevel }, (_, i) => i + 1);

  const [showScroll, setShowScroll] = useState(false);

  // Un solo punto de entrada para ver/editar una materia: reemplaza el
  // combo previo de click=aprobar, click derecho/long-press=menú flotante y
  // tooltip por hover, que en mobile no tenía ninguna pista visual de que
  // existiera. Ahora cualquier click (incluso en bloqueadas o electivas)
  // abre este modal con correlativas, acciones y qué destraba.
  const [selectedSubject, setSelectedSubject] = useState<Materia | null>(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [blockedShake, setBlockedShake] = useState<string | null>(null);

  const [isSimuladorOpen, setIsSimuladorOpen] = useState(false);

  // Progressive disclosure: por defecto los niveles completos arrancan
  // cerrados, los que tienen algo en curso/disponible arrancan abiertos y
  // los que todavía no se pueden cursar quedan cerrados. nivelesForzados
  // guarda solo lo que el usuario tocó a mano, para no pisar ese default
  // hasta que interactúe.
  const [nivelesForzados, setNivelesForzados] = useState<Record<number, boolean>>({});

  // Electivas: colapsadas por default, se abren al tocar la card "Electivas
  // N° Nivel" de ese año (antes se listaban siempre, ocupando lugar aunque
  // no se hubiera elegido ninguna).
  const [electivasAbiertas, setElectivasAbiertas] = useState<Record<number, boolean>>({});
  const toggleElectivas = (lvl: number) => setElectivasAbiertas((prev) => ({ ...prev, [lvl]: !prev[lvl] }));

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
    const handleScrollAndMove = () => {
      setShowScroll(window.scrollY > 200);

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

    window.addEventListener('scroll', handleScrollAndMove, { passive: true });
    window.addEventListener('touchmove', handleScrollAndMove, { passive: true });
    window.addEventListener('wheel', handleScrollAndMove, { passive: true });
    window.addEventListener('resize', handleScrollAndMove);

    handleScrollAndMove();

    return () => {
      window.removeEventListener('scroll', handleScrollAndMove);
      window.removeEventListener('touchmove', handleScrollAndMove);
      window.removeEventListener('wheel', handleScrollAndMove);
      window.removeEventListener('resize', handleScrollAndMove);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const obtenerEstado = (subject: any): EstadoMateria => {
    let estado = materias[subject.id];
    if (!estado) estado = (subject.level === 1 || subject.isElective || subject.isElectivePlaceholder) ? 'available' : 'disabled';
    return estado;
  };

  const cardsDeNivel = (lvl: number) => SUBJECTS.filter((s: any) => s.level === lvl);

  type EstadoNivel = 'complete' | 'active' | 'locked';
  const nivelStatus = (lvl: number): EstadoNivel => {
    const cards = cardsDeNivel(lvl);
    if (cards.length === 0) return 'active';
    const estados = cards.map(obtenerEstado);
    if (estados.every((e) => e === 'aprobada')) return 'complete';
    if (estados.every((e) => e === 'disabled')) return 'locked';
    return 'active';
  };

  const estaAbierto = (lvl: number) => nivelesForzados[lvl] ?? nivelStatus(lvl) === 'active';
  const toggleNivel = (lvl: number) => setNivelesForzados((prev) => ({ ...prev, [lvl]: !estaAbierto(lvl) }));

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

  const ejecutarCambioEstado = (subjectId: string, accion: AccionMateria) => {
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
          const infoLimpia = { ...detalles[subjectId], eventos: [], comision: null };
          actualizarDetalleMateria(subjectId, infoLimpia);
          cambiarEstadoMateria(subjectId, accion);
          closeModal();
        }
      });
    } else {
      cambiarEstadoMateria(subjectId, accion);
    }
  };

  const handleMateriaClick = (subject: Materia, estadoActual: string) => {
    if (estadoActual === 'disabled') {
      setBlockedShake(subject.id);
      setTimeout(() => setBlockedShake(prev => (prev === subject.id ? null : prev)), 400);
    }
    setSelectedSubject(subject);
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

  const renderCard = (subject: any) => {
    const estadoActual = obtenerEstado(subject);

    let displayHours = subject.hours;
    
    const isUnlp = careerData.careerInfo.id.includes('unlp');
    if (isUnlp && ['1S', '2S', 'Ingreso'].includes(displayHours)) {
      displayHours = '';
    }

    if (subject.isElectivePlaceholder) {
      const electivasNivel = ELECTIVAS?.[subject.level as keyof typeof ELECTIVAS] || [];
      let aprobadaHours = 0; let cursadaHours = 0;
      electivasNivel.forEach((el: any) => {
        if (materias[el.id] === 'aprobada') aprobadaHours += el.annualHours || 0;
        else if (['cursada', 'cursando'].includes(materias[el.id])) cursadaHours += el.annualHours || 0;
      });

      const target = subject.targetHours || 0;
      const totalActive = aprobadaHours + cursadaHours;

      if (aprobadaHours >= target) {
        displayHours = `Aprobado: ${aprobadaHours}/${target} hs`;
      } else if (totalActive > 0) {
        displayHours = `Cursando: ${totalActive}/${target} hs`;
      } else {
        displayHours = `Progreso: ${totalActive}/${target} hs`;
      }
    }

    const isShaking = blockedShake === subject.id;
    const isPlaceholderOpen = subject.isElectivePlaceholder && !!electivasAbiertas[subject.level];

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
        className={`subject-card ${estadoActual} ${isShaking ? 'highlight-blocked' : ''} ${subject.isElectivePlaceholder ? 'electiva-toggle-card' : ''} ${isPlaceholderOpen ? 'open' : ''}`}
        onClick={() => subject.isElectivePlaceholder ? toggleElectivas(subject.level) : handleMateriaClick(subject, estadoActual)}
        role={subject.isElectivePlaceholder ? 'button' : undefined}
        tabIndex={subject.isElectivePlaceholder ? 0 : undefined}
        aria-expanded={subject.isElectivePlaceholder ? isPlaceholderOpen : undefined}
        onKeyDown={subject.isElectivePlaceholder ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleElectivas(subject.level); } } : undefined}
        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
      >
        <div className="subject-num">{subject.num}</div>
        <div className="subject-name">{subject.name}</div>
        {durationBadges}
        {displayHours && <div className="subject-hours" style={{ marginTop: durationBadges ? '0' : '10px' }}>{displayHours}</div>}
        <div className="subject-status-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {subject.isElectivePlaceholder
            ? <svg className="electiva-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            : getStatusIcon(estadoActual)}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        /* Acordeón de niveles (progressive disclosure) */
        .nivel-acordeon { border: 1px solid var(--border); border-radius: 12px; background: var(--panel); }
        .nivel-header { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; user-select: none; min-height: 44px; }
        .nivel-header:focus-visible { outline: 2px solid var(--cursando); outline-offset: -2px; border-radius: 10px; }
        .nivel-chip { font-family: 'Space Mono', monospace; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; display: flex; align-items: center; gap: 5px; white-space: nowrap; flex-shrink: 0; }
        .nivel-chip.complete { background: rgba(34, 197, 94, 0.12); color: var(--aprobada); }
        .nivel-chip.active { background: rgba(59, 130, 246, 0.12); color: var(--cursando); }
        .nivel-chip.locked { background: var(--disabled); color: var(--disabled-text); }
        .nivel-chevron { color: var(--muted); transition: transform 0.3s cubic-bezier(.4,0,.2,1); flex-shrink: 0; margin-left: auto; }
        .nivel-acordeon.open .nivel-chevron { transform: rotate(180deg); }
        /* Grid 0fr→1fr: interpola contra el alto real del contenido, mucho más suave que animar max-height */
        .nivel-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.32s cubic-bezier(.4,0,.2,1); }
        .nivel-acordeon.open .nivel-body { grid-template-rows: 1fr; }
        .nivel-body-inner { overflow: hidden; min-height: 0; padding: 0 16px 20px; }
        .nivel-body-inner > * { opacity: 0; transform: translateY(-4px); transition: opacity 0.2s ease 0.04s, transform 0.2s ease 0.04s; }
        .nivel-acordeon.open .nivel-body-inner > * { opacity: 1; transform: translateY(0); }
        .nivel-acordeon.locked .nivel-body-inner { opacity: 0.55; }
        .nivel-lock-note { display: flex; align-items: flex-start; gap: 6px; font-size: 0.78rem; color: var(--muted); margin-bottom: 12px; }
        .nivel-lock-note svg { flex-shrink: 0; margin-top: 1px; }
        @media (max-width: 480px) {
          .nivel-header { flex-wrap: wrap; row-gap: 8px; }
          .nivel-header .mark-all-btn { order: 3; margin-left: auto; }
          .nivel-header .nivel-chevron { order: 2; margin-left: 0; }
        }

        .subject-card:hover, .subject-card.aprobada:hover, .subject-card.cursada:hover, .subject-card.available:hover { transform: none !important; }
        .subject-card.highlight-blocked { border-color: #ef4444 !important; box-shadow: 0 0 15px rgba(239, 68, 68, 0.6) !important; animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; z-index: 50; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .subject-status-icon { position: absolute; bottom: 10px; right: 10px; opacity: 0.8; }

        .electiva-toggle-card .electiva-chevron { transition: transform 0.25s ease; }
        .electiva-toggle-card.open .electiva-chevron { transform: rotate(180deg); }
        .electiva-toggle-card.open { border-color: var(--cursando) !important; box-shadow: 0 0 0 2px color-mix(in srgb, var(--cursando) 30%, transparent); }

        .electivas-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.32s cubic-bezier(.4,0,.2,1); margin-top: 12px; }
        .electivas-panel.open { grid-template-rows: 1fr; }
        .electivas-panel-inner { overflow: hidden; min-height: 0; }
        .electivas-req-note { font-size: 0.8rem; color: var(--muted); margin-bottom: 10px; }
        .electivas-empty { font-size: 0.85rem; color: var(--muted); font-style: italic; }

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

        <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {levels.map((lvl) => {
              const materiasObligatorias = SUBJECTS.filter((s: any) => s.level === lvl && !s.isElective && !s.isElectivePlaceholder);
              const electivas = ELECTIVAS?.[lvl as keyof typeof ELECTIVAS] || [];
              const placeholders = SUBJECTS.filter((s: any) => s.level === lvl && s.isElectivePlaceholder);
              const status = nivelStatus(lvl);
              const abierto = estaAbierto(lvl);
              const cards = cardsDeNivel(lvl);
              const aprobadasCount = cards.filter((s: any) => obtenerEstado(s) === 'aprobada').length;

              return (
                <div key={lvl} className={`nivel-acordeon ${abierto ? 'open' : ''} ${status === 'locked' ? 'locked' : ''}`}>
                  <div
                    className="nivel-header"
                    role="button"
                    tabIndex={0}
                    aria-expanded={abierto}
                    onClick={() => toggleNivel(lvl)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleNivel(lvl); } }}
                    style={{ color: `var(--n${lvl})` }}
                  >
                    <div className="level-badge" style={{ borderColor: `var(--n${lvl})` }}>Nivel {lvl}</div>

                    {status === 'complete' ? (
                      <span className="nivel-chip complete">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        Completo · {aprobadasCount}/{cards.length}
                      </span>
                    ) : status === 'locked' ? (
                      <span className="nivel-chip locked">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        Bloqueado
                      </span>
                    ) : (
                      <span className="nivel-chip active">{aprobadasCount}/{cards.length}</span>
                    )}

                    <button
                      className="mark-all-btn"
                      onClick={(e) => { e.stopPropagation(); marcarNivel(lvl); }}
                    >
                      Marcar todas
                    </button>

                    <svg className="nivel-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </div>

                  <div className="nivel-body">
                    <div className="nivel-body-inner">
                      {status === 'locked' && (
                        <div className="nivel-lock-note">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                          Se habilita cuando tengas al día las correlativas del nivel anterior.
                        </div>
                      )}

                      <div className="subject-grid">
                        {materiasObligatorias.map(renderCard)}
                        {placeholders.map(renderCard)}
                      </div>

                      {placeholders.length > 0 && (
                        <div className={`electivas-panel ${electivasAbiertas[lvl] ? 'open' : ''}`}>
                          <div className="electivas-panel-inner">
                            <div className="electivas-req-note">
                              Requiere <b>{placeholders[0].targetHours} hs anuales</b> de electivas de este nivel.
                            </div>
                            {electivas.length > 0 ? (
                              <div className="subject-grid">{electivas.map(renderCard)}</div>
                            ) : (
                              <div className="electivas-empty">No hay electivas cargadas todavía para este nivel.</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          id="btn-scroll-top" 
          className={`scroll-top-btn ${showScroll ? 'visible' : ''}`} 
          onClick={scrollToTop} 
          title="Volver arriba"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
        </button>

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

        <MateriaDetailModal
          isOpen={selectedSubject !== null}
          onClose={() => setSelectedSubject(null)}
          subject={selectedSubject}
          estadoActual={selectedSubject ? obtenerEstado(selectedSubject) : 'available'}
          materias={materias}
          detalles={detalles}
          careerData={careerData}
          onCambiarEstado={(accion) => selectedSubject && ejecutarCambioEstado(selectedSubject.id, accion)}
          onEditarNota={() => setIsGradeModalOpen(true)}
        />

        <GradeModal
          isOpen={isGradeModalOpen}
          onClose={() => setIsGradeModalOpen(false)}
          materiaName={selectedSubject?.name || ''}
          initialNota={selectedSubject ? detalles[selectedSubject.id]?.notaFinal : null}
          initialDificultad={selectedSubject ? detalles[selectedSubject.id]?.dificultad : null}
          onSubmit={(nota, dificultad) => {
            if (selectedSubject) {
              actualizarDetalleMateria(selectedSubject.id, { ...detalles[selectedSubject.id], notaFinal: nota, dificultad });
            }
          }}
        />

      </main>
    </>
  );
}