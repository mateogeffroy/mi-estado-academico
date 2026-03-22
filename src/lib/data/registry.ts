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