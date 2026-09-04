import { SupabaseClient } from '@supabase/supabase-js';
import {
  Amistad,
  AmistadesRepository,
  CursanteDeMateria,
  MiPerfilPublico,
  PerfilPublico,
} from '../../application/ports/AmistadesRepository';

interface FilaPerfil {
  user_id: string;
  nombre: string;
  carrera_id: string | null;
  buscable?: boolean;
}

interface FilaAmistad {
  solicitante_id: string;
  destinatario_id: string;
  estado: 'pendiente' | 'aceptada';
}

const aPerfil = (fila: FilaPerfil): PerfilPublico => ({
  userId: fila.user_id,
  nombre: fila.nombre,
  carreraId: fila.carrera_id,
});

const aAmistad = (fila: FilaAmistad): Amistad => ({
  solicitanteId: fila.solicitante_id,
  destinatarioId: fila.destinatario_id,
  estado: fila.estado,
});

// El % y el _ son comodines de LIKE: sin escaparlos, buscar "100%" o "a_b"
// devuelve cualquier cosa.
const escaparLike = (texto: string) => texto.replace(/[\\%_]/g, c => `\\${c}`);

export class SupabaseAmistadesRepository implements AmistadesRepository {
  constructor(private readonly client: SupabaseClient) {}

  async buscarPersonas(miId: string, texto: string, limite = 20): Promise<PerfilPublico[]> {
    const { data, error } = await this.client
      .from('perfiles_publicos')
      .select('user_id, nombre, carrera_id')
      .eq('buscable', true)
      .neq('user_id', miId)
      .ilike('nombre', `%${escaparLike(texto)}%`)
      .order('nombre')
      .limit(limite);
    if (error) throw new Error(`No se pudo buscar gente: ${error.message}`);
    return (data as FilaPerfil[] | null ?? []).map(aPerfil);
  }

  async obtenerAmistades(userId: string): Promise<Amistad[]> {
    const { data, error } = await this.client
      .from('amistades')
      .select('solicitante_id, destinatario_id, estado')
      .or(`solicitante_id.eq.${userId},destinatario_id.eq.${userId}`);
    if (error) throw new Error(`No se pudieron cargar tus amistades: ${error.message}`);
    return (data as FilaAmistad[] | null ?? []).map(aAmistad);
  }

  async obtenerPerfiles(userIds: string[]): Promise<PerfilPublico[]> {
    if (userIds.length === 0) return [];
    const { data, error } = await this.client
      .from('perfiles_publicos')
      .select('user_id, nombre, carrera_id')
      .in('user_id', userIds);
    if (error) throw new Error(`No se pudieron cargar los perfiles: ${error.message}`);
    return (data as FilaPerfil[] | null ?? []).map(aPerfil);
  }

  async contarSolicitudesPendientes(userId: string): Promise<number> {
    // head: true trae sólo el conteo, sin las filas.
    const { count, error } = await this.client
      .from('amistades')
      .select('*', { count: 'exact', head: true })
      .eq('destinatario_id', userId)
      .eq('estado', 'pendiente');
    if (error) throw new Error(`No se pudieron contar las solicitudes: ${error.message}`);
    return count ?? 0;
  }

  async obtenerCursantesDeMateria(miId: string, materiaId: string): Promise<CursanteDeMateria[]> {
    const { data, error } = await this.client
      .from('comisiones_publicas')
      .select('user_id, comision')
      .eq('materia_id', materiaId)
      .neq('user_id', miId);
    if (error) throw new Error(`No se pudo cargar la gente de la materia: ${error.message}`);
    return (data as { user_id: string; comision: string | null }[] | null ?? [])
      .map(fila => ({ userId: fila.user_id, comision: fila.comision }));
  }

  async enviarSolicitud(miId: string, destinatarioId: string): Promise<void> {
    const { error } = await this.client
      .from('amistades')
      .insert({ solicitante_id: miId, destinatario_id: destinatarioId, estado: 'pendiente' });
    if (error) throw new Error(`No se pudo enviar la solicitud: ${error.message}`);
  }

  async aceptarSolicitud(miId: string, solicitanteId: string): Promise<void> {
    const { error } = await this.client
      .from('amistades')
      .update({ estado: 'aceptada' })
      .match({ solicitante_id: solicitanteId, destinatario_id: miId });
    if (error) throw new Error(`No se pudo aceptar la solicitud: ${error.message}`);
  }

  async eliminarRelacion(miId: string, otroId: string): Promise<void> {
    // La relación puede estar guardada en cualquiera de las dos direcciones
    // según quién la haya pedido.
    const { error } = await this.client
      .from('amistades')
      .delete()
      .or(
        `and(solicitante_id.eq.${miId},destinatario_id.eq.${otroId}),` +
        `and(solicitante_id.eq.${otroId},destinatario_id.eq.${miId})`
      );
    if (error) throw new Error(`No se pudo eliminar la relación: ${error.message}`);
  }

  async obtenerMiPerfil(userId: string): Promise<MiPerfilPublico | null> {
    const { data, error } = await this.client
      .from('perfiles_publicos')
      .select('user_id, nombre, carrera_id, buscable')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new Error(`No se pudo cargar tu perfil público: ${error.message}`);
    if (!data) return null;
    const fila = data as FilaPerfil;
    return { ...aPerfil(fila), buscable: Boolean(fila.buscable) };
  }

  async actualizarMiPerfil(
    userId: string,
    cambios: { buscable?: boolean; carreraId?: string | null }
  ): Promise<void> {
    const fila: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (cambios.buscable !== undefined) fila.buscable = cambios.buscable;
    if (cambios.carreraId !== undefined) fila.carrera_id = cambios.carreraId;

    const { error } = await this.client.from('perfiles_publicos').update(fila).eq('user_id', userId);
    if (error) throw new Error(`No se pudo actualizar tu perfil público: ${error.message}`);
  }
}
