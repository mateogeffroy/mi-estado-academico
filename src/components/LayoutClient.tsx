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
    let isMounted = true; // Evita fugas de memoria si el componente se desmonta

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
        if (isMounted) setIsChecking(false); // Liberar pantalla de carga en caso de error
      }
    };

    checkAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== 'INITIAL_SESSION' && isMounted) {
        // Validación simplificada para no trabar el ruteo
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
    gap: '6px',
    border: '1px solid transparent',
    whiteSpace: 'nowrap' as const
  };

  return (
    <>
      <header>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', position: 'relative', zIndex: 1000 }}>
          
          {/* 1. IZQUIERDA: Logo con tu estilo exacto */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div className="header-titles">
                <div className="logo">
                  Mi Estado <span style={{ color: 'var(--cursando)' }}>Académico</span>
                </div>
                {/* Le agrego desktop-only al subtítulo para que en celular no se rompa la línea */}
                <div className="subtitle desktop-only">ING. EN SISTEMAS DE INFORMACIÓN - UTN FRLP</div>
              </div>
            </Link>
          </div>

          {/* 2. CENTRO: Referencias (Ocultas en celular) */}
          <div className="desktop-only" style={{ flex: 1, justifyContent: 'center' }}>
            {pathname === '/plan' && (
              <div style={{ display: 'flex', gap: '20px', fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="legend-dot ld-disabled" style={{ width: '8px', height: '8px' }}></div>Bloqueada</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="legend-dot ld-available" style={{ width: '8px', height: '8px' }}></div>Disponible</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="legend-dot" style={{ backgroundColor: 'var(--cursando)', width: '8px', height: '8px' }}></div>Cursando</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="legend-dot ld-cursada" style={{ width: '8px', height: '8px' }}></div>Cursada</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="legend-dot ld-aprobada" style={{ width: '8px', height: '8px' }}></div>Aprobada</div>
              </div>
            )}
          </div>

          {/* 3. DERECHA: Contenedor para acciones */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            
            {/* Botones de PC */}
            <div className="desktop-only" style={{ gap: '10px', alignItems: 'center' }}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <button style={{ ...navBtnBase, background: pathname === '/' ? 'var(--cursando)' : 'rgba(255,255,255,0.03)', color: pathname === '/' ? 'black' : 'white', border: pathname === '/' ? 'none' : '1px solid var(--border)' }}>
                  🏠 Inicio
                </button>
              </Link>
              <Link href="/plan" style={{ textDecoration: 'none' }}>
                <button style={{ ...navBtnBase, background: pathname === '/plan' ? 'var(--cursando)' : 'rgba(255,255,255,0.03)', color: pathname === '/plan' ? 'black' : 'white', border: pathname === '/plan' ? 'none' : '1px solid var(--border)' }}>
                  🚀 Plan
                </button>
              </Link>
              <Link href="/cursada" style={{ textDecoration: 'none' }}>
                <button style={{ ...navBtnBase, background: pathname === '/cursada' ? 'var(--cursando)' : 'rgba(255,255,255,0.03)', color: pathname === '/cursada' ? 'black' : 'white', border: pathname === '/cursada' ? 'none' : '1px solid var(--border)' }}>
                  🎒 Cursada
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

            {/* BURGER ICON: Solo en celular */}
            <button 
              className="mobile-only hamburger-btn" 
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
          <Link href="/" className={`sidebar-action-btn ${pathname === '/' ? 'active-route' : ''}`}>
            🏠 Inicio
          </Link>
          <Link href="/plan" className={`sidebar-action-btn ${pathname === '/plan' ? 'active-route' : ''}`}>
            🚀 Plan de Estudios
          </Link>
          <Link href="/cursada" className={`sidebar-action-btn ${pathname === '/cursada' ? 'active-route' : ''}`}>
            🎒 Ver Mi Cursada
          </Link>
          
          <div className="sidebar-divider" style={{ margin: '10px 0' }}></div>
          
          <button className="sidebar-action-btn btn-danger-sidebar" onClick={handleLogout}>
            🚪 Cerrar Sesión
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
          </div>
        )}
      </aside>

      <WelcomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AnnouncementModal />

      <div>
        {children}
      </div>

      {/* --- FOOTER CON ENLACES LEGALES --- */}
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