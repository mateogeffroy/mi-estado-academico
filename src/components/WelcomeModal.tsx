'use client';

import React, { useEffect, useState } from 'react';

export default function WelcomeModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  // Evitamos errores de hidratación y controlamos que se monte en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Bloqueamos el scroll del fondo cuando el modal está abierto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return (
    <>
      <style>{`
        .welcome-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(5px);
          z-index: 10000; display: flex; align-items: center; justify-content: center;
          padding: 20px; animation: fadeIn 0.2s ease-out;
        }
        
        .welcome-modal {
          background: var(--panel); border: 1px solid var(--border);
          border-radius: 24px; padding: 40px; max-width: 550px; width: 100%;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); position: relative;
        }

        /* Ocultamos las instrucciones de celular por defecto (modo PC) */
        .mobile-instruction { display: none; }
        .desktop-instruction { display: flex; }

        /* 🔥 Si la pantalla es de celular, ocultamos PC y mostramos Móvil 🔥 */
        @media (max-width: 900px) {
          .mobile-instruction { display: flex; }
          .desktop-instruction { display: none; }
          .welcome-modal { padding: 24px; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      
      <div className="welcome-overlay" onClick={onClose}>
        <div className="welcome-modal" onClick={e => e.stopPropagation()}>
          
          <button 
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'var(--border)', border: 'none',
              width: '36px', height: '36px',
              borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s', padding: 0
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'var(--border)'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <h2 style={{ color: 'white', fontSize: '1.6rem', marginBottom: '20px', marginTop: '10px' }}>
            ¿Cómo usar el Plan de Estudios?
          </h2>

          {/* ==============================================
              INSTRUCCIONES PARA PC
              ============================================== */}
          <div className="desktop-instruction" style={{ flexDirection: 'column', gap: '15px', color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            <p style={{ margin: 0 }}>
              Simplemente interactuá con una materia para cambiar su estado:
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <rect x="5" y="2" width="14" height="20" rx="7"/>
                <path d="M12 2v7"/>
                <path d="M5 9h14"/>
              </svg>
              <span><strong>Click Izquierdo:</strong> Marca la materia como <span style={{ color: '#10b981', fontWeight: 'bold' }}>Aprobada</span> (o la devuelve a Disponible).</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <rect x="5" y="2" width="14" height="20" rx="7"/>
                <path d="M12 2v7"/>
                <path d="M5 9h14"/>
              </svg>
              <span><strong>Click Derecho:</strong> Alterna entre <span style={{ color: 'var(--cursando)', fontWeight: 'bold' }}>Cursando</span> y <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Cursada</span>.</span>
            </div>
          </div>

          {/* ==============================================
              INSTRUCCIONES PARA MÓVIL
              ============================================== */}
          <div className="mobile-instruction" style={{ flexDirection: 'column', gap: '15px', color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            <p style={{ margin: 0 }}>
              Simplemente tocá una materia para desplegar sus opciones:
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                <span style={{ color: 'white', fontWeight: 'bold' }}>Menú de Acciones:</span>
              </div>
              
              <ul style={{ margin: 0, paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                <li><strong style={{ color: '#22c55e' }}>Aprobada:</strong> Materia finalizada con nota.</li>
                <li><strong style={{ color: '#eab308' }}>Cursada:</strong> Materia regularizada, debés el final.</li>
                <li><strong style={{ color: 'var(--cursando)' }}>Cursando:</strong> Materia en curso (habilita el calendario en Mi Cursada).</li>
                <li><strong style={{ color: '#60a5fa' }}>Desmarcar:</strong> Revierte la materia a Disponible.</li>
              </ul>
            </div>
          </div>

          {/* ==============================================
              TEXTO COMÚN (PIE DEL MODAL)
              ============================================== */}
          <p style={{ margin: '20px 0 0 0', fontSize: '0.9rem', color: 'var(--muted)', lineHeight: '1.5' }}>
            Las materias bloqueadas (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'text-bottom' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>) se habilitarán automáticamente cuando apruebes o curses sus correlativas. Podés interactuar con ellas para ver qué requisitos te faltan.
          </p>

          <button 
            onClick={onClose}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1.05rem', borderRadius: '12px', fontWeight: 'bold', marginTop: '24px', border: 'none', cursor: 'pointer' }}
          >
            Entendido
          </button>

        </div>
      </div>
    </>
  );
}