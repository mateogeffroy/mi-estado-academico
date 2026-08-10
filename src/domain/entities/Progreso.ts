// Estado de avance de un usuario sobre el catálogo de materias.

export type EstadoMateria = 'available' | 'disabled' | 'cursando' | 'cursada' | 'aprobada';

export interface HorarioCustom {
  id: string;
  dia: string;
  inicio: string;
  fin: string;
  duracion?: string;
}

export interface EventoAcademico {
  id: string;
  materiaId: string;
  nombre: string;
  tipo: string;
  fecha: string; // YYYY-MM-DD
}

export interface DetalleMateria {
  notaFinal: number | null;
  dificultad: number | null;
  comision: string | null;
  horariosCustom: HorarioCustom[];
  eventos: EventoAcademico[];
}

export function detalleVacio(): DetalleMateria {
  return { notaFinal: null, dificultad: null, comision: null, horariosCustom: [], eventos: [] };
}

// materiaId -> estado
export type MateriasEstado = Record<string, EstadoMateria>;
// materiaId -> detalle
export type DetallesMaterias = Record<string, DetalleMateria>;

export interface EstadisticasCarrera {
  aprobadas: number;
  cursadas: number;
  cursando: number;
  porcentaje: number;
  promedio: number;
  totalMaterias: number;
}
