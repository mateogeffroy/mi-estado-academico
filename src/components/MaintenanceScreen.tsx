// src/components/MaintenanceScreen.tsx
'use client';

export default function MaintenanceScreen() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      padding: '20px',
      textAlign: 'center',
      background: 'var(--bg, #111)', // Usa tu variable de fondo si existe
      color: 'white'
    }}>
      <div style={{
        background: 'var(--panel, #1e1e1e)',
        padding: '40px',
        borderRadius: '24px',
        border: '1px solid var(--border, #333)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        maxWidth: '450px',
        width: '100%'
      }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '20px' }}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '15px' }}>
          Servidores en Mantenimiento
        </h1>
        
        <p style={{ color: 'var(--muted, #a3a3a3)', marginBottom: '30px', fontSize: '1rem', lineHeight: '1.5' }}>
          Estamos experimentando intermitencias con nuestra base de datos o aplicando mejoras en el sistema. Volveremos a estar en línea en unos minutos.
        </p>

        <button 
          onClick={handleReload}
          className="btn-primary"
          style={{ 
            padding: '12px 24px', 
            borderRadius: '12px', 
            fontSize: '1rem', 
            fontWeight: 'bold',
            width: '100%'
          }}
        >
          Reintentar conexión
        </button>
      </div>
    </div>
  );
}