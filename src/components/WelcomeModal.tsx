'use client';
import { useState } from 'react';

export default function WelcomeModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [slide, setSlide] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex', opacity: 1 }}>
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
        
        {slide === 3 && (
          <div className="carousel-slide active">
            <h3>☕ Apoyá el Proyecto</h3>
            <p>Por el momento, la única forma de dar una mano para mantener y mejorar el proyecto es con una donación. ¡Toda ayuda suma muchísimo!</p>
          </div>
        )}
        
        <div className="modal-controls" style={{ marginTop: '25px' }}>
          <div className="dots">
            <span className={`dot ${slide === 1 ? 'active' : ''}`}></span>
            <span className={`dot ${slide === 2 ? 'active' : ''}`}></span>
            <span className={`dot ${slide === 3 ? 'active' : ''}`}></span>
          </div>
          <div className="buttons">
            <button className="btn-secondary" style={{ visibility: slide === 1 ? 'hidden' : 'visible' }} onClick={() => setSlide(slide - 1)}>Atrás</button>
            {slide < 3 ? (
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