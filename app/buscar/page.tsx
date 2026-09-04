'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Input from '../../src/components/Input';
import Card from '../../src/components/Card';
import Tabs from '../../src/components/Tabs';
import PersonCard from '../../src/components/PersonCard';
import ConfirmModal from '../../src/components/ConfirmModal';
import { supabase } from '../../src/lib/supabase';
import { marcarSolicitudesVistas } from '../../src/lib/solicitudesVistas';
import { amistadesRepository } from '../../src/infrastructure/repositorios';
import { Amistad, PerfilPublico, relacionCon } from '../../src/application/ports/AmistadesRepository';

const TABS = [
  { id: 'buscar', label: 'Buscar' },
  { id: 'solicitudes', label: 'Solicitudes' },
  { id: 'amigos', label: 'Amigos' },
  { id: 'bloqueados', label: 'Bloqueados' },
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
  const [bloqueados, setBloqueados] = useState<PerfilPublico[]>([]);
  const [aBloquear, setABloquear] = useState<PerfilPublico | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setCargandoSesion(false);
    });
  }, []);

  // Relaciones propias + los perfiles de la otra punta, para poder mostrar
  // nombre y carrera en las pestañas de solicitudes y amigos.
  const recargarAmistades = useCallback(async (id: string) => {
    const [relaciones, listaBloqueados] = await Promise.all([
      amistadesRepository.obtenerAmistades(id),
      amistadesRepository.obtenerBloqueados(id),
    ]);
    setAmistades(relaciones);
    setBloqueados(listaBloqueados);
    const otros = relaciones.map(a => (a.solicitanteId === id ? a.destinatarioId : a.solicitanteId));
    const cargados = await amistadesRepository.obtenerPerfiles(otros);
    setPerfiles(Object.fromEntries(cargados.map(p => [p.userId, p])));
  }, []);

  useEffect(() => {
    if (!userId) return;
    recargarAmistades(userId).catch(e => setError(e.message));
    amistadesRepository.obtenerMiPerfil(userId).then(p => setSoyBuscable(p?.buscable ?? false)).catch(() => {});
  }, [userId, recargarAmistades]);

  // Abrir la pestaña de solicitudes cuenta como haberlas visto: apaga el
  // badge del nav aunque queden sin responder.
  useEffect(() => {
    if (tab === 'solicitudes') marcarSolicitudesVistas();
  }, [tab]);

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
      onBloquear={setABloquear}
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
        .buscar-vacio { color: var(--muted); font-size: 0.85rem; text-align: center; padding: var(--space-5) 0; }
      `}</style>

      <div>
        <h1 style={{ color: 'var(--text-strong)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', margin: '0 0 8px 0' }}>Buscar gente</h1>
        <p style={{ color: 'var(--muted)', margin: 0 }}>Encontrá compañeros y agregalos como amigos.</p>
      </div>

      {!soyBuscable && (
        <Card style={{ borderLeft: '3px solid var(--warning)', fontSize: '0.85rem' }}>
          Estás oculto: no aparecés en las búsquedas ni en los listados de comisión, salvo para tus amigos.
          Podés cambiarlo desde <Link href="/perfil" style={{ color: 'var(--cursando)' }}>tu perfil</Link>.
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

      {tab === 'bloqueados' && (
        bloqueados.length === 0
          ? <div className="buscar-vacio">No bloqueaste a nadie.</div>
          : (
            <div className="person-list">
              {bloqueados.map(persona => (
                <PersonCard
                  key={persona.userId}
                  persona={persona}
                  relacion="ninguna"
                  bloqueado
                  ocupado={ocupadoCon === persona.userId}
                  onAgregar={() => {}}
                  onAceptar={() => {}}
                  onEliminar={() => {}}
                  onDesbloquear={p => accion(() => amistadesRepository.desbloquear(userId!, p.userId), p.userId)}
                />
              ))}
            </div>
          )
      )}

      <ConfirmModal
        isOpen={aBloquear !== null}
        title="Bloquear usuario"
        message={aBloquear
          ? `¿Seguro que querés bloquear a ${aBloquear.nombre}? Dejan de verse: no va a poder encontrarte ni mandarte solicitudes, y si eran amigos la amistad se borra. Podés desbloquearlo cuando quieras desde la pestaña "Bloqueados".`
          : ''}
        confirmText="Sí, bloquear"
        isDanger
        onConfirm={() => {
          const persona = aBloquear;
          setABloquear(null);
          if (persona) accion(() => amistadesRepository.bloquear(userId!, persona.userId), persona.userId);
        }}
        onCancel={() => setABloquear(null)}
      />
    </main>
  );
}
