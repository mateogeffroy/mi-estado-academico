export const careerInfo = {
  id: 'utn-electrica',
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
    id: 1, name: 'Análisis Matemático I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'E11 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '18:15', fin: '22:00' }] }]
  },
  { 
    id: 2, name: 'Álgebra y Geometría Analítica', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'E11 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:30', fin: '21:30' }] }]
  },
  { 
    id: 3, name: 'Ingeniería y Sociedad', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'E11 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '16:30', fin: '18:00' }] }]
  },
  { 
    id: 4, name: 'Sistemas de Representación', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'E11 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '16:00', fin: '18:15' }] }]
  },
  { 
    id: 5, name: 'Física I', level: 1, type: 'Anual', correlCursada: [1], correlAprobada: [],
    comisiones: [{ id: 'E11 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '18:00', fin: '21:45' }] }]
  },
  { 
    id: 6, name: 'Química General', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'E11 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:15', fin: '21:00' }] }]
  },
  { 
    id: 7, name: 'Integración Eléctrica I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'E11 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '18:00', fin: '20:15' }] }]
  },
  { 
    id: 8, name: 'Fundamentos de Informática', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'E11 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '21:30', fin: '23:00' }] }]
  },

  // --- NIVEL 2 ---
  { 
    id: 9, name: 'Física II', level: 2, type: 'Anual', correlCursada: [1, 5], correlAprobada: [],
    comisiones: [{ id: 'E21 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '18:00', fin: '21:45' }] }]
  },
  { 
    id: 10, name: 'Probabilidad y Estadística', level: 2, type: 'Anual', correlCursada: [1, 2], correlAprobada: [],
    comisiones: [{ id: 'E21 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '19:45', fin: '22:00' }] }]
  },
  { 
    id: 11, name: 'Electrotecnia I', level: 2, type: 'Anual', correlCursada: [1, 2, 5], correlAprobada: [],
    comisiones: [{ id: 'E21 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '19:15', fin: '21:30' }, { nombre: 'Miércoles', inicio: '19:15', fin: '21:30' }] }]
  },
  { 
    id: 12, name: 'Estabilidad', level: 2, type: 'Anual', correlCursada: [1, 2, 5], correlAprobada: [],
    comisiones: [{ id: 'E21 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '18:00', fin: '19:30' }, { nombre: 'Jueves', inicio: '19:30', fin: '21:00' }] }]
  },
  { 
    id: 13, name: 'Mecánica Técnica', level: 2, type: 'Anual', correlCursada: [1, 5], correlAprobada: [],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '18:30', fin: '20:00' }] }] 
  },
  { 
    id: 14, name: 'Integración Eléctrica II', level: 2, type: 'Anual', correlCursada: [1, 5, 7], correlAprobada: [],
    comisiones: [{ id: 'E21 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:15' }] }]
  },
  { id: 15, name: 'Inglés I', level: 2, type: 'Anual', correlCursada: [], correlAprobada: [] },
  { 
    id: 16, name: 'Análisis Matemático II', level: 2, type: 'Anual', correlCursada: [1, 2], correlAprobada: [],
    comisiones: [{ id: 'E21 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '21:30', fin: '23:00' }, { nombre: 'Miércoles', inicio: '17:00', fin: '19:15' }] }]
  },
  { 
    id: 17, name: 'Cálculo Numérico', level: 2, type: 'Anual', correlCursada: [1, 2, 5, 8], correlAprobada: [],
    comisiones: [{ id: 'E21 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '21:00', fin: '22:30' }] }]
  },

  // --- NIVEL 3 ---
  { 
    id: 18, name: 'Tecnologías y Ensayos de Materiales', level: 3, type: 'Anual', correlCursada: [1, 5], correlAprobada: [6, 9],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '19:15' }] }]
  },
  { 
    id: 19, name: 'Instrumentos y Mediciones Eléctricas', level: 3, type: 'Anual', correlCursada: [1, 2, 5], correlAprobada: [10, 11],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '19:30', fin: '22:30' }, { nombre: 'Jueves', inicio: '19:15', fin: '20:45' }] }]
  },
  { 
    id: 20, name: 'Teoría de los Campos', level: 3, type: 'Anual', correlCursada: [9, 16], correlAprobada: [1, 2, 5],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:15', fin: '19:30' }] }]
  },
  { 
    id: 21, name: 'Física III', level: 3, type: 'Anual', correlCursada: [1, 2, 5], correlAprobada: [9, 16],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '18:00', fin: '19:30' }] }]
  },
  { 
    id: 22, name: 'Máquinas Eléctricas I', level: 3, type: 'Anual', correlCursada: [1, 5], correlAprobada: [9, 11, 16, 17],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '18:30', fin: '23:00' }] }]
  },
  { 
    id: 23, name: 'Electrotecnia II', level: 3, type: 'Anual', correlCursada: [1, 2, 5], correlAprobada: [9, 11, 16],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '19:45', fin: '22:45' }] }]
  },
  { 
    id: 24, name: 'Termodinámica', level: 3, type: 'Anual', correlCursada: [1, 2, 5], correlAprobada: [9, 16],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '20:45', fin: '23:00' }] }]
  },
  { 
    id: 25, name: 'Fundamentos para el Análisis de Señales', level: 3, type: 'Anual', correlCursada: [1, 2], correlAprobada: [16, 17],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '20:00', fin: '22:15' }] }]
  },
  { 
    id: 26, name: 'Taller Interdisciplinario', level: 3, type: 'Anual', correlCursada: [1, 5], correlAprobada: [9, 11, 16, 17],
    comisiones: [{ id: 'E31 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '16:30', fin: '18:00' }] }]
  },

  // --- NIVEL 4 ---
  { id: 27, name: 'Inglés II', level: 4, type: 'Anual', correlCursada: [], correlAprobada: [15] },
  { 
    id: 28, name: 'Economía', level: 4, type: 'Anual', correlCursada: [], correlAprobada: [3],
    comisiones: [{ id: 'E41 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '20:30', fin: '22:45' }] }]
  },
  { 
    id: 29, name: 'Electrónica I', level: 4, type: 'Anual', correlCursada: [1, 5], correlAprobada: [11],
    comisiones: [{ id: 'E41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '20:00', fin: '23:00' }] }]
  },
  { 
    id: 30, name: 'Máquinas Eléctricas II', level: 4, type: 'Anual', correlCursada: [6, 9, 10, 11, 15, 16], correlAprobada: [18, 19, 20, 22, 23],
    comisiones: [{ id: 'E41 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '18:30', fin: '23:00' }] }]
  },
  { 
    id: 31, name: 'Seguridad, Riesgo Eléctrico y Medioamb.', level: 4, type: 'Anual', correlCursada: [6, 11, 18, 20], correlAprobada: [15, 16],
    comisiones: [{ id: 'E41 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:00', fin: '18:30' }] }]
  },
  { 
    id: 32, name: 'Instalaciones Eléctricas y Luminotecnia', level: 4, type: 'Anual', correlCursada: [18, 22, 23], correlAprobada: [6, 9, 11, 14, 15, 16],
    comisiones: [{ id: 'E41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '20:00' }, { nombre: 'Miércoles', inicio: '17:00', fin: '18:30' }] }]
  },
  { 
    id: 33, name: 'Control Automático', level: 4, type: 'Anual', correlCursada: [11, 16], correlAprobada: [23, 25],
    comisiones: [{ id: 'E41 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '20:45' }] }]
  },
  { 
    id: 34, name: 'Máquinas Térmicas, Hidráulicas y Fluidos', level: 4, type: 'Anual', correlCursada: [9, 16], correlAprobada: [12, 13, 24],
    comisiones: [{ id: 'E41 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '18:15', fin: '20:30' }] }]
  },
  { 
    id: 35, name: 'Legislación', level: 4, type: 'Anual', correlCursada: [], correlAprobada: [3],
    comisiones: [{ id: 'E41 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '16:45', fin: '18:15' }] }]
  },

  // --- NIVEL 5 ---
  { 
    id: 36, name: 'Electrónica II', level: 5, type: 'Anual', correlCursada: [11, 26], correlAprobada: [23, 29],
    comisiones: [{ id: 'E51 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:45', fin: '20:00' }] }]
  },
  { 
    id: 37, name: 'Gen., Trans. y Dist. de Energía Eléctrica', level: 5, type: 'Anual', correlCursada: [21, 30, 34], correlAprobada: [12, 13, 18, 22, 23, 24],
    comisiones: [{ id: 'E51 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '20:00', fin: '23:00' }, { nombre: 'Viernes', inicio: '20:00', fin: '21:30' }] }]
  },
  { 
    id: 38, name: 'Sistemas de Potencia', level: 5, type: 'Anual', correlCursada: [18, 22, 23, 26], correlAprobada: [30, 33],
    comisiones: [{ id: 'E51 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '20:00', fin: '23:00' }] }]
  },
  { 
    id: 39, name: 'Accionamientos y Controles Eléctricos', level: 5, type: 'Anual', correlCursada: [29, 30, 33], correlAprobada: [11, 18, 22, 23, 25, 26],
    comisiones: [{ id: 'E51 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:00', fin: '20:00' }] }]
  },
  { 
    id: 40, name: 'Organización y Administración de Empresas', level: 5, type: 'Anual', correlCursada: [26], correlAprobada: [28, 35],
    comisiones: [{ id: 'E51 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '20:00' }] }]
  },
  { 
    id: 41, name: 'Proyecto Final', level: 5, type: 'Anual', correlCursada: [28, 30, 32, 33], correlAprobada: [18, 19, 22, 23, 25, 26, 27],
    comisiones: [{ id: 'E51 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:45', fin: '20:00' }, { nombre: 'Miércoles', inicio: '20:15', fin: '22:30' }] }]
  },
  { id: 'PPS', name: 'Práctica Profesional Supervisada', level: 5, type: 'Anual', correlCursada: [28, 30, 32, 33], correlAprobada: [18, 19, 22, 23, 25, 26, 27] },
  
  // --- BOLSA DE ELECTIVAS ---
  { id: 'ELEC', name: 'Electivas necesarias', level: 5, type: 'Anual', isElectivePlaceholder: true, targetHours: 10, correlCursada: [], correlAprobada: [] }
];

export const ELECTIVAS = {
  4: [
    { 
      id: 'E3', name: 'Aplicaciones en Tiempo Real', type: '1° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 2,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Viernes', inicio: '18:30', fin: '21:30' }] }]
    },
    { 
      id: 'E2', name: 'Conducción de Grupos', type: '2° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 2,
      comisiones: [{ id: 'Electiva', duration: '2', dias: [{ nombre: 'Viernes', inicio: '18:30', fin: '21:30' }] }]
    }
  ],
  5: [
    { 
      id: 'E5', name: 'Energías Alternativas en el Siglo XXI', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '20:00', fin: '22:15' }] }]
    },
    { 
      id: 'E7', name: 'Protecciones en Centrales Eléctricas', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '21:30', fin: '23:00' }] }]
    },
    { 
      id: 'E6', name: 'Impacto Ambiental de Líneas y Centrales', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:15', fin: '20:15' }] }]
    },
    { 
      id: 'E9', name: 'Proyectos Energéticos', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '20:00' }] }]
    },
    { id: 'E1', name: 'Responsabilidad Social Institucional', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 2, comisiones: [] },
    { id: 'E4', name: 'Marco Regulatorio Energético', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 2, comisiones: [] },
    { id: 'E8', name: 'Emprendedorismo', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 2, comisiones: [] }
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