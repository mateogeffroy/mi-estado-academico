'use client';

import { useState, useEffect } from 'react';

interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nota: number) => void;
  materiaName: string;
}

export default function GradeModal({ isOpen, onClose, onSubmit, materiaName }: GradeModalProps) {
  const [nota, setNota] = useState('');

  // Limpiamos el input cada vez que se abre el modal
  useEffect(() => {
    if (isOpen) setNota('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const notaNum = parseInt(nota);
    if (!isNaN(notaNum) && notaNum >= 1 && notaNum <= 10) {
      onSubmit(notaNum);
      onClose();
    } else {
      // Un pequeño feedback visual si ponen cualquier cosa
      alert("Por favor, ingresá una nota válida entre 1 y 10.");
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10000,
      padding: '20px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
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
          onMouseOver={(e) => e.currentTarget.style.color = 'white'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}
        >
          ✕
        </button>

        <h3 style={{ color: 'white', fontSize: '1.3rem', margin: '0 0 10px 0', paddingRight: '20px' }}>
          Cargar Nota Final
        </h3>
        <p style={{ color: 'var(--cursando)', fontSize: '1rem', margin: '0 0 20px 0', fontWeight: 'bold' }}>
          {materiaName}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="number" 
            min="1" 
            max="10" 
            placeholder="Ej: 8"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            style={{ 
              padding: '15px', 
              borderRadius: '12px', 
              border: '1px solid var(--border)', 
              background: 'rgba(0,0,0,0.3)', 
              color: 'white', 
              fontSize: '1.2rem',
              textAlign: 'center',
              outline: 'none' 
            }}
            autoFocus
            required
          />
          <button type="submit" className="btn-primary" style={{ padding: '15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem' }}>
            Guardar Nota
          </button>
        </form>

      </div>
    </div>
  );
}