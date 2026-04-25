export type TipoInhabil = 'feriado' | 'finales' | 'paro';

export interface DiaInhabil {
  fecha: string; 
  motivo: string;
  tipo: TipoInhabil;
}

// 🇦🇷 FERIADOS NACIONALES (Comunes a todos los usuarios, sea UTN o UNLP)
export const FERIADOS_NACIONALES: DiaInhabil[] = [
  { fecha: '2026-03-23', motivo: 'Feriado puente', tipo: 'feriado' },
  { fecha: '2026-03-24', motivo: 'Día Nacional de la Memoria', tipo: 'feriado' },
  { fecha: '2026-04-02', motivo: 'Día del Veterano y de los Caídos', tipo: 'feriado' },
  { fecha: '2026-04-03', motivo: 'Viernes Santo', tipo: 'feriado' },
  { fecha: '2026-05-01', motivo: 'Día del Trabajador', tipo: 'feriado' },
  { fecha: '2026-05-25', motivo: 'Revolución de Mayo', tipo: 'feriado' },
  { fecha: '2026-06-15', motivo: 'Inmortalidad Gral. Güemes', tipo: 'feriado' },
  { fecha: '2026-06-20', motivo: 'Inmortalidad Gral. Belgrano', tipo: 'feriado' },
  { fecha: '2026-07-09', motivo: 'Día de la Independencia', tipo: 'feriado' },
  { fecha: '2026-07-10', motivo: 'Feriado puente', tipo: 'feriado' },
  { fecha: '2026-08-17', motivo: 'Inmortalidad Gral. San Martín', tipo: 'feriado' },
  { fecha: '2026-10-12', motivo: 'Día de la Diversidad Cultural', tipo: 'feriado' },
  { fecha: '2026-11-23', motivo: 'Día de la Soberanía Nacional', tipo: 'feriado' },
  { fecha: '2026-12-07', motivo: 'Feriado puente', tipo: 'feriado' },
  { fecha: '2026-12-08', motivo: 'Inmaculada Concepción', tipo: 'feriado' },
  { fecha: '2026-12-25', motivo: 'Navidad', tipo: 'feriado' },
];

// ⚙️ CALENDARIO ACADÉMICO UTN FRLP
export const CALENDARIO_UTN: DiaInhabil[] = [
  // Exámenes y Días Institucionales
  { fecha: '2026-04-22', motivo: '1º Turno Examen Final', tipo: 'finales' },
  { fecha: '2026-05-02', motivo: 'Día del Docente Universitario', tipo: 'feriado' },
  { fecha: '2026-05-27', motivo: '2º Turno Examen Final', tipo: 'finales' },
  { fecha: '2026-06-16', motivo: '3º Turno Examen Final', tipo: 'finales' },
  
  // Receso Invernal Universitario
  { fecha: '2026-07-20', motivo: 'Receso Invernal', tipo: 'feriado' },
  { fecha: '2026-07-21', motivo: 'Receso Invernal', tipo: 'feriado' },
  { fecha: '2026-07-22', motivo: 'Receso Invernal', tipo: 'feriado' },
  { fecha: '2026-07-23', motivo: 'Receso Invernal', tipo: 'feriado' },
  { fecha: '2026-07-24', motivo: 'Receso Invernal', tipo: 'feriado' },
  { fecha: '2026-07-27', motivo: 'Receso Invernal', tipo: 'feriado' },
  { fecha: '2026-07-28', motivo: 'Receso Invernal', tipo: 'feriado' },
  { fecha: '2026-07-29', motivo: 'Receso Invernal', tipo: 'feriado' },
  { fecha: '2026-07-30', motivo: 'Receso Invernal', tipo: 'feriado' },
  { fecha: '2026-07-31', motivo: 'Receso Invernal', tipo: 'feriado' },

  { fecha: '2026-08-07', motivo: '4º Turno Examen Final', tipo: 'finales' },
  { fecha: '2026-08-19', motivo: 'Día de la UTN', tipo: 'feriado' },
  
  { fecha: '2026-09-21', motivo: 'Día del Estudiante', tipo: 'feriado' },
  { fecha: '2026-09-22', motivo: 'Semana del Estudiante', tipo: 'feriado' },
  { fecha: '2026-09-23', motivo: 'Semana del Estudiante', tipo: 'feriado' },
  { fecha: '2026-09-24', motivo: 'Día de la Facultad (FRLP)', tipo: 'feriado' },
  
  { fecha: '2026-09-25', motivo: '5º Turno Examen Final', tipo: 'finales' },
  { fecha: '2026-10-13', motivo: '6º Turno Examen Final', tipo: 'finales' },
  
  { fecha: '2026-11-19', motivo: 'Aniversario de La Plata', tipo: 'feriado' },
  { fecha: '2026-11-26', motivo: 'Día del Trabajador No Docente', tipo: 'feriado' },
  
  // Semana de 7mo Turno
  { fecha: '2026-12-14', motivo: '7º Turno Examen Final', tipo: 'finales' },
  { fecha: '2026-12-15', motivo: '7º Turno Examen Final', tipo: 'finales' },
  { fecha: '2026-12-16', motivo: '7º Turno Examen Final', tipo: 'finales' },
  { fecha: '2026-12-17', motivo: '7º Turno Examen Final', tipo: 'finales' },
  { fecha: '2026-12-18', motivo: '7º Turno Examen Final', tipo: 'finales' },
];

// 🧠 FUNCIÓN INTELIGENTE: Devuelve el calendario según la carrera
export const getInhabiles = (careerId: string): DiaInhabil[] => {
  const inhabiles = [...FERIADOS_NACIONALES];

  // Si la carrera empieza con 'utn', sumamos el calendario de la UTN
  if (careerId?.startsWith('utn')) {
    inhabiles.push(...CALENDARIO_UTN);
  }
  
  // A FUTURO: Si la carrera es de UNLP Informática, sumamos sus feriados
  // else if (careerId?.startsWith('unlp-info')) {
  //   inhabiles.push(...CALENDARIO_UNLP_INFO);
  // }

  return inhabiles;
};