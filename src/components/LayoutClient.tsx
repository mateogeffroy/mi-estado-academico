'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import WelcomeModal from './WelcomeModal';
import { supabase } from '../lib/supabase';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  
  const pathname = usePathname();
  const router = useRouter(); 

  // --- Lógica para resaltar la sección activa en el Dashboard ---
  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      const sections = ['agenda', 'cursando', 'progreso'];
      const scrollPosition = window.scrollY + 150; 

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // --- PATOVICA (ROUTE GUARD) ---
  useEffect(() => {
    // Verificamos si hay sesión activa al cargar la página
    const verificarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Si no hay sesión y no estamos en la página de login, lo pateamos al login
      if (!session && pathname !== '/login') {
        router.push('/login');
      }
    };

    verificarSesion();

    // Nos suscribimos a cambios (ej: si se le vence la sesión o cierra desde otra pestaña)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && pathname !== '/login') {
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);
  // ------------------------------

  if (pathname === '/login') return <>{children}</>;

  // Función de logout con redirección
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); 
    router.refresh(); 
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
            {pathname === '/' && (
              <nav className="dashboard-nav">
                <a href="#agenda" className={activeSection === 'agenda' ? 'active' : ''}>Eventos</a>
                <a href="#cursando" className={activeSection === 'cursando' ? 'active' : ''}>Cursando</a>
                <a href="#progreso" className={activeSection === 'progreso' ? 'active' : ''}>Progreso</a>
              </nav>
            )}
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
            {/* Si estamos en el Home, mostramos el botón al Plan */}
            {pathname === '/' && (
              <Link href="/plan" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', marginRight: '10px' }}>
                  Plan de estudios 🚀
                </button>
              </Link>
            )}

            {/* Si estamos en el Plan, mostramos la ayuda */}
            {pathname === '/plan' && (
              <button className="help-btn" onClick={() => setIsModalOpen(true)}>?</button>
            )}
            
            <a href="https://cafecito.app/mateogeffroy" target="_blank" rel="noopener noreferrer" className="cafecito-btn header-cafecito">Cafecito</a>
            <button className="btn-danger header-cafecito" onClick={handleLogout}>Cerrar sesión</button>
          </div>

          <button className="hamburger-btn mobile-only" onClick={() => setIsSidebarOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </header>

    <WelcomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {children}
    </>
  );
}