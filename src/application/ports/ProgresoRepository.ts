import { DetalleMateria, DetallesMaterias, EstadoMateria, MateriasEstado } from '../../domain/entities/Progreso';

export interface ProgresoRepository {
  obtenerProgreso(userId: string): Promise<{ materias: MateriasEstado; detalles: DetallesMaterias }>;
  guardarMateria(userId: string, materiaId: string, estado: EstadoMateria, detalle: DetalleMateria): Promise<void>;
  guardarMultiplesAprobadas(userId: string, materiaIds: string[]): Promise<void>;
  borrarTodo(userId: string): Promise<void>;
  // Borra las filas cuyo materia_id empiece con el prefijo dado (ver
  // ARCHITECTURE.md sobre por qué esto es una limitación conocida, no una
  // relación real, hasta el cutover al catálogo de la Fase 1).
  borrarPorPrefijo(userId: string, prefijo: string): Promise<{ error: string | null }>;
}
