import { SupabaseClient } from '@supabase/supabase-js';
import { CarrerasRepository } from '../../application/ports/CarrerasRepository';

export class SupabaseCarrerasRepository implements CarrerasRepository {
  constructor(private readonly client: SupabaseClient) {}

  async obtenerCarrerasDeUsuario(userId: string): Promise<string[]> {
    const { data, error } = await this.client.from('usuario_carreras').select('carrera_id').eq('user_id', userId);
    if (error) throw new Error(`No se pudieron cargar las carreras: ${error.message}`);
    return (data ?? []).map((fila) => fila.carrera_id as string);
  }

  async agregarCarrera(userId: string, carreraId: string): Promise<void> {
    const { error } = await this.client.from('usuario_carreras').insert({ user_id: userId, carrera_id: carreraId });
    if (error) throw new Error(`No se pudo agregar la carrera: ${error.message}`);
  }

  async borrarCarrera(userId: string, carreraId: string): Promise<{ error: string | null }> {
    const { error } = await this.client.from('usuario_carreras').delete().match({ user_id: userId, carrera_id: carreraId });
    return { error: error?.message ?? null };
  }
}
