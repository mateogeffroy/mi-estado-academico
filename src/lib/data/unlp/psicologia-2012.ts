// src/lib/data/unlp/psicologia-2012.ts

export const careerInfo = {
  id: 'unlp-psicologia-2012',
  universidad: 'UNLP',
  nombre: 'Licenciatura y Profesorado en Psicología',
  plan: 'Plan 2012 / 1984',
  tituloIntermedio: 'Profesorado en Psicología',
  tituloFinal: 'Licenciado/a en Psicología',
  creditosTotales: 0,
};

export const SUBJECTS = [
  // ── PRIMER AÑO ──
  { id: 412, name: 'Psicología I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [] },
  { id: 414, name: 'Antropología Cultural y Social', level: 1, type: '1° Cuatr.', correlCursada: [], correlAprobada: [] },
  { id: 415, name: 'Lógica', level: 1, type: 'Cuatrimestral', correlCursada: [], correlAprobada: [] },
  { id: 416, name: 'Introducción a la Filosofía', level: 1, type: 'Cuatrimestral', correlCursada: [], correlAprobada: [] },
  { id: 411, name: 'Biología Humana', level: 1, type: '2° Cuatr.', correlCursada: [], correlAprobada: [] },

  // ── SEGUNDO AÑO ──
  { id: 422, name: 'Psicología II', level: 2, type: 'Anual', correlCursada: [412], correlAprobada: [] },
  { id: 421, name: 'Teoría Psicoanalítica', level: 2, type: 'Anual', correlCursada: [412], correlAprobada: [] },
  { id: 425, name: 'Sociología General', level: 2, type: 'Cuatrimestral', correlCursada: [], correlAprobada: [414] },
  { id: 423, name: 'Psicología Genética', level: 2, type: 'Cuatrimestral', correlCursada: [412], correlAprobada: [] },
  { id: 424, name: 'Estadística Aplicada a la Psicología', level: 2, type: 'Cuatrimestral', correlCursada: [], correlAprobada: [] },
  { id: 426, name: 'Lingüística General', level: 2, type: 'Cuatrimestral', correlCursada: [415], correlAprobada: [] },
  // Exclusiva Profesorado:
  { id: 427, name: 'Fundamentos de la Educación', level: 2, type: '1° Cuatr.', correlCursada: [], correlAprobada: [], isProfesorado: true },

  // ── TERCER AÑO ──
  { id: '43A', name: 'Neuroanatomía y Neurofisiología', level: 3, type: '1° Cuatr.', correlCursada: [411], correlAprobada: [] },
  { id: 434, name: 'Epistemología y Metodología de la Investigación', level: 3, type: '1° Cuatr.', correlCursada: [415, 422, 421], correlAprobada: [412] },
  { id: 433, name: 'Fundamentos, Técnicas e Inst. de Exploración I', level: 3, type: '1° Cuatr.', correlCursada: [415, 422, 424, 421], correlAprobada: [412] },
  { id: 431, name: 'Corrientes Actuales en Psicología', level: 3, type: '2° Cuatr.', correlCursada: [422, 426], correlAprobada: [412, 415] },
  { id: 432, name: 'Psicología Evolutiva I', level: 3, type: '1° Cuatr.', correlCursada: [423, 421], correlAprobada: [412] },
  { id: 435, name: 'Psicología Evolutiva II', level: 3, type: '2° Cuatr.', correlCursada: [432], correlAprobada: [412] },
  { id: 436, name: 'Psicología Social', level: 3, type: '2° Cuatr.', correlCursada: [415, 422, 425, 421], correlAprobada: [412, 414] },
  // Exclusiva Profesorado:
  { id: 439, name: 'Diseño y Planeamiento del Curriculum', level: 3, type: '2° Cuatr.', correlCursada: [423, 427, 432], correlAprobada: [412, 421], isProfesorado: true },

  // ── CUARTO AÑO ──
  { id: 441, name: 'Psicopatología I', level: 4, type: 'Anual', correlCursada: ['43A', 435], correlAprobada: [411, 423, 421] },
  { id: 444, name: 'Psicología Institucional', level: 4, type: '1° Cuatr.', correlCursada: [434, 436], correlAprobada: [415, 422, 425, 424] },
  { id: 445, name: 'Seminario de Psicología Experimental', level: 4, type: '1° Cuatr.', correlCursada: [434, 433], correlAprobada: [415, 422, 424, 421] },
  { id: 443, name: 'Psicopatología II', level: 4, type: '2° Cuatr.', correlCursada: ['43A', 432, 435], correlAprobada: [411, 423, 421] },
  { id: 442, name: 'Fundamentos, Técnicas e Inst. de Exploración II', level: 4, type: '2° Cuatr.', correlCursada: [434, 433], correlAprobada: [415, 422, 424, 421] },
  { id: 'ID1', name: 'Capacitación en Idioma', level: 4, type: '1° Cuatr.', correlCursada: [], correlAprobada: [] },

  // ── QUINTO AÑO ──
  { id: 451, name: 'Psicodiagnóstico', level: 5, type: 'Anual', correlCursada: [441, 443, 442], correlAprobada: ['43A', 435, 433] },
  { id: 452, name: 'Psicología Educacional', level: 5, type: '1° Cuatr.', correlCursada: [441, 443, 442, 444], correlAprobada: ['43A', 435, 433, 436] },
  { id: 453, name: 'Psicoterapia I', level: 5, type: '1° Cuatr.', correlCursada: [441, 443], correlAprobada: ['43A', 435] },
  { id: 454, name: 'Psicoterapia II', level: 5, type: '2° Cuatr.', correlCursada: [441, 443, 444], correlAprobada: ['43A', 435, 436] },
  { id: 455, name: 'Psicología Preventiva', level: 5, type: '2° Cuatr.', correlCursada: [441, 443, 444], correlAprobada: ['43A', 435, 436] },
  { id: 'TPT', name: 'Taller de Producción Textual', level: 5, type: 'Cuatrimestral', correlCursada: [441, 444, 445, 443, 442, 'ID1'], correlAprobada: [] },
  // Exclusivas Profesorado:
  { id: '34PRA', name: 'Planif. Didáctica y Prácticas de la Enseñanza', level: 5, type: 'Anual', correlCursada: [439, 444, 441, 452], correlAprobada: ['43A', 435, 427, 433, 431], isProfesorado: true },
  { id: 'ID2', name: 'Capacitación en Idioma II', level: 5, type: 'Cuatrimestral', correlCursada: [], correlAprobada: [], isProfesorado: true },

  // ── SEXTO AÑO (Solo Licenciatura) ──
  { id: 461, name: 'Psicología Clínica de Niños y Adolescentes', level: 6, type: 'Anual', correlCursada: [451, 453, 454], correlAprobada: [443, 442, 444] },
  { id: 462, name: 'Psicología Clínica de Adultos y Gerontes', level: 6, type: 'Anual', correlCursada: [451, 453, 454], correlAprobada: [441, 442, 444] },
  { id: 465, name: 'Orientación Vocacional', level: 6, type: '1° Cuatr.', correlCursada: [451, 455], correlAprobada: [443, 442, 444] },
  { id: 463, name: 'Psicología Laboral', level: 6, type: '2° Cuatr.', correlCursada: [451, 455], correlAprobada: [441, 442, 444] },
  { id: 464, name: 'Psicología Forense', level: 6, type: 'Cuatrimestral', correlCursada: [451, 455], correlAprobada: [443, 442, 444] },
  { id: 'TIF', name: 'Trabajo Integrador Final (TIF)', level: 6, type: 'Anual', correlCursada: [], correlAprobada: [441, 444, 445, 443, 442, 'ID1'] },
];

export const ELECTIVAS = {};

export const ALL = [...SUBJECTS];

export function getSubjectById(id: any) { 
  return ALL.find((s: any) => s.id == id); 
}