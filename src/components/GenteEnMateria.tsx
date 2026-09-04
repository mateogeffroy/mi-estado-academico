'use client';

import { useCallback, useEffect, useState } from 'react';
import Card from './Card';
import PersonCard from './PersonCard';
import { supabase } from '../lib/supabase';
import { amistadesRepository } from '../infrastructure/repositorios';
import {
  Amistad,
  CursanteDeMateria,
  PerfilPublico,
  relacionCon,
} from '../application/ports/AmistadesRepository';

interface GenteEnMateriaProps {
  materiaId: string;
  /** Comisión elegida en esta materia. Sin comisión elegida no hay listado. */
  comision?: string | null;
  /** Las materias sin comisiones precargadas no tienen a quién listar. */
  tieneComisiones?: boolean;
}

/**
 * Los dos listados de una comisión: los amigos que la cursan y los
 * compañeros, que es el resto de la gente visible anotada en esa misma
 * comisión. Al cambiar de comisión cambian los dos listados.
 */
export default function GenteEnMateria({ materiaId, comision, tieneComisiones = true }: GenteEnMateriaProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [cursantes, setCursantes] = useState<CursanteDeMateria[]>([]);
  const [perfiles, setPerfiles] = useState<Record<string, PerfilPublico>>({});
  const [amistades, setAmistades] = useState<Amistad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [ocupadoCon, setOcupadoCon] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const cargar = useCallback(async (id: string) => {
    const [gente, relaciones] = await Promise.all([
      amistadesRepository.obtenerCursantesDeMateria(id, materiaId),
      amistadesRepository.obtenerAmistades(id),
    ]);
    setCursantes(gente);
    setAmistades(relaciones);
    const cargados = await amistadesRepository.obtenerPerfiles(gente.map(c => c.userId));
    setPerfiles(Object.fromEntries(cargados.map(p => [p.userId, p])));
  }, [materiaId]);

  useEffect(() => {
    if (!userId) return;
    setCargando(true);
    cargar(userId)
      .catch(e => setError(e.message))
      .finally(() => setCargando(false));
  }, [userId, cargar]);

  const accion = async (fn: () => Promise<void>, otroId: string) => {
    if (!userId) return;
    setOcupadoCon(otroId);
    setError(null);
    try {
      await fn();
      await cargar(userId);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setOcupadoCon(null);
    }
  };

  // Una materia sin comisiones precargadas se cursa con horario propio: no
  // hay comisión contra la cual cruzar gente.
  if (!tieneComisiones || !userId || cargando) return null;

  const esAmigo = (otroId: string) => relacionCon(amistades, userId, otroId) === 'amigos';
  const conPerfil = (lista: CursanteDeMateria[]) => lista.filter(c => perfiles[c.userId]);

  const enLaComision = cursantes.filter(c => comision != null && c.comision === comision);
  const amigos = conPerfil(enLaComision.filter(c => esAmigo(c.userId)));
  const companeros = conPerfil(enLaComision.filter(c => !esAmigo(c.userId)));
  const amigosEnOtrasComisiones = conPerfil(
    cursantes.filter(c => esAmigo(c.userId) && c.comision !== comision)
  ).length;

  const tarjeta = (cursante: CursanteDeMateria, mostrarComision: boolean) => {
    const persona = perfiles[cursante.userId];
    return (
      <PersonCard
        key={cursante.userId}
        persona={persona}
        relacion={relacionCon(amistades, userId, cursante.userId)}
        subtitulo={mostrarComision && cursante.comision ? `Comisión ${cursante.comision}` : undefined}
        ocupado={ocupadoCon === cursante.userId}
        onAgregar={p => accion(() => amistadesRepository.enviarSolicitud(userId, p.userId), p.userId)}
        onAceptar={p => accion(() => amistadesRepository.aceptarSolicitud(userId, p.userId), p.userId)}
        onEliminar={p => accion(() => amistadesRepository.eliminarRelacion(userId, p.userId), p.userId)}
      />
    );
  };

  const vacio = (texto: string) => (
    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0 }}>{texto}</p>
  );

  return (
    <Card style={{ marginTop: 'var(--space-5)' }}>
      <h2 style={{ color: 'var(--text-strong)', fontSize: '1.2rem', marginBottom: 'var(--space-4)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        {comision ? `Gente en la comisión ${comision}` : 'Gente en esta materia'}
      </h2>

      {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: 'var(--space-3)' }}>{error}</p>}

      {comision == null ? (
        vacio('Elegí una comisión arriba para ver quiénes la cursan.')
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div>
            <h3 style={{ color: 'var(--text-strong)', fontSize: '0.95rem', margin: '0 0 var(--space-3) 0' }}>
              Amigos {amigos.length > 0 && <span style={{ color: 'var(--muted)', fontWeight: 400 }}>({amigos.length})</span>}
            </h3>
            {amigos.length === 0
              ? vacio('Ninguno de tus amigos cursa en esta comisión.')
              : <div className="person-list">{amigos.map(c => tarjeta(c, false))}</div>}
            {amigosEnOtrasComisiones > 0 && (
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: 'var(--space-2) 0 0 0' }}>
                {amigosEnOtrasComisiones === 1
                  ? 'Un amigo más cursa esta materia en otra comisión.'
                  : `${amigosEnOtrasComisiones} amigos más cursan esta materia en otras comisiones.`}
              </p>
            )}
          </div>

          <div>
            <h3 style={{ color: 'var(--text-strong)', fontSize: '0.95rem', margin: '0 0 var(--space-3) 0' }}>
              Compañeros {companeros.length > 0 && <span style={{ color: 'var(--muted)', fontWeight: 400 }}>({companeros.length})</span>}
            </h3>
            {companeros.length === 0
              ? vacio('Todavía no hay nadie más visible en esta comisión.')
              : <div className="person-list">{companeros.map(c => tarjeta(c, false))}</div>}
          </div>
        </div>
      )}
    </Card>
  );
}
