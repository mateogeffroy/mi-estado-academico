'use client';

import React, { useState, useEffect } from 'react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 4;

  if (!isOpen) return null;

  const slides = [
    {
      title: "¡Hay Novedades!",
      desc: "Actualizamos el sistema con funcionalidades clave para organizar tu cursada.",
      icon: "🚀"
    },
    {
      title: "Multicarrera",
      desc: "Ahora podés gestionar 2 o más planes en simultáneo. Agregalos entrando a tu **\"Mi Perfil\"**.",
      icon: "📚"
    },
    {
      title: "Horario Inteligente",
      desc: "La grilla ahora se adapta a la semana actual. El calendario mensual sigue disponible en el botón 📅.",
      icon: "⏰"
    },
    {
      title: "¡Tu opinión cuenta!",
      desc: "¿Encontraste un error o tenés una idea? Usá el botón **\"Dejanos tu opinión\"** al final de la página.",
      icon: "💬"
    }
  ];

  const handleNext = () => {
    if (currentSlide < totalSlides) setCurrentSlide(prev => prev + 1);
    else {
      localStorage.setItem('mea_update_v4', 'true');
      onClose();
    }
  };

  const handleBack = () => {
    if (currentSlide > 1) setCurrentSlide(prev => prev - 1);
  };

  return (
    <div className="wm-overlay" onClick={onClose}>
      <style>{`
        .wm-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.3s ease; }
        .wm-card { background: var(--panel); border: 1px solid var(--border); border-radius: 24px; width: 100%; max-width: 400px; padding: 40px 30px; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.5); text-align: center; display: flex; flex-direction: column; gap: 20px; }
        .wm-icon { font-size: 3rem; margin-bottom: 10px; }
        .wm-title { color: var(--text-strong); font-size: 1.6rem; font-weight: 800; line-height: 1.2; }
        .wm-desc { color: var(--text); font-size: 1rem; line-height: 1.5; }
        .wm-desc strong { color: var(--cursando); }
        .wm-dots { display: flex; justify-content: center; gap: 8px; margin: 10px 0; }
        .wm-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); transition: 0.3s; }
        .wm-dot.active { background: var(--cursando); width: 24px; border-radius: 10px; }
        .wm-footer { display: flex; gap: 12px; margin-top: 10px; }
        .wm-btn { flex: 1; padding: 14px; border-radius: 12px; font-weight: bold; cursor: pointer; transition: 0.3s; }
        .wm-btn-next { background: var(--cursando); color: black; }
        .wm-btn-back { background: var(--glass-bg); color: var(--text); border: 1px solid var(--border); }
      `}</style>
      
      <div className="wm-card" onClick={e => e.stopPropagation()}>
        <div className="wm-icon">{slides[currentSlide - 1].icon}</div>
        <h2 className="wm-title">{slides[currentSlide - 1].title}</h2>
        <p className="wm-desc" dangerouslySetInnerHTML={{ 
          __html: slides[currentSlide - 1].desc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
        }} />
        
        <div className="wm-dots">
          {slides.map((_, i) => (
            <div key={i} className={`wm-dot ${currentSlide === i + 1 ? 'active' : ''}`} />
          ))}
        </div>

        <div className="wm-footer">
          {currentSlide > 1 && (
            <button className="wm-btn wm-btn-back" onClick={handleBack}>Atrás</button>
          )}
          <button className="wm-btn wm-btn-next" onClick={handleNext}>
            {currentSlide === totalSlides ? "¡Entendido!" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}