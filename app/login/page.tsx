'use client';

import { supabase } from '../../src/lib/supabase';

export default function Login() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  };

  return (
    // Centrado absoluto perfecto con Grid
    <main style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', width: '100%', padding: '20px' }}>
      
      <div className="modal-box" style={{ textAlign: 'center', width: '100%', maxWidth: '420px', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="logo" style={{ marginBottom: '15px', fontSize: '1.5rem' }}>
          Plan de estudios <span>dinámico</span>
        </div>
        <h3 style={{ color: 'white', marginBottom: '8px', fontSize: '1.5rem' }}>¡Hola de nuevo!</h3>
        <p style={{ color: 'var(--muted)', marginBottom: '30px', fontSize: '0.95rem', lineHeight: 1.5 }}>
          Iniciá sesión para guardar tu progreso en la nube y acceder desde cualquier dispositivo.
        </p>
        
        <button 
          className="btn-primary" 
          onClick={handleLogin} 
          style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '14px', fontSize: '1.05rem', marginBottom: '20px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s' }}
        >
          <div style={{ background: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          Continuar con Google
        </button>
        
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', padding: '15px 0', lineHeight: 1.5 }}>
          Si no dispones de una cuenta de Google, podés enviarme un mail a 
          <b style={{ color: 'var(--text)' }}> mateogeffroy.dev@gmail.com</b>.
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', marginTop: '5px', lineHeight: 1.5 }}>
          Para apoyar el mantenimiento de este proyecto gratuito, considerá invitarme a un cafecito.
        </div>
      </div>
    </main>
  );
}