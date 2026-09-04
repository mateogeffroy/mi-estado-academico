'use client';

import Avatar from './Avatar';
import Badge from './Badge';
import Button from './Button';
import { PerfilPublico, Relacion } from '../application/ports/AmistadesRepository';
import { getNombreCarreraCorto } from '../lib/data/registry';

interface PersonCardProps {
  persona: PerfilPublico;
  relacion: Relacion;
  /** Reemplaza a la carrera en la segunda línea (p. ej. la comisión). */
  subtitulo?: string;
  /** Deshabilita los botones mientras una acción está en vuelo. */
  ocupado?: boolean;
  /** Con true, la tarjeta muestra el estado de bloqueo en vez de la relación. */
  bloqueado?: boolean;
  onAgregar: (persona: PerfilPublico) => void;
  onAceptar: (persona: PerfilPublico) => void;
  onEliminar: (persona: PerfilPublico) => void;
  onBloquear?: (persona: PerfilPublico) => void;
  onDesbloquear?: (persona: PerfilPublico) => void;
}

const BADGE = {
  amigos: { tone: 'aprobada', label: 'Amigos' },
  enviada: { tone: 'muted', label: 'Solicitud enviada' },
  recibida: { tone: 'accent', label: 'Te agregó' },
  ninguna: null,
} as const;

export default function PersonCard({
  persona,
  relacion,
  subtitulo,
  ocupado,
  bloqueado,
  onAgregar,
  onAceptar,
  onEliminar,
  onBloquear,
  onDesbloquear,
}: PersonCardProps) {
  const badge = BADGE[relacion];

  return (
    <div className="person-card">
      <div className="person-card-info">
        <Avatar name={persona.nombre} size="sm" />
        <div style={{ minWidth: 0 }}>
          <div className="person-card-nombre">{persona.nombre}</div>
          <div className="person-card-carrera">{subtitulo ?? getNombreCarreraCorto(persona.carreraId)}</div>
        </div>
      </div>

      <div className="person-card-acciones">
        {bloqueado ? (
          <>
            <Badge tone="danger">Bloqueado</Badge>
            <Button type="button" variant="secondary" disabled={ocupado} onClick={() => onDesbloquear?.(persona)}>
              Desbloquear
            </Button>
          </>
        ) : (
          <>
            {badge && <Badge tone={badge.tone}>{badge.label}</Badge>}

            {relacion === 'ninguna' && (
              <Button type="button" variant="secondary" disabled={ocupado} onClick={() => onAgregar(persona)}>
                Agregar
              </Button>
            )}

            {relacion === 'recibida' && (
              <Button type="button" variant="primary" disabled={ocupado} onClick={() => onAceptar(persona)}>
                Aceptar
              </Button>
            )}

            {relacion !== 'ninguna' && (
              <Button type="button" variant="ghost" disabled={ocupado} onClick={() => onEliminar(persona)}>
                {relacion === 'amigos' ? 'Quitar' : relacion === 'enviada' ? 'Cancelar' : 'Rechazar'}
              </Button>
            )}

            {onBloquear && (
              <Button
                type="button"
                variant="ghost"
                disabled={ocupado}
                onClick={() => onBloquear(persona)}
                title="No lo vas a ver más, ni él a vos"
                style={{ color: 'var(--danger)' }}
              >
                Bloquear
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
