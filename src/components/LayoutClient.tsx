'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import WelcomeModal from './WelcomeModal';
import { supabase } from '../lib/supabase';
import AnnouncementModal from './AnnouncementModal';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // LA CORTINA: Empezamos asumiendo que estamos chequeando
  const [isChecking, setIsChecking] = useState(true); 
  
  const pathname = usePathname();
  const router = useRouter(); 

  // --- PATOVICA (ROUTE GUARD UNIFICADO) ---
  useEffect(() => {
    const checkAccess = (session: any) => {
      if (!session) {
        if (pathname !== '/login' && pathname !== '/onboarding') {
          router.push('/login');
        } else {
          setIsChecking(false); // Liberamos la cortina si ya está en login
        }
      } else {
        const hasName = session.user?.user_metadata?.full_name;
        
        if (!hasName && pathname !== '/onboarding') {
          router.push('/onboarding');
        } else if (hasName && (pathname === '/login' || pathname === '/onboarding')) {
          router.push('/');
        } else {
          setIsChecking(false); // Todo en orden, liberamos la cortina
        }
      }
    };

    const verificarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      checkAccess(session);
    };
    verificarSesion();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Si el evento es INITIAL_SESSION no hacemos nada porque ya lo maneja getSession
      if (event !== 'INITIAL_SESSION') {
        checkAccess(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  // Si la cortina está baja, mostramos una pantalla de carga sutil
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

  // Ocultamos el Layout completo para Login y Onboarding
  if (pathname === '/login' || pathname === '/onboarding') return <>{children}</>;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login'; 
  };

  return (
    <>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, width: '100%', zIndex: 1000, background: 'rgba(13, 15, 20, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
        <div className="header-content">
          <div className="header-left">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div className="header-titles">
                <div className="logo">
                  Mi Estado <span style={{ color: 'var(--cursando)' }}>Académico</span>
                </div>
                <div className="subtitle">ING. EN SISTEMAS DE INFORMACIÓN - UTN FRLP</div>
              </div>
            </Link>
          </div>

          <div className="header-center desktop-only">
            {pathname === '/plan' && (
              <div className="legend">
                <div className="legend-item"><div className="legend-dot ld-disabled"></div>Bloqueada</div>
                <div className="legend-item"><div className="legend-dot ld-available"></div>Disponible</div>
                <div className="legend-item"><div className="legend-dot" style={{ backgroundColor: 'var(--cursando)' }}></div>Cursando</div>
                <div className="legend-item"><div className="legend-dot ld-cursada"></div>Cursada</div>
                <div className="legend-item"><div className="legend-dot ld-aprobada"></div>Aprobada</div>
              </div>
            )}
          </div>

          <div className="header-actions desktop-only">
            {pathname !== '/plan' && (
              <Link href="/plan" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', marginRight: '5px' }}>
                  🚀 Plan
                </button>
              </Link>
            )}

            {pathname !== '/cursada' && (
              <Link href="/cursada" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '7px 15px', fontSize: '0.9rem', marginRight: '15px', borderRadius: '6px', background: 'transparent', border: '1px solid var(--border)', color: 'white', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--cursando)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                  🎒 Cursada
                </button>
              </Link>
            )}

            {pathname === '/plan' && (
              <button className="help-btn" onClick={() => setIsModalOpen(true)} style={{ marginRight: '15px' }}>?</button>
            )}
            
            <button className="btn-danger header-cafecito" onClick={handleLogout}>Cerrar sesión</button>
          </div>

          <button className="hamburger-btn mobile-only" onClick={() => setIsSidebarOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </header>

      <WelcomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AnnouncementModal />

      <div style={{ minHeight: '80vh' }}>
        {children}
      </div>

      <footer style={{ background: 'var(--panel)', borderTop: '1px solid var(--border)', padding: '40px 20px', marginTop: 'auto', position: 'relative', zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>
              Mi Estado <span style={{ color: 'var(--cursando)' }}>Académico</span>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              Proyecto independiente para estudiantes de la UTN FRLP. No oficial.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem' }}>
            <Link href="/privacidad" style={{ color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}>
              Política de Privacidad
            </Link>
            <Link href="/terminos" style={{ color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}>
              Términos y Condiciones
            </Link>
          </div>

          <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} Mateo Geffroy. Todos los derechos reservados.
          </div>

        </div>
      </footer>
    </>
  );
}