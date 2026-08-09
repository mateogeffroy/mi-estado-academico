export interface EstadisticasDificultad {
  promedio: number;
  total: number;
}

export interface DificultadRepository {
  obtenerEstadisticas(materiaId: string): Promise<EstadisticasDificultad>;
}
