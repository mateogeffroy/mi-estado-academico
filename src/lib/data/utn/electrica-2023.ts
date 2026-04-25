import { COMISIONES_BASICAS } from './comisiones-basicas';

export const careerInfo = {
  id: 'utn-electrica-2023', // Corregido para que coincida con tu page.tsx
  universidad: 'UTN FRLP',
  nombre: 'Ingeniería Eléctrica',
  plan: 'Plan 2023',
  tituloIntermedio: 'No posee',
  tituloFinal: 'Ingeniero/a Electricista',
  creditosTotales: 41 
};

export const SUBJECTS = [
  // --- NIVEL 1 ---
  { 
    id: 'UTN-AM1', name: 'Análisis Matemático I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-AM1']
  },
  { 
    id: 'UTN-AGA', name: 'Álgebra y Geometría Analítica', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-AGA']
  },
  { 
    id: 'UTN-IYS', name: 'Ingeniería y Sociedad', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'E11 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '16:30', fin: '18:00' }] }]
  },
  { 
    id: 'UTN-SDR', name: 'Sistemas de Representación', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-SDR']
  },
  { 
    id: 'UTN-F1', name: 'Física I', level: 1, type: 'Anual', correlCursada: ['UTN-AM1'], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-F1']
  },
  { 
    id: 'UTN-QG', name: 'Química General', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-QG']
  },
  { 
    id: 'ELE-7', name: 'Integración Eléctrica I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'E11 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '18:00', fin: '20:15' }] }]
  },
  { 
    id: 'UTN-FI', name: 'Fundamentos de Informática', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'E11 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '21:30', fin: '23:00' }] }]
  },

  // --- NIVEL 2 ---
  { 
    id: 'UTN-F2', name: 'Física II', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-F1'], correlAprobada: [],
    comisiones: [{ id: 'E21 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '18:00', fin: '21:45' }] }]
  },
  { 
    id: 'UTN-PYE', name: 'Probabilidad y Estadística', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-AGA'], correlAprobada: [],
    comisiones: [{ id: 'E21 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '19:45', fin: '22:00' }] }]
  },
  { 
    id: 'ELE-11', name: 'Electrotecnia I', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-AGA', 'UTN-F1'], correlAprobada: [],
    comisiones: [{ id: 'E21 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '19:15', fin: '21:30' }, { nombre: 'Miércoles', inicio: '19:15', fin: '21:30' }] }]
  },
  { 
    id: 'ELE-12', name: 'Estabilidad', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-AGA', 'UTN-F1'], correlAprobada: [],
    comisiones: [{ id: 'E21 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '18:00', fin: '19:30' }, { nombre: 'Jueves', inicio: '19:30', fin: '21:00' }] }]
  },
  { 
    id: 'ELE-13', name: 'Mecánica Técnica', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-F1'], correlAprobada: [],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '18:30', fin: '20:00' }] }] 
  },
  { 
    id: 'ELE-14', name: 'Integración Eléctrica II', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-F1', 'ELE-7'], correlAprobada: [],
    comisiones: [{ id: 'E21 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:15' }] }]
  },
  { id: 'UTN-ING1', name: 'Inglés I', level: 2, type: 'Anual', correlCursada: [], correlAprobada: [] },
  { 
    id: 'UTN-AM2', name: 'Análisis Matemático II', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-AGA'], correlAprobada: [],
    comisiones: [{ id: 'E21 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '21:30', fin: '23:00' }, { nombre: 'Miércoles', inicio: '17:00', fin: '19:15' }] }]
  },
  { 
    id: 'ELE-17', name: 'Cálculo Numérico', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-AGA', 'UTN-F1', 'UTN-FI'], correlAprobada: [],
    comisiones: [{ id: 'E21 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '21:00', fin: '22:30' }] }]
  },

  // --- NIVEL 3 ---
  { 
    id: 'ELE-18', name: 'Tecnologías y Ensayos de Materiales', level: 3, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-F1'], correlAprobada: ['UTN-QG', 'UTN-F2'],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '19:15' }] }]
  },
  { 
    id: 'ELE-19', name: 'Instrumentos y Mediciones Eléctricas', level: 3, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-AGA', 'UTN-F1'], correlAprobada: ['UTN-PYE', 'ELE-11'],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '19:30', fin: '22:30' }, { nombre: 'Jueves', inicio: '19:15', fin: '20:45' }] }]
  },
  { 
    id: 'ELE-20', name: 'Teoría de los Campos', level: 3, type: 'Anual', correlCursada: ['UTN-F2', 'UTN-AM2'], correlAprobada: ['UTN-AM1', 'UTN-AGA', 'UTN-F1'],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:15', fin: '19:30' }] }]
  },
  { 
    id: 'UTN-F3', name: 'Física III', level: 3, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-AGA', 'UTN-F1'], correlAprobada: ['UTN-F2', 'UTN-AM2'],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '18:00', fin: '19:30' }] }]
  },
  { 
    id: 'ELE-22', name: 'Máquinas Eléctricas I', level: 3, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-F1'], correlAprobada: ['UTN-F2', 'ELE-11', 'UTN-AM2', 'ELE-17'],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '18:30', fin: '23:00' }] }]
  },
  { 
    id: 'ELE-23', name: 'Electrotecnia II', level: 3, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-AGA', 'UTN-F1'], correlAprobada: ['UTN-F2', 'ELE-11', 'UTN-AM2'],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '19:45', fin: '22:45' }] }]
  },
  { 
    id: 'ELE-24', name: 'Termodinámica', level: 3, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-AGA', 'UTN-F1'], correlAprobada: ['UTN-F2', 'UTN-AM2'],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '20:45', fin: '23:00' }] }]
  },
  { 
    id: 'ELE-25', name: 'Fundamentos para el Análisis de Señales', level: 3, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-AGA'], correlAprobada: ['UTN-AM2', 'ELE-17'],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '20:00', fin: '22:15' }] }]
  },
  { 
    id: 'ELE-26', name: 'Taller Interdisciplinario', level: 3, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-F1'], correlAprobada: ['UTN-F2', 'ELE-11', 'UTN-AM2', 'ELE-17'],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '16:30', fin: '18:00' }] }]
  },

  // --- NIVEL 4 ---
  { id: 'UTN-ING2', name: 'Inglés II', level: 4, type: 'Anual', correlCursada: [], correlAprobada: ['UTN-ING1'] },
  { 
    id: 'UTN-ECO', name: 'Economía', level: 4, type: 'Anual', correlCursada: [], correlAprobada: ['UTN-IYS'],
    comisiones: [{ id: 'E41 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '20:30', fin: '22:45' }] }]
  },
  { 
    id: 'ELE-29', name: 'Electrónica I', level: 4, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-F1'], correlAprobada: ['ELE-11'],
    comisiones: [{ id: 'E41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '20:00', fin: '23:00' }] }]
  },
  { 
    id: 'ELE-30', name: 'Máquinas Eléctricas II', level: 4, type: 'Anual', correlCursada: ['UTN-QG', 'UTN-F2', 'UTN-PYE', 'ELE-11', 'UTN-ING1', 'UTN-AM2'], correlAprobada: ['ELE-18', 'ELE-19', 'ELE-20', 'ELE-22', 'ELE-23'],
    comisiones: [{ id: 'E41 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '18:30', fin: '23:00' }] }]
  },
  { 
    id: 'ELE-31', name: 'Seguridad, Riesgo Eléctrico y Medioamb.', level: 4, type: 'Anual', correlCursada: ['UTN-QG', 'ELE-11', 'ELE-18', 'ELE-20'], correlAprobada: ['UTN-ING1', 'UTN-AM2'],
    comisiones: [{ id: 'E41 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:00', fin: '18:30' }] }]
  },
  { 
    id: 'ELE-32', name: 'Instalaciones Eléctricas y Luminotecnia', level: 4, type: 'Anual', correlCursada: ['ELE-18', 'ELE-22', 'ELE-23'], correlAprobada: ['UTN-QG', 'UTN-F2', 'ELE-11', 'ELE-14', 'UTN-ING1', 'UTN-AM2'],
    comisiones: [{ id: 'E41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '20:00' }, { nombre: 'Miércoles', inicio: '17:00', fin: '18:30' }] }]
  },
  { 
    id: 'ELE-33', name: 'Control Automático', level: 4, type: 'Anual', correlCursada: ['ELE-11', 'UTN-AM2'], correlAprobada: ['ELE-23', 'ELE-25'],
    comisiones: [{ id: 'E41 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '20:45' }] }]
  },
  { 
    id: 'ELE-34', name: 'Máquinas Térmicas, Hidráulicas y Fluidos', level: 4, type: 'Anual', correlCursada: ['UTN-F2', 'UTN-AM2'], correlAprobada: ['ELE-12', 'ELE-13', 'ELE-24'],
    comisiones: [{ id: 'E41 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '18:15', fin: '20:30' }] }]
  },
  { 
    id: 'UTN-LEG', name: 'Legislación', level: 4, type: 'Anual', correlCursada: [], correlAprobada: ['UTN-IYS'],
    comisiones: [{ id: 'E41 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '16:45', fin: '18:15' }] }]
  },

  // --- NIVEL 5 ---
  { 
    id: 'ELE-36', name: 'Electrónica II', level: 5, type: 'Anual', correlCursada: ['ELE-11', 'ELE-26'], correlAprobada: ['ELE-23', 'ELE-29'],
    comisiones: [{ id: 'E51 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:45', fin: '20:00' }] }]
  },
  { 
    id: 'ELE-37', name: 'Gen., Trans. y Dist. de Energía Eléctrica', level: 5, type: 'Anual', correlCursada: ['UTN-F3', 'ELE-30', 'ELE-34'], correlAprobada: ['ELE-12', 'ELE-13', 'ELE-18', 'ELE-22', 'ELE-23', 'ELE-24'],
    comisiones: [{ id: 'E51 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '20:00', fin: '23:00' }, { nombre: 'Viernes', inicio: '20:00', fin: '21:30' }] }]
  },
  { 
    id: 'ELE-38', name: 'Sistemas de Potencia', level: 5, type: 'Anual', correlCursada: ['ELE-18', 'ELE-22', 'ELE-23', 'ELE-26'], correlAprobada: ['ELE-30', 'ELE-33'],
    comisiones: [{ id: 'E51 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '20:00', fin: '23:00' }] }]
  },
  { 
    id: 'ELE-39', name: 'Accionamientos y Controles Eléctricos', level: 5, type: 'Anual', correlCursada: ['ELE-29', 'ELE-30', 'ELE-33'], correlAprobada: ['ELE-11', 'ELE-18', 'ELE-22', 'ELE-23', 'ELE-25', 'ELE-26'],
    comisiones: [{ id: 'E51 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:00', fin: '20:00' }] }]
  },
  { 
    id: 'ELE-40', name: 'Organización y Administración de Empresas', level: 5, type: 'Anual', correlCursada: ['ELE-26'], correlAprobada: ['UTN-ECO', 'UTN-LEG'],
    comisiones: [{ id: 'E51 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '20:00' }] }]
  },
  { 
    id: 'ELE-41', name: 'Proyecto Final', level: 5, type: 'Anual', correlCursada: ['UTN-ECO', 'ELE-30', 'ELE-32', 'ELE-33'], correlAprobada: ['ELE-18', 'ELE-19', 'ELE-22', 'ELE-23', 'ELE-25', 'ELE-26', 'UTN-ING2'],
    comisiones: [{ id: 'E51 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:45', fin: '20:00' }, { nombre: 'Miércoles', inicio: '20:15', fin: '22:30' }] }]
  },
  { id: 'PPS', name: 'Práctica Profesional Supervisada', level: 5, type: 'Anual', correlCursada: ['UTN-ECO', 'ELE-30', 'ELE-32', 'ELE-33'], correlAprobada: ['ELE-18', 'ELE-19', 'ELE-22', 'ELE-23', 'ELE-25', 'ELE-26', 'UTN-ING2'] },
  
  // --- BOLSA DE ELECTIVAS ---
  { id: 'ELEC', name: 'Electivas necesarias', level: 5, type: 'Anual', isElectivePlaceholder: true, targetHours: 10, correlCursada: [], correlAprobada: [] }
];

export const ELECTIVAS = {
  4: [
    { 
      id: 'ELE-E3', name: 'Aplicaciones en Tiempo Real', type: '1° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 2,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Viernes', inicio: '18:30', fin: '21:30' }] }]
    },
    { 
      id: 'ELE-E2', name: 'Conducción de Grupos', type: '2° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 2,
      comisiones: [{ id: 'Electiva', duration: '2', dias: [{ nombre: 'Viernes', inicio: '18:30', fin: '21:30' }] }]
    }
  ],
  5: [
    { 
      id: 'ELE-E5', name: 'Energías Alternativas en el Siglo XXI', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '20:00', fin: '22:15' }] }]
    },
    { 
      id: 'ELE-E7', name: 'Protecciones en Centrales Eléctricas', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '21:30', fin: '23:00' }] }]
    },
    { 
      id: 'ELE-E6', name: 'Impacto Ambiental de Líneas y Centrales', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:15', fin: '20:15' }] }]
    },
    { 
      id: 'ELE-E9', name: 'Proyectos Energéticos', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '20:00' }] }]
    },
    { id: 'ELE-E1', name: 'Responsabilidad Social Institucional', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 2, comisiones: [] },
    { id: 'ELE-E4', name: 'Marco Regulatorio Energético', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 2, comisiones: [] },
    { id: 'ELE-E8', name: 'Emprendedorismo', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 2, comisiones: [] }
  ]
};

export const ALL = [
  ...SUBJECTS,
  ...(ELECTIVAS[4] || []),
  ...(ELECTIVAS[5] || [])
];

export const getSubjectById = (id: any) => {
  return ALL.find(subject => subject.id.toString() === id.toString());
};