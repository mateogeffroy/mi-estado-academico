export interface PerfilPublico {
  userId: string;
  nombre: string;
  carreraId: string | null;
}

export interface MiPerfilPublico extends PerfilPublico {
  buscable: boolean;
}

export interface Amistad {
  solicitanteId: string;
  destinatarioId: string;
  estado: 'pendiente' | 'aceptada';
}

/** Cómo se ve el otro desde mi lado de la relación. */
export type Relacion = 'ninguna' | 'enviada' | 'recibida' | 'amigos';

export const relacionCon = (amistades: Amistad[], miId: string, otroId: string): Relacion => {
  const a = amistades.find(
    x => (x.solicitanteId === miId && x.destinatarioId === otroId) ||
         (x.destinatarioId === miId && x.solicitanteId === otroId)
  );
  if (!a) return 'ninguna';
  if (a.estado === 'aceptada') return 'amigos';
  return a.solicitanteId === miId ? 'enviada' : 'recibida';
};

/** Alguien que cursa una materia, según la vista comisiones_publicas. */
export interface CursanteDeMateria {
  userId: string;
  comision: string | null;
}

export interface AmistadesRepository {
  /** Perfiles buscables cuyo nombre contiene el texto, sin incluirse a uno mismo. */
  buscarPersonas(miId: string, texto: string, limite?: number): Promise<PerfilPublico[]>;
  /** Todas las relaciones en las que participa el usuario, pendientes y aceptadas. */
  obtenerAmistades(userId: string): Promise<Amistad[]>;
  obtenerPerfiles(userIds: string[]): Promise<PerfilPublico[]>;
  /**
   * Cuántas solicitudes sin responder tiene el usuario. Con `desde`, sólo las
   * que llegaron después de ese momento: es lo que permite que el badge se
   * apague cuando ya las miró.
   */
  contarSolicitudesPendientes(userId: string, desde?: string | null): Promise<number>;
  /** Quiénes cursan esa materia, sin incluirse a uno mismo. */
  obtenerCursantesDeMateria(miId: string, materiaId: string): Promise<CursanteDeMateria[]>;
  enviarSolicitud(miId: string, destinatarioId: string): Promise<void>;
  aceptarSolicitud(miId: string, solicitanteId: string): Promise<void>;
  /** Sirve para cancelar una solicitud, rechazarla o dejar de ser amigos. */
  eliminarRelacion(miId: string, otroId: string): Promise<void>;
  bloquear(miId: string, otroId: string): Promise<void>;
  desbloquear(miId: string, otroId: string): Promise<void>;
  /** A quiénes bloqueó el usuario, con su perfil para poder mostrarlos. */
  obtenerBloqueados(miId: string): Promise<PerfilPublico[]>;
  obtenerMiPerfil(userId: string): Promise<MiPerfilPublico | null>;
  actualizarMiPerfil(userId: string, cambios: { buscable?: boolean; carreraId?: string | null }): Promise<void>;
}
