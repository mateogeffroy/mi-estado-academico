'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // <-- Agregamos useRouter
import WelcomeModal from './WelcomeModal';
import { supabase } from '../lib/supabase';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  
  const pathname = usePathname();
  const router = useRouter(); // <-- Inicializamos el router

  // Lógica para resaltar la sección activa en el Dashboard
  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      // Incluimos 'agenda' como la primera sección detectable
      const sections = ['agenda', 'cursando', 'progreso'];
      const scrollPosition = window.scrollY + 150; // Offset para el header fijo

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

  if (pathname === '/login') return <>{children}</>;

  // Función de logout actualizada con redirección
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // Redirige al login
    router.refresh(); // Limpia la caché de Next.js por seguridad
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
                {/* Navegación dinámica para el Home */}
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
            {/* El botón de ayuda ahora solo es visible en la vista del Plan */}
            {pathname === '/plan' && (
              <button className="help-btn" onClick={() => setIsModalOpen(true)}>?</button>
            )}
            <a href="https://cafecito.app/mateogeffroy" target="_blank" rel="noopener noreferrer" className="cafecito-btn header-cafecito">Cafecito</a>
            {/* Botón de logout ahora funciona perfecto */}
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