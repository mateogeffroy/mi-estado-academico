// src/lib/data/unlp/apu-2021.ts

export const careerInfo = {
  id: 'unlp-apu-2021',
  universidad: 'UNLP',
  nombre: 'Analista Programador Universitario',
  plan: 'Plan 2021',
  tituloIntermedio: '', // No tiene
  tituloFinal: 'Analista Programador Universitario',
  creditosTotales: 0,
};

export const SUBJECTS = [
  // ── CURSO DE INGRESO ──
  { id: 'CNE', num: '01', name: 'Expresión de Problemas y Algoritmos', hours: 'Ingreso', duration: 'Ingreso', level: 1, correlCursada: [], correlAprobada: [] },
  { id: 'CNC', num: '02', name: 'Conceptos de Organización de Computadoras', hours: 'Ingreso', duration: 'Ingreso', level: 1, correlCursada: [], correlAprobada: [] },
  { id: 'CNM', num: '03', name: 'Matemática 0', hours: 'Ingreso', duration: 'Ingreso', level: 1, correlCursada: [], correlAprobada: [] },

  // ── PRIMER AÑO ──
  // Primer Semestre (1S)
  { id: 'SI106', num: '04', name: 'Conceptos de Algoritmos, Datos y Programas', hours: '1S', duration: '1', level: 1, correlCursada: ['CNE'], correlAprobada: [] },
  { id: 'SI104', num: '05', name: 'Organización de Computadoras', hours: '1S', duration: '1', level: 1, correlCursada: ['CNC'], correlAprobada: [] },
  { id: 'SI101', num: '06', name: 'Matemática 1', hours: '1S', duration: '1', level: 1, correlCursada: ['CNM'], correlAprobada: [] },
  // Segundo Semestre (2S)
  { id: 'SI107', num: '07', name: 'Taller de Programación', hours: '2S', duration: '2', level: 1, correlCursada: ['SI106'], correlAprobada: [] },
  { id: 'SI105', num: '08', name: 'Arquitectura de Computadoras', hours: '2S', duration: '2', level: 1, correlCursada: ['SI104'], correlAprobada: [] },
  { id: 'SI102', num: '09', name: 'Matemática 2', hours: '2S', duration: '2', level: 1, correlCursada: ['SI101'], correlAprobada: [] },

  // ── SEGUNDO AÑO ──
  // Tercer Semestre (1S)
  { id: 'SI209', num: '10', name: 'Fundamentos de Organización de Datos', hours: '1S', duration: '1', level: 2, correlCursada: ['SI107'], correlAprobada: [] },
  { id: 'SI203', num: '11', name: 'Algoritmos y Estructuras de Datos', hours: '1S', duration: '1', level: 2, correlCursada: ['SI102', 'SI107'], correlAprobada: [] },
  { id: 'SI207', num: '12', name: 'Seminario de Lenguajes', hours: '1S', duration: '1', level: 2, correlCursada: ['SI107'], correlAprobada: [] },
  // Cuarto Semestre (2S)
  { id: 'SI210', num: '13', name: 'Diseño de Bases de Datos', hours: '2S', duration: '2', level: 2, correlCursada: ['SI209'], correlAprobada: [] },
  { id: 'SI202', num: '14', name: 'Ingeniería de Software 1', hours: '2S', duration: '2', level: 2, correlCursada: ['SI107'], correlAprobada: [] },
  { id: 'SI206', num: '15', name: 'Orientación a Objetos 1', hours: '2S', duration: '2', level: 2, correlCursada: ['SI107'], correlAprobada: [] },
  { id: 'SI204', num: '16', name: 'Introducción a los Sistemas Operativos', hours: '2S', duration: '2', level: 2, correlCursada: ['SI107', 'SI105'], correlAprobada: [] },
  { id: 'SI208', num: '17', name: 'Taller de lecto-comprensión y Traducción en Inglés', hours: '2S', duration: '2', level: 2, correlCursada: [], correlAprobada: [] },

  // ── TERCER AÑO ──
  // Quinto Semestre (1S)
  { id: 'SI308', num: '18', name: 'Matemática 3', hours: '1S', duration: '1', level: 3, correlCursada: ['SI102'], correlAprobada: [] },
  { id: 'SI302', num: '19', name: 'Ingeniería de Software 2', hours: '1S', duration: '1', level: 3, correlCursada: ['SI202', 'SI208'], correlAprobada: [] },
  { id: 'SI307', num: '20', name: 'Orientación a Objetos 2', hours: '1S', duration: '1', level: 3, correlCursada: ['SI206', 'SI208'], correlAprobada: [] },
  // Sexto Semestre (2S)
  { id: 'SI301', num: '21', name: 'Programación Concurrente', hours: '2S', duration: '2', level: 3, correlCursada: ['SI204', 'SI207', 'SI208'], correlAprobada: [] },
  { id: 'SI305', num: '22', name: 'Proyecto de Software', hours: '2S', duration: '2', level: 3, correlCursada: ['SI210', 'SI202', 'SI203', 'SI206', 'SI207', 'SI208'], correlAprobada: [] },
  { id: '07301', num: '23', name: 'Taller de Tecnologías de Producción de Software', hours: '2S', duration: '2', level: 3, correlCursada: ['SI210', 'SI203', 'SI204', 'SI206', 'SI208', 'SI302'], correlAprobada: [] },
  
  // Placeholder para la materia electiva
  { id: 'REQ3', num: 'E1', name: 'Electiva', hours: '1 Asign.', duration: '2', level: 3, correlCursada: [], correlAprobada: [], isElectivePlaceholder: true, targetHours: 1 },
];

export const ELECTIVAS = {
  3: [
    { id: 'SI306', num: 'OP', name: 'Conceptos y Paradigmas de Lenguajes de Programación', hours: '2S', duration: '2', annualHours: 1, correlCursada: ['SI203', 'SI207', 'SI208'], correlAprobada: [] },
    { id: 'SI304', num: 'OP', name: 'Redes y Comunicaciones', hours: '2S', duration: '2', annualHours: 1, correlCursada: ['SI102', 'SI204', 'SI208'], correlAprobada: [] },
    { id: 'S0303', num: 'OP', name: 'Bases de Datos 1', hours: '2S', duration: '2', annualHours: 1, correlCursada: ['SI210', 'SI208'], correlAprobada: [] },
    { id: 'S0410', num: 'OP', name: 'Sistemas y Organizaciones', hours: '2S', duration: '2', annualHours: 1, correlCursada: ['SI210', 'SI202', 'SI208'], correlAprobada: [] }
  ]
};

export const ALL = [
  ...SUBJECTS,
  ...(ELECTIVAS[3] || [])
];

export function getSubjectById(id: any) { 
  return ALL.find((s: any) => s.id == id); 
}