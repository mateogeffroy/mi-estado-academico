import * as Sentry from '@sentry/nextjs';
import { CareerData } from '../../domain/entities/Materia';

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

export type { CareerData };

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
    // No debería pasar nunca con un careerId real (implica estado guardado
    // corrupto o un id que ya no existe en el registry): vale la pena verlo.
    Sentry.captureMessage(`Carrera no encontrada en el registry: ${careerId}`, 'warning');
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

// Nombre corto de cada carrera, para selectores y tarjetas. El nombre largo
// (con el plan) vive en la pantalla de perfil.
export const NOMBRES_CARRERAS: Record<string, string> = {
  'utn-sistemas-2023': 'Ingeniería en Sistemas',
  'utn-civil-2023': 'Ingeniería Civil',
  'utn-industrial-2008': 'Ingeniería Industrial',
  'utn-mecanica-2023': 'Ingeniería Mecánica',
  'utn-quimica-2008': 'Ingeniería Química',
  'utn-electrica-2023': 'Ingeniería Eléctrica',
  'unlp-apu-2021': 'APU (UNLP)',
  'unlp-sistemas-2021': 'Lic. en Sistemas (UNLP)',
  'unlp-informatica-2021': 'Lic. en Informática (UNLP)',
  'unlp-psicologia-2012': 'Psicología (UNLP)',
  'unlp-computacion-2024': 'Ing. en Computación (UNLP)',
  'unlp-sonido-2023': 'Tec. en Sonido (UNLP)',
};

export const getNombreCarreraCorto = (careerId: string | null | undefined): string =>
  (careerId && NOMBRES_CARRERAS[careerId]) || 'Carrera sin definir';