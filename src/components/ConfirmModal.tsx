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
        
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
          {isDanger ? '⚠️' : '❓'}
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
          >
            {cancelText}
          </button>
          
          <button 
            onClick={onConfirm}
            className={isDanger ? "" : "btn-primary"}
            style={{ 
              flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer',
              background: isDanger ? '#ef4444' : '', color: isDanger ? 'white' : ''
            }}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}