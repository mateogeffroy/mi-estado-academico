'use client';

import { useState, useEffect } from 'react';

export default function AnnouncementModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Actualizamos la versión a v2.0 para forzar que aparezca de nuevo con los cambios
    const hasSeenAnnouncement = localStorage.getItem('hasSeenWelcome_v2.0');
    
    if (!hasSeenAnnouncement) {
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenWelcome_v2.0', 'true');
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  // Las 5 slides con íconos SVG modernos
  const slides = [
    {
      icon: (
        <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', color: 'var(--cursando)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
      ),
      title: 'Nuevo dominio oficial',
      content: (
        <>Nos despedimos del viejo link <i style={{ opacity: 0.8 }}>(plan-estudios-dinamico.vercel.app)</i> y nos mudamos definitivamente a <strong style={{ color: 'white' }}>miestadoacademico.com.ar</strong>.</>
      )
    },
    {
      icon: (
        <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', color: '#22c55e' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
        </div>
      ),
      title: 'Ubicación del Plan',
      content: (
        <>El Plan de Estudios Dinámico tiene una sección aparte.<br/><br/>Podés acceder a él fácilmente usando los botones del menú principal o desde el botón en la barra de navegación superior.</>
      )
    },
    {
      icon: (
        <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', color: '#ef4444' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/></svg>
        </div>
      ),
      title: 'Nueva sección "Cursada"',
      content: (
        <>Para usar esta sección, primero tenés que ir al Plan y marcar las materias que estás cursando.<br/><br/><strong style={{ color: '#ef4444' }}>¡Importante!</strong> La app aún no detecta cuatrimestres, estoy trabajando en eso, así que asegurate de marcar <strong style={{ color: 'white' }}>SÓLO</strong> las materias que vas a cursar en este momento para que no se mezclen los datos.</>
      )
    },
    {
      icon: (
        <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '50%', color: '#eab308' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
      ),
      title: 'Comisiones y Horarios',
      content: (
        <>Una vez que tengas tus materias en la sección Cursada, vas a poder elegir la <strong style={{ color: 'white' }}>comisión</strong> a la que te anotaste.<br/><br/>Esto te armará la grilla de horarios automáticamente y habilitará el registro de exámenes, trabajos prácticos y más.</>
      )
    },
    {
      icon: (
        <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '50%', color: '#ec4899' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </div>
      ),
      title: '¡Gracias por el apoyo!',
      content: (
        <>Si tenés alguna sugerencia, idea o encontrás algún error, no dudes en comunicarte a mi correo:<br/><br/><strong style={{ color: 'var(--cursando)' }}>mateogeffroy.dev@gmail.com</strong><br/><br/>¡Seguiré trabajando traerles más mejoras y actualizaciones!</>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      opacity: isOpen ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out'
    }}>
      <div style={{
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '420px' // Mantenemos una altura fija para que no salte al cambiar de slide
      }}>
        
        {/* Contenido de la Slide Actual */}
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '20px', animation: 'fadeIn 0.5s ease-out' }}>
            {slides[step].icon}
          </div>
          <h2 style={{ color: 'white', fontSize: '1.6rem', margin: '0 0 15px 0' }}>
            {slides[step].title}
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.6', margin: 0 }}>
            {slides[step].content}
          </p>
        </div>

        {/* Indicadores (Puntitos) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '30px 0' }}>
          {slides.map((_, index) => (
            <div 
              key={index} 
              style={{ 
                width: '10px', height: '10px', borderRadius: '50%', 
                background: step === index ? 'var(--cursando)' : 'rgba(255, 255, 255, 0.2)',
                transition: 'background 0.3s ease'
              }} 
            />
          ))}
        </div>

        {/* Botones de Navegación */}
        <div style={{ display: 'flex', gap: '15px' }}>
          {step > 0 && (
            <button 
              onClick={prevStep}
              style={{ flex: 1, padding: '15px', fontSize: '1rem', borderRadius: '12px', background: 'transparent', border: '1px solid var(--border)', color: 'white', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Atrás
            </button>
          )}
          
          {step < slides.length - 1 ? (
            <button 
              onClick={nextStep}
              className="btn-primary"
              style={{ flex: step === 0 ? '1' : '2', padding: '15px', fontSize: '1rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}
            >
              Siguiente
            </button>
          ) : (
            <button 
              onClick={handleClose}
              style={{ flex: 2, padding: '15px', fontSize: '1rem', borderRadius: '12px', fontWeight: 'bold', background: '#10b981', color: '#000', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
              onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
            >
              ¡Entendido!
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}