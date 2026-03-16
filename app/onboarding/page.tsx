'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../src/lib/supabase';

export default function OnboardingPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [carrera, setCarrera] = useState('Ingeniería en Sistemas de Información');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificamos si ya está logueado
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else if (session.user.user_metadata?.full_name) {
        // Si ya tiene nombre, no tiene nada que hacer acá
        router.push('/');
      }
    };
    checkUser();
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!nombre.trim()) {
      setError('Por favor, ingresá tu nombre o apodo.');
      setLoading(false);
      return;
    }

    // Actualizamos la metadata del usuario en Supabase
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: nombre,
        carrera: carrera
      }
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    // 🔥 SOLUCIÓN: Forzamos una recarga completa para que el Dashboard lea el nombre nuevo al instante
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
            <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>¿Qué carrera estudiás?</label>
            <select 
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              style={{ padding: '15px', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem', cursor: 'pointer' }}
            >
              <option value="Ingeniería en Sistemas de Información">Ingeniería en Sistemas de Información</option>
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