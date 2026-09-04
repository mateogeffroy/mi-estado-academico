'use client';

import { useState } from 'react';
import Modal from './Modal';

// 🔑 CLAVE DE VERSIÓN
export const UPDATE_VERSION_KEY = 'seen_update_v3';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const slides = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    tag: 'Novedades',
    title: 'Ahora podés encontrar compañeros',
    description: (
      <span>
        Desde <strong style={{ color: 'var(--cursando)' }}>Buscar</strong> podés encontrar a otras personas por su nombre
        y agregarlas como amigos. En cada materia vas a ver quiénes cursan en tu misma comisión.
      </span>
    ),
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
      </svg>
    ),
    tag: 'Importante',
    title: 'Qué ven los demás',
    description: (
      <span>
        Sólo <strong style={{ color: 'var(--cursando)' }}>tu nombre, tu carrera y las materias y comisiones que cursás</strong>.
        Nunca tus notas, tu promedio ni tus horarios. Podés ocultarte o bloquear a alguien cuando quieras
        desde <strong style={{ color: 'var(--cursando)' }}>Mi Perfil</strong>.
      </span>
    ),
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    tag: 'En camino',
    title: 'Apuntes por materia',
    description: (
      <span>
        Se viene una sección para compartir <strong style={{ color: 'var(--cursando)' }}>resúmenes, ejercicios resueltos y código</strong>
        {' '}en cada materia, con la opción de publicarlos para todos o sólo para tus amigos.
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
          border-radius: 24px;
          width: 100%; max-width: 440px;
          padding: 32px 28px 20px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.3);
          display: flex; flex-direction: column;
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
        .update-modal-icon { margin-bottom: 16px; }
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
          margin: 0 0 24px 0;
          min-height: 80px;
        }
        .update-modal-dots {
          display: flex; gap: 7px; align-items: center; margin-bottom: 28px; justify-content: center;
        }
        .update-modal-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--border);
          transition: all 0.3s ease;
          border: none; padding: 0;
        }
        .update-modal-dot.active {
          background: var(--cursando);
          width: 20px;
          border-radius: 4px;
        }

        .update-modal-actions {
          display: flex; flex-direction: column; gap: 12px;
        }
        .actions-row {
          display: flex; gap: 12px;
        }
        
        /* Botón Siguiente (Primario Azul) */
        .btn-update-next {
          flex: 2;
          background: var(--cursando);
          border: none;
          color: black;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-update-next:active { transform: scale(0.98); }

        /* Botón Atrás (Secundario con Borde) */
        .btn-update-back {
          flex: 1;
          background: transparent;
          border: 1.5px solid var(--border);
          color: var(--muted);
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-update-back:hover { color: var(--text-strong); border-color: var(--muted); }

        /* Botón Saltar (Terciario/Texto) */
        .btn-update-skip {
          background: transparent;
          border: none;
          color: var(--muted);
          padding: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: underline;
          text-underline-offset: 3px;
          opacity: 0.7;
        }
        .btn-update-skip:hover { opacity: 1; color: var(--text-strong); }

        .update-modal-close {
          position: absolute; top: 18px; right: 18px;
          background: transparent; border: none;
          color: var(--muted); cursor: pointer;
          padding: 6px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.2s, background 0.2s;
        }
      `}</style>

      <Modal isOpen={isOpen} onClose={onClose} overlayClassName="update-modal-overlay" className="update-modal" ariaLabel={slide.title}>

          <button className="update-modal-close" onClick={onClose}>
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
              <div key={i} className={`update-modal-dot ${i === current ? 'active' : ''}`} />
            ))}
          </div>

          <div className="update-modal-actions">
            <div className="actions-row">
              {current > 0 && (
                <button className="btn-update-back" onClick={handlePrev}>
                  Atrás
                </button>
              )}
              <button className="btn-update-next" onClick={handleNext}>
                {isLast ? '¡Entendido!' : 'Siguiente'}
                {!isLast && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                )}
              </button>
            </div>
            
            {!isLast && (
              <button className="btn-update-skip" onClick={onClose}>
                Saltar presentación
              </button>
            )}
          </div>
      </Modal>
    </>
  );
}