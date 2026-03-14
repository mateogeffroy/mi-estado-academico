'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../src/lib/supabase';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const requirements = [
    { test: (p: string) => p.length >= 8 && p.length <= 16, label: 'Entre 8 y 16 caracteres' },
    { test: (p: string) => /[A-Z]/.test(p), label: 'Una letra mayúscula' },
    { test: (p: string) => /[a-z]/.test(p), label: 'Una letra minúscula' },
    { test: (p: string) => /[0-9]/.test(p), label: 'Un número' },
    { test: (p: string, cp: string) => p === cp && p.length > 0, label: 'Las contraseñas coinciden' }
  ];

  const isPasswordValid = requirements.every(req => req.test(password, confirmPassword));

  // --- LOGIN TRADICIONAL ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!isLogin && !isPasswordValid) {
      setError('Por favor, asegurate de cumplir todos los requisitos de la contraseña.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/'); 
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        setSuccessMsg('¡Cuenta creada con éxito! Ya podés iniciar sesión.');
        setIsLogin(true); 
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIN CON GOOGLE ---
  const handleGoogleLogin = async () => {
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback` 
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google.');
    }
  };

  // Función para scrollear a la info
  const scrollToInfo = () => {
    document.getElementById('info-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        .scroll-arrow {
          animation: bounce 2s infinite;
        }
      `}</style>

      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* ========================================================= */}
        {/* SECCIÓN 1: EL LOGIN (Pantalla completa)                     */}
        {/* ========================================================= */}
        <section style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', // Centrado perfecto con Flexbox
          padding: '15px', 
          boxSizing: 'border-box',
          position: 'relative'
        }}>
          
          <div style={{
            background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '24px',
            padding: 'clamp(20px, 5vw, 40px)', 
            maxWidth: '550px', width: '100%',
            boxSizing: 'border-box',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 10
            // Eliminamos marginTop y marginBottom 'auto' para que justifyContent se encargue del centrado
          }}>
            
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <h1 className="logo" style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', marginBottom: '10px', lineHeight: '1.1' }}>
                <span style={{ color: 'white' }}>Mi Estado</span><br />
                <span style={{ color: 'var(--cursando)' }}>Académico</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', margin: 0 }}>
                {isLogin ? 'Bienvenido de vuelta, futuro colega.' : 'Creá tu cuenta para empezar a trackear.'}
              </p>
            </div>

            {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
            {successMsg && <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center' }}>{successMsg}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>Correo Electrónico</label>
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="alumno@frlp.utn.edu.ar"
                  style={{ padding: '15px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'white', fontSize: '1rem', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>Contraseña</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '15px', paddingRight: '50px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'white', fontSize: '1rem', outline: 'none' }}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>Confirmar Contraseña</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ width: '100%', boxSizing: 'border-box', padding: '15px', paddingRight: '50px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'white', fontSize: '1rem', outline: 'none' }}
                      required
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '15px', background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
                      {showConfirmPassword ? '👁️' : '🙈'}
                    </button>
                  </div>
                </div>
              )}

              {!isLogin && (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '4px', fontWeight: 'bold' }}>Requisitos de tu contraseña:</span>
                  {requirements.map((req, idx) => {
                    const isMet = req.test(password, confirmPassword);
                    return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: isMet ? 'white' : 'var(--muted)' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: isMet ? '#10b981' : 'transparent', border: `1px solid ${isMet ? '#10b981' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {isMet && <span style={{ color: 'black', fontSize: '10px' }}>✓</span>}
                        </div>
                        {req.label}
                      </div>
                    );
                  })}
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={loading || (!isLogin && !isPasswordValid)} style={{ padding: '16px', fontSize: '1.1rem', borderRadius: '12px', fontWeight: 'bold', opacity: (loading || (!isLogin && !isPasswordValid)) ? 0.5 : 1, cursor: (loading || (!isLogin && !isPasswordValid)) ? 'not-allowed' : 'pointer', width: '100%', boxSizing: 'border-box' }}>
                {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
              <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>o</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            </div>

            <button 
              onClick={handleGoogleLogin} 
              type="button"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', borderRadius: '12px', background: 'white', color: 'black', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', width: '100%', boxSizing: 'border-box' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuar con Google
            </button>

            <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.95rem', color: 'var(--muted)' }}>
              {isLogin ? '¿No tenés una cuenta? ' : '¿Ya tenés una cuenta? '}
              <button onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); setPassword(''); setConfirmPassword(''); }} style={{ background: 'transparent', border: 'none', color: 'var(--cursando)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>
                {isLogin ? 'Registrate acá' : 'Iniciá sesión'}
              </button>
            </div>
          </div>

          {/* 🔥 SOLUCIÓN: Posición absoluta para que no empuje el formulario hacia arriba */}
          <div 
            onClick={scrollToInfo}
            className="scroll-arrow"
            style={{ 
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              cursor: 'pointer', 
              color: 'var(--muted)', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '5px' 
            }}
          >
            <span style={{ fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Descubrí más</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>

        </section>

        {/* ========================================================= */}
        {/* SECCIÓN 2: INFORMACIÓN (Landing Page)                       */}
        {/* ========================================================= */}
        <div style={{marginBottom: '120px', width: '100%', boxSizing: 'border-box'}}> 
          <section id="info-section" style={{ padding: '30px 15px', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', color: 'white', marginBottom: '15px' }}>¿Qué podés hacer acá?</h2>
            <p style={{ color: 'var(--muted)', fontSize: 'clamp(1rem, 3vw, 1.2rem)', lineHeight: '1.6' }}>
              Mi Estado Académico es la herramienta definitiva para que los estudiantes organizen su carrera sin volverse locos con excels o PDFs desactualizados.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px', maxWidth: '1100px', width: '100%', boxSizing: 'border-box' }}>
            
            <div style={{ background: 'var(--panel)', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🗺️</div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>Plan de Estudios Dinámico</h3>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.6' }}>
                Podés visualizar en tiempo real el estado de tu plan pudiendo marcar las materias como aprobadas, cursadas y cursando. A medida que se completa se van desbloqueando las materias disponibles.
              </p>
            </div>

            <div style={{ background: 'var(--panel)', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📈</div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>Seguimiento de Promedio y Progreso</h3>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.6' }}>
                Podés visualizar el promedio rellenando en la tabla de materias aprobadas las notas finales de las materias.
              </p>
            </div>

            <div style={{ background: 'var(--panel)', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📅</div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>Cursada</h3>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.6' }}>
                Podés seleccionar las comisiones de cursada por cada materia que se encuentre en el estado "cursando" y se plasman los horarios en la página de cursada. A su vez, se pueden agendar eventos que se ven en un calendario.
              </p>
            </div>

          </div>
        </section>
        </div>
      </main>
    </>
  );
}