'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import WelcomeModal from './WelcomeModal';
import { supabase } from '../lib/supabase';
import AnnouncementModal from './AnnouncementModal';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter(); 

  // Cerramos el sidebar si el usuario cambia de página
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // --- LÓGICA DE SESIÓN BLINDADA ---
  useEffect(() => {
    let isMounted = true; 

    const checkAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (!session) {
          if (pathname !== '/login' && pathname !== '/onboarding') {
            router.replace('/login');
          } else {
            setIsChecking(false);
          }
        } else {
          const hasName = session.user?.user_metadata?.full_name;
          if (!hasName && pathname !== '/onboarding') {
            router.replace('/onboarding');
          } else if (hasName && (pathname === '/login' || pathname === '/onboarding')) {
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
        if (!session && pathname !== '/login' && pathname !== '/onboarding') {
           router.replace('/login');
        } else if (session && (pathname === '/login' || pathname === '/onboarding')) {
           router.replace('/');
        } else {
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
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid transparent',
    whiteSpace: 'nowrap' as const
  };

  return (
    <>
      {/* 🔥 MAGIA DE RESPONSIVIDAD: 
        Forzamos a que el menú completo desaparezca y aparezca la hamburguesa
        mucho antes (a los 1150px) para que los botones no se aplasten.
      */}
      <style>{`
        .nav-full-menu {
          display: flex;
        }
        .nav-burger-btn {
          display: none;
        }
        @media (max-width: 1150px) {
          .nav-full-menu {
            display: none !important;
          }
          .nav-burger-btn {
            display: flex !important;
          }
        }
      `}</style>

      <header>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', position: 'relative', zIndex: 1000 }}>
          
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div className="header-titles">
                <div className="logo">
                  Mi Estado <span style={{ color: 'var(--cursando)' }}>Académico</span>
                </div>
                {/* Ocultamos el subtítulo a los 1150px también para hacer espacio */}
                <div className="subtitle nav-full-menu">ING. EN SISTEMAS DE INFORMACIÓN - UTN FRLP</div>
              </div>
            </Link>
          </div>

          <div className="nav-full-menu" style={{ flex: 1, justifyContent: 'center' }}>
            {pathname === '/plan' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="legend-dot ld-disabled" style={{ width: '8px', height: '8px' }}></div>Bloqueada</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="legend-dot ld-available" style={{ width: '8px', height: '8px' }}></div>Disponible</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="legend-dot" style={{ backgroundColor: 'var(--cursando)', width: '8px', height: '8px' }}></div>Cursando</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="legend-dot ld-cursada" style={{ width: '8px', height: '8px' }}></div>Cursada</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="legend-dot ld-aprobada" style={{ width: '8px', height: '8px' }}></div>Aprobada</div>
                
                <button 
                  className="help-btn"
                  onClick={() => setIsModalOpen(true)}
                  title="Ver instrucciones del Plan"
                  style={{ marginLeft: '10px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </button>
              </div>
            )}
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            
            {/* ESTE ES EL MENÚ COMPLETO (Se oculta en pantallas medianas/chicas) */}
            <div className="nav-full-menu" style={{ gap: '10px', alignItems: 'center' }}>
              
              {/* BOTÓN CAFECITO (PC) */}
              {pathname === '/' && (
                <Link href="https://cafecito.app/mateogeffroy" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <button 
                    style={{ ...navBtnBase, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#f59e0b'; e.currentTarget.style.color = 'black'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'; e.currentTarget.style.color = '#f59e0b'; }}
                    title="Invitame un Cafecito"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4-4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>
                    Cafecito
                  </button>
                </Link>
              )}

              <Link href="/" style={{ textDecoration: 'none' }}>
                <button style={{ ...navBtnBase, background: pathname === '/' ? 'var(--cursando)' : 'rgba(255,255,255,0.03)', color: pathname === '/' ? 'black' : 'white', border: pathname === '/' ? 'none' : '1px solid var(--border)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Inicio
                </button>
              </Link>
              
              <Link href="/plan" style={{ textDecoration: 'none' }}>
                <button style={{ ...navBtnBase, background: pathname === '/plan' ? 'var(--cursando)' : 'rgba(255,255,255,0.03)', color: pathname === '/plan' ? 'black' : 'white', border: pathname === '/plan' ? 'none' : '1px solid var(--border)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
                  Plan
                </button>
              </Link>
              
              <Link href="/cursada" style={{ textDecoration: 'none' }}>
                <button style={{ ...navBtnBase, background: pathname === '/cursada' ? 'var(--cursando)' : 'rgba(255,255,255,0.03)', color: pathname === '/cursada' ? 'black' : 'white', border: pathname === '/cursada' ? 'none' : '1px solid var(--border)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Cursada
                </button>
              </Link>

              <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 5px' }}></div>
              
              <button 
                className="btn-danger" 
                onClick={handleLogout}
                style={{ ...navBtnBase, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.1)' }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
              >
                Cerrar sesión
              </button>
            </div>

            {/* ESTA ES LA HAMBURGUESA (Aparece cuando el menú completo se oculta) */}
            <button 
              className="nav-burger-btn hamburger-btn" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <div className={`hamburger-icon ${isSidebarOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* --- MENÚ LATERAL (SIDEBAR) --- */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      
      <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h3>Menú</h3>
          <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>
            ✕
          </button>
        </div>
        
        <div className="sidebar-content">
          
          {/* BOTÓN CAFECITO (CELULAR) */}
          {pathname === '/' && (
            <>
              <Link 
                href="https://cafecito.app/mateogeffroy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="sidebar-action-btn" 
                style={{ color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.2)', background: 'rgba(245, 158, 11, 0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>
                Invitame un Cafecito
              </Link>
              <div className="sidebar-divider" style={{ margin: '4px 0' }}></div>
            </>
          )}

          <Link href="/" className={`sidebar-action-btn ${pathname === '/' ? 'active-route' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Inicio
          </Link>
          <Link href="/plan" className={`sidebar-action-btn ${pathname === '/plan' ? 'active-route' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
            Plan de Estudios
          </Link>
          <Link href="/cursada" className={`sidebar-action-btn ${pathname === '/cursada' ? 'active-route' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Ver Mi Cursada
          </Link>
          
          <div className="sidebar-divider" style={{ margin: '10px 0' }}></div>
          
          <button className="sidebar-action-btn btn-danger-sidebar" onClick={handleLogout}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Cerrar Sesión
          </button>
        </div>

        {pathname === '/plan' && (
          <div className="sidebar-legend">
            <div className="sidebar-legend-title">Referencias</div>
            <div className="sidebar-legend-item"><div className="legend-dot ld-disabled"></div> Bloqueada</div>
            <div className="sidebar-legend-item"><div className="legend-dot ld-available"></div> Disponible</div>
            <div className="sidebar-legend-item"><div className="legend-dot" style={{ backgroundColor: 'var(--cursando)' }}></div> Cursando</div>
            <div className="sidebar-legend-item"><div className="legend-dot ld-cursada"></div> Cursada</div>
            <div className="sidebar-legend-item"><div className="legend-dot ld-aprobada"></div> Aprobada</div>
            
            <div className="sidebar-divider" style={{ margin: '8px 0' }}></div>
            <button 
              className="sidebar-action-btn" 
              onClick={() => {
                setIsSidebarOpen(false); 
                setIsModalOpen(true);    
              }}
              style={{ justifyContent: 'center', background: 'var(--cursando)', color: 'black', border: 'none', marginTop: '4px' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              ¿Cómo usar el Plan?
            </button>
          </div>
        )}
      </aside>

      <WelcomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AnnouncementModal />

      <div>
        {children}
      </div>

      <footer style={{ background: 'var(--panel)', borderTop: '1px solid var(--border)', padding: '30px 20px', marginTop: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          
          <div style={{ color: 'var(--muted)', fontSize: '0.8rem', textAlign: 'center', flex: '1 1 auto' }}>
            © {new Date().getFullYear()} Mateo Geffroy • <strong>Mi Estado Académico</strong>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', flex: '1 1 auto', fontSize: '0.8rem', color: 'var(--muted)' }}>
            <Link 
              href="/terminos" 
              style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} 
              onMouseOver={(e) => e.currentTarget.style.color = 'white'} 
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}
            >
              Términos y Condiciones
            </Link>
            <span style={{ opacity: 0.5 }}>|</span>
            <Link 
              href="/privacidad" 
              style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} 
              onMouseOver={(e) => e.currentTarget.style.color = 'white'} 
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}
            >
              Políticas de Privacidad
            </Link>
          </div>

          <div style={{ color: 'var(--muted)', fontSize: '0.8rem', textAlign: 'center', flex: '1 1 auto' }}>
            UTN FRLP - Sistemas de Información
          </div>
          
        </div>
      </footer>
    </>
  );
}