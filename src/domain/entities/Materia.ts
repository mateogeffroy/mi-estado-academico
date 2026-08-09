// Catálogo estático de carreras/materias (hoy vive en src/lib/data/**, ver
// ARCHITECTURE.md sobre el plan para migrarlo a las tablas de la Fase 1).

export interface HorarioComision {
  nombre: string; // día de la semana; puede incluir variantes como "Viernes (1°C)"
  inicio: string;
  fin: string;
}

export interface Comision {
  id: string;
  duration?: string;
  dias: HorarioComision[];
}

export interface Materia {
  id: string;
  num?: string;
  name: string;
  level?: number;
  hours?: string;
  duration?: string;
  correlCursada?: string[];
  correlAprobada?: string[];
  comisiones?: Comision[];
  // Electivas
  annualHours?: number;
  isElectivePlaceholder?: boolean;
  targetHours?: number;
  isOutdated?: boolean;
  onlyIngenieria?: boolean;
  // Otros flags puntuales del catálogo
  isSeminario?: boolean;
}

export interface CareerInfo {
  id: string;
  universidad: string;
  nombre: string;
  plan: string;
  tituloIntermedio: string;
  tituloFinal: string;
  creditosTotales: number;
}

export interface CareerData {
  careerInfo: CareerInfo;
  ALL: Materia[];
  SUBJECTS: Materia[];
  ELECTIVAS?: Record<number, Materia[]>;
  getSubjectById: (id: string) => Materia | undefined;
}
