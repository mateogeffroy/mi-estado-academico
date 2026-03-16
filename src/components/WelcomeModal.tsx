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
        
        {/* Botón de cerrar (X) a prueba de balas */}
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
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
          <p style={{ margin: 0 }}>
            Simplemente tocá una materia para cambiar su estado:
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

          <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: 'var(--muted)' }}>
            Las materias bloqueadas (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'text-bottom' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>) se habilitarán automáticamente cuando apruebes o curses sus correlativas correspondientes.
          </p>
        </div>

        <button 
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%', padding: '12px', fontSize: '1rem', borderRadius: '12px', fontWeight: 'bold', marginTop: '30px', border: 'none', cursor: 'pointer' }}
        >
          Entendido
        </button>

      </div>
    </div>
  );
}