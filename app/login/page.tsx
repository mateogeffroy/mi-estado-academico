'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
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

  // 🔥 HOOKS DEL TEMA 🔥
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const requirements = [
    { test: (p: string) => p.length >= 8 && p.length <= 16, label: 'Entre 8 y 16 caracteres' },
    { test: (p: string) => /[A-Z]/.test(p), label: 'Una letra mayúscula' },
    { test: (p: string) => /[a-z]/.test(p), label: 'Una letra minúscula' },
    { test: (p: string) => /[0-9]/.test(p), label: 'Un número' },
    { test: (p: string, cp: string) => p === cp && p.length > 0, label: 'Las contraseñas coinciden' }
  ];

  const isPasswordValid = requirements.every(req => req.test(password, confirmPassword));

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
    document.getElementById('mobile-info-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        #login-main {
          padding: 0 !important; 
          margin: 0 !important;
          max-width: 100% !important;
          width: 100% !important;
          overflow-x: hidden !important; 
          box-sizing: border-box !important;
          position: relative;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        .scroll-arrow {
          animation: bounce 2s infinite;
        }

        /* ================================================================= */
        /* ESTILOS COMUNES Y COMPONENTES REUTILIZABLES                       */
        /* ================================================================= */
        .login-box {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
        }

        .auth-form { display: flex; flex-direction: column; }
        .auth-label { color: var(--muted); font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }

        .input-field {
          width: 100%; box-sizing: border-box; border-radius: 10px;
          border: 1px solid var(--border); background: var(--glass-bg);
          color: var(--text-strong); outline: none; transition: border-color 0.2s ease, background 0.2s ease;
        }
        .input-field:focus { border-color: var(--cursando); background: var(--glass-hover); }

        .auth-submit-btn { border-radius: 10px; font-weight: bold; width: 100%; box-sizing: border-box; cursor: pointer; border: none; }
        
        .auth-google-btn {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          border-radius: 10px; background: var(--panel); color: var(--text-strong); font-weight: bold;
          border: 1px solid var(--border); cursor: pointer; transition: transform 0.2s, background 0.2s; 
          width: 100%; box-sizing: border-box;
        }
        .auth-google-btn:hover { transform: scale(1.02); background: var(--glass-hover); }

        .arrow-container { cursor: pointer; color: var(--muted); display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 30px; transition: color 0.2s ease; }
        .arrow-container:hover { color: var(--text-strong); }

        .hero-subtitle { color: var(--text); line-height: 1.6; }
        .hero-checklist { list-style: none; display: flex; flex-direction: column; padding: 0; margin: 0; }
        .hero-checklist li { display: flex; align-items: flex-start; gap: 16px; color: var(--text); line-height: 1.5; }
        .check-icon { color: var(--cursando); flex-shrink: 0; margin-top: 2px; }
        
        .career-box { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 12px; padding: 16px; box-sizing: border-box; }
        .career-box-title { color: var(--text-strong); font-weight: bold; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .career-box-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; color: var(--muted); }
        .contact-text { color: var(--muted); text-align: center; width: 100%; }

        .mobile-layout { display: flex; flex-direction: column; width: 100%; }
        .mobile-login-section { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; box-sizing: border-box; }
        .mobile-info-section { background: var(--panel); border-top: 1px solid var(--border); display: flex; flex-direction: column; box-sizing: border-box; }

        .desktop-layout { display: none !important; }

        .floating-theme-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--panel);
          border: 1px solid var(--border);
          color: var(--text-strong);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 9999;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform 0.2s ease, background 0.2s ease;
          padding: 0;
        }
        .floating-theme-btn:hover {
          transform: scale(1.1);
          background: var(--glass-hover);
        }

        /* ================================================================= */
        /* RESPONSIVIDAD DINÁMICA                                            */
        /* ================================================================= */
        
        /* CELULARES (< 768px) */
        @media (max-width: 767px) {
          .mobile-login-section { padding: 30px 24px !important; }
          .mobile-info-section { padding: 40px 24px 80px 24px !important; gap: 30px; }
          
          .logo-container-mobile { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 3vw, 12px); width: 100%; }
          .logo-img-mobile { width: clamp(40px, 12vw, 55px); height: clamp(40px, 12vw, 55px); object-fit: contain; flex-shrink: 0; }
          .title-mobile { font-size: clamp(1.4rem, 7vw, 1.8rem); line-height: 1.05; display: flex; flex-direction: column; margin: 0; font-weight: 800; text-align: left; }
          
          .login-wrapper { max-width: 340px; width: 100%; margin: 0 auto; }
          .login-box { padding: 20px 16px; gap: 14px; }
          .auth-form { gap: 14px; }
          .auth-label { font-size: 0.8rem; }
          .input-field { padding: 10px 12px; font-size: 0.9rem; }
          .auth-submit-btn { padding: 12px; font-size: 1rem; }
          .auth-google-btn { padding: 10px; font-size: 0.9rem; }

          .hero-subtitle { font-size: clamp(0.85rem, 4vw, 0.95rem); }
          .hero-checklist { gap: 14px; }
          .hero-checklist li { font-size: clamp(0.8rem, 4vw, 0.9rem); gap: 10px; }
          .career-box { padding: 12px; }
          .career-box-title { font-size: 0.9rem; margin-bottom: 8px; }
          .career-box-list { font-size: 0.8rem; gap: 4px; }
          .contact-text { font-size: 0.8rem; margin-top: 12px; }
        }

        /* TABLETS (768px - 1024px) */
        @media (min-width: 768px) and (max-width: 1024px) {
          .mobile-login-section { padding: 40px 30px !important; }
          .mobile-info-section { padding: 60px 30px 100px 30px !important; gap: 40px; }
          
          .logo-container-mobile { display: flex; align-items: center; justify-content: center; gap: 16px; width: 100%; }
          .logo-img-mobile { width: 75px; height: 75px; object-fit: contain; flex-shrink: 0; }
          .title-mobile { font-size: 2.6rem; line-height: 1.05; display: flex; flex-direction: column; margin: 0; font-weight: 800; text-align: left; }

          .login-wrapper { max-width: 380px; width: 100%; margin: 0 auto; } 
          .login-box { padding: 24px 20px; gap: 16px; }
          .auth-form { gap: 16px; }
          .auth-label { font-size: 0.85rem; }
          .input-field { padding: 12px 14px; font-size: 0.95rem; }
          .auth-submit-btn { padding: 14px; font-size: 1.05rem; }
          .auth-google-btn { padding: 12px; font-size: 0.95rem; }

          .hero-subtitle { font-size: 1.05rem; }
          .hero-checklist { gap: 16px; }
          .hero-checklist li { font-size: 0.95rem; gap: 12px; }
          .career-box { padding: 16px; }
          .career-box-title { font-size: 0.95rem; margin-bottom: 12px; }
          .career-box-list { font-size: 0.85rem; gap: 6px; }
          .contact-text { font-size: 0.85rem; margin-top: 16px; }
        }

        /* ESCRITORIO UNIFICADO (>= 1025px) */
        @media (min-width: 1025px) {
          body, html { overflow: hidden !important; }
          .mobile-layout { display: none !important; }
          .desktop-layout { display: flex !important; width: 100%; height: 100vh; }
          
          .hero-col {
            flex: 0 0 50%; max-width: 50%; height: 100vh;
            background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.08) 0%, transparent 50%), var(--panel);
            border-right: 1px solid var(--border);
            display: flex; flex-direction: column; 
            justify-content: center; 
            gap: clamp(20px, 4vh, 40px);
            padding: clamp(20px, 5vh, 40px) clamp(30px, 4vw, 60px);
            overflow: hidden; box-sizing: border-box;
          }

          .form-col {
            flex: 0 0 50%; max-width: 50%; height: 100vh;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            background: var(--bg); overflow: hidden; box-sizing: border-box;
          }

          .logo-container-desktop { display: flex; align-items: center; gap: clamp(10px, 1.5vw, 20px); margin-bottom: 0px; }
          .logo-img-desktop { width: clamp(55px, 5vw, 75px); height: clamp(55px, 5vw, 75px); object-fit: contain; flex-shrink: 0; }
          .title-desktop { font-size: clamp(2.2rem, 3vw, 3rem); line-height: 1.05; display: flex; flex-direction: column; margin: 0; font-weight: 800; text-align: left; }

          .hero-subtitle { font-size: clamp(0.95rem, 1vw, 1.15rem); max-width: 90%; line-height: 1.4; margin-top: clamp(5px, 1vh, 10px); }
          .hero-checklist { gap: clamp(12px, 1.5vh, 20px); }
          .hero-checklist li { font-size: clamp(0.85rem, 0.9vw, 1rem); gap: 12px; line-height: 1.3; }
          .check-icon { width: clamp(20px, 1.5vw, 24px); height: clamp(20px, 1.5vw, 24px); }
          
          .career-box { padding: clamp(12px, 1.5vw, 20px); border-radius: 12px; }
          .career-box-title { font-size: clamp(0.85rem, 0.9vw, 1rem); margin-bottom: 8px; }
          .career-box-list { font-size: clamp(0.75rem, 0.8vw, 0.9rem); gap: 4px; }
          
          .contact-text { font-size: clamp(0.75rem, 0.8vw, 0.9rem); margin-top: clamp(10px, 1.5vh, 20px); }
          
          .login-wrapper { max-width: clamp(360px, 25vw, 420px); width: 100%; display: flex; flex-direction: column; }
          .login-box { padding: clamp(24px, 3vh, 32px) clamp(24px, 3vw, 32px); gap: clamp(16px, 2vh, 24px); border-radius: 16px; }
          .auth-form { gap: clamp(14px, 1.5vh, 20px); }
          .auth-label { font-size: clamp(0.75rem, 0.8vw, 0.9rem); }
          .input-field { padding: clamp(10px, 1.5vh, 14px) 14px; font-size: clamp(0.85rem, 0.9vw, 1rem); }
          .auth-submit-btn { padding: clamp(12px, 1.5vh, 16px); font-size: clamp(0.95rem, 1vw, 1.1rem); }
          .auth-google-btn { padding: clamp(10px, 1.2vh, 14px); font-size: clamp(0.85rem, 0.9vw, 1rem); }
          
          .desktop-form-title h2 { font-size: clamp(1.8rem, 2vw, 2.2rem) !important; margin-bottom: 5px !important; }
          .desktop-form-title p { font-size: clamp(0.95rem, 1vw, 1.05rem) !important; }
        }
      `}</style>

      <main id="login-main">
        
        {/* 🔥 BOTÓN FLOTANTE TEMA 🔥 */}
        <button 
          className="floating-theme-btn" 
          title="Alternar tema"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {mounted && theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, width: '24px', height: '24px' }}>
              <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, width: '24px', height: '24px' }}>
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          )}
        </button>

        {/* ========================================================= */}
        {/* LAYOUT MÓVIL Y TABLET (< 1024px)                            */}
        {/* ========================================================= */}
        <div className="mobile-layout">
          <section className="mobile-login-section">
            <div className="login-wrapper">
              
              {isLogin && (
                <div style={{ textAlign: 'center', marginBottom: '35px', width: '100%' }}>
                  <div className="logo-container-mobile">
                    <img src="/icon.png" alt="Logo Mi Estado Académico" className="logo-img-mobile" />
                    <h1 className="logo title-mobile">
                      <span style={{ color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>Mi Estado</span>
                      <span style={{ color: 'var(--cursando)', whiteSpace: 'nowrap' }}>Académico</span>
                    </h1>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: 'clamp(0.9rem, 4vw, 1.05rem)', margin: '12px 0 0 0', fontWeight: 500 }}>
                    Bienvenido de vuelta
                  </p>
                </div>
              )}

              <div className="login-box">
                {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '12px', borderRadius: '10px', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}
                {successMsg && <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '12px', borderRadius: '10px', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>{successMsg}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label className="auth-label">Correo Electrónico</label>
                    <input 
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="alumno@frlp.utn.edu.ar" className="input-field" required
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label className="auth-label">Contraseña</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input 
                        type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" className="input-field" style={{ paddingRight: '50px' }} required
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
                          placeholder="••••••••" className="input-field" style={{ paddingRight: '50px' }} required
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
                    <div style={{ background: 'var(--glass-bg)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '2px', fontWeight: 'bold' }}>Requisitos de tu contraseña:</span>
                      {requirements.map((req, idx) => {
                        const isMet = req.test(password, confirmPassword);
                        return (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: isMet ? 'var(--text-strong)' : 'var(--muted)' }}>
                            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: isMet ? '#10b981' : 'transparent', border: `1px solid ${isMet ? '#10b981' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {isMet && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                            </div>
                            {req.label}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <button 
                    type="submit" className="btn-primary auth-submit-btn" 
                    disabled={loading || (!isLogin && !isPasswordValid)} 
                    style={{ opacity: (loading || (!isLogin && !isPasswordValid)) ? 0.5 : 1, cursor: (loading || (!isLogin && !isPasswordValid)) ? 'not-allowed' : 'pointer' }}
                  >
                    {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
                  </button>
                </form>

                {isLogin && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                      <span style={{ color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>O ingresá con</span>
                      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    </div>

                    <button onClick={handleGoogleLogin} type="button" className="auth-google-btn">
                      <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Continuar con Google
                    </button>
                  </>
                )}

                <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--muted)' }}>
                  {isLogin ? '¿No tenés una cuenta? ' : '¿Ya tenés una cuenta? '}
                  <button onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); setPassword(''); setConfirmPassword(''); }} style={{ background: 'transparent', border: 'none', color: 'var(--cursando)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>
                    {isLogin ? 'Registrate acá' : 'Iniciá sesión'}
                  </button>
                </div>
              </div>

              <div onClick={scrollToInfo} className="scroll-arrow arrow-container">
                <span style={{ fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 'bold' }}>Descubrí más</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>

            </div>
          </section>

          <section id="mobile-info-section" className="mobile-info-section">
            <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px', width: '100%' }}>
              
              <ul className="hero-checklist">
                <li>
                  <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
                  <span><strong>Plan de Estudios Dinámico:</strong> Visualizá tu plan, correlatividades claras y marcá materias aprobadas o en curso.</span>
                </li>
                <li>
                  <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                  <span><strong>Seguimiento de Promedio:</strong> Calculá tu promedio analítico exacto cargando las notas finales de tus materias.</span>
                </li>
                <li>
                  <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span><strong>Gestión de Cursada:</strong> Agendá eventos, parciales y organizá tus horarios seleccionando comisiones reales.</span>
                </li>
                
                <li>
                  <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span><strong>Blog y Novedades:</strong> Estás invitado a leer nuestras guías universitarias y artículos técnicos sin necesidad de iniciar sesión.</span>
                    <Link href="/blog" style={{ textDecoration: 'none' }}>
                      <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
                        Ir al Blog <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </button>
                    </Link>
                  </div>
                </li>

              </ul>

              <div style={{ width: '100%', marginTop: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                  <div className="career-box">
                    <div className="career-box-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                      UTN - FRLP
                    </div>
                    <ul className="career-box-list">
                      <li>Ing. Civil</li>
                      <li>Ing. Eléctrica</li>
                      <li>Ing. Industrial</li>
                      <li>Ing. Mecánica</li>
                      <li>Ing. Química</li>
                      <li>Ing. en Sistemas</li>
                    </ul>
                  </div>
                  <div className="career-box">
                    <div className="career-box-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                      UNLP
                    </div>
                    <ul className="career-box-list">
                      <li>Analista Programador Universitario</li>
                      <li>Licenciatura en Computación</li>
                      <li>Licenciatura en Informática</li>
                      <li>Licenciatura en Sistemas</li>
                      <li>Lic. y Prof. de Psicología</li>
                      <li>Téc. Univ. en Sonido y Grabación</li>
                    </ul>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                  <p className="contact-text" style={{ margin: 0 }}>
                    Si no ves tu carrera, escribí un mail a <strong style={{ color: 'var(--text-strong)' }}>mateogeffroy.dev@gmail.com</strong>
                  </p>

                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                    <Link href="/terminos" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Términos y Condiciones</Link>
                    <span style={{ color: 'var(--border)' }}>|</span>
                    <Link href="/privacidad" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Políticas de Privacidad</Link>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </div>

        {/* ========================================================= */}
        {/* LAYOUT ESCRITORIO (>= 1025px)                               */}
        {/* ========================================================= */}
        <div className="desktop-layout">
          
          <section className="hero-col">
            <div className="hero-logo-container">
              
              <div className="logo-container-desktop">
                <img src="/icon.png" alt="Logo Mi Estado Académico" className="logo-img-desktop" />
                <h1 className="logo title-desktop">
                  <span style={{ color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>Mi Estado</span>
                  <span style={{ color: 'var(--cursando)', whiteSpace: 'nowrap' }}>Académico</span>
                </h1>
              </div>

              <p className="hero-subtitle">
                Gestión inteligente, trazabilidad absoluta y control total de tu carrera académica.
              </p>
            </div>

            <ul className="hero-checklist">
              <li>
                <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
                <span><strong>Plan de Estudios Dinámico:</strong> Visualizá tu plan, correlatividades claras y marcá materias aprobadas o en curso.</span>
              </li>
              <li>
                <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                <span><strong>Seguimiento de Promedio:</strong> Calculá tu promedio analítico exacto cargando las notas finales de tus materias.</span>
              </li>
              <li>
                <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span><strong>Gestión de Cursada:</strong> Agendá eventos, parciales y organizá tus horarios seleccionando comisiones reales.</span>
              </li>

              <li>
                <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span><strong>Blog y Novedades:</strong> Estás invitado a leer nuestras guías universitarias y artículos técnicos sin necesidad de iniciar sesión.</span>
                  <Link href="/blog" style={{ textDecoration: 'none' }}>
                    <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
                      Ir al Blog <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                  </Link>
                </div>
              </li>

            </ul>

            <div style={{ width: '100%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div className="career-box">
                  <div className="career-box-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    UTN - FRLP
                  </div>
                  <ul className="career-box-list">
                    <li>Ing. Civil</li>
                    <li>Ing. Eléctrica</li>
                    <li>Ing. Industrial</li>
                    <li>Ing. Mecánica</li>
                    <li>Ing. Química</li>
                    <li>Ing. en Sistemas</li>
                  </ul>
                </div>
                <div className="career-box">
                  <div className="career-box-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    UNLP
                  </div>
                  <ul className="career-box-list">
                    <li>Analista Programador Universitario</li>
                    <li>Licenciatura en Computación</li>
                    <li>Licenciatura en Informática</li>
                    <li>Licenciatura en Sistemas</li>
                    <li>Lic. y Prof. de Psicología</li>
                    <li>Téc. Univ. en Sonido y Grabación</li>
                  </ul>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <p className="contact-text" style={{ margin: '15px 0 0 0' }}>
                  Si no ves tu carrera, escribí un mail a <strong style={{ color: 'var(--text-strong)' }}>mateogeffroy.dev@gmail.com</strong>
                </p>
                
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', fontSize: '0.85rem' }}>
                  <Link href="/terminos" style={{ color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-strong)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}>Términos y Condiciones</Link>
                  <span style={{ color: 'var(--border)' }}>|</span>
                  <Link href="/privacidad" style={{ color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-strong)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}>Políticas de Privacidad</Link>
                </div>
              </div>

            </div>
          </section>

          <section className="form-col">
            <div className="login-wrapper">
              {isLogin && (
                <div style={{ textAlign: 'center', marginBottom: '24px', width: '100%' }}>
                  <div className="desktop-form-title" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--text-strong)', fontSize: '2rem', marginBottom: '8px', fontWeight: 'bold' }}>
                      ¡Bienvenido!
                    </h2>
                    <p style={{ color: 'var(--muted)', fontSize: '1.05rem', margin: 0 }}>
                      Ingresá tus credenciales para acceder
                    </p>
                  </div>
                </div>
              )}

              <div className="login-box">
                {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '12px', borderRadius: '10px', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}
                {successMsg && <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '12px', borderRadius: '10px', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>{successMsg}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label className="auth-label">Correo Electrónico</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alumno@mail.com" className="input-field" required />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label className="auth-label">Contraseña</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-field" style={{ paddingRight: '50px' }} required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {showPassword ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>}
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label className="auth-label">Confirmar Contraseña</label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="input-field" style={{ paddingRight: '50px' }} required />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '15px', background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {showConfirmPassword ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>}
                        </button>
                      </div>
                    </div>
                  )}

                  {!isLogin && (
                    <div style={{ background: 'var(--glass-bg)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '2px', fontWeight: 'bold' }}>Requisitos de tu contraseña:</span>
                      {requirements.map((req, idx) => {
                        const isMet = req.test(password, confirmPassword);
                        return (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: isMet ? 'var(--text-strong)' : 'var(--muted)' }}>
                            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: isMet ? '#10b981' : 'transparent', border: `1px solid ${isMet ? '#10b981' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {isMet && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                            </div>
                            {req.label}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <button type="submit" className="btn-primary auth-submit-btn" disabled={loading || (!isLogin && !isPasswordValid)} style={{ opacity: (loading || (!isLogin && !isPasswordValid)) ? 0.5 : 1, cursor: (loading || (!isLogin && !isPasswordValid)) ? 'not-allowed' : 'pointer' }}>
                    {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
                  </button>
                </form>

                {isLogin && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                      <span style={{ color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>O ingresá con</span>
                      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    </div>

                    <button style={{ color: 'BLACK', backgroundColor: 'white'}} onClick={handleGoogleLogin} type="button" className="auth-google-btn">
                      <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Continuar con Google
                    </button>
                  </>
                )}

                <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--muted)' }}>
                  {isLogin ? '¿No tenés una cuenta? ' : '¿Ya tenés una cuenta? '}
                  <button onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); setPassword(''); setConfirmPassword(''); }} style={{ background: 'transparent', border: 'none', color: 'var(--cursando)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>
                    {isLogin ? 'Registrate acá' : 'Iniciá sesión'}
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}