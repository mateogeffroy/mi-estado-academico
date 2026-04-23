export type TipoInhabil = 'feriado' | 'finales' | 'paro';

export interface DiaInhabil {
  fecha: string; 
  motivo: string;
  tipo: TipoInhabil;
}

export const INHABILES: DiaInhabil[] = [
  // --- MARZO ---
  { fecha: '2026-03-23', motivo: 'Feriado puente', tipo: 'feriado' },
  { fecha: '2026-03-24', motivo: 'Día Nacional de la Memoria', tipo: 'feriado' },
  
  // --- ABRIL ---
  { fecha: '2026-04-02', motivo: 'Día del Veterano y de los Caídos', tipo: 'feriado' },
  { fecha: '2026-04-03', motivo: 'Viernes Santo', tipo: 'feriado' },
  { fecha: '2026-04-22', motivo: '1º Turno Examen Final', tipo: 'finales' },
  
  // --- MAYO ---
  { fecha: '2026-05-01', motivo: 'Día del Trabajador', tipo: 'feriado' },
  { fecha: '2026-05-02', motivo: 'Día del Docente Universitario', tipo: 'feriado' },
  { fecha: '2026-05-25', motivo: 'Revolución de Mayo', tipo: 'feriado' },
  { fecha: '2026-05-27', motivo: '2º Turno Examen Final', tipo: 'finales' },
  
  // --- JUNIO ---
  { fecha: '2026-06-15', motivo: 'Inmortalidad Gral. Güemes', tipo: 'feriado' },
  { fecha: '2026-06-16', motivo: '3º Turno Examen Final', tipo: 'finales' },
  { fecha: '2026-06-20', motivo: 'Inmortalidad Gral. Belgrano', tipo: 'feriado' },
  
  // --- JULIO ---
  { fecha: '2026-07-09', motivo: 'Día de la Independencia', tipo: 'feriado' },
  { fecha: '2026-07-10', motivo: 'Feriado puente', tipo: 'feriado' },
  // Receso Invernal
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

  // --- AGOSTO ---
  { fecha: '2026-08-07', motivo: '4º Turno Examen Final', tipo: 'finales' },
  { fecha: '2026-08-17', motivo: 'Inmortalidad Gral. San Martín', tipo: 'feriado' },
  { fecha: '2026-08-19', motivo: 'Día de la UTN', tipo: 'feriado' },
  
  // --- SEPTIEMBRE ---
  { fecha: '2026-09-21', motivo: 'Día del Estudiante', tipo: 'feriado' },
  { fecha: '2026-09-22', motivo: 'Semana del Estudiante', tipo: 'feriado' },
  { fecha: '2026-09-23', motivo: 'Semana del Estudiante', tipo: 'feriado' },
  { fecha: '2026-09-24', motivo: 'Día de la Facultad (FRLP)', tipo: 'feriado' },
  { fecha: '2026-09-25', motivo: '5º Turno Examen Final', tipo: 'finales' },
  
  // --- OCTUBRE ---
  { fecha: '2026-10-12', motivo: 'Día de la Diversidad Cultural', tipo: 'feriado' },
  { fecha: '2026-10-13', motivo: '6º Turno Examen Final', tipo: 'finales' },
  
  // --- NOVIEMBRE ---
  { fecha: '2026-11-19', motivo: 'Aniversario de La Plata', tipo: 'feriado' },
  { fecha: '2026-11-23', motivo: 'Día de la Soberanía Nacional', tipo: 'feriado' },
  { fecha: '2026-11-26', motivo: 'Día del Trabajador No Docente', tipo: 'feriado' },
  
  // --- DICIEMBRE ---
  { fecha: '2026-12-07', motivo: 'Feriado puente', tipo: 'feriado' },
  { fecha: '2026-12-08', motivo: 'Inmaculada Concepción', tipo: 'feriado' },
  // Semana de 7mo Turno
  { fecha: '2026-12-14', motivo: '7º Turno Examen Final', tipo: 'finales' },
  { fecha: '2026-12-15', motivo: '7º Turno Examen Final', tipo: 'finales' },
  { fecha: '2026-12-16', motivo: '7º Turno Examen Final', tipo: 'finales' },
  { fecha: '2026-12-17', motivo: '7º Turno Examen Final', tipo: 'finales' },
  { fecha: '2026-12-18', motivo: '7º Turno Examen Final', tipo: 'finales' },
  { fecha: '2026-12-25', motivo: 'Navidad', tipo: 'feriado' },

  // --- EJEMPLO PARA CARGA MANUAL DE PARO ---
  // Descomentá y ajustá la fecha si te enterás de un paro:
  // { fecha: '2026-06-10', motivo: 'Paro Nacional Docente', tipo: 'paro' },
];