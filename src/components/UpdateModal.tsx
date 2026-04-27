'use client';

import { useState } from 'react';

// 🔑 CLAVE DE VERSIÓN: cambiá este valor en cada nueva actualización para que
// el modal vuelva a mostrarse a todos los usuarios.
export const UPDATE_VERSION_KEY = 'seen_update_v2';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const slides = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    tag: 'Novedades',
    title: 'Actualización disponible',
    description: (
      <span>Se agregaron <strong style={{ color: 'var(--cursando)' }}>2 nuevas funcionalidades</strong> que mejoran la experiencia de la plataforma.</span>
    ),
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
        <line x1="9" y1="3" x2="9" y2="18"/>
        <line x1="15" y1="6" x2="15" y2="21"/>
      </svg>
    ),
    tag: 'Funcionalidad 1',
    title: 'Portabilidad de carreras',
    description: (
      <span>
        El sistema ahora permite registrar el progreso de <strong style={{ color: 'var(--cursando)' }}>2 o más carreras</strong> en simultáneo.
        Para agregar una nueva carrera, ingresá a <strong style={{ color: 'var(--cursando)' }}>"mi perfil"</strong>.
      </span>
    ),
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    tag: 'Funcionalidad 2',
    title: 'Horario semanal + Calendario',
    description: (
      <span>
        El horario semanal ahora se adapta a la <strong style={{ color: 'var(--cursando)' }}>semana actual</strong>, mostrando eventos, feriados y mesas de examen.
        El calendario anterior sigue disponible dentro de la sección de horario, en el botón del ícono de calendario.
      </span>
    ),
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    tag: 'Tu opinión importa',
    title: 'Ayudame a mejorar',
    description: (
      <span>
        Si encontrás un error o tenés una sugerencia, completá el formulario al pie de la página en el botón <strong style={{ color: 'var(--cursando)' }}>"Dejanos tu opinión"</strong>. Esta plataforma es hecha por y para estudiantes.
      </span>
    ),
  },
];

export default function UpdateModal({ isOpen, onClose }: UpdateModalProps) {
  const [current, setCurrent] = useState(0);

  if (!isOpen) return null;

  const isLast = current === slides.length - 1;
  const slide = slides[current];

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const handlePrev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  return (
    <>
      <style>{`
        .update-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(6px);
          z-index: 3000;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: umFadeIn 0.25s ease-out;
        }
        .update-modal {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 20px;
          width: 100%; max-width: 460px;
          padding: 36px 32px 28px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.3);
          display: flex; flex-direction: column; gap: 0;
          position: relative;
          animation: umSlideUp 0.3s cubic-bezier(.22,1,.36,1);
        }
        @keyframes umFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes umSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

        .update-modal-tag {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: var(--cursando);
          margin-bottom: 10px;
        }
        .update-modal-icon {
          margin-bottom: 16px;
        }
        .update-modal-title {
          color: var(--text-strong);
          font-size: 1.4rem;
          font-weight: 800;
          margin: 0 0 12px 0;
          line-height: 1.2;
        }
        .update-modal-desc {
          color: var(--muted);
          font-size: 0.95rem;
          line-height: 1.65;
          margin: 0 0 28px 0;
          min-height: 70px;
        }
        .update-modal-dots {
          display: flex; gap: 7px; align-items: center; margin-bottom: 24px;
        }
        .update-modal-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--border);
          transition: all 0.3s ease;
          cursor: pointer;
          border: none; padding: 0;
        }
        .update-modal-dot.active {
          background: var(--cursando);
          width: 22px;
          border-radius: 4px;
        }
        .update-modal-actions {
          display: flex; gap: 10px; justify-content: flex-end; align-items: center;
        }
        .update-modal-btn-skip {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--muted);
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .update-modal-btn-skip:hover { color: var(--text-strong); border-color: var(--text-strong); }
        .update-modal-btn-next {
          background: var(--cursando);
          border: none;
          color: black;
          padding: 10px 24px;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          display: flex; align-items: center; gap: 7px;
        }
        .update-modal-btn-next:hover { opacity: 0.88; transform: translateY(-1px); }

        .update-modal-close {
          position: absolute; top: 18px; right: 18px;
          background: transparent; border: none;
          color: var(--muted); cursor: pointer;
          padding: 6px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.2s, background 0.2s;
        }
        .update-modal-close:hover { color: var(--text-strong); background: var(--glass-hover); }
      `}</style>

      <div className="update-modal-overlay" onClick={onClose}>
        <div className="update-modal" onClick={(e) => e.stopPropagation()}>

          <button className="update-modal-close" onClick={onClose} title="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <div className="update-modal-tag">{slide.tag}</div>
          <div className="update-modal-icon">{slide.icon}</div>
          <h2 className="update-modal-title">{slide.title}</h2>
          <p className="update-modal-desc">{slide.description}</p>

          <div className="update-modal-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`update-modal-dot ${i === current ? 'active' : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Ir al slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="update-modal-actions">
            {current > 0 && (
              <button className="update-modal-btn-skip" onClick={handlePrev}>
                Anterior
              </button>
            )}
            {!isLast && (
              <button className="update-modal-btn-skip" onClick={onClose}>
                Saltar
              </button>
            )}
            <button className="update-modal-btn-next" onClick={handleNext}>
              {isLast ? (
                <>
                  ¡Entendido!
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </>
              ) : (
                <>
                  Siguiente
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}