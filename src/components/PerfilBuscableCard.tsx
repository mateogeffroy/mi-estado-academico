'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from './Card';
import { supabase } from '../lib/supabase';
import { amistadesRepository } from '../infrastructure/repositorios';

/**
 * Opt-in para aparecer en la búsqueda de gente. Arranca apagado para todos:
 * mientras esté apagado, nadie puede encontrarte ni mandarte solicitudes.
 */
export default function PerfilBuscableCard({ careerId }: { careerId?: string | null }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [buscable, setBuscable] = useState<boolean | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amigos, setAmigos] = useState(0);
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  useEffect(() => {
    if (!userId) return;
    amistadesRepository
      .obtenerMiPerfil(userId)
      .then(perfil => {
        setBuscable(perfil?.buscable ?? false);
        // La carrera del perfil público sigue a la carrera activa: es el
        // único dato de carrera que ven los demás, así que no puede quedar
        // desactualizado cuando el usuario cambia de plan.
        if (perfil && careerId && perfil.carreraId !== careerId) {
          amistadesRepository.actualizarMiPerfil(userId, { carreraId: careerId }).catch(() => {});
        }
      })
      .catch(e => setError(e.message));

    amistadesRepository
      .obtenerAmistades(userId)
      .then(relaciones => {
        setAmigos(relaciones.filter(a => a.estado === 'aceptada').length);
        setPendientes(relaciones.filter(a => a.estado === 'pendiente' && a.destinatarioId === userId).length);
      })
      .catch(() => {});
  }, [userId, careerId]);

  const cambiar = async (valor: boolean) => {
    if (!userId) return;
    setGuardando(true);
    setError(null);
    const previo = buscable;
    setBuscable(valor);
    try {
      await amistadesRepository.actualizarMiPerfil(userId, { buscable: valor, carreraId: careerId ?? null });
    } catch (e: any) {
      setBuscable(previo);
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  if (buscable === null) return null;

  return (
    <Card style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ color: 'var(--text-strong)', margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Aparecer en las búsquedas
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
            Mientras esté activado, otras personas pueden encontrarte por tu nombre, verte en el listado de
            tu comisión y mandarte solicitudes. Se muestra tu nombre, tu carrera y qué materias cursás:
            nunca tus notas ni tus horarios. Si lo desactivás, sólo te ven tus amigos.
          </p>
          {error && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', margin: '8px 0 0 0' }}>{error}</p>}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: guardando ? 'wait' : 'pointer', flexShrink: 0 }}>
          <input
            type="checkbox"
            checked={buscable}
            disabled={guardando}
            onChange={e => cambiar(e.target.checked)}
            style={{ width: '20px', height: '20px', accentColor: 'var(--cursando)', cursor: 'inherit' }}
          />
          <span style={{ color: buscable ? 'var(--cursando)' : 'var(--muted)', fontWeight: 700, fontSize: '0.85rem' }}>
            {buscable ? 'Visible' : 'Oculto'}
          </span>
        </label>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
        <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
          <strong style={{ color: 'var(--text-strong)' }}>{amigos}</strong> {amigos === 1 ? 'amigo' : 'amigos'}
        </span>
        {pendientes > 0 && (
          <span style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 700 }}>
            {pendientes} {pendientes === 1 ? 'solicitud sin responder' : 'solicitudes sin responder'}
          </span>
        )}
        <Link href="/buscar" style={{ marginLeft: 'auto', color: 'var(--cursando)', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
          Ver amigos y solicitudes →
        </Link>
      </div>
    </Card>
  );
}
