'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import WelcomeModal from './WelcomeModal';
import { supabase } from '../lib/supabase';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  // Estado para el modal de Feedback
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({ name: '', avatarUrl: '', initials: '' });
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false); 

  const pathname = usePathname();
  const router = useRouter(); 

  // Nueva lógica de rutas activas
  const isBlogActive = pathname?.startsWith('/blog');

  useEffect(() => {
    setIsSidebarOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUserData = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const fullName = data.user.user_metadata?.full_name || data.user.email || 'Usuario';
      const avatarUrl = data.user.user_metadata?.avatar_url || '';
      
      const nameParts = fullName.split(' ');
      let initials = '';
      if (nameParts.length >= 2) {
        initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      } else {
        initials = fullName.substring(0, 2).toUpperCase();
      }

      setUserProfile({ name: fullName, avatarUrl, initials });
    }
  };

  useEffect(() => {
    let isMounted = true; 

    const checkIfPublicRoute = (path: string) => {
      if (!path) return false;
      return (
        path === '/login' || 
        path === '/onboarding' ||
        path.startsWith('/blog') || 
        path.startsWith('/terminos') || 
        path.startsWith('/privacidad')
      );
    };

    const checkAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        setHasSession(!!session);
        const isPublicRoute = checkIfPublicRoute(pathname);

        if (!session) {
          if (!isPublicRoute) {
            router.replace('/login');
          } else {
            setIsChecking(false); 
          }
        } else {
          fetchUserData(); 
          if (pathname === '/login') {
            router.replace('/');
          } else {
            setIsChecking(false);
          }
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        if (isMounted) setIsChecking(false); 
      }
    };

    checkAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== 'INITIAL_SESSION' && isMounted) {
        setHasSession(!!session);
        const isPublicRoute = checkIfPublicRoute(pathname);

        if (!session && !isPublicRoute) {
           router.replace('/login');
        } else if (session && pathname === '/login') {
           fetchUserData();
           router.replace('/');
        } else {
           if (session) fetchUserData();
           setIsChecking(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--cursando)', fontWeight: 'bold', fontSize: '1.2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(0, 229, 255, 0.2)', borderTopColor: 'var(--cursando)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          Verificando sesión...
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (pathname === '/login' || pathname === '/onboarding') return <>{children}</>;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login'; 
  };

  const navBtnBase = {
    padding: '8px 18px',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.4s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid transparent',
    whiteSpace: 'nowrap' as const
  };

  return (
    <>
      <style>{`
        .nav-full-menu { display: flex; }
        .nav-burger-btn { display: none; }
        .sidebar-action-btn-custom { padding: 12px 14px !important; transition: all 0.4s ease !important; }
        .theme-toggle-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 10px; background: transparent; border: none; color: var(--muted); cursor: pointer; transition: all 0.4s ease; padding: 0; }
        .theme-toggle-btn:hover { color: var(--text-strong); background: var(--glass-hover); }
        .sidebar-btn-hover:hover { color: var(--text-strong) !important; background: var(--glass-hover) !important; }
        .avatar-btn { width: 40px; height: 40px; border-radius: 50%; background: var(--glass-bg); color: var(--text-strong); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; cursor: pointer; border: 2px solid transparent; transition: all 0.4s ease; overflow: hidden; flex-shrink: 0; padding: 0; }
        .avatar-btn:hover { transform: scale(1.05); background: var(--glass-hover); }
        .avatar-btn.active-profile { border-color: var(--cursando); }
        .avatar-btn img { width: 100%; height: 100%; object-fit: cover; }
        .profile-dropdown-menu { position: absolute; top: calc(100% + 10px); right: 0; background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 8px; min-width: 180px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); display: flex; flex-direction: column; gap: 4px; animation: fadeIn 0.2s ease-out; z-index: 1500; }
        .profile-dropdown-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 8px; font-weight: 600; font-size: 0.9rem; color: var(--text-strong); cursor: pointer; text-decoration: none; transition: background 0.2s ease; background: transparent; border: none; width: 100%; text-align: left; }
        .profile-dropdown-item:hover { background: var(--glass-hover); }
        .profile-dropdown-item.danger { color: #ef4444; }
        .profile-dropdown-item.danger:hover { background: rgba(239, 68, 68, 0.1); }
        @media (max-width: 1150px) { .nav-full-menu { display: none !important; } .nav-burger-btn { display: flex !important; } }
        
        /* Modal de Feedback */
        .feedback-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--overlay-bg); backdrop-filter: blur(5px); z-index: 2000; display: flex; align-items: center; justify-content: center; opacity: 0; animation: fadeIn 0.2s forwards; padding: 20px; }
        .feedback-modal { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; width: 100%; max-width: 500px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); display: flex; flex-direction: column; gap: 20px; position: relative; }
        .feedback-input, .feedback-textarea { width: 100%; background: var(--glass-bg); border: 1px solid var(--border); border-radius: 8px; padding: 12px; color: var(--text-strong); font-family: inherit; font-size: 0.95rem; }
        .feedback-textarea { resize: vertical; min-height: 120px; }
        .feedback-input:focus, .feedback-textarea:focus { outline: none; border-color: var(--cursando); }
      `}</style>

      <header>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', position: 'relative', zIndex: 1000 }}>
          
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="/icon.png" alt="Logo Mi Estado Académico" style={{ width: '42px', height: '42px', objectFit: 'contain', flexShrink: 0 }} />
              <div className="header-titles">
                <div className="logo" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                  <div style={{ color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>Mi Estado</div>
                  <div style={{ color: 'var(--cursando)', whiteSpace: 'nowrap' }}>Académico</div>
                </div>
              </div>
            </Link>

            <div className="nav-full-menu" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '20px' }}>
              {hasSession && pathname === '/' && (
                <>
                  <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 5px' }}></div>
                  <button className="help-btn" onClick={() => window.dispatchEvent(new Event('start-home-tour'))} title="Guía de inicio">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </button>
                  
                  <Link href="https://cafecito.app/mateogeffroy" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <button style={{ ...navBtnBase, padding: '6px 12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4-4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>
                      Cafecito
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <div className="nav-full-menu" style={{ gap: '10px', alignItems: 'center' }}>
              <button className="theme-toggle-btn" title="Alternar tema" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
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

              <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 5px' }}></div>

              {hasSession ? (
                <>
                  <Link href="/" style={{ textDecoration: 'none' }}>
                    <button style={{ ...navBtnBase, background: pathname === '/' ? 'var(--cursando)' : 'var(--glass-bg)', color: pathname === '/' ? 'black' : 'var(--text-strong)', border: pathname === '/' ? 'none' : '1px solid var(--border)' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      Inicio
                    </button>
                  </Link>
                  
                  <Link href="/plan" style={{ textDecoration: 'none' }}>
                    <button style={{ ...navBtnBase, background: pathname === '/plan' ? 'var(--cursando)' : 'var(--glass-bg)', color: pathname === '/plan' ? 'black' : 'var(--text-strong)', border: pathname === '/plan' ? 'none' : '1px solid var(--border)' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
                      Plan de estudios
                    </button>
                  </Link>
                  
                  {/* 🔥 BOTÓN DE BLOG EN LUGAR DE CURSADA 🔥 */}
                  <Link href="/blog" style={{ textDecoration: 'none' }}>
                    <button style={{ ...navBtnBase, background: isBlogActive ? 'var(--cursando)' : 'var(--glass-bg)', color: isBlogActive ? 'black' : 'var(--text-strong)', border: isBlogActive ? 'none' : '1px solid var(--border)' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
                      Blog
                    </button>
                  </Link>

                  <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 5px' }}></div>

                  <div style={{ position: 'relative' }} ref={profileMenuRef}>
                    <button 
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className={`avatar-btn ${pathname === '/perfil' ? 'active-profile' : ''}`}
                      title="Mi Perfil"
                    >
                      {userProfile.avatarUrl ? (
                        <img src={userProfile.avatarUrl} alt="Avatar" />
                      ) : (
                        <span>{userProfile.initials}</span>
                      )}
                    </button>

                    {isProfileMenuOpen && (
                      <div className="profile-dropdown-menu">
                        <Link href="/perfil" className="profile-dropdown-item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          Mi Perfil
                        </Link>
                        <div style={{ height: '1px', background: 'var(--border)', margin: '2px 0' }}></div>
                        <button onClick={handleLogout} className="profile-dropdown-item danger">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                          Cerrar Sesión
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/blog" style={{ textDecoration: 'none' }}>
                    <button style={{ ...navBtnBase, background: isBlogActive ? 'var(--cursando)' : 'var(--glass-bg)', color: isBlogActive ? 'black' : 'var(--text-strong)', border: isBlogActive ? 'none' : '1px solid var(--border)' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
                      Blog y Novedades
                    </button>
                  </Link>
                  <Link href="/login" style={{ textDecoration: 'none' }}>
                    <button style={{ ...navBtnBase, background: 'var(--cursando)', color: 'black', border: 'none' }}>
                      Iniciar Sesión / Registrarse
                    </button>
                  </Link>
                </>
              )}
            </div>

            <button className="nav-burger-btn hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
              <div className={`hamburger-icon ${isSidebarOpen ? 'open' : ''}`}><span></span><span></span><span></span></div>
            </button>
          </div>
        </div>
      </header>

      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
      
      <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h3>Menú</h3>
          <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>✕</button>
        </div>
        
        <div className="sidebar-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px', gap: '0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
            {hasSession ? (
              <>
                <Link href="/" className={`sidebar-action-btn sidebar-action-btn-custom ${pathname === '/' ? 'active-route' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Inicio
                </Link>
                <Link href="/plan" className={`sidebar-action-btn sidebar-action-btn-custom ${pathname === '/plan' ? 'active-route' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
                  Plan de Estudios
                </Link>
                <Link href="/blog" className={`sidebar-action-btn sidebar-action-btn-custom ${isBlogActive ? 'active-route' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
                  Blog
                </Link>
                <Link href="/perfil" className={`sidebar-action-btn sidebar-action-btn-custom ${pathname === '/perfil' ? 'active-route' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Mi Perfil
                </Link>
              </>
            ) : (
              <>
                <Link href="/blog" className={`sidebar-action-btn sidebar-action-btn-custom ${isBlogActive ? 'active-route' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
                  Blog y Novedades
                </Link>
                <div className="sidebar-divider" style={{ margin: '10px 0' }}></div>
                <Link href="/login" className="sidebar-action-btn sidebar-action-btn-custom" style={{ background: 'var(--cursando)', color: 'black', justifyContent: 'center' }}>
                  Iniciar Sesión / Registrarse
                </Link>
              </>
            )}
          </div>
          <div style={{ marginTop: 'auto' }}>
            {hasSession && (
              <button className="sidebar-action-btn sidebar-action-btn-custom btn-danger-sidebar" onClick={handleLogout} style={{ width: '100%', marginTop: '10px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      </aside>

      <WelcomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Contenido principal de las páginas */}
      <div>{children}</div>

      {/* FOOTER ACTUALIZADO CON BOTÓN DE SUGERENCIAS */}
      <footer style={{ background: 'var(--panel)', borderTop: '1px solid var(--border)', padding: '30px 20px', marginTop: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '0.8rem', textAlign: 'center', flex: '1 1 auto' }}>
            © {new Date().getFullYear()} Mateo Geffroy - <strong>Mi Estado Académico</strong>
          </div>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', flex: '1 1 auto', fontSize: '0.8rem', color: 'var(--muted)', flexWrap: 'wrap' }}>
            <Link href="/terminos" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-strong)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}>
              Términos y Condiciones
            </Link>
            <span style={{ opacity: 0.5 }}>|</span>
            <Link href="/privacidad" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-strong)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}>
              Políticas de Privacidad
            </Link>
            <span style={{ opacity: 0.5 }}>|</span>
            <button 
              onClick={() => setIsFeedbackModalOpen(true)}
              style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, fontSize: 'inherit', cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }} 
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-strong)'} 
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Dejanos tu opinión
            </button>
          </div>
        </div>
      </footer>

      {/* 🔥 MODAL DE OPINIÓN/FEEDBACK 🔥 */}
      {isFeedbackModalOpen && (
        <div className="feedback-modal-overlay" onClick={() => setIsFeedbackModalOpen(false)}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setIsFeedbackModalOpen(false)} 
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '1.2rem', cursor: 'pointer', padding: '4px' }}
            >
              ✕
            </button>
            
            <div>
              <h2 style={{ color: 'var(--text-strong)', margin: '0 0 8px 0', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Dejanos tu opinión
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                ¿Encontraste un error, algo te pareció confuso o tenés alguna sugerencia? Tu crítica nos ayuda un montón a mejorar.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert("¡Mensaje enviado!"); setIsFeedbackModalOpen(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Título Breve</label>
                <input type="text" className="feedback-input" placeholder="Ej: Error en correlativas / Sugerencia visual" required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Desarrollo de la crítica</label>
                <textarea className="feedback-textarea" placeholder="Explicá detalladamente tu observación, qué estabas haciendo o qué te gustaría ver..." required></textarea>
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '14px', fontSize: '1rem', marginTop: '10px' }}>
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      )}

    </>
  );
}