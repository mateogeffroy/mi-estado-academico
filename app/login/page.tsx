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
        
        setSuccessMsg('¡Cuenta creada con éxito! Revisá tu correo electrónico para confirmar la cuenta.');
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

  return (
    <>
      <style>{`
        /* 🔥 DESTRUIMOS LAS RESTRICCIONES DE GLOBALS.CSS SOLO PARA EL LOGIN 🔥 */
        #login-main {
          padding: 0 !important; 
          margin: 0 !important;
          max-width: 100% !important;
          width: 100vw !important;
          min-height: 100vh !important;
          display: block !important;
        }

        /* ================================================================= */
        /* ESTRUCTURA SPLIT SCREEN (Base Móvil)                              */
        /* ================================================================= */
        
        .split-layout {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 100vh;
        }

        .form-col {
          order: 1; /* En celular el formulario va arriba */
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 20px 40px 20px;
        }
        
        .hero-col {
          order: 2; /* En celular la info va abajo */
          display: flex;
          flex-direction: column;
          padding: 40px 20px 60px 20px;
          background: var(--panel);
          border-top: 1px solid var(--border);
          gap: 30px;
        }

        @media (pointer: coarse) {
          .form-col { padding-top: 8vh; }
        }

        /* --- CLASES DE VISIBILIDAD --- */
        .hero-logo-container { display: none; }
        .form-logo-container { display: flex; width: 100%; }
        .desktop-form-title { display: none !important; }

        /* --- ESTILOS DEL FORMULARIO --- */
        .login-wrapper {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          z-index: 10;
        }

        .login-box {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .auth-form { display: flex; flexDirection: column; gap: 18px; }
        .auth-label { color: var(--muted); font-size: 0.85rem; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }

        .input-field {
          width: 100%; padding: 14px; border-radius: 10px; border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.02); color: white; font-size: 0.95rem; outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .input-field:focus { border-color: var(--cursando); background: rgba(255, 255, 255, 0.05); }

        .auth-submit-btn { padding: 14px; font-size: 1.05rem; border-radius: 10px; font-weight: bold; width: 100%; cursor: pointer; border: none; }

        .auth-google-btn {
          display: flex; align-items: center; justify-content: center; gap: 12px; padding: 12px;
          border-radius: 10px; background: white; color: black; font-weight: bold; font-size: 0.95rem;
          border: none; cursor: pointer; transition: transform 0.2s; width: 100%;
        }
        .auth-google-btn:hover { transform: scale(1.02); }

        /* --- ESTILOS DEL HERO (CHECKLIST Y TEXTOS) --- */
        .hero-subtitle {
          color: var(--text);
          font-size: 1.1rem;
          line-height: 1.6;
        }
        .hero-checklist {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 0;
        }
        .hero-checklist li {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          color: var(--text);
          font-size: 1rem;
          line-height: 1.5;
        }
        .check-icon {
          color: var(--cursando);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .badge-carrera {
          display: inline-flex;
          background: rgba(59, 130, 246, 0.1);
          color: var(--cursando);
          padding: 10px 16px;
          border-radius: 12px;
          font-weight: bold;
          font-size: 0.85rem;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          width: fit-content;
        }

        .responsive-title {
          margin-bottom: 5px;
          line-height: 1;
          letter-spacing: -0.5px;
          font-size: clamp(1.1rem, 6.5vw, 2.4rem); 
        }

        /* ================================================================= */
        /* ESCRITORIO (60/40 Split Screen Fijo sin Scroll)                   */
        /* ================================================================= */
        @media (min-width: 1025px) {
          .split-layout {
            flex-direction: row !important;
            height: 100vh;
          }

          /* HERO A LA IZQUIERDA (60%) */
          .hero-col {
            order: 1;
            flex: 0 0 60%;
            max-width: 60%;
            height: 100vh;
            padding: 60px 6vw;
            background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.08) 0%, transparent 50%), var(--panel);
            border-right: 1px solid var(--border);
            border-top: none;
            justify-content: center;
            overflow-y: auto;
          }

          /* FORMULARIO A LA DERECHA (40%) */
          .form-col {
            order: 2;
            flex: 0 0 40%;
            max-width: 40%;
            height: 100vh;
            padding: 40px;
            justify-content: center;
            background: var(--bg);
          }

          /* Intercambio de Logos */
          .hero-logo-container { display: flex; flex-direction: column; align-items: flex-start; }
          .form-logo-container { display: none !important; }
          .desktop-form-title { display: flex !important; }

          .login-wrapper { max-width: 450px; }
          .login-box { padding: 40px 32px; gap: 24px; }
          .auth-form { gap: 24px; }
          
          .hero-subtitle { font-size: 1.3rem; margin-top: 20px; max-width: 90%; }
          .hero-checklist li { font-size: 1.1rem; }
          
          .responsive-title { font-size: 3.5rem; }
        }

        /* Ajustes menores para Notebooks bajitas */
        @media (min-width: 1025px) and (max-height: 800px) {
          .hero-col { padding: 30px 4vw; gap: 20px; }
          .login-box { padding: 30px 24px; gap: 18px; }
          .auth-form { gap: 18px; }
          .responsive-title { font-size: 2.8rem; }
          .hero-subtitle { font-size: 1.1rem; }
          .hero-checklist li { font-size: 1rem; }
        }
      `}</style>

      <main id="login-main">
        
        <div className="split-layout">
          
          {/* ========================================================= */}
          {/* COLUMNA 1: FORMULARIO DE LOGIN                            */}
          {/* ========================================================= */}
          <section className="form-col">
            <div className="login-wrapper">
              
              <div style={{ textAlign: 'center', marginBottom: '24px', width: '100%' }}>
                
                {/* --- LOGO EN MÓVIL --- */}
                <div className="form-logo-container" style={{ flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px, 3vw, 20px)', width: '100%' }}>
                    <img src="/icon.png" alt="Logo Mi Estado Académico" style={{ width: 'clamp(40px, 10vw, 75px)', height: 'clamp(40px, 10vw, 75px)', objectFit: 'contain', flexShrink: 0 }} />
                    
                    <h1 className="logo responsive-title" style={{ margin: 0, display: 'inline-flex', flexDirection: 'column', textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontSize: '0.42em', lineHeight: 1, padding: '0 0.05em' }}>
                        <span>MI</span><span>ESTADO</span>
                      </div>
                      <span style={{ color: 'var(--cursando)', whiteSpace: 'nowrap' }}>ACADÉMICO</span>
                    </h1>
                  </div>

                  <p style={{ color: 'var(--muted)', fontSize: '1.05rem', margin: '14px 0 0 0', fontWeight: 500 }}>
                    {isLogin ? 'Bienvenido de vuelta' : 'Creá tu cuenta para empezar'}
                  </p>
                </div>

                {/* --- TÍTULO EN ESCRITORIO --- */}
                <div className="desktop-form-title" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '8px', fontWeight: 'bold' }}>
                    {isLogin ? '¡Bienvenido!' : '¡Creá tu cuenta!'}
                  </h2>
                  <p style={{ color: 'var(--muted)', fontSize: '1.05rem', margin: 0 }}>
                    {isLogin ? 'Ingresá tus credenciales para acceder' : 'Registrate y organizá tu carrera'}
                  </p>
                </div>

              </div>

              <div className="login-box">
                {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '14px', borderRadius: '10px', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}
                {successMsg && <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '14px', borderRadius: '10px', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>{successMsg}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label className="auth-label">Correo Electrónico</label>
                    <input 
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="alumno@frlp.utn.edu.ar"
                      className="input-field"
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label className="auth-label">Contraseña</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input 
                        type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-field"
                        style={{ paddingRight: '50px' }}
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {showPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label className="auth-label">Confirmar Contraseña</label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input 
                          type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="input-field"
                          style={{ paddingRight: '50px' }}
                          required
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '15px', background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {showConfirmPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {!isLogin && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '2px', fontWeight: 'bold' }}>Requisitos de tu contraseña:</span>
                      {requirements.map((req, idx) => {
                        const isMet = req.test(password, confirmPassword);
                        return (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: isMet ? 'white' : 'var(--muted)' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: isMet ? '#10b981' : 'transparent', border: `1px solid ${isMet ? '#10b981' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {isMet && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                            </div>
                            {req.label}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn-primary auth-submit-btn" 
                    disabled={loading || (!isLogin && !isPasswordValid)} 
                    style={{ opacity: (loading || (!isLogin && !isPasswordValid)) ? 0.5 : 1, cursor: (loading || (!isLogin && !isPasswordValid)) ? 'not-allowed' : 'pointer' }}
                  >
                    {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
                  </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                  <span style={{ color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>O ingresá con</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                </div>

                <button 
                  onClick={handleGoogleLogin} 
                  type="button"
                  className="auth-google-btn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continuar con Google
                </button>

                <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--muted)' }}>
                  {isLogin ? '¿No tenés una cuenta? ' : '¿Ya tenés una cuenta? '}
                  <button onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); setPassword(''); setConfirmPassword(''); }} style={{ background: 'transparent', border: 'none', color: 'var(--cursando)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>
                    {isLogin ? 'Registrate acá' : 'Iniciá sesión'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* COLUMNA 2: HERO / INFO CARDS                              */}
          {/* ========================================================= */}
          <section className="hero-col">
            
            <div className="hero-logo-container">
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
                <img src="/icon.png" alt="Logo" style={{ width: '60px', height: '60px', objectFit: 'contain', flexShrink: 0 }} />
                <h1 className="logo responsive-title" style={{ margin: 0, display: 'inline-flex', flexDirection: 'column', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontSize: '0.42em', lineHeight: 1, padding: '0 0.05em' }}>
                    <span>MI</span><span>ESTADO</span>
                  </div>
                  <span style={{ color: 'var(--cursando)', lineHeight: 1 }}>ACADÉMICO</span>
                </h1>
              </div>
              <p className="hero-subtitle">
                Gestión inteligente, trazabilidad absoluta y control total de tu carrera académica.
              </p>
            </div>

            <ul className="hero-checklist">
              <li>
                <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span><strong>Plan de Estudios Dinámico:</strong> Visualizá tu plan, correlatividades claras y marcá materias aprobadas o en curso.</span>
              </li>
              <li>
                <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span><strong>Seguimiento de Promedio:</strong> Calculá tu promedio analítico exacto cargando las notas finales de tus materias.</span>
              </li>
              <li>
                <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span><strong>Gestión de Cursada:</strong> Agendá eventos, parciales y organizá tus horarios seleccionando comisiones reales.</span>
              </li>
            </ul>

            <div style={{ marginTop: 'auto', paddingTop: '30px' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '10px' }}>
                Carreras Disponibles
              </p>
              <div className="badge-carrera">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                Ingeniería en Sistemas - UTN FRLP
              </div>
            </div>

          </section>

        </div>
      </main>
    </>
  );
}