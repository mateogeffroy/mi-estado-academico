// Importamos todas las carreras disponibles
import * as UtnSistemas2023 from './utn/sistemas-2023';
import * as UtnCivil2023 from './utn/civil-2023';
import * as UtnIndustrial2008 from './utn/industrial-2008';
import * as UtnMecanica2023 from './utn/mecanica-2023';
import * as UtnQuimica2008 from './utn/quimica-2008';
import * as UtnElectrica2023 from './utn/electrica-2023';
import * as UnlpApu2021 from './unlp/apu-2021';
import * as UnlpSistemas2021 from './unlp/sistemas-2021';
import * as UnlpInformatica2021 from './unlp/informatica-2021';
import * as UnlpPsicologia2012 from './unlp/psicologia-2012';
import * as UnlpComputacion2024 from './unlp/computacion-2024';
import * as UnlpSonido2023 from './unlp/sonido-2019';

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
  'utn-civil-2023': UtnCivil2023,
  'utn-industrial-2008': UtnIndustrial2008,
  'utn-mecanica-2023': UtnMecanica2023,
  'utn-quimica-2008': UtnQuimica2008,
  'utn-electrica-2023': UtnElectrica2023,
  'unlp-apu-2021': UnlpApu2021,
  'unlp-sistemas-2021': UnlpSistemas2021,
  'unlp-informatica-2021': UnlpInformatica2021,
  'unlp-psicologia-2012': UnlpPsicologia2012,
  'unlp-computacion-2024': UnlpComputacion2024,
  'unlp-sonido-2023': UnlpSonido2023,
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

// Prefijo de materia_id exclusivo de cada carrera, usado para el borrado en
// cascada de "materias exclusivas" al desanotarse de una carrera.
// null = no existe un prefijo que identifique de forma exclusiva a las
// materias de esa carrera (sus IDs se solapan con los de otra carrera del
// mismo registro, ej. unlp-sistemas-2021/unlp-informatica-2021/unlp-apu-2021
// comparten literalmente los mismos ids como 'SI101' o 'CNE'). En esos casos
// preferimos NO borrar nada por LIKE antes que arriesgarnos a borrar datos
// de otra carrera del usuario. La solución real es la migración del catálogo
// a tablas relacionales (ver auditoría), donde cada materia tiene su propia
// carrera_id por FK en vez de inferirse por convención de nombres.
export const CAREER_MATERIA_PREFIX: Record<string, string | null> = {
  'utn-sistemas-2023': 'SIS-',
  'utn-civil-2023': 'CIV-',
  'utn-industrial-2008': 'IND-',
  'utn-mecanica-2023': 'MEC-',
  'utn-quimica-2008': 'QUI-',
  'utn-electrica-2023': 'ELE-',
  'unlp-sonido-2023': 'TU',
  'unlp-sistemas-2021': null,
  'unlp-informatica-2021': null,
  'unlp-apu-2021': null,
  'unlp-psicologia-2012': null,
  'unlp-computacion-2024': null,
};

export const getCareerPrefix = (careerId: string): string | null =>
  CAREER_MATERIA_PREFIX[careerId] ?? null;