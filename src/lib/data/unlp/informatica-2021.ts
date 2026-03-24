// src/lib/data/unlp/informatica-2021.ts

export const careerInfo = {
  id: 'unlp-informatica-2021',
  universidad: 'UNLP',
  nombre: 'Licenciatura en Informática',
  plan: 'Plan 2021',
  tituloIntermedio: 'Analista en TIC',
  tituloFinal: 'Licenciado/a en Informática',
  creditosTotales: 0,
};

export const SUBJECTS = [
  // ── CURSO DE INGRESO ──
  { id: 'CNE', num: '01', name: 'Expresión de Problemas y Algoritmos', hours: 'Ingreso', duration: 'Ingreso', level: 1, correlCursada: [], correlAprobada: [] },
  { id: 'CNC', num: '02', name: 'Conceptos de Organización de Computadoras', hours: 'Ingreso', duration: 'Ingreso', level: 1, correlCursada: [], correlAprobada: [] },
  { id: 'CNM', num: '03', name: 'Matemática 0', hours: 'Ingreso', duration: 'Ingreso', level: 1, correlCursada: [], correlAprobada: [] },

  // ── PRIMER AÑO ──
  // Primer Semestre (1S)
  { id: 'SI106', num: '04', name: 'Conceptos de Algoritmos, Datos y Programas', hours: '1S', duration: '1', level: 1, correlCursada: [], correlAprobada: ['CNE'] },
  { id: 'SI104', num: '05', name: 'Organización de Computadoras', hours: '1S', duration: '1', level: 1, correlCursada: [], correlAprobada: ['CNC'] },
  { id: 'SI101', num: '06', name: 'Matemática 1', hours: '1S', duration: '1', level: 1, correlCursada: [], correlAprobada: ['CNM'] },
  // Segundo Semestre (2S)
  { id: 'SI107', num: '07', name: 'Taller de Programación', hours: '2S', duration: '2', level: 1, correlCursada: [], correlAprobada: ['SI106'] },
  { id: 'SI105', num: '08', name: 'Arquitectura de Computadoras', hours: '2S', duration: '2', level: 1, correlCursada: [], correlAprobada: ['SI104'] },
  { id: 'SI102', num: '09', name: 'Matemática 2', hours: '2S', duration: '2', level: 1, correlCursada: [], correlAprobada: ['SI101'] },

  // ── SEGUNDO AÑO ──
  // Tercer Semestre (1S)
  { id: 'SI209', num: '10', name: 'Fundamentos de Organización de Datos', hours: '1S', duration: '1', level: 2, correlCursada: [], correlAprobada: ['SI107'] },
  { id: 'SI203', num: '11', name: 'Algoritmos y Estructuras de Datos', hours: '1S', duration: '1', level: 2, correlCursada: [], correlAprobada: ['SI102', 'SI107'] },
  { id: 'SI207', num: '12', name: 'Seminario de Lenguajes', hours: '1S', duration: '1', level: 2, correlCursada: [], correlAprobada: ['SI107'] },
  // Cuarto Semestre (2S)
  { id: 'SI210', num: '13', name: 'Diseño de Bases de Datos', hours: '2S', duration: '2', level: 2, correlCursada: [], correlAprobada: ['SI209'] },
  { id: 'SI202', num: '14', name: 'Ingeniería de Software 1', hours: '2S', duration: '2', level: 2, correlCursada: [], correlAprobada: ['SI107'] },
  { id: 'SI206', num: '15', name: 'Orientación a Objetos 1', hours: '2S', duration: '2', level: 2, correlCursada: [], correlAprobada: ['SI107'] },
  { id: 'SI204', num: '16', name: 'Introducción a los Sistemas Operativos', hours: '2S', duration: '2', level: 2, correlCursada: [], correlAprobada: ['SI107', 'SI105'] },
  { id: 'SI208', num: '17', name: 'Taller de lecto-comprensión y Traducción en Inglés', hours: '2S', duration: '2', level: 2, correlCursada: [], correlAprobada: [] },

  // ── TERCER AÑO ──
  // Quinto Semestre (1S)
  { id: 'SI308', num: '18', name: 'Matemática 3', hours: '1S', duration: '1', level: 3, correlCursada: [], correlAprobada: ['SI102'] },
  { id: 'SI302', num: '19', name: 'Ingeniería de Software 2', hours: '1S', duration: '1', level: 3, correlCursada: [], correlAprobada: ['SI202', 'SI208'] },
  { id: 'SI306', num: '20', name: 'Conceptos y Paradigmas de Lenguajes de Programación', hours: '1S', duration: '1', level: 3, correlCursada: [], correlAprobada: ['SI203', 'SI207', 'SI208'] },
  { id: 'SI307', num: '21', name: 'Orientación a Objetos 2', hours: '1S', duration: '1', level: 3, correlCursada: [], correlAprobada: ['SI206', 'SI208'] },
  // Sexto Semestre (2S)
  { id: 'SI304', num: '22', name: 'Redes y Comunicaciones', hours: '2S', duration: '2', level: 3, correlCursada: [], correlAprobada: ['SI102', 'SI204', 'SI208'] },
  { id: 'SI301', num: '23', name: 'Programación Concurrente', hours: '2S', duration: '2', level: 3, correlCursada: [], correlAprobada: ['SI204', 'SI207', 'SI208'] },
  { id: 'SI305', num: '24', name: 'Proyecto de Software', hours: '2S', duration: '2', level: 3, correlCursada: [], correlAprobada: ['SI210', 'SI202', 'SI203', 'SI206', 'SI207', 'SI208'] },
  { id: 'OI309', num: '25', name: 'Computabilidad y Complejidad', hours: '2S', duration: '2', level: 3, correlCursada: [], correlAprobada: ['SI203', 'SI308', 'SI208'] },

  // ── CUARTO AÑO ──
  // Séptimo Semestre (1S)
  { id: 'OI401', num: '26', name: 'Teoría de la Computación y Verificación de Programas', hours: '1S', duration: '1', level: 4, correlCursada: [], correlAprobada: ['SI308', 'SI306'] },
  { id: 'SI403', num: '27', name: 'Sistemas Operativos', hours: '1S', duration: '1', level: 4, correlCursada: [], correlAprobada: ['SI304'] },
  { id: 'OI404', num: '28', name: 'Sistemas Paralelos', hours: '1S', duration: '1', level: 4, correlCursada: [], correlAprobada: ['SI301'] },
  { id: 'REQ4', num: 'E1', name: 'Optativa 1 LI', hours: '1 Asign.', duration: '1', level: 4, correlCursada: [], correlAprobada: [], isElectivePlaceholder: true, targetHours: 1 },
  // Octavo Semestre (2S)
  { id: 'OI406', num: '29', name: 'Lógica e Inteligencia Artificial', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI102', 'SI306'] },
  { id: 'SI409', num: '30', name: 'Matemática 4', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI308'] },
  { id: 'OI402', num: '31', name: 'Laboratorio de Software', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI305'] },
  { id: 'OI405', num: '32', name: 'Programación Distribuida y Tiempo Real', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI306', 'SI304'] },

  // ── QUINTO AÑO ──
  // Noveno Semestre (1S)
  { id: 'OI502', num: '33', name: 'Diseño de Experiencia de Usuario', hours: '1S', duration: '1', level: 5, correlCursada: [], correlAprobada: ['SI302', 'OI402'] },
  { id: 'SI504', num: '34', name: 'Aspectos Sociales y Profesionales de Informática', hours: '1S', duration: '1', level: 5, correlCursada: [], correlAprobada: ['SI305'] },
  { id: 'SI505', num: '35', name: 'Aspectos Éticos, Sociales y Profesionales Avanzados de Informática', hours: '1S', duration: '1', level: 5, correlCursada: [], correlAprobada: ['SI305'] },
  // Para la tesina se exigen todos los finales de 1ro y 2do año, más 2 exámenes adicionales (que el alumno manejará desde la UI)
  { id: 'OI503', num: '36', name: 'Tesina de Licenciatura en Informática', hours: '1S', duration: '1', level: 5, correlCursada: [], correlAprobada: ['SI106', 'SI104', 'SI101', 'SI107', 'SI105', 'SI102', 'SI209', 'SI203', 'SI207', 'SI210', 'SI202', 'SI206', 'SI204', 'SI208'] },
];

export const ELECTIVAS = {
  4: [
    // Optativas Compartidas / Otros Planes
    { id: 'S0303', num: 'OP', name: 'Bases de Datos 1', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI210', 'SI208'] },
    { id: 'OP-CSS', num: 'OP', name: 'Calidad en Sistemas de Software', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI302'] },
    { id: 'OP-CCR', num: 'OP', name: 'Cloud Computing y Cloud Robotics', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI301'] },
    { id: 'OP-CAB', num: 'OP', name: 'Conceptos y Aplicaciones de Big Data', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI301'] },
    { id: 'S0408', num: 'OP', name: 'Desarrollo de Software en Sistemas Distribuidos', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI301', 'SI304', 'S0303'] },
    { id: 'OP-DIM', num: 'OP', name: 'Diseño de Interacciones en Aplicaciones Móviles', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI202', 'SI206', 'SI208'] },
    { id: 'OP-EDAM', num: 'OP', name: 'Enfoques para el Desarrollo de Aplicaciones Móviles Multiplataforma', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI210', 'SI302', 'SI307'] },
    { id: 'OP-IAW', num: 'OP', name: 'Ingeniería de Aplicaciones Web', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI307'] },
    { id: 'OP-ICB', num: 'OP', name: 'Introducción a la Ciberseguridad', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI304'] },
    { id: 'OP-ICM', num: 'OP', name: 'Introducción a la Computación Móvil', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI302', 'SI304'] },
    { id: 'OP-IFD', num: 'OP', name: 'Introducción a la Forensia Digital', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI403'] },
    { id: 'OP-MAA', num: 'OP', name: 'Métodos Ágiles para Aplicaciones Web', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI302', 'SI206', 'SI208'] },
    { id: 'OP-SPR', num: 'OP', name: 'Seguridad y Privacidad en Redes', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI403', 'SI304'] },
    { id: 'S0410', num: 'OP', name: 'Sistemas y Organizaciones', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI210', 'SI202', 'SI208'] },
    { id: 'OP-TPG', num: 'OP', name: 'Taller de Programación sobre GPU', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI301'] },

    // Optativas Adicionales
    { id: 'OP-AAP', num: 'OP', name: 'Aprendizaje Automático Profundo (Deep Learning)', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI203', 'SI308'] },
    { id: 'OP-DSB', num: 'OP', name: 'Desarrollo de Software para Blockchain', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI307', 'SI204', 'SI203'] },
    { id: 'OP-DSA', num: 'OP', name: 'Desarrollo Seguro de Aplicaciones', hours: '1S', duration: '1', level: 4, correlCursada: [], correlAprobada: ['SI305'] },
    { id: 'OP-IDC', num: 'OP', name: 'Internet de las Cosas', hours: '1S', duration: '1', level: 4, correlCursada: [], correlAprobada: ['SI305'] },
    { id: 'OP-IBC', num: 'OP', name: 'Introducción a Blockchain, Criptomonedas y Smart Contracts', hours: '1S', duration: '1', level: 4, correlCursada: [], correlAprobada: ['SI307', 'SI204', 'SI203'] },
    { id: 'OP-ICC', num: 'OP', name: 'Introducción a la Computación Cuántica', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: [] },
    { id: 'OP-JAA', num: 'OP', name: 'Java y Aplicaciones Avanzadas sobre Internet', hours: '1S', duration: '1', level: 4, correlCursada: [], correlAprobada: ['SI305'] },
    { id: 'OP-MDS', num: 'OP', name: 'Minería de Datos usando Sistemas Inteligentes', hours: '1S', duration: '1', level: 4, correlCursada: [], correlAprobada: ['SI203', 'SI308'] },
    { id: 'OP-PAS', num: 'OP', name: 'Patrones de Arquitecturas de Software', hours: '1S', duration: '1', level: 4, correlCursada: [], correlAprobada: ['SI305', 'SI307', 'SI302'] },
    { id: 'OP-PEL', num: 'OP', name: 'Programación en Lógica', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI306'] },
    { id: 'OP-TAS', num: 'OP', name: 'Tecnología, Ambiente y Sociedad', hours: '1S', duration: '1', level: 4, correlCursada: [], correlAprobada: ['SI304'] },
    { id: 'OP-WSG', num: 'OP', name: 'Web Semántica y Grafos de Conocimiento', hours: '1S', duration: '1', level: 4, correlCursada: [], correlAprobada: ['SI307', 'SI203'] },
    { id: 'OP-TAB', num: 'OP', name: 'Tecnologías Aplicadas para Business Intelligence', hours: '2S', duration: '2', level: 4, correlCursada: [], correlAprobada: ['SI305'] },
  ]
};

export const ALL = [
  ...SUBJECTS,
  ...(ELECTIVAS[4] || [])
];

export function getSubjectById(id: any) { 
  return ALL.find((s: any) => s.id == id); 
}