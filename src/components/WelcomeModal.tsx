'use client';

export default function WelcomeModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10000, // Z-index altísimo para que nada lo pise
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '550px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        
        {/* Botón de cerrar (X) en la esquina */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '20px', right: '20px',
            background: 'rgba(255,255,255,0.1)', border: 'none',
            color: 'white', width: '32px', height: '32px',
            borderRadius: '50%', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          ✕
        </button>

        <h2 style={{ color: 'white', fontSize: '1.6rem', marginBottom: '20px', marginTop: 0 }}>
          ¿Cómo usar el Plan de Estudios?
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
          <p style={{ margin: 0 }}>
            Simplemente tocá una materia para cambiar su estado:
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
            <span style={{ fontSize: '1.2rem' }}>🖱️</span>
            <span><strong>Click Izquierdo:</strong> Marca la materia como <span style={{ color: '#10b981', fontWeight: 'bold' }}>Aprobada</span> (o la devuelve a Disponible).</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
            <span style={{ fontSize: '1.2rem' }}>🖱️</span>
            <span><strong>Click Derecho:</strong> Alterna entre <span style={{ color: 'var(--cursando)', fontWeight: 'bold' }}>Cursando</span> y <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Cursada</span>.</span>
          </div>

          <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: 'var(--muted)' }}>
            Las materias bloqueadas (🔒) se habilitarán automáticamente cuando apruebes o curses sus correlativas correspondientes.
          </p>
        </div>

        <button 
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%', padding: '12px', fontSize: '1rem', borderRadius: '12px', fontWeight: 'bold', marginTop: '30px' }}
        >
          Entendido
        </button>

      </div>
    </div>
  );
}