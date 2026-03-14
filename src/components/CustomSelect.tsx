'use client';

import { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function CustomSelect({ value, options, onChange }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Este useEffect es un clásico: escucha los clics en toda la pantalla 
  // y si hacés clic afuera del componente, lo cierra.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', minWidth: '180px', flex: 1 }}>
      {/* El botón principal que muestra el valor seleccionado */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          padding: '12px 15px', 
          borderRadius: '8px', 
          border: `1px solid ${isOpen ? 'var(--cursando)' : 'var(--border)'}`, 
          background: 'var(--panel)', 
          color: 'white', 
          cursor: 'pointer', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          transition: 'all 0.2s ease',
          userSelect: 'none'
        }}
      >
        <span>{value}</span>
        <span style={{ 
          fontSize: '0.8rem', 
          color: 'var(--muted)',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
          transition: 'transform 0.3s ease' 
        }}>
          ▼
        </span>
      </div>

      {/* La lista desplegable de opciones */}
      {isOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0, 
          marginTop: '8px', 
          background: 'var(--panel)', 
          border: '1px solid var(--border)', 
          borderRadius: '8px', 
          overflow: 'hidden', 
          zIndex: 50, // Lo ponemos bien arriba para que no lo tape nada abajo
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.15s ease-out'
        }}>
          {options.map((opt) => (
            <div 
              key={opt} 
              onClick={() => { 
                onChange(opt); 
                setIsOpen(false); 
              }}
              style={{ 
                padding: '12px 15px', 
                cursor: 'pointer', 
                transition: 'background 0.2s', 
                background: value === opt ? 'rgba(59, 130, 246, 0.1)' : 'transparent', 
                color: value === opt ? 'var(--cursando)' : 'white',
                fontWeight: value === opt ? 'bold' : 'normal'
              }}
              onMouseOver={(e) => {
                if (value !== opt) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseOut={(e) => {
                if (value !== opt) e.currentTarget.style.background = 'transparent';
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}