import { SupabaseClient } from '@supabase/supabase-js';
import { EventosRepository } from '../../application/ports/EventosRepository';
import { EventoAcademico } from '../../domain/entities/Progreso';

interface FilaUsuarioEvento {
  id: string;
  materia_id: string;
  nombre: string;
  tipo: string;
  fecha: string;
}

function aEventoAcademico(fila: FilaUsuarioEvento): EventoAcademico {
  return { id: fila.id, materiaId: fila.materia_id, nombre: fila.nombre, tipo: fila.tipo, fecha: fila.fecha };
}

export class SupabaseEventosRepository implements EventosRepository {
  constructor(private readonly client: SupabaseClient) {}

  async obtenerEventosDeUsuario(userId: string): Promise<EventoAcademico[]> {
    const { data, error } = await this.client
      .from('usuario_eventos')
      .select('id, materia_id, nombre, tipo, fecha')
      .eq('user_id', userId);
    if (error) throw new Error(`No se pudieron cargar los eventos: ${error.message}`);
    return (data as FilaUsuarioEvento[] | null ?? []).map(aEventoAcademico);
  }

  async crearEvento(userId: string, evento: Omit<EventoAcademico, 'id'>): Promise<EventoAcademico> {
    // El id se genera del lado del cliente porque la tabla existente no
    // tiene un default de servidor (ver ARCHITECTURE.md).
    const id = crypto.randomUUID();
    const { error } = await this.client.from('usuario_eventos').insert({
      id,
      user_id: userId,
      materia_id: evento.materiaId,
      nombre: evento.nombre,
      tipo: evento.tipo,
      fecha: evento.fecha,
    });
    if (error) throw new Error(`No se pudo agendar el evento: ${error.message}`);
    return { id, ...evento };
  }

  async borrarEvento(userId: string, eventoId: string): Promise<void> {
    const { error } = await this.client.from('usuario_eventos').delete().eq('id', eventoId).eq('user_id', userId);
    if (error) throw new Error(`No se pudo borrar el evento: ${error.message}`);
  }

  async borrarTodo(userId: string): Promise<void> {
    const { error } = await this.client.from('usuario_eventos').delete().eq('user_id', userId);
    if (error) throw new Error(`No se pudieron borrar los eventos: ${error.message}`);
  }

  async borrarPorPrefijo(userId: string, prefijo: string): Promise<{ error: string | null }> {
    const { error } = await this.client
      .from('usuario_eventos')
      .delete()
      .eq('user_id', userId)
      .like('materia_id', `${prefijo}%`);
    return { error: error?.message ?? null };
  }
}
