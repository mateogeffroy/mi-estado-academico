'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';

// 🔥 DICCIONARIOS DE UNIVERSIDADES Y CARRERAS
const UNIVERSIDADES = [
  { id: 'utn', name: 'UTN (FRLP)' },
  { id: 'unlp', name: 'UNLP' }
];

const CARRERAS_POR_UNI: Record<string, { id: string, name: string }[]> = {
  'utn': [
    { id: 'utn-sistemas-2023', name: 'Ingeniería en Sistemas de Información (Plan 2023)' },
    { id: 'utn-civil-2023', name: 'Ingeniería Civil (Plan 2023)' },
    { id: 'utn-industrial-2008', name: 'Ingeniería Industrial (Plan 2008)' },
    { id: 'utn-mecanica-2023', name: 'Ingeniería Mecánica (Plan 2023)' },
    { id: 'utn-quimica-2008', name: 'Ingeniería Química (Plan 2008)' },
    { id: 'utn-electrica-2023', name: 'Ingeniería Eléctrica (Plan 2023)' },
  ],
  'unlp': [
    { id: 'unlp-apu-2021', name: 'Analista Programador Universitario (Plan 2021)' },
    { id: 'unlp-sistemas-2021', name: 'Licenciatura en Sistemas (Plan 2021)' },
    { id: 'unlp-informatica-2021', name: 'Licenciatura en Informática (Plan 2021)' },
    { id: 'unlp-psicologia-2012', name: 'Licenciatura y Profesorado en Psicología (Plan 2012)' },
    { id: 'unlp-computacion-2024', name: 'Ingeniería en Computación (Plan 2024)' },
  ]
};

export default function OnboardingPage() {
  const [nombre, setNombre] = useState('');
  const [universidad, setUniversidad] = useState('utn');
  const [carreraId, setCarreraId] = useState('utn-sistemas-2023');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para nuestro menú desplegable personalizado
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Variables para saber qué mostrar en el botón
  const opcionesCarreras = CARRERAS_POR_UNI[universidad] || [];
  const carreraSeleccionada = opcionesCarreras.find(c => c.id === carreraId);
  const nombreCarreraAMostrar = carreraSeleccionada ? carreraSeleccionada.name : 'Seleccioná tu carrera...';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.user_metadata?.full_name) {
        setNombre(session.user.user_metadata.full_name);
      }
    });
  }, []);

  // Mantiene sincronizada la carrera al cambiar de universidad
  useEffect(() => {
    if (CARRERAS_POR_UNI[universidad] && CARRERAS_POR_UNI[universidad].length > 0) {
      setCarreraId(CARRERAS_POR_UNI[universidad][0].id);
    }
  }, [universidad]);

  // Efecto para cerrar el menú si se hace clic en cualquier otro lado de la pantalla
  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.custom-select-wrapper')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!nombre.trim()) {
      setError('Por favor, ingresá tu nombre o apodo.');
      setLoading(false);
      return;
    }

    // Actualizamos la metadata
    const { data: authData, error: updateError } = await supabase.auth.updateUser({
      data: { full_name: nombre, carrera_id: carreraId }
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    // Insertamos la carrera en la BD
    if (authData?.user) {
      await supabase
        .from('progreso_usuarios')
        .upsert({ 
          id_usuario: authData.user.id,
          carrera_id: carreraId
        }, { onConflict: 'id_usuario' });
    }

    // Redirección dura al inicio para limpiar la caché de Next.js
    window.location.href = '/';
  };

  return (
    <>
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="login-card" style={{ maxWidth: '450px', width: '100%', padding: '40px', background: 'var(--panel)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 900, marginBottom: '10px' }}>
              ¡Ya casi estamos!
            </h1>
            <p style={{ color: 'var(--muted)' }}>Completá tu perfil para empezar a trackear tu cursada.</p>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>¿Cómo te llamás?</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Tu nombre o apodo" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{ padding: '15px', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>¿En qué universidad estudiás?</label>
              <select 
                value={universidad}
                onChange={(e) => setUniversidad(e.target.value)}
                style={{ padding: '15px', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem', cursor: 'pointer' }}
              >
                {UNIVERSIDADES.map(uni => (
                  <option key={uni.id} value={uni.id} style={{ background: 'var(--panel)' }}>
                    {uni.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>¿Qué carrera cursás?</label>
              
              {/* INICIO DEL DROPDOWN PERSONALIZADO */}
              <div className="custom-select-wrapper" style={{ position: 'relative', width: '100%' }}>
                
                {/* El botón principal que se muestra siempre */}
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    padding: '15px 18px',
                    borderRadius: '12px',
                    border: `1px solid ${isDropdownOpen ? '#3b82f6' : 'var(--border)'}`,
                    background: 'rgba(0,0,0,0.2)',
                    color: carreraSeleccionada ? '#ffffff' : 'var(--muted)',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: isDropdownOpen ? '0 0 0 3px rgba(59, 130, 246, 0.2)' : 'none'
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {nombreCarreraAMostrar}
                  </span>
                  <svg 
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', minWidth: '20px', color: 'var(--muted)' }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>

                {/* La lista de opciones flotante */}
                {isDropdownOpen && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      marginTop: '8px',
                      background: 'var(--panel)', // Usa el mismo color de tus paneles
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      zIndex: 50,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      animation: 'fadeInDown 0.2s ease-out'
                    }}
                  >
                    <div style={{ maxHeight: '240px', overflowY: 'auto' }} className="custom-scrollbar">
                      {opcionesCarreras.map((carrera) => (
                        <div
                          key={carrera.id}
                          onClick={() => {
                            setCarreraId(carrera.id);
                            setIsDropdownOpen(false);
                          }}
                          style={{
                            padding: '12px 18px',
                            color: carreraId === carrera.id ? '#3b82f6' : 'var(--text)',
                            background: carreraId === carrera.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                            cursor: 'pointer',
                            transition: 'background 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                          onMouseEnter={(e) => { if (carreraId !== carrera.id) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                          onMouseLeave={(e) => { if (carreraId !== carrera.id) e.currentTarget.style.background = 'transparent' }}
                        >
                          {/* Ícono de check si está seleccionada */}
                          {carreraId === carrera.id ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          ) : (
                            <div style={{ width: '16px', flexShrink: 0 }}></div>
                          )}
                          <span style={{ fontSize: '0.95rem' }}>
                            {carrera.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* FIN DEL DROPDOWN PERSONALIZADO */}
            </div>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
              style={{ padding: '15px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '10px' }}
            >
              {loading ? 'Guardando...' : 'Comenzar a usar la app'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}