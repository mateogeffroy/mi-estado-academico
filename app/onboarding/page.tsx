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
  ]
};

export default function OnboardingPage() {
  const [nombre, setNombre] = useState('');
  const [universidad, setUniversidad] = useState('utn');
  const [carreraId, setCarreraId] = useState('utn-sistemas-2023');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.user_metadata?.full_name) {
        setNombre(session.user.user_metadata.full_name);
      }
    });
  }, []);

  // 2. Mantiene sincronizada la carrera al cambiar de universidad
  useEffect(() => {
    if (CARRERAS_POR_UNI[universidad] && CARRERAS_POR_UNI[universidad].length > 0) {
      setCarreraId(CARRERAS_POR_UNI[universidad][0].id);
    }
  }, [universidad]);

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

    // 🔥 Redirección dura al inicio para limpiar la caché de Next.js
    window.location.href = '/';
  };

  return (
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
            <select 
              value={carreraId}
              onChange={(e) => setCarreraId(e.target.value)}
              style={{ padding: '15px', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem', cursor: 'pointer' }}
            >
              {CARRERAS_POR_UNI[universidad]?.map(carrera => (
                <option key={carrera.id} value={carrera.id} style={{ background: 'var(--panel)' }}>
                  {carrera.name}
                </option>
              ))}
            </select>
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
  );
}