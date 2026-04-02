'use client';

import React, { useState, useEffect } from 'react';

interface SimuladorModalProps {
  isOpen: boolean;
  onClose: () => void;
  materias: Record<string, string>;
  ALL: any[];
}

export default function SimuladorModal({ isOpen, onClose, materias, ALL }: SimuladorModalProps) {
  const [simulacion, setSimulacion] = useState<Record<string, 'aprobada' | 'cursada'>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState({ isOpen: false, x: 0, y: 0, subjectId: null as string | null });

  const [activeRightId, setActiveRightId] = useState<string | null>(null);

  // Inicialización al abrir
  useEffect(() => {
    if (isOpen) {
      const estadoInicial: Record<string, 'aprobada' | 'cursada'> = {};
      ALL.forEach(m => {
        // 🔥 AHORA INCLUIMOS CURSANDO Y CURSADAS (Finales pendientes) 🔥
        if (materias[m.id] === 'cursando' || materias[m.id] === 'cursada') {
          estadoInicial[m.id] = 'aprobada'; // Por defecto simulamos que las aprobas
        }
      });
      setSimulacion(estadoInicial);
      setHoveredId(null);
      setPinnedId(null);
      setActiveRightId(null);
      setMobileMenu({ isOpen: false, x: 0, y: 0, subjectId: null });
    }
  }, [isOpen, materias, ALL]);

  // Cierre del menú móvil al hacer clic afuera o scrollear (Con corrección de closest)
  useEffect(() => {
    const handleOutsideInteraction = (e: MouseEvent | TouchEvent | Event) => {
      const target = e.target as HTMLElement;
      
      if (target && typeof target.closest === 'function') {
        if (!target.closest('.sim-mobile-menu') && !target.closest('.sim-card')) {
          setMobileMenu(prev => ({ ...prev, isOpen: false }));
          setActiveRightId(null); 
        }
      } else {
        setMobileMenu(prev => ({ ...prev, isOpen: false }));
        setActiveRightId(null); 
      }
    };

    if (mobileMenu.isOpen || activeRightId) {
      window.addEventListener('click', handleOutsideInteraction);
      window.addEventListener('touchstart', handleOutsideInteraction, { passive: true });
      window.addEventListener('scroll', handleOutsideInteraction, true); 
    }

    return () => {
      window.removeEventListener('click', handleOutsideInteraction);
      window.removeEventListener('touchstart', handleOutsideInteraction);
      window.removeEventListener('scroll', handleOutsideInteraction, true);
    };
  }, [mobileMenu.isOpen, activeRightId]);

  if (!isOpen) return null;

  // 🔥 NUEVO FILTRO: Incluye Cursando y Cursadas 🔥
  const materiasSimulables = ALL.filter(m => materias[m.id] === 'cursando' || materias[m.id] === 'cursada');
  const estadoCombinado = { ...materias, ...simulacion };

  const evaluarDisponibilidad = (subject: any, mapaEstados: Record<string, string>) => {
    if (!subject.correlCursada?.length && !subject.correlAprobada?.length) return true;
    const cursadasOk = (subject.correlCursada || []).every((id: string) => 
      mapaEstados[id] === 'cursada' || mapaEstados[id] === 'aprobada'
    );
    const aprobadasOk = (subject.correlAprobada || []).every((id: string) => 
      mapaEstados[id] === 'aprobada'
    );
    return cursadasOk && aprobadasOk;
  };

  const materiasDesbloqueadas = ALL.filter(m => {
    const estadoReal = materias[m.id];
    if (estadoReal === 'aprobada' || estadoReal === 'cursada' || estadoReal === 'cursando') return false;
    const disponibleReal = evaluarDisponibilidad(m, materias);
    const disponibleSimulado = evaluarDisponibilidad(m, estadoCombinado);
    return !disponibleReal && disponibleSimulado;
  });

  const dependeDe = (materiaDerecha: any, idIzquierda: string) => {
    return materiaDerecha.correlCursada?.includes(idIzquierda) || materiaDerecha.correlAprobada?.includes(idIzquierda);
  };

  const toggleEstadoSimulado = (id: string) => {
    setSimulacion(prev => ({
      ...prev,
      [id]: prev[id] === 'aprobada' ? 'cursada' : 'aprobada'
    }));
  };

  // MANEJADORES COLUMNA IZQUIERDA
  const handleLeftClick = (e: React.MouseEvent, m: any) => {
    e.stopPropagation();
    if (window.innerWidth <= 900) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      let posX = rect.left;
      let posY = rect.bottom + 8;
      
      if (posY + 120 > window.innerHeight) posY = rect.top - 120;
      if (posX + 180 > window.innerWidth) posX = window.innerWidth - 190;

      setMobileMenu({ isOpen: true, x: posX, y: posY, subjectId: m.id });
    } else {
      setPinnedId(prev => prev === m.id ? null : m.id);
      setHoveredId(null); 
      setMobileMenu(prev => ({ ...prev, isOpen: false })); 
    }
  };

  const handleRightClick = (e: React.MouseEvent, m: any) => {
    e.preventDefault();
    if (window.innerWidth > 900) {
      toggleEstadoSimulado(m.id);
    }
  };

  // MANEJADORES COLUMNA DERECHA
  const handleUnlockedClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.innerWidth <= 900) {
      setActiveRightId(prev => prev === id ? null : id);
    }
  };

  const activeLeftId = pinnedId || hoveredId;

  return (
    <>
      <style>{`
        .simulador-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px);
          z-index: 2000; display: flex; align-items: center; justify-content: center;
          padding: 20px; animation: fadeIn 0.2s ease-out;
        }
        .simulador-modal {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 24px; width: 100%; max-width: 900px;
          max-height: 90vh; display: flex; flex-direction: column;
          box-shadow: 0 25px 50px rgba(0,0,0,0.3); overflow: hidden;
        }
        .simulador-header {
          padding: 24px 30px; border-bottom: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
          background: var(--panel);
        }
        .simulador-body {
          display: grid; grid-template-columns: 1fr 1fr; gap: 30px;
          padding: 30px; overflow-y: auto; flex: 1; position: relative;
        }
        .simulador-columna { display: flex; flex-direction: column; gap: 15px; }
        
        .sim-card {
          padding: 16px; border-radius: 12px; border: 1px solid var(--border);
          background: var(--glass-bg); transition: all 0.3s ease;
          display: flex; flex-direction: column; gap: 6px; position: relative;
          user-select: none;
        }
        
        .sim-card.estado-aprobada { border-color: var(--aprobada); background: rgba(34, 197, 94, 0.05); }
        .sim-card.estado-cursada { border-color: var(--cursada); background: rgba(251, 191, 36, 0.05); }
        .sim-card.estado-desbloqueada { border-color: var(--cursando); background: rgba(59, 130, 246, 0.05); }

        .sim-card.dimmed { opacity: 0.3; transform: scale(0.98); }
        .sim-card.highlighted { 
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.2); 
          border-color: var(--cursando); transform: scale(1.02); z-index: 10;
        }

        .pin-icon {
          position: absolute; right: 12px; top: 12px;
          color: var(--text-strong); opacity: 0.8;
        }

        .right-dialog-wrapper {
          display: grid; grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin-top 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 0;
        }
        .right-dialog-wrapper.open { grid-template-rows: 1fr; margin-top: 10px; }
        .right-dialog-content {
          overflow: hidden; opacity: 0;
          transition: opacity 0.3s ease, padding-top 0.3s ease, border-color 0.3s ease;
          padding-top: 0; border-top: 1px dashed transparent;
        }
        .right-dialog-wrapper.open .right-dialog-content {
          opacity: 1; padding-top: 10px; border-top-color: var(--border);
        }

        .sim-mobile-menu {
          position: fixed; background: var(--panel); border: 1px solid var(--border);
          border-radius: 12px; padding: 8px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          min-width: 180px; z-index: 3000; display: flex; flex-direction: column; gap: 4px;
          animation: fadeIn 0.2s ease-out;
        }
        .sim-mobile-btn {
          background: transparent; color: var(--text-strong); border: none;
          padding: 12px 14px; text-align: left; border-radius: 8px; font-weight: 600;
          font-family: 'Syne', sans-serif; font-size: 0.9rem; cursor: pointer;
          display: flex; align-items: center; gap: 10px; transition: background 0.2s;
        }
        .sim-mobile-btn:hover, .sim-mobile-btn:active { background: var(--glass-hover); }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: var(--glass-bg); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--muted); }

        @media (max-width: 900px) {
          .simulador-body { grid-template-columns: 1fr; gap: 40px; padding: 20px; }
          .simulador-columna { border-bottom: 1px dashed var(--border); padding-bottom: 20px; }
          .simulador-columna:last-child { border-bottom: none; padding-bottom: 0; }
          .simulador-header { padding: 20px; }
        }
      `}</style>

      <div className="simulador-overlay" onClick={onClose}>
        <div className="simulador-modal" onClick={e => e.stopPropagation()}>
          
          <div className="simulador-header">
            <div>
              <h2 style={{ color: 'var(--text-strong)', margin: '0 0 4px 0', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m12 16 4-4-4-4"/><path d="M8 12h8"/></svg>
                Simulador
              </h2>
              <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem' }}>
                Descubrí qué materias destrabás al rendir tus finales y cursadas.
              </p>
            </div>
            <button onClick={onClose} style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)', color: 'var(--text-strong)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              ✕
            </button>
          </div>

          <div className="simulador-body custom-scrollbar">
            
            {/* COLUMNA IZQUIERDA: A SIMULAR */}
            <div className="simulador-columna">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--cursando)' }}></div>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.1rem' }}>Materias a Simular</h3>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: '-10px 0 10px 0' }}>
                <span className="desktop-only">Click izq: Fijar. Click der: Cambiar estado.</span>
                <span className="mobile-only">Tocá una materia para ver opciones.</span>
              </p>

              {materiasSimulables.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                  No tenés materias en curso ni finales pendientes.
                </div>
              ) : (
                materiasSimulables.map(m => {
                  const estSimulado = simulacion[m.id] || 'aprobada';
                  const estReal = materias[m.id]; // 'cursando' o 'cursada'
                  
                  const isPinned = pinnedId === m.id;
                  const isHovered = !pinnedId && hoveredId === m.id;
                  
                  let isHighlighted = isPinned || isHovered;
                  let isDimmed = false;
                  
                  if (pinnedId && !isPinned) isDimmed = true;
                  if (!pinnedId && hoveredId && !isHovered) isDimmed = true;
                  
                  return (
                    <div 
                      key={m.id}
                      className={`sim-card estado-${estSimulado} ${isHighlighted ? 'highlighted' : (isDimmed ? 'dimmed' : '')}`}
                      onClick={(e) => handleLeftClick(e, m)} 
                      onContextMenu={(e) => handleRightClick(e, m)} 
                      onMouseEnter={() => { if (!pinnedId && window.innerWidth > 900) setHoveredId(m.id); }}
                      onMouseLeave={() => { if (!pinnedId && window.innerWidth > 900) setHoveredId(null); }}
                      style={{ cursor: 'pointer' }}
                    >
                      {isPinned && (
                        <svg className="pin-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>
                        </svg>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'Space Mono', color: 'var(--muted)' }}>
                          {m.level ? `Nivel ${m.level}` : 'Electiva'}
                        </span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: estReal === 'cursada' ? 'var(--cursada)' : 'var(--cursando)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Real: {estReal}
                        </span>
                      </div>
                      
                      <div style={{ color: 'var(--text-strong)', fontWeight: 'bold', fontSize: '1.05rem', paddingRight: '20px' }}>{m.name}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: estSimulado === 'aprobada' ? 'var(--aprobada)' : 'var(--cursada)' }}>
                        Simulando: {estSimulado === 'aprobada' ? 'Final Aprobado' : 'Cursada Firmada'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* COLUMNA DERECHA: DESBLOQUEADAS */}
            <div className="simulador-columna">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--available-border)' }}></div>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.1rem' }}>Nuevas Desbloqueadas</h3>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: '-10px 0 10px 0' }}>
                <span className="desktop-only">Pasá el mouse para ver qué las destraba.</span>
                <span className="mobile-only">Tocá una materia para ver qué la destraba.</span>
              </p>

              {materiasDesbloqueadas.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                  Aún no se desbloquean nuevas materias.
                </div>
              ) : (
                materiasDesbloqueadas.map(m => {
                  const isHighlightedFromLeft = activeLeftId && dependeDe(m, activeLeftId);
                  const isDimmedFromLeft = activeLeftId && !isHighlightedFromLeft;
                  const isRightActive = activeRightId === m.id;

                  const depsAprobada = (m.correlAprobada || []).filter((id: string) => materiasSimulables.some(curso => curso.id === id));
                  const depsCursada = (m.correlCursada || []).filter((id: string) => materiasSimulables.some(curso => curso.id === id));
                  
                  const hasDependencies = depsAprobada.length > 0 || depsCursada.length > 0;
                  const showDialog = isRightActive && hasDependencies;

                  return (
                    <div 
                      key={m.id}
                      className={`sim-card estado-desbloqueada ${isHighlightedFromLeft || isRightActive ? 'highlighted' : (isDimmedFromLeft ? 'dimmed' : '')}`}
                      onMouseEnter={() => { if (window.innerWidth > 900) setActiveRightId(m.id); }}
                      onMouseLeave={() => { if (window.innerWidth > 900) setActiveRightId(null); }}
                      onClick={(e) => handleUnlockedClick(e, m.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div style={{ fontSize: '0.75rem', fontFamily: 'Space Mono', color: 'var(--muted)' }}>{m.level ? `Nivel ${m.level}` : 'Electiva'}</div>
                      <div style={{ color: 'var(--text-strong)', fontWeight: 'bold', fontSize: '1rem' }}>{m.name}</div>
                      
                      {isHighlightedFromLeft && m.correlAprobada?.includes(activeLeftId!) && !isRightActive && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--aprobada)', fontWeight: 'bold', marginTop: '4px' }}>Requiere: Final Aprobado</div>
                      )}
                      {isHighlightedFromLeft && m.correlCursada?.includes(activeLeftId!) && !isRightActive && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--cursada)', fontWeight: 'bold', marginTop: '4px' }}>Requiere: Cursada Firmada</div>
                      )}

                      {/* DIALOG EXPANDIBLE CON ANIMACIÓN SUAVE */}
                      <div className={`right-dialog-wrapper ${showDialog ? 'open' : ''}`}>
                        <div className="right-dialog-content">
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-strong)', marginBottom: '4px', fontWeight: 'bold' }}>Desbloqueada gracias a:</div>
                          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {depsAprobada.map(depId => {
                              const name = ALL.find(s => s.id === depId)?.name || depId;
                              return <li key={`a-${depId}`}><strong style={{ color: 'var(--text-strong)' }}>{name}</strong> <span style={{ color: 'var(--aprobada)' }}>(Aprobada)</span></li>;
                            })}
                            {depsCursada.map(depId => {
                              const name = ALL.find(s => s.id === depId)?.name || depId;
                              return <li key={`c-${depId}`}><strong style={{ color: 'var(--text-strong)' }}>{name}</strong> <span style={{ color: 'var(--cursada)' }}>(Cursada)</span></li>;
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>
      </div>

      {/* MENÚ CONTEXTUAL MÓVIL */}
      {mobileMenu.isOpen && mobileMenu.subjectId && (
        <div 
          className="sim-mobile-menu"
          style={{ left: mobileMenu.x, top: mobileMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="sim-mobile-btn" 
            onClick={() => {
              setPinnedId(prev => prev === mobileMenu.subjectId ? null : mobileMenu.subjectId);
              setMobileMenu(prev => ({ ...prev, isOpen: false }));
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>
            {pinnedId === mobileMenu.subjectId ? 'Desfijar materia' : 'Fijar vista'}
          </button>
          
          <div style={{ height: '1px', background: 'var(--border)', margin: '2px 0' }}></div>
          
          <button 
            className="sim-mobile-btn" 
            onClick={() => {
              toggleEstadoSimulado(mobileMenu.subjectId!);
              setMobileMenu(prev => ({ ...prev, isOpen: false }));
            }}
          >
            {simulacion[mobileMenu.subjectId] === 'aprobada' ? (
              <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cursada)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Cambiar a Cursada</>
            ) : (
              <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--aprobada)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Cambiar a Aprobada</>
            )}
          </button>
        </div>
      )}
    </>
  );
}