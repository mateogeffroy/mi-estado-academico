import { SupabaseClient } from '@supabase/supabase-js';
import { ProgresoRepository } from '../../application/ports/ProgresoRepository';
import {
  DetalleMateria,
  DetallesMaterias,
  EstadoMateria,
  MateriasEstado,
  detalleVacio,
} from '../../domain/entities/Progreso';

interface FilaUsuarioMateria {
  materia_id: string;
  estado: string;
  nota_final: number | null;
  dificultad: number | null;
  comision: string | null;
  horarios_custom: DetalleMateria['horariosCustom'] | null;
}

// Implementa ProgresoRepository contra la tabla usuario_materias tal como
// existe hoy en producción (materia_id como texto, sin FK al catálogo).
// Ver ARCHITECTURE.md para el plan de cutover a las tablas de la Fase 1.
export class SupabaseProgresoRepository implements ProgresoRepository {
  constructor(private readonly client: SupabaseClient) {}

  async obtenerProgreso(userId: string): Promise<{ materias: MateriasEstado; detalles: DetallesMaterias }> {
    const { data, error } = await this.client
      .from('usuario_materias')
      .select('materia_id, estado, nota_final, dificultad, comision, horarios_custom')
      .eq('user_id', userId);

    if (error) throw new Error(`No se pudo cargar el progreso: ${error.message}`);

    const materias: MateriasEstado = {};
    const detalles: DetallesMaterias = {};
    (data as FilaUsuarioMateria[] | null ?? []).forEach((fila) => {
      materias[fila.materia_id] = fila.estado as EstadoMateria;
      detalles[fila.materia_id] = {
        ...detalleVacio(),
        notaFinal: fila.nota_final,
        dificultad: fila.dificultad,
        comision: fila.comision,
        horariosCustom: fila.horarios_custom ?? [],
      };
    });
    return { materias, detalles };
  }

  async guardarMateria(userId: string, materiaId: string, estado: EstadoMateria, detalle: DetalleMateria): Promise<void> {
    const { error } = await this.client.from('usuario_materias').upsert(
      {
        user_id: userId,
        materia_id: materiaId,
        estado,
        nota_final: detalle.notaFinal,
        dificultad: detalle.dificultad,
        comision: detalle.comision,
        horarios_custom: detalle.horariosCustom,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,materia_id' }
    );
    if (error) throw new Error(`No se pudo guardar la materia: ${error.message}`);
  }

  async guardarMultiplesAprobadas(userId: string, materiaIds: string[]): Promise<void> {
    const filas = materiaIds.map((materiaId) => ({
      user_id: userId,
      materia_id: materiaId,
      estado: 'aprobada' as const,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await this.client.from('usuario_materias').upsert(filas, { onConflict: 'user_id,materia_id' });
    if (error) throw new Error(`No se pudieron guardar las materias: ${error.message}`);
  }

  async borrarTodo(userId: string): Promise<void> {
    const { error } = await this.client.from('usuario_materias').delete().eq('user_id', userId);
    if (error) throw new Error(`No se pudo reiniciar el progreso: ${error.message}`);
  }

  async borrarPorPrefijo(userId: string, prefijo: string): Promise<{ error: string | null }> {
    const { error } = await this.client
      .from('usuario_materias')
      .delete()
      .eq('user_id', userId)
      .like('materia_id', `${prefijo}%`);
    return { error: error?.message ?? null };
  }
}
