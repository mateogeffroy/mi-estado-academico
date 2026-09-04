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
  recibir_novedades?: boolean;
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

// Misma normalización que la columna nombre_normalizado de la base: sin
// acentos y en minúsculas, para que "martin" encuentre a "Martín".
const normalizar = (texto: string) =>
  texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

export class SupabaseAmistadesRepository implements AmistadesRepository {
  constructor(private readonly client: SupabaseClient) {}

  async buscarPersonas(miId: string, texto: string, limite = 20): Promise<PerfilPublico[]> {
    const { data, error } = await this.client
      // La vista ya filtra por buscable y saca a los bloqueados en las dos
      // direcciones, cosa que desde el cliente no se puede hacer sin revelar
      // quién bloqueó a quién.
      .from('perfiles_buscables')
      .select('user_id, nombre, carrera_id')
      .neq('user_id', miId)
      .ilike('nombre_normalizado', `%${escaparLike(normalizar(texto))}%`)
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

  async contarSolicitudesPendientes(userId: string, desde?: string | null): Promise<number> {
    // head: true trae sólo el conteo, sin las filas.
    let query = this.client
      .from('amistades')
      .select('*', { count: 'exact', head: true })
      .eq('destinatario_id', userId)
      .eq('estado', 'pendiente');
    if (desde) query = query.gt('created_at', desde);

    const { count, error } = await query;
    if (error) throw new Error(`No se pudieron contar las solicitudes: ${error.message}`);
    return count ?? 0;
  }

  async bloquear(miId: string, otroId: string): Promise<void> {
    // El trigger de la base borra la amistad o solicitud que hubiera.
    const { error } = await this.client
      .from('bloqueos')
      .insert({ bloqueador_id: miId, bloqueado_id: otroId });
    if (error) throw new Error(`No se pudo bloquear: ${error.message}`);
  }

  async desbloquear(miId: string, otroId: string): Promise<void> {
    const { error } = await this.client
      .from('bloqueos')
      .delete()
      .match({ bloqueador_id: miId, bloqueado_id: otroId });
    if (error) throw new Error(`No se pudo desbloquear: ${error.message}`);
  }

  async obtenerBloqueados(miId: string): Promise<PerfilPublico[]> {
    const { data, error } = await this.client
      .from('bloqueos')
      .select('bloqueado_id')
      .eq('bloqueador_id', miId);
    if (error) throw new Error(`No se pudieron cargar los bloqueados: ${error.message}`);

    const ids = (data as { bloqueado_id: string }[] | null ?? []).map(f => f.bloqueado_id);
    return this.obtenerPerfiles(ids);
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
      .select('user_id, nombre, carrera_id, buscable, recibir_novedades')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new Error(`No se pudo cargar tu perfil público: ${error.message}`);
    if (!data) return null;
    const fila = data as FilaPerfil;
    return {
      ...aPerfil(fila),
      buscable: Boolean(fila.buscable),
      recibirNovedades: fila.recibir_novedades !== false,
    };
  }

  async actualizarMiPerfil(
    userId: string,
    cambios: { buscable?: boolean; carreraId?: string | null; recibirNovedades?: boolean }
  ): Promise<void> {
    const fila: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (cambios.buscable !== undefined) fila.buscable = cambios.buscable;
    if (cambios.carreraId !== undefined) fila.carrera_id = cambios.carreraId;
    if (cambios.recibirNovedades !== undefined) fila.recibir_novedades = cambios.recibirNovedades;

    const { error } = await this.client.from('perfiles_publicos').update(fila).eq('user_id', userId);
    if (error) throw new Error(`No se pudo actualizar tu perfil público: ${error.message}`);
  }
}
