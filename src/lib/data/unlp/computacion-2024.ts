// src/lib/data/unlp/computacion-2024.ts

export const careerInfo = {
  id: 'unlp-computacion-2024',
  universidad: 'UNLP',
  nombre: 'Ingeniería en Computación',
  plan: 'Plan 2024',
  tituloIntermedio: 'No posee',
  tituloFinal: 'Ingeniero/a en Computación',
  creditosTotales: 0,
};

export const SUBJECTS = [
  // ── NIVELACIÓN Y PRIMER AÑO (Level 1) ──
  { id: 'D1001', name: 'Matemática para Ingeniería', hours: 'Ingreso', duration: 'Ingreso', level: 1, correlCursada: [], correlAprobada: [] },
  { id: 'I1001', name: 'Introducción a la Informática', hours: 'Ingreso', duration: 'Ingreso', level: 1, correlCursada: [], correlAprobada: [] },
  
  // Primer Semestre (1S)
  { id: 'F1301', name: 'Matemática A', hours: '1S', duration: '1', level: 1, correlCursada: ['D1001'], correlAprobada: [] },
  { id: 'I1101', name: 'Programación I', hours: '1S', duration: '1', level: 1, correlCursada: ['I1001'], correlAprobada: [] },
  { id: 'I1166', name: 'Fundamentos de Arquitectura de Computadoras', hours: '1S', duration: '1', level: 1, correlCursada: ['I1001'], correlAprobada: [] },
  
  // Segundo Semestre (2S)
  { id: 'F1302', name: 'Matemática B', hours: '2S', duration: '2', level: 1, correlCursada: ['F1301'], correlAprobada: [] },
  { id: 'I1102', name: 'Programación II', hours: '2S', duration: '2', level: 1, correlCursada: ['I1101'], correlAprobada: [] },
  { id: 'F1303', name: 'Física I', hours: '2S', duration: '2', level: 1, correlCursada: ['F1301'], correlAprobada: [] },

  // ── SEGUNDO AÑO (Level 2) ──
  // Primer Semestre (1S)
  { id: 'F1304', name: 'Matemática C', hours: '1S', duration: '1', level: 2, correlCursada: ['F1302'], correlAprobada: [] },
  { id: 'I1103', name: 'Programación III', hours: '1S', duration: '1', level: 2, correlCursada: ['I1102'], correlAprobada: [] },
  { id: 'I1105', name: 'Arquitectura de Computadoras', hours: '1S', duration: '1', level: 2, correlCursada: ['I1166'], correlAprobada: [] },
  { id: 'I1104', name: 'Taller de Lenguajes I', hours: '1S', duration: '1', level: 2, correlCursada: ['I1102'], correlAprobada: [] },
  
  // Segundo Semestre (2S)
  { id: 'F1306', name: 'Matemática D', hours: '2S', duration: '2', level: 2, correlCursada: ['F1304'], correlAprobada: [] },
  { id: 'F1305', name: 'Física II', hours: '2S', duration: '2', level: 2, correlCursada: ['F1302', 'F1303'], correlAprobada: [] },
  { id: 'I1106', name: 'Conceptos de Sistemas Operativos', hours: '2S', duration: '2', level: 2, correlCursada: ['I1102', 'I1105'], correlAprobada: [] },
  { id: 'I1107', name: 'Taller de Lenguajes II', hours: '2S', duration: '2', level: 2, correlCursada: ['I1104'], correlAprobada: [] },
  { id: 'INFIN', name: 'Inglés (Prueba de Suficiencia)', hours: 'Antes de 3ro', duration: 'A', level: 2, correlCursada: [], correlAprobada: [] }, // Extra curricular

  // ── TERCER AÑO (Level 3) ──
  // Primer Semestre (1S)
  { id: 'F1315', name: 'Probabilidades y Estadística', hours: '1S', duration: '1', level: 3, correlCursada: ['F1302'], correlAprobada: [] },
  { id: 'E1282', name: 'Electrotecnia y Electrónica', hours: '1S', duration: '1', level: 3, correlCursada: ['F1304', 'F1305'], correlAprobada: [] },
  { id: 'I1108', name: 'Conceptos de Bases de Datos', hours: '1S', duration: '1', level: 3, correlCursada: ['I1102'], correlAprobada: [] },
  { id: 'E1301', name: 'Introducción al Diseño Lógico', hours: '1S', duration: '1', level: 3, correlCursada: ['I1105'], correlAprobada: [] },
  
  // Segundo Semestre (2S)
  { id: 'E1302', name: 'Introducción al Procesamiento de Señales', hours: '2S', duration: '2', level: 3, correlCursada: ['F1306'], correlAprobada: [] },
  { id: 'I1109', name: 'Taller de Arquitectura', hours: '2S', duration: '2', level: 3, correlCursada: ['E1301'], correlAprobada: [] },
  { id: 'I1110', name: 'Ingeniería de Software', hours: '2S', duration: '2', level: 3, correlCursada: ['I1102'], correlAprobada: [] },
  { id: 'E1303', name: 'Redes de Datos 1', hours: '2S', duration: '2', level: 3, correlCursada: ['I1106'], correlAprobada: [] },

  // ── CUARTO AÑO (Level 4) ──
  // Primer Semestre (1S)
  { id: 'I1111', name: 'Concurrencia y Paralelismo', hours: '1S', duration: '1', level: 4, correlCursada: ['I1107', 'I1106'], correlAprobada: [] },
  { id: 'E1304', name: 'Instrumentación y Control', hours: '1S', duration: '1', level: 4, correlCursada: ['E1282', 'E1302'], correlAprobada: [] },
  { id: 'E1305', name: 'Circuitos Digitales y Microcontroladores', hours: '1S', duration: '1', level: 4, correlCursada: ['I1109'], correlAprobada: [] },
  { id: 'I1113', name: 'Economía y Emprendedorismo', hours: '1S', duration: '1', level: 4, correlCursada: ['F1304'], correlAprobada: [] },
  { id: 'AFC1', name: 'Activ. de Formación Complementaria I', hours: '1S', duration: '1', level: 4, correlCursada: [], correlAprobada: [] },
  
  // Segundo Semestre (2S)
  { id: 'I1114', name: 'Redes de Datos II', hours: '2S', duration: '2', level: 4, correlCursada: ['E1303'], correlAprobada: [] },
  { id: 'I1115', name: 'Sistemas de Tiempo Real', hours: '2S', duration: '2', level: 4, correlCursada: ['I1110', 'I1111'], correlAprobada: [] },
  { id: 'E1306', name: 'Taller de Proyecto I', hours: '2S', duration: '2', level: 4, correlCursada: ['I1110', 'E1305'], correlAprobada: [] },
  { id: 'I1112', name: 'Bases de Datos', hours: '2S', duration: '2', level: 4, correlCursada: ['I1108'], correlAprobada: [] },
  { id: 'AFC2', name: 'Activ. de Formación Complementaria II', hours: '2S', duration: '2', level: 4, correlCursada: ['AFC1'], correlAprobada: [] },

  // ── QUINTO AÑO (Level 5) ──
  // Primer Semestre (1S)
  { id: 'I1116', name: 'Sistemas Distribuidos y Paralelos', hours: '1S', duration: '1', level: 5, correlCursada: ['I1111'], correlAprobada: [] },
  { id: 'I1117', name: 'Aspectos Legales de Ing. Informática', hours: '1S', duration: '1', level: 5, correlCursada: ['I1113'], correlAprobada: [] },
  { id: 'E1307', name: 'Intro. a la Arq. de Computadoras Cuánticas', hours: '1S', duration: '1', level: 5, correlCursada: ['E1306'], correlAprobada: [] },
  { id: 'REQ5_1', name: 'Optativa 1', hours: '1 Asign.', duration: '1', level: 5, correlCursada: [], correlAprobada: [], isElectivePlaceholder: true, targetHours: 1 },
  { id: 'AFC3', name: 'Activ. de Formación Complementaria III', hours: '1S', duration: '1', level: 5, correlCursada: ['AFC2'], correlAprobada: [] },
  
  // Segundo Semestre (2S)
  { id: 'I1118', name: 'Taller de Proyecto II', hours: '2S', duration: '2', level: 5, correlCursada: ['I1110'], correlAprobada: [] },
  { id: 'HUM', name: 'Electiva Aspectos Humanísticos', hours: '2S', duration: '2', level: 5, correlCursada: [], correlAprobada: [] },
  { id: 'I1167', name: 'Introducción a la Programación Cuántica', hours: '2S', duration: '2', level: 5, correlCursada: ['I1105', 'I1110'], correlAprobada: [] },
  { id: 'REQ5_2', name: 'Optativa 2', hours: '1 Asign.', duration: '2', level: 5, correlCursada: [], correlAprobada: [], isElectivePlaceholder: true, targetHours: 1 },
  { id: 'AFC4', name: 'Activ. de Formación Complementaria IV', hours: '2S', duration: '2', level: 5, correlCursada: ['AFC3'], correlAprobada: [] },
  
  // Final
  { id: 'EI100', name: 'Práctica Profesional Supervisada', hours: '200 hs', duration: 'A', level: 5, correlCursada: [], correlAprobada: [] }
];

export const ELECTIVAS = {
  5: [] // A rellenar en caso de tener lista de optativas
};

export const ALL = [
  ...SUBJECTS,
  ...(ELECTIVAS[5] || [])
];

export function getSubjectById(id: any) { 
  return ALL.find((s: any) => s.id === id); 
}