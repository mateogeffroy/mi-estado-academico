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

        /* --- ESTILOS BASE COMPARTIDOS --- */
        .login-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          box-sizing: border-box;
        }
        .login-box {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 24px;
          width: 100%;
          max-width: 550px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          gap: 20px;
          z-index: 10;
          box-sizing: border-box;
        }
        .input-field {
          width: 100%;
          box-sizing: border-box;
          padding: 15px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: white;
          font-size: 1rem;
          outline: none;
        }
        .arrow-container {
          cursor: pointer;
          color: var(--muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }
        .responsive-title {
          margin-bottom: 10px;
          line-height: 1.1;
        }

        /* --- ESTILOS PARA PC --- */
        @media (min-width: 769px) {
          .login-section {
            justify-content: center;
            padding: 20px;
          }
          .login-box {
            padding: 40px;
            margin-top: auto;
            margin-bottom: auto;
          }
          .responsive-title {
            font-size: 2.5rem;
          }
          .arrow-container {
            margin-top: auto;
            padding-bottom: 80px;
          }
        }

        /* --- ESTILOS PARA CELULAR --- */
        @media (max-width: 768px) {
          .login-section {
            justify-content: flex-start;
            padding: 30px 15px 15px 15px; 
          }
          .login-box {
            padding: 25px 15px;
            margin-top: 0;
            margin-bottom: 40px;
          }
          .responsive-title {
            font-size: 1.8rem; 
          }
          .arrow-container {
            margin-top: auto;
            padding-bottom: 30px;
          }
          .input-field {
            padding: 12px; 
          }
        }
      `}</style>

      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* ========================================================= */}
        {/* SECCIÓN 1: EL LOGIN                                       */}
        {/* ========================================================= */}
        <section className="login-section">
          
          <div className="login-box">
            
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <h1 className="logo responsive-title">
                <span style={{ color: 'white' }}>Mi Estado</span><br />
                <span style={{ color: 'var(--cursando)' }}>Académico</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', margin: 0 }}>
                {isLogin ? 'Bienvenido de vuelta' : 'Creá tu cuenta para empezar a trackear.'}
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
                  className="input-field"
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>Contraseña</label>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>Confirmar Contraseña</label>
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
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '4px', fontWeight: 'bold' }}>Requisitos de tu contraseña:</span>
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

          <div onClick={scrollToInfo} className="scroll-arrow arrow-container">
            <span style={{ fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Descubrí más</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>

        </section>

        {/* ========================================================= */}
        {/* SECCIÓN 2: INFORMACIÓN (Landing Page)                     */}
        {/* ========================================================= */}
        <div style={{marginBottom: '120px', width: '100%', boxSizing: 'border-box'}}> 
          <section id="info-section" style={{ padding: '30px 15px', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', color: 'white', marginBottom: '15px' }}>¿Qué podés hacer acá?</h2>
            <p style={{ color: 'var(--muted)', fontSize: 'clamp(1rem, 3vw, 1.2rem)', lineHeight: '1.6' }}>
              Mi Estado Académico es la herramienta definitiva para que los estudiantes organicen su carrera sin volverse locos con excels o PDFs desactualizados.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px', maxWidth: '1100px', width: '100%', boxSizing: 'border-box' }}>
            
            <div style={{ background: 'var(--panel)', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <div style={{ marginBottom: '20px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
              </div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>Plan de Estudios Dinámico</h3>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.6' }}>
                Visualizá tu plan de estudios completo, con las correlatividades claras y actualizadas. Podés marcar las materias que cursaste, estás cursando o planeás cursar para tener un mapa claro de tu progreso.
              </p>
            </div>

            <div style={{ background: 'var(--panel)', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <div style={{ marginBottom: '20px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              </div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>Seguimiento de Promedio y Progreso</h3>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.6' }}>
                Podés visualizar el promedio rellenando en la tabla de materias aprobadas las notas finales de las materias.
              </p>
            </div>

            <div style={{ background: 'var(--panel)', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <div style={{ marginBottom: '20px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>Cursada</h3>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.6' }}>
                Seleccioná en el plan de estudios dinámico las materias que cursas actualmente para que se reflejen automáticamente en tu cursada. Entrando a una materia, podés agregar fechas de eventos y seleccionar la comisión en la que cursas para que se te coloque en el horario semanal automático.
              </p>
            </div>

          </div>
        </section>
        </div>
      </main>
    </>
  );
}