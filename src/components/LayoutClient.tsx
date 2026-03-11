'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WelcomeModal from './WelcomeModal';
import { supabase } from '../lib/supabase';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === '/login') {
    return <>{children}</>;
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <header>
        <div className="header-content">
          <div className="header-left">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div className="header-titles">
                <div className="logo">Plan de estudios <span>dinámico</span></div>
                <div className="subtitle">Ing. en sistemas UTN-FRLP - Plan 2023</div>
              </div>
            </Link>
            
            <div className="legend">
              <div className="legend-item"><div className="legend-dot ld-disabled"></div>Bloqueada</div>
              <div className="legend-item"><div className="legend-dot ld-available"></div>Disponible</div>
              <div className="legend-item"><div className="legend-dot ld-cursada"></div>Cursada</div>
              <div className="legend-item"><div className="legend-dot ld-aprobada"></div>Aprobada</div>
            </div>
          </div>

          <div className="header-actions desktop-only">
            <button className="help-btn" title="Ayuda y tutorial" onClick={() => setIsModalOpen(true)}>?</button>
            <a href="https://cafecito.app/mateogeffroy" target="_blank" rel="noopener noreferrer" className="cafecito-btn header-cafecito" style={{ display: 'flex', gap: '6px', alignItems: 'center', position: 'static', boxShadow: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
              Cafecito
            </a>
            <button className="btn-danger header-cafecito" onClick={handleLogout} style={{ display: 'flex', gap: '8px', alignItems: 'center' }} title="Cerrar Sesión">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Cerrar Sesión
            </button>
          </div>

          <button className="hamburger-btn mobile-only" onClick={toggleSidebar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </header>

      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
      <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h3>Menú</h3>
          <button className="close-sidebar-btn" onClick={toggleSidebar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="sidebar-content">
          <button className="sidebar-action-btn" onClick={() => { setIsModalOpen(true); toggleSidebar(); }}>
            <span className="help-icon-mini">?</span> Ayuda
          </button>
          <a href="https://cafecito.app/mateogeffroy" target="_blank" rel="noopener noreferrer" className="sidebar-action-btn cafecito-sidebar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
            Invitame un cafecito
          </a>
          <button className="sidebar-action-btn btn-danger-sidebar" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Cerrar Sesión
          </button>
        </div>
      </div>

      <WelcomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {children}
    </>
  );
}