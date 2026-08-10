import { SupabaseClient } from '@supabase/supabase-js';
import { DificultadRepository, EstadisticasDificultad } from '../../application/ports/DificultadRepository';

export class SupabaseDificultadRepository implements DificultadRepository {
  constructor(private readonly client: SupabaseClient) {}

  async obtenerEstadisticas(materiaId: string): Promise<EstadisticasDificultad> {
    const { data, error } = await this.client.rpc('obtener_estadisticas_materia', { p_materia_id: materiaId });
    if (error || !data || data.length === 0) return { promedio: 0, total: 0 };
    return { promedio: Number(data[0].promedio), total: Number(data[0].total_votos) };
  }
}
