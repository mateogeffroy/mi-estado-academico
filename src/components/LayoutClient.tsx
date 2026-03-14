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
  
  const pathname = usePathname();
  const router = useRouter(); 

  useEffect(() => {
    const checkAccess = (session: any) => {
      if (!session) {
        if (pathname !== '/login' && pathname !== '/onboarding') {
          router.push('/login');
        } else {
          setIsChecking(false);
        }
      } else {
        const hasName = session.user?.user_metadata?.full_name;
        if (!hasName && pathname !== '/onboarding') {
          router.push('/onboarding');
        } else if (hasName && (pathname === '/login' || pathname === '/onboarding')) {
          router.push('/');
        } else {
          setIsChecking(false);
        }
      }
    };

    const verificarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      checkAccess(session);
    };
    verificarSesion();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== 'INITIAL_SESSION') {
        checkAccess(session);
      }
    });

    return () => subscription.unsubscribe();
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
      <header style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, width: '100%', zIndex: 1000, 
        background: 'rgba(13, 15, 20, 0.98)', backdropFilter: 'blur(15px)', 
        borderBottom: '1px solid var(--border)', height: '70px', display: 'flex'
      }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '0 40px' }}>
          
          {/* 1. IZQUIERDA: Tu estilo original de Logo */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div className="header-titles">
                <div className="logo">
                  Mi Estado <span style={{ color: 'var(--cursando)' }}>Académico</span>
                </div>
                <div className="subtitle">ING. EN SISTEMAS DE INFORMACIÓN - UTN FRLP</div>
              </div>
            </Link>
          </div>

          {/* 2. CENTRO: Referencias (Solo en /plan) */}
          <div style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
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

          {/* 3. DERECHA: Botones anclados */}
          <div style={{ flex: 1, display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end' }}>
            
            <Link href="/" style={{ textDecoration: 'none' }}>
              <button style={{
                  ...navBtnBase,
                  background: pathname === '/' ? 'var(--cursando)' : 'rgba(255,255,255,0.03)',
                  color: pathname === '/' ? 'black' : 'white',
                  border: pathname === '/' ? 'none' : '1px solid var(--border)'
                }}>
                🏠 Inicio
              </button>
            </Link>

            <Link href="/plan" style={{ textDecoration: 'none' }}>
              <button style={{
                  ...navBtnBase,
                  background: pathname === '/plan' ? 'var(--cursando)' : 'rgba(255,255,255,0.03)',
                  color: pathname === '/plan' ? 'black' : 'white',
                  border: pathname === '/plan' ? 'none' : '1px solid var(--border)'
                }}>
                🚀 Plan
              </button>
            </Link>

            <Link href="/cursada" style={{ textDecoration: 'none' }}>
              <button style={{
                  ...navBtnBase,
                  background: pathname === '/cursada' ? 'var(--cursando)' : 'rgba(255,255,255,0.03)',
                  color: pathname === '/cursada' ? 'black' : 'white',
                  border: pathname === '/cursada' ? 'none' : '1px solid var(--border)'
                }}>
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
        </div>
      </header>

      <WelcomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AnnouncementModal />

      <div style={{ minHeight: '80vh', paddingTop: '70px' }}>
        {children}
      </div>

      <footer style={{ background: 'var(--panel)', borderTop: '1px solid var(--border)', padding: '30px 40px', marginTop: '60px' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Mateo Geffroy • <strong>Mi Estado Académico</strong>
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
            UTN FRLP - Sistemas de Información
          </div>
        </div>
      </footer>
    </>
  );
}