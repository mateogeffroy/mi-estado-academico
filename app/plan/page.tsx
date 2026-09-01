'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePlan } from '../../src/context/PlanContext';
import { AccionMateria } from '../../src/application/useCases/actualizarProgreso';
import { Materia } from '../../src/domain/entities/Materia';
import { EstadoMateria } from '../../src/domain/entities/Progreso';
import ConfirmModal from '../../src/components/ConfirmModal';
import SimuladorModal from '../../src/components/SimuladorModal';
import MateriaDetailModal from '../../src/components/MateriaDetailModal';
import GradeModal from '../../src/components/GradeModal';

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

type ActiveLevel = number | 'todos';
const TAB_STORAGE_KEY = 'plan_ultima_tab';

const leerTabGuardada = (): ActiveLevel | null => {
  if (typeof window === 'undefined') return null;
  const saved = window.localStorage.getItem(TAB_STORAGE_KEY);
  if (saved === 'todos') return 'todos';
  const n = Number(saved);
  return Number.isFinite(n) && n > 0 ? n : null;
};

export default function PlanDeEstudios() {
  const { materias, detalles, cambiarEstadoMateria, actualizarDetalleMateria, reiniciarProgreso, marcarMultiplesAprobadas, stats, careerData, todasLasCarreras, careerId, setCarreraActiva } = usePlan();
  const { SUBJECTS, ELECTIVAS, ALL } = careerData;
  const maxLevel = Math.max(...SUBJECTS.map((s: any) => s.level || 1));
  const levels = Array.from({ length: maxLevel }, (_, i) => i + 1);

  // Un solo punto de entrada para ver/editar una materia: reemplaza el
  // combo previo de click=aprobar, click derecho/long-press=menú flotante y
  // tooltip por hover, que en mobile no tenía ninguna pista visual de que
  // existiera. Ahora cualquier click (incluso en bloqueadas o electivas)
  // abre este modal con correlativas, acciones y qué destraba.
  const [selectedSubject, setSelectedSubject] = useState<Materia | null>(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [blockedShake, setBlockedShake] = useState<string | null>(null);

  const [isSimuladorOpen, setIsSimuladorOpen] = useState(false);

  // Navegación por año: sólo se muestra un año a la vez (o "Todos" para el
  // plan completo, como antes). null = sin selección manual, se usa el año
  // "activo" calculado más abajo. Se inicializa con la última tab que tocó
  // el usuario (localStorage) para que retome donde dejó.
  const [activeLevelOverride, setActiveLevelOverride] = useState<ActiveLevel | null>(leerTabGuardada);

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

  const obtenerEstado = (subject: any): EstadoMateria => {
    let estado = materias[subject.id];
    if (!estado) estado = (subject.level === 1 || subject.isElective || subject.isElectivePlaceholder) ? 'available' : 'disabled';
    return estado;
  };

  // isSeminario: materias como "Seminario Integrador" son extra, no forman
  // parte del bloque del año (no cuentan para su progreso ni para si está
  // completo/bloqueado). Se siguen mostrando y se pueden marcar igual.
  const cardsDeNivel = (lvl: number) => SUBJECTS.filter((s: any) => s.level === lvl && !s.isSeminario);

  type EstadoNivel = 'complete' | 'active' | 'locked';
  const nivelStatus = (lvl: number): EstadoNivel => {
    const cards = cardsDeNivel(lvl);
    if (cards.length === 0) return 'active';
    const estados = cards.map(obtenerEstado);
    if (estados.every((e) => e === 'aprobada')) return 'complete';
    if (estados.every((e) => e === 'disabled')) return 'locked';
    return 'active';
  };

  // Color de la tab: gris "sin comenzar" (0 aprobadas y nada cursando),
  // azul "en progreso" (algo aprobado, o 0 aprobadas pero hay algo
  // cursando), verde "completado" (todo aprobado). Independiente de si el
  // año está bloqueado por correlativas: un año recién habilitado también
  // arranca gris.
  type TabEstado = 'vacio' | 'progreso' | 'completo';
  const tabEstado = (lvl: number): TabEstado => {
    const cards = cardsDeNivel(lvl);
    if (cards.length === 0) return 'vacio';
    const estados = cards.map(obtenerEstado);
    const aprobadas = estados.filter((e) => e === 'aprobada').length;
    if (aprobadas === cards.length) return 'completo';
    if (aprobadas > 0 || estados.some((e) => e === 'cursando')) return 'progreso';
    return 'vacio';
  };

  // Año a mostrar: el que el usuario tocó a mano (o retomado de
  // localStorage), o si no hay nada guardado/válido, el primer año
  // "activo" (con algo cursable/en curso). Si la tab guardada era de otra
  // carrera con menos años, se ignora y cae al default.
  const defaultLevel = levels.find((lvl) => nivelStatus(lvl) === 'active') ?? levels[0] ?? 1;
  const activeLevel: ActiveLevel =
    activeLevelOverride === 'todos'
      ? 'todos'
      : activeLevelOverride !== null && levels.includes(activeLevelOverride)
        ? activeLevelOverride
        : defaultLevel;

  const selectLevel = (lvl: ActiveLevel) => {
    setActiveLevelOverride(lvl);
    if (typeof window !== 'undefined') window.localStorage.setItem(TAB_STORAGE_KEY, String(lvl));
  };

  // Resumen del año activo (título, estado, marcar todas) para mostrarlo en
  // la misma fila que las tabs, a la derecha. No aplica en "Todos", donde
  // cada bloque ya trae el suyo propio.
  const summaryLevel = activeLevel === 'todos' ? null : activeLevel;
  const summaryCards = summaryLevel !== null ? cardsDeNivel(summaryLevel) : [];
  const summaryStatus = summaryLevel !== null ? nivelStatus(summaryLevel) : 'active';
  const summaryAprobadas = summaryCards.filter((s: any) => obtenerEstado(s) === 'aprobada').length;
  const summaryObligatorias = summaryLevel !== null
    ? SUBJECTS.filter((s: any) => s.level === summaryLevel && !s.isElective && !s.isElectivePlaceholder)
    : [];
  const summaryHayPendientes = summaryObligatorias.some((m: any) => {
    const e = materias[m.id] || (m.level === 1 ? 'available' : 'disabled');
    return e !== 'disabled' && e !== 'aprobada';
  });

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

  // Un año completo: header (título, estado, marcar todas), grid de
  // materias y el panel de electivas. Se usa tanto para la vista de un
  // solo año como, repetida por cada año, para la tab "Todos". En la vista
  // de un solo año el header se muestra arriba, en la fila de tabs
  // (headerInline=false); en "Todos" cada bloque necesita el suyo propio.
  const renderYearBlock = (lvl: number, headerInline: boolean = true) => {
    const cards = cardsDeNivel(lvl);
    const status = nivelStatus(lvl);
    const aprobadasCount = cards.filter((s: any) => obtenerEstado(s) === 'aprobada').length;
    const obligatorias = SUBJECTS.filter((s: any) => s.level === lvl && !s.isElective && !s.isElectivePlaceholder);
    const electivas = ELECTIVAS?.[lvl as keyof typeof ELECTIVAS] || [];
    const placeholders = SUBJECTS.filter((s: any) => s.level === lvl && s.isElectivePlaceholder);
    const hayPendientes = obligatorias.some((m: any) => {
      const e = materias[m.id] || (m.level === 1 ? 'available' : 'disabled');
      return e !== 'disabled' && e !== 'aprobada';
    });

    return (
      <div key={lvl} className="year-panel">
        {headerInline && (
          <div className="year-panel-header">
            <h2 className="year-panel-title" style={{ color: `var(--n${lvl})` }}>Año {lvl}</h2>

            {status === 'complete' ? (
              <span className="year-chip complete">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Completo · {aprobadasCount}/{cards.length}
              </span>
            ) : status === 'locked' ? (
              <span className="year-chip locked">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                Bloqueado
              </span>
            ) : (
              <span className="year-chip active">{aprobadasCount}/{cards.length}</span>
            )}

            {status !== 'locked' && hayPendientes && (
              <button className="mark-all-btn" onClick={() => marcarNivel(lvl)}>
                Marcar todas
              </button>
            )}
          </div>
        )}

        {status === 'locked' && (
          <div className="year-lock-note">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            Se habilita cuando tengas al día las correlativas del nivel anterior.
          </div>
        )}

        <div className="subject-grid">
          {obligatorias.map(renderCard)}
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
    );
  };

  return (
    <>
      <style>{`
        /* Tabs por año: un solo año visible a la vez en vez del acordeón
           anterior con todos apilados (o "Todos" para verlos todos juntos
           como antes). Menos scroll, foco en lo que importa ahora; los
           chips ya muestran el progreso de cada año sin tener que abrirlo. */
        .year-tabs-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        /* Año activo a la izquierda; las tabs de navegación quedan a la
           derecha, más chicas, como selector secundario. */
        .year-tabs { display: flex; gap: 6px; overflow-x: auto; padding: 4px 2px 10px; -webkit-overflow-scrolling: touch; margin-left: auto; min-width: 0; }
        .year-tabs-summary { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .year-tabs-summary .year-panel-title { white-space: nowrap; }
        .year-tab {
          flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 2px;
          padding: 6px 10px; border-radius: 9px; border: 1.5px solid var(--disabled-border);
          background: var(--panel); cursor: pointer; transition: all 0.15s;
          font: inherit; text-align: left; color: var(--disabled-text);
        }
        .year-tab:focus-visible { outline: 2px solid var(--cursando); outline-offset: 2px; }
        .year-tab .tab-label { font-weight: 800; font-size: 0.7rem; white-space: nowrap; color: inherit; }
        .year-tab .tab-frac { font-family: 'Space Mono', monospace; font-size: 0.62rem; opacity: 0.8; white-space: nowrap; color: inherit; }
        /* progreso: azul característico de la app, completo: verde, vacío: gris (default de arriba) */
        .year-tab.progreso { border-color: var(--cursando); color: var(--cursando); background: color-mix(in srgb, var(--cursando) 8%, var(--panel)); }
        .year-tab.completo { border-color: var(--aprobada); color: var(--aprobada); background: color-mix(in srgb, var(--aprobada) 8%, var(--panel)); }
        .year-tab.todos-tab { border-color: var(--accent); color: var(--accent); background: color-mix(in srgb, var(--accent) 8%, var(--panel)); }
        /* Selección: glow sutil en vez de otro color, para no pisar el color de estado */
        .year-tab.active { box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 20%, transparent), 0 0 14px color-mix(in srgb, currentColor 35%, transparent); }

        .year-panel { animation: fadeIn 0.2s ease-out; }
        .year-panel-header { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
        .year-panel-title { font-size: 1.2rem; font-weight: 800; margin: 0; }
        .year-chip { font-family: 'Space Mono', monospace; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; display: flex; align-items: center; gap: 5px; white-space: nowrap; }
        .year-chip.complete { background: rgba(34, 197, 94, 0.12); color: var(--aprobada); }
        .year-chip.active { background: rgba(59, 130, 246, 0.12); color: var(--cursando); }
        .year-chip.locked { background: var(--disabled); color: var(--disabled-text); }
        .year-lock-note { display: flex; align-items: flex-start; gap: 6px; font-size: 0.8rem; color: var(--muted); margin-bottom: 16px; }
        .year-lock-note svg { flex-shrink: 0; margin-top: 1px; }

        .subject-card:hover, .subject-card.aprobada:hover, .subject-card.cursada:hover, .subject-card.available:hover { transform: none !important; }
        .subject-card.highlight-blocked { border-color: var(--danger) !important; box-shadow: 0 0 15px rgba(239, 68, 68, 0.6) !important; animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; z-index: 50; }
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

      <main id="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>

            <div className="header-titles" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 className="logo">Plan de <span>estudios</span></h1>

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
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

            {todasLasCarreras?.length > 1 && (
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
            )}

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

        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <div className="year-tabs-row">
            {summaryLevel !== null && (
              <div className="year-tabs-summary">
                <h2 className="year-panel-title" style={{ color: `var(--n${summaryLevel})` }}>Año {summaryLevel}</h2>

                {summaryStatus === 'complete' ? (
                  <span className="year-chip complete">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Completo · {summaryAprobadas}/{summaryCards.length}
                  </span>
                ) : summaryStatus === 'locked' ? (
                  <span className="year-chip locked">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    Bloqueado
                  </span>
                ) : (
                  <span className="year-chip active">{summaryAprobadas}/{summaryCards.length}</span>
                )}

                {summaryStatus !== 'locked' && summaryHayPendientes && (
                  <button className="mark-all-btn" onClick={() => marcarNivel(summaryLevel)}>
                    Marcar todas
                  </button>
                )}
              </div>
            )}

            <div className="year-tabs">
              <button
                type="button"
                className={`year-tab todos-tab ${activeLevel === 'todos' ? 'active' : ''}`}
                onClick={() => selectLevel('todos')}
              >
                <span className="tab-label">Todos</span>
                <span className="tab-frac">{stats.aprobadas}/{stats.totalMaterias}</span>
              </button>

              {levels.map((lvl) => {
                const cards = cardsDeNivel(lvl);
                const aprobadasCount = cards.filter((s: any) => obtenerEstado(s) === 'aprobada').length;
                const estado = tabEstado(lvl);
                return (
                  <button
                    key={lvl}
                    type="button"
                    className={`year-tab ${estado} ${lvl === activeLevel ? 'active' : ''}`}
                    onClick={() => selectLevel(lvl)}
                  >
                    <span className="tab-label">Año {lvl}</span>
                    <span className="tab-frac">{aprobadasCount}/{cards.length}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          {activeLevel === 'todos' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {levels.map((lvl) => renderYearBlock(lvl))}
            </div>
          ) : (
            renderYearBlock(activeLevel, false)
          )}
        </div>

        <div className="stats-bar plan-stats-bar-override" style={{ position: 'sticky', width: '100%', zIndex: 900, background: 'var(--bg)', borderTop: '1px solid var(--border)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>

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
