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

  // Las 5 slides con tu contenido exacto
  const slides = [
    {
      icon: '🌐',
      title: 'Nuevo dominio oficial',
      content: (
        <>Nos despedimos del viejo link <i>plan-estudios-dinamico.vercel.app</i> y nos mudamos definitivamente a <strong>miestadoacademico.com.ar</strong>.<br/><br/>¡Mucho más profesional y fácil de compartir!</>
      )
    },
    {
      icon: '🗺️',
      title: 'Ubicación del Plan',
      content: (
        <>El Plan de Estudios Académico tiene su propia sección exclusiva.<br/><br/>Podés acceder a él fácilmente usando los botones del menú principal en el <strong>Home</strong> o desde el botón en la barra de navegación superior.</>
      )
    },
    {
      icon: '🎒',
      title: 'Nueva sección "Cursada"',
      content: (
        <>Para usar esta sección, primero tenés que ir al Plan y marcar las materias que estás cursando.<br/><br/><strong style={{ color: '#ef4444' }}>¡Importante!</strong> La app aún no detecta cuatrimestres, así que asegurate de marcar <strong>SÓLO</strong> las materias que vas a cursar en este momento para que no se mezclen los datos.</>
      )
    },
    {
      icon: '🕒',
      title: 'Comisiones y Horarios',
      content: (
        <>Una vez que tengas tus materias en la sección Cursada, vas a poder elegir la <strong>comisión</strong> a la que te anotaste.<br/><br/>Esto te armará la grilla de horarios automáticamente y habilitará el registro de exámenes, trabajos prácticos y más.</>
      )
    },
    {
      icon: '❤️',
      title: '¡Gracias por el apoyo!',
      content: (
        <>Si tenés alguna sugerencia, idea o encontrás algún error, no dudes en comunicarte a mi correo:<br/><br/><strong style={{ color: 'var(--cursando)' }}>mateogeffroy.dev@gmail.com</strong><br/><br/>¡Seguiré trabajando a full para traerles más mejoras y actualizaciones!</>
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
        minHeight: '400px' // Mantenemos una altura fija para que no salte al cambiar de slide
      }}>
        
        {/* Contenido de la Slide Actual */}
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '15px', animation: 'fadeIn 0.5s ease-out' }}>
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
              style={{ flex: 1, padding: '15px', fontSize: '1rem', borderRadius: '12px', background: 'transparent', border: '1px solid var(--border)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Atrás
            </button>
          )}
          
          {step < slides.length - 1 ? (
            <button 
              onClick={nextStep}
              className="btn-primary"
              style={{ flex: step === 0 ? '1' : '2', padding: '15px', fontSize: '1rem', borderRadius: '12px', fontWeight: 'bold' }}
            >
              Siguiente
            </button>
          ) : (
            <button 
              onClick={handleClose}
              className="btn-primary"
              style={{ flex: 2, padding: '15px', fontSize: '1rem', borderRadius: '12px', fontWeight: 'bold', background: '#10b981', color: '#000' }} // Verde para el final
            >
              ¡Entendido, a trackear! 🚀
            </button>
          )}
        </div>

      </div>
    </div>
  );
}