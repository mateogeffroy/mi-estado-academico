// src/lib/data/registry.ts

// Importamos todas las carreras disponibles
import * as UtnSistemas2023 from './utn/sistemas-2023';
import * as UnlpApu2021 from './unlp/apu-2021';

// Definimos la estructura REAL de lo que devuelve una carrera
export interface CareerData {
  careerInfo: {
    id: string;
    universidad: string;
    nombre: string;
    plan: string;
    tituloIntermedio: string;
    tituloFinal: string;
    creditosTotales: number;
  };
  ALL: any[];
  SUBJECTS: any[];
  ELECTIVAS: {
    [key: number]: any[]; // Es un objeto con keys numéricos (3, 4, 5)
  };
  getSubjectById: (id: any) => any;
}

// Mapeamos el ID de la carrera con su archivo de datos
export const careersRegistry: Record<string, CareerData> = {
  'utn-sistemas-2023': UtnSistemas2023,
  'unlp-apu-2021': UnlpApu2021,
};

// Función helper para obtener los datos de una carrera
export const getCareerData = (careerId: string): CareerData => {
  const data = careersRegistry[careerId];
  if (!data) {
    console.warn(`Carrera no encontrada: ${careerId}. Cargando plan por defecto.`);
    return careersRegistry['utn-sistemas-2023']; // Plan por defecto (fallback)
  }
  return data;
};