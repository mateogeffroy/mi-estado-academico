'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean; // Si es true, el botón de confirmar se pone rojo
}

export default function ConfirmModal({ 
  isOpen, title, message, confirmText = "Confirmar", cancelText = "Cancelar", 
  onConfirm, onCancel, isDanger = false 
}: ConfirmModalProps) {
  
  if (!isOpen) return null;

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
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        textAlign: 'center'
      }}>
        
        {/* --- ÍCONOS SVG MINIMALISTAS --- */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          {isDanger ? (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="rgba(234, 179, 8, 0.1)" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ) : (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="rgba(59, 130, 246, 0.1)" stroke="var(--cursando)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          )}
        </div>
        
        <h3 style={{ color: 'white', fontSize: '1.4rem', margin: '0 0 15px 0' }}>
          {title}
        </h3>
        
        <div style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.5', marginBottom: '30px' }}>
          {message}
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={onCancel}
            style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'transparent', border: '1px solid var(--border)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            {cancelText}
          </button>
          
          <button 
            onClick={onConfirm}
            className={isDanger ? "" : "btn-primary"}
            style={{ 
              flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer',
              background: isDanger ? '#ef4444' : '', color: isDanger ? 'white' : '',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => { if (isDanger) e.currentTarget.style.background = '#dc2626' }}
            onMouseOut={(e) => { if (isDanger) e.currentTarget.style.background = '#ef4444' }}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}