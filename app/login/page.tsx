'use client';

import { useState } from 'react';
import { supabase } from '../../src/lib/supabase';

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [carrera, setCarrera] = useState('sistemas');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // El login con Google que ya tenías
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
  };

  // Manejador del formulario de Email/Contraseña
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isRegistering) {
      // 1. Validamos que las contraseñas coincidan
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }
      
      // 2. QUERY DE SUPABASE PARA REGISTRO
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            carrera: carrera // Guardamos la carrera en los metadatos del usuario
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message); // Mostramos el error si el mail ya existe o la pass es débil
      } else {
        // Supabase por defecto pide confirmar el mail. Si la sesión es null, significa que mandó el correo.
        if (data.session) {
          window.location.href = '/'; // Si no pide confirmación, lo mandamos adentro
        } else {
          alert('¡Cuenta creada con éxito! Revisá tu casilla de correo para verificar tu cuenta e iniciar sesión.');
          setIsRegistering(false); // Lo devolvemos a la vista de login
          setPassword('');
          setConfirmPassword('');
        }
      }
      
    } else {
      // 3. QUERY DE SUPABASE PARA INICIAR SESIÓN
      const { error: signInError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (signInError) {
        setError('Credenciales incorrectas o cuenta no verificada');
      } else {
        window.location.href = '/'; // Login exitoso, lo mandamos al Dashboard
      }
    }
    
    setLoading(false);
  };
  return (
    <main style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', width: '100%', padding: '20px' }}>
      
      <div className="modal-box" style={{ width: '100%', maxWidth: '420px', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
        
        <div className="logo" style={{ marginBottom: '10px', fontSize: '1.5rem', textAlign: 'center' }}>
          Mi Estado <span>Académico</span>
        </div>
        
        <h3 style={{ color: 'white', marginBottom: '8px', fontSize: '1.5rem', textAlign: 'center' }}>
          {isRegistering ? 'Creá tu cuenta' : '¡Hola de nuevo!'}
        </h3>
        <p style={{ color: 'var(--muted)', marginBottom: '30px', fontSize: '0.95rem', lineHeight: 1.5, textAlign: 'center' }}>
          {isRegistering 
            ? 'Registrate para guardar tu progreso en la nube.' 
            : 'Iniciá sesión para continuar con tu carrera.'}
        </p>

        {/* --- FORMULARIO DE EMAIL / CONTRASEÑA --- */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
          
          <input 
            type="email" 
            placeholder="Tu correo electrónico" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem', outline: 'none' }}
            required
          />

          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem', outline: 'none' }}
            required
          />

          {isRegistering && (
            <>
              <input 
                type="password" 
                placeholder="Confirmar contraseña" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem', outline: 'none' }}
                required
              />
              
              <div style={{ marginTop: '5px' }}>
                <label style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '8px', display: 'block', marginLeft: '5px' }}>¿Qué carrera estudiás?</label>
                <select 
                  value={carrera}
                  onChange={(e) => setCarrera(e.target.value)}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--panel)', color: 'white', fontSize: '1rem', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="sistemas">Ingeniería en Sistemas</option>
                  <option value="civil">Ingeniería Civil</option>
                  <option value="electrica">Ingeniería Eléctrica</option>
                  <option value="mecanica">Ingeniería Mecánica</option>
                  <option value="quimica">Ingeniería Química</option>
                </select>
              </div>
            </>
          )}

          {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px' }}>{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '1.05rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', marginTop: '10px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Cargando...' : (isRegistering ? 'Registrarme' : 'Ingresar')}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span>o continuá con</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        {/* --- BOTÓN DE GOOGLE --- */}
        <button 
          onClick={handleGoogleLogin} 
          style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '14px', fontSize: '1.05rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', transition: 'background 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          <div style={{ background: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          Google
        </button>
        
        {/* Toggle Registrarse / Login */}
        <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '30px', textAlign: 'center' }}>
          {isRegistering ? '¿Ya tenés una cuenta? ' : '¿No tenés una cuenta? '}
          <button 
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            style={{ background: 'transparent', border: 'none', color: 'var(--cursando)', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            {isRegistering ? 'Iniciá sesión acá' : 'Registrate gratis'}
          </button>
        </div>

      </div>
    </main>
  );
}