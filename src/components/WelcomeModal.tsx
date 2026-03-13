'use client';
import { useState } from 'react';

export default function WelcomeModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [slide, setSlide] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ 
      display: 'flex', 
      opacity: 1, 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      backgroundColor: 'rgba(0, 0, 0, 0.85)', 
      zIndex: 9999, 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div className="modal-box">
        {slide === 1 && (
          <div className="carousel-slide active">
            <h3>👋 ¡Bienvenido!</h3>
            <p>Esta herramienta fue creada momentáneamente para el plan de estudios 2023 de <b>Ingeniería en Sistemas de Información</b>. Si bien por ahora es la única disponible, no se descarta ampliar la web a otras carreras en el futuro.</p>
          </div>
        )}

        {slide === 2 && (
          <div className="carousel-slide active">
            <h3>🎮 ¿Cómo se usa?</h3>
            <div className="instruction-desktop">
              <p>Usá el <b>Click Izquierdo</b> sobre una materia para marcarla como <b>Aprobada</b> ✅.</p>
              <p>Usá el <b>Click Derecho</b> para marcarla como <b>Cursada</b> 📖.</p>
              <video src="/instruccion-desktop.mp4" autoPlay loop muted playsInline style={{ width: '100%', borderRadius: '6px', border: '1px dashed var(--muted)', marginTop: '15px' }}></video>
            </div>
            <div className="instruction-mobile">
              <p>Simplemente <b>tocá una materia</b> para desplegar el menú de opciones y seleccionar si está Aprobada ✅ o Cursada 📖.</p>
              <video src="/instruccion-mobile.mp4" autoPlay loop muted playsInline style={{ width: '100%', borderRadius: '6px', border: '1px dashed var(--muted)', marginTop: '15px' }}></video>
            </div>
          </div>
        )}
        
        <div className="modal-controls" style={{ marginTop: '25px' }}>
          <div className="dots">
            <span className={`dot ${slide === 1 ? 'active' : ''}`}></span>
            <span className={`dot ${slide === 2 ? 'active' : ''}`}></span>
          </div>
          <div className="buttons">
            <button className="btn-secondary" style={{ visibility: slide === 1 ? 'hidden' : 'visible' }} onClick={() => setSlide(slide - 1)}>Atrás</button>
            {slide < 2 ? (
              <button className="btn-primary" onClick={() => setSlide(slide + 1)}>Siguiente</button>
            ) : (
              <button className="btn-primary" onClick={() => { setSlide(1); onClose(); }}>¡Empezar!</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}