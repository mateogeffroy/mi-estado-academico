'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Input from '../../src/components/Input';
import Card from '../../src/components/Card';
import Tabs from '../../src/components/Tabs';
import PersonCard from '../../src/components/PersonCard';
import { supabase } from '../../src/lib/supabase';
import { amistadesRepository } from '../../src/infrastructure/repositorios';
import { Amistad, PerfilPublico, relacionCon } from '../../src/application/ports/AmistadesRepository';

const TABS = [
  { id: 'buscar', label: 'Buscar' },
  { id: 'solicitudes', label: 'Solicitudes' },
  { id: 'amigos', label: 'Amigos' },
];

export default function BuscarPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  const [tab, setTab] = useState('buscar');
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<PerfilPublico[]>([]);
  const [buscando, setBuscando] = useState(false);

  const [amistades, setAmistades] = useState<Amistad[]>([]);
  const [perfiles, setPerfiles] = useState<Record<string, PerfilPublico>>({});
  const [ocupadoCon, setOcupadoCon] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [soyBuscable, setSoyBuscable] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setCargandoSesion(false);
    });
  }, []);

  // Relaciones propias + los perfiles de la otra punta, para poder mostrar
  // nombre y carrera en las pestañas de solicitudes y amigos.
  const recargarAmistades = useCallback(async (id: string) => {
    const relaciones = await amistadesRepository.obtenerAmistades(id);
    setAmistades(relaciones);
    const otros = relaciones.map(a => (a.solicitanteId === id ? a.destinatarioId : a.solicitanteId));
    const cargados = await amistadesRepository.obtenerPerfiles(otros);
    setPerfiles(Object.fromEntries(cargados.map(p => [p.userId, p])));
  }, []);

  useEffect(() => {
    if (!userId) return;
    recargarAmistades(userId).catch(e => setError(e.message));
    amistadesRepository.obtenerMiPerfil(userId).then(p => setSoyBuscable(p?.buscable ?? false)).catch(() => {});
  }, [userId, recargarAmistades]);

  // Espera a que se deje de tipear antes de pegarle a la base.
  useEffect(() => {
    if (!userId) return;
    const texto = query.trim();
    if (texto.length < 2) {
      setResultados([]);
      return;
    }
    setBuscando(true);
    const timer = setTimeout(() => {
      amistadesRepository
        .buscarPersonas(userId, texto)
        .then(setResultados)
        .catch(e => setError(e.message))
        .finally(() => setBuscando(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query, userId]);

  const accion = async (fn: () => Promise<void>, otroId: string) => {
    if (!userId) return;
    setOcupadoCon(otroId);
    setError(null);
    try {
      await fn();
      await recargarAmistades(userId);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setOcupadoCon(null);
    }
  };

  const tarjeta = (persona: PerfilPublico) => (
    <PersonCard
      key={persona.userId}
      persona={persona}
      relacion={userId ? relacionCon(amistades, userId, persona.userId) : 'ninguna'}
      ocupado={ocupadoCon === persona.userId}
      onAgregar={p => accion(() => amistadesRepository.enviarSolicitud(userId!, p.userId), p.userId)}
      onAceptar={p => accion(() => amistadesRepository.aceptarSolicitud(userId!, p.userId), p.userId)}
      onEliminar={p => accion(() => amistadesRepository.eliminarRelacion(userId!, p.userId), p.userId)}
    />
  );

  const conPerfil = (ids: string[]) => ids.map(id => perfiles[id]).filter(Boolean);
  const recibidas = conPerfil(
    amistades.filter(a => a.estado === 'pendiente' && a.destinatarioId === userId).map(a => a.solicitanteId)
  );
  const amigos = conPerfil(
    amistades
      .filter(a => a.estado === 'aceptada')
      .map(a => (a.solicitanteId === userId ? a.destinatarioId : a.solicitanteId))
  );

  if (cargandoSesion) return <main className="buscar-main" />;

  if (!userId) {
    return (
      <main className="buscar-main">
        <Card style={{ textAlign: 'center' }}>
          Necesitás <Link href="/login" style={{ color: 'var(--cursando)' }}>iniciar sesión</Link> para buscar gente.
        </Card>
      </main>
    );
  }

  return (
    <main className="buscar-main">
      <style>{`
        .buscar-main { padding-bottom: 60px; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-5); }
        .person-list { display: flex; flex-direction: column; gap: var(--space-2); }
        .person-card { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); flex-wrap: wrap; background: var(--panel); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px 14px; }
        .person-card-info { display: flex; align-items: center; gap: var(--space-3); min-width: 0; }
        .person-card-nombre { font-weight: 600; color: var(--text-strong); font-size: 0.9rem; overflow-wrap: anywhere; }
        .person-card-carrera { font-size: 0.75rem; color: var(--muted); }
        .person-card-acciones { display: flex; align-items: center; gap: var(--space-2); flex-shrink: 0; }
        .person-card-acciones button { padding: 6px 12px; font-size: 0.8rem; }
        .buscar-vacio { color: var(--muted); font-size: 0.85rem; text-align: center; padding: var(--space-5) 0; }
      `}</style>

      <div>
        <h1 style={{ color: 'var(--text-strong)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', margin: '0 0 8px 0' }}>Buscar gente</h1>
        <p style={{ color: 'var(--muted)', margin: 0 }}>Encontrá compañeros y agregalos como amigos.</p>
      </div>

      {!soyBuscable && (
        <Card style={{ borderLeft: '3px solid var(--warning)', fontSize: '0.85rem' }}>
          No aparecés en las búsquedas de otras personas. Podés activarlo desde{' '}
          <Link href="/perfil" style={{ color: 'var(--cursando)' }}>tu perfil</Link>.
        </Card>
      )}

      <Tabs
        items={TABS.map(t => (t.id === 'solicitudes' && recibidas.length > 0 ? { ...t, label: `Solicitudes (${recibidas.length})` } : t))}
        activeId={tab}
        onChange={setTab}
      />

      {error && <Card style={{ borderLeft: '3px solid var(--danger)', color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</Card>}

      {tab === 'buscar' && (
        <>
          <Input
            type="text"
            placeholder="Buscar por nombre..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          {query.trim().length < 2 ? (
            <div className="buscar-vacio">Escribí al menos 2 letras para buscar.</div>
          ) : buscando ? (
            <div className="buscar-vacio">Buscando...</div>
          ) : resultados.length === 0 ? (
            <div className="buscar-vacio">No encontramos a nadie con ese nombre.</div>
          ) : (
            <div className="person-list">{resultados.map(tarjeta)}</div>
          )}
        </>
      )}

      {tab === 'solicitudes' && (
        recibidas.length === 0
          ? <div className="buscar-vacio">No tenés solicitudes pendientes.</div>
          : <div className="person-list">{recibidas.map(tarjeta)}</div>
      )}

      {tab === 'amigos' && (
        amigos.length === 0
          ? <div className="buscar-vacio">Todavía no agregaste a nadie.</div>
          : <div className="person-list">{amigos.map(tarjeta)}</div>
      )}
    </main>
  );
}
