'use client';

import { useState, useEffect } from 'react';

interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nota: number, dificultad: number | null) => void;
  materiaName: string;
  // 🔥 Nuevas propiedades para recibir los datos previos 🔥
  initialNota?: number | null;
  initialDificultad?: number | null;
}

export default function GradeModal({ isOpen, onClose, onSubmit, materiaName, initialNota, initialDificultad }: GradeModalProps) {
  const [nota, setNota] = useState('');
  const [dificultad, setDificultad] = useState<number | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  // Cargamos los datos previos si existen, o limpiamos si es una materia nueva
  useEffect(() => {
    if (isOpen) {
      setNota(initialNota ? initialNota.toString() : '');
      setDificultad(initialDificultad || null);
      setHoveredStar(null);
    }
  }, [isOpen, initialNota, initialDificultad]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const notaNum = parseInt(nota);
    if (!isNaN(notaNum) && notaNum >= 1 && notaNum <= 10) {
      onSubmit(notaNum, dificultad);
      onClose();
    } else {
      alert("Por favor, ingresá una nota válida entre 1 y 10.");
    }
  };

  const textosDificultad = ['Un paseo', 'Fácil', 'Intermedia', 'Difícil', 'Un infierno'];
  const valorActual = hoveredStar || dificultad;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'var(--overlay-bg)',
      backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10000,
      padding: '20px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      
      {/* 🔥 Estilos para ocultar las flechas nativas del input number 🔥 */}
      <style>{`
        .no-spinners::-webkit-outer-spin-button,
        .no-spinners::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spinners {
          -moz-appearance: textfield;
        }
      `}</style>

      <div style={{
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '30px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative'
      }}>
        
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '15px', right: '15px',
            background: 'transparent', border: 'none',
            color: 'var(--muted)', width: '30px', height: '30px',
            borderRadius: '50%', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', transition: 'color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-strong)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}
        >
          ✕
        </button>

        <h3 style={{ color: 'var(--text-strong)', fontSize: '1.3rem', margin: '0 0 10px 0', paddingRight: '20px' }}>
          Cargar Nota Final
        </h3>
        <p style={{ color: 'var(--cursando)', fontSize: '1rem', margin: '0 0 20px 0', fontWeight: 'bold' }}>
          {materiaName}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>Nota Final (1-10)</label>
            <input 
              type="number" 
              min="1" 
              max="10" 
              placeholder="Ej: 8"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              className="no-spinners"
              style={{ 
                padding: '15px', 
                borderRadius: '12px', 
                border: '1px solid var(--border)', 
                background: 'var(--glass-bg)', 
                color: 'var(--text-strong)', 
                fontSize: '1.2rem',
                textAlign: 'center',
                outline: 'none' 
              }}
              autoFocus
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', background: 'var(--glass-bg)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <label style={{ color: 'var(--text-strong)', fontSize: '0.9rem', fontWeight: 'bold' }}>
              ¿Qué tan difícil te pareció? <span style={{ color: 'var(--muted)', fontWeight: 'normal' }}>(Opcional)</span>
            </label>
            
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = valorActual !== null && valorActual >= star;
                return (
                  <svg 
                    key={star}
                    onClick={() => setDificultad(dificultad === star ? null : star)} 
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(null)}
                    width="32" height="32" viewBox="0 0 24 24" 
                    fill={isActive ? 'var(--cursada)' : 'none'} 
                    stroke={isActive ? 'var(--cursada)' : 'var(--border)'} 
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ 
                      cursor: 'pointer', 
                      transition: 'all 0.15s ease', 
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      filter: isActive ? 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.4))' : 'none'
                    }}
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                );
              })}
            </div>
            
            <span style={{ fontSize: '0.85rem', color: valorActual ? 'var(--cursada)' : 'var(--muted)', fontWeight: 'bold', minHeight: '1.2em' }}>
              {valorActual ? textosDificultad[valorActual - 1] : 'Seleccioná para puntuar'}
            </span>
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '5px' }}>
            Guardar
          </button>
        </form>

      </div>
    </div>
  );
}