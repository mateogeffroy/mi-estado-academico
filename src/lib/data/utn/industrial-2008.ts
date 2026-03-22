export const careerInfo = {
  id: 'utn-industrial-2008',
  universidad: 'UTN FRLP',
  nombre: 'Ingeniería Industrial',
  plan: 'Ord. 1114',
  tituloIntermedio: 'No posee',
  tituloFinal: 'Ingeniero/a Industrial',
  creditosTotales: 42 
};

export const SUBJECTS = [
  // --- NIVEL 1 ---
  { 
    id: 1, name: 'Análisis Matemático I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'I11 (Mañana)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '12:00' }] },
      { id: 'I12 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '21:00' }] }
    ]
  },
  { 
    id: 2, name: 'Química General', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'I11 (Mañana)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '08:00', fin: '09:30' }, { nombre: 'Jueves', inicio: '10:30', fin: '12:45' }] },
      { id: 'I12 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '18:00', fin: '22:00' }] }
    ]
  },
  { 
    id: 3, name: 'Sistemas de Representación', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'I11 (Mañana)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '08:00', fin: '10:15' }] },
      { id: 'I12 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '18:00', fin: '20:15' }] }
    ]
  },
  { 
    id: 4, name: 'Informática I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'I11 (Mañana)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '08:00', fin: '10:15' }] },
      { id: 'I12 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '20:30', fin: '22:45' }] }
    ]
  },
  { 
    id: 5, name: 'Pensamiento Sistémico', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'I11 (Mañana)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '10:30', fin: '12:45' }] },
      { id: 'I12 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '20:30', fin: '22:45' }] }
    ]
  },
  { 
    id: 6, name: 'Física I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'I11 (Mañana)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '09:30', fin: '13:30' }] },
      { id: 'I12 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '16:30', fin: '20:30' }] }
    ]
  },
  { 
    id: 7, name: 'Álgebra y Geometría Analítica', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'I11 (Mañana)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '08:00', fin: '12:00' }] },
      { id: 'I12 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '21:00' }] }
    ]
  },
  { 
    id: 8, name: 'Ingeniería y Sociedad', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'I11 (Mañana)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '12:30', fin: '14:00' }] },
      { id: 'I12 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '16:30', fin: '18:00' }] }
    ]
  },

  // --- NIVEL 2 ---
  { 
    id: 9, name: 'Análisis Matemático II', level: 2, type: 'Anual', correlCursada: [1, 7], correlAprobada: [1, 7],
    comisiones: [
      { id: 'I21 (Mañana)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '12:00', fin: '13:30' }, { nombre: 'Martes', inicio: '08:00', fin: '10:15' }] },
      { id: 'I22 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '19:15' }, { nombre: 'Martes', inicio: '20:00', fin: '21:30' }] }
    ]
  },
  { 
    id: 10, name: 'Administración General', level: 2, type: 'Anual', correlCursada: [4, 5, 7, 8], correlAprobada: [4, 5, 7, 8],
    comisiones: [
      { id: 'I21 (Mañana)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '08:00', fin: '11:00' }] },
      { id: 'I22 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '19:15', fin: '22:15' }] }
    ]
  },
  { 
    id: 11, name: 'Probabilidad y Estadística', level: 2, type: 'Anual', correlCursada: [1, 7], correlAprobada: [1, 7],
    comisiones: [
      { id: 'I21 (Mañana)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '08:00', fin: '10:15' }] },
      { id: 'I22 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:30', fin: '19:45' }] }
    ]
  },
  { 
    id: 12, name: 'Ciencia de los Materiales', level: 2, type: 'Anual', correlCursada: [2, 6], correlAprobada: [2, 6],
    comisiones: [
      { id: 'I21 (Mañana)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '10:30', fin: '12:00' }, { nombre: 'Jueves', inicio: '10:30', fin: '12:00' }] },
      { id: 'I22 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '18:00', fin: '19:30' }, { nombre: 'Jueves', inicio: '17:30', fin: '19:00' }] }
    ]
  },
  { 
    id: 13, name: 'Física II', level: 2, type: 'Anual', correlCursada: [1, 6], correlAprobada: [1, 6],
    comisiones: [
      { id: 'I21 (Mañana)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '08:00', fin: '12:00' }] },
      { id: 'I22 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:15', fin: '21:15' }] }
    ]
  },
  { 
    id: 14, name: 'Economía General', level: 2, type: 'Anual', correlCursada: [1, 5, 8], correlAprobada: [1, 5, 8],
    comisiones: [
      { id: 'I21 (Mañana)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '09:30' }, { nombre: 'Viernes', inicio: '11:15', fin: '12:45' }] },
      { id: 'I22 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '21:30', fin: '23:00' }, { nombre: 'Viernes', inicio: '20:00', fin: '21:30' }] }
    ]
  },
  { 
    id: 15, name: 'Informática II', level: 2, type: 'Anual', correlCursada: [4], correlAprobada: [4],
    comisiones: [
      { id: 'I21 (Mañana)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '09:45', fin: '12:00' }] },
      { id: 'I22 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '19:15', fin: '21:30' }] }
    ]
  },
  { id: 16, name: 'Inglés I', level: 2, type: 'Anual', correlCursada: [], correlAprobada: [] },

  // --- NIVEL 3 ---
  { 
    id: 17, name: 'Costos y Presupuestos', level: 3, type: 'Anual', correlCursada: [10, 14], correlAprobada: [1, 4, 5, 7, 8],
    comisiones: [{ id: 'I31 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '18:00', fin: '20:15' }] }]
  },
  { 
    id: 18, name: 'Estudio del Trabajo', level: 3, type: 'Anual', correlCursada: [10, 11], correlAprobada: [1, 4, 5, 7, 8],
    comisiones: [{ id: 'I31 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '19:00', fin: '20:30' }, { nombre: 'Martes', inicio: '18:00', fin: '19:30' }] }]
  },
  { 
    id: 19, name: 'Comercialización', level: 3, type: 'Anual', correlCursada: [10, 11, 14], correlAprobada: [1, 4, 5, 7, 8],
    comisiones: [{ id: 'I31 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '20:45', fin: '23:00' }] }]
  },
  { 
    id: 20, name: 'Termodinámica y Máquinas Térmicas', level: 3, type: 'Anual', correlCursada: [2, 13], correlAprobada: [1, 6],
    comisiones: [{ id: 'I31 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '19:45', fin: '23:00' }] }]
  },
  { 
    id: 21, name: 'Estática y Resistencia de Materiales', level: 3, type: 'Anual', correlCursada: [9, 12], correlAprobada: [1, 2, 6, 7],
    comisiones: [{ id: 'I31 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:30', fin: '20:45' }] }]
  },
  { 
    id: 22, name: 'Mecánica de los Fluidos', level: 3, type: 'Anual', correlCursada: [9], correlAprobada: [1, 6, 7],
    comisiones: [{ id: 'I31 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '20:30', fin: '22:45' }] }]
  },
  { 
    id: 23, name: 'Economía de la Empresa', level: 3, type: 'Anual', correlCursada: [10, 14], correlAprobada: [1, 4, 5, 7, 8],
    comisiones: [{ id: 'I31 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '20:45', fin: '23:00' }] }]
  },
  { 
    id: 24, name: 'Electrotecnia y Máquinas Eléctricas', level: 3, type: 'Anual', correlCursada: [13], correlAprobada: [1, 6],
    comisiones: [{ id: 'I31 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:30', fin: '19:00' }, { nombre: 'Jueves', inicio: '20:45', fin: '23:00' }] }]
  },
  { 
    id: 25, name: 'Análisis Numérico y Cálculo Avanzado', level: 3, type: 'Anual', correlCursada: [9], correlAprobada: [1, 7],
    comisiones: [{ id: 'I31 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '19:00', fin: '20:30' }] }]
  },

  // --- NIVEL 4 ---
  { 
    id: 26, name: 'Seguridad, Higiene e Ing. Ambiental', level: 4, type: 'Anual', correlCursada: [18], correlAprobada: [10, 11],
    comisiones: [{ id: 'I41 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:30', fin: '19:45' }] }]
  },
  { 
    id: 27, name: 'Investigación Operativa', level: 4, type: 'Anual', correlCursada: [9, 11], correlAprobada: [1, 7],
    comisiones: [{ id: 'I41 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '20:00', fin: '23:00' }] }]
  },
  { 
    id: 28, name: 'Procesos Industriales', level: 4, type: 'Anual', correlCursada: [18, 20, 24], correlAprobada: [2, 10, 11, 13],
    comisiones: [{ id: 'I41 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '18:00', fin: '22:00' }] }]
  },
  { 
    id: 29, name: 'Mecánica y Mecanismos', level: 4, type: 'Anual', correlCursada: [9], correlAprobada: [1, 6, 7],
    comisiones: [{ id: 'I41 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '20:45', fin: '23:00' }] }]
  },
  { 
    id: 30, name: 'Evaluación de Proyectos', level: 4, type: 'Anual', correlCursada: [18, 19, 23], correlAprobada: [10, 11, 14, 16],
    comisiones: [{ id: 'I41 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '19:15', fin: '23:00' }] }]
  },
  { 
    id: 31, name: 'Planificación y Control de la Producción', level: 4, type: 'Anual', correlCursada: [18], correlAprobada: [10, 11],
    comisiones: [{ id: 'I41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '20:00', fin: '23:00' }] }]
  },
  { 
    id: 32, name: 'Diseño de Producto', level: 4, type: 'Anual', correlCursada: [15, 19], correlAprobada: [3, 4, 10, 11, 14],
    comisiones: [{ id: 'I41 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:30', fin: '19:00' }] }]
  },
  { id: 33, name: 'Inglés II', level: 4, type: 'Anual', correlCursada: [16], correlAprobada: [] },
  { 
    id: 34, name: 'Instalaciones Industriales', level: 4, type: 'Anual', correlCursada: [20, 21, 22, 24], correlAprobada: [2, 9, 12, 13],
    comisiones: [{ id: 'I41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:30', fin: '19:45' }] }]
  },
  { 
    id: 35, name: 'Legislación', level: 4, type: 'Anual', correlCursada: [10], correlAprobada: [],
    comisiones: [{ id: 'I41 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '19:15', fin: '20:45' }] }]
  },

  // --- NIVEL 5 ---
  { 
    id: 36, name: 'Mantenimiento', level: 5, type: '1° Cuatr.', correlCursada: [34], correlAprobada: [20, 21, 24],
    comisiones: [{ id: 'I51 (Noche)', duration: '1', dias: [{ nombre: 'Viernes', inicio: '18:30', fin: '20:45' }] }]
  },
  { 
    id: 37, name: 'Manejo de Materiales y Distribución', level: 5, type: 'Anual', correlCursada: [18, 29], correlAprobada: [9, 10, 11],
    comisiones: [{ id: 'I51 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '19:15', fin: '21:30' }] }]
  },
  { 
    id: 38, name: 'Comercio Exterior', level: 5, type: '1° Cuatr.', correlCursada: [30], correlAprobada: [18, 19, 23],
    comisiones: [{ id: 'I51 (Noche)', duration: '1', dias: [{ nombre: 'Martes', inicio: '17:30', fin: '19:45' }, { nombre: 'Viernes', inicio: '20:45', fin: '23:00' }] }]
  },
  { 
    id: 39, name: 'Relaciones Industriales', level: 5, type: 'Anual', correlCursada: [18], correlAprobada: [10, 11],
    comisiones: [{ id: 'I51 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '19:15' }] }]
  },
  { 
    id: 40, name: 'Proyecto Final', level: 5, type: 'Anual', correlCursada: [], correlAprobada: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 31, 33],
    comisiones: [{ id: 'I51 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '19:15', fin: '20:45' }, { nombre: 'Martes', inicio: '20:00', fin: '23:00' }] }]
  },
  { 
    id: 41, name: 'Ingeniería en Calidad', level: 5, type: 'Anual', correlCursada: [18], correlAprobada: [10, 11],
    comisiones: [{ id: 'I51 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '20:45', fin: '23:00' }] }]
  },
  { 
    id: 42, name: 'Control de Gestión', level: 5, type: '2° Cuatr.', correlCursada: [17, 23], correlAprobada: [10, 14],
    comisiones: [{ id: 'I51 (Noche)', duration: '2', dias: [{ nombre: 'Martes', inicio: '17:30', fin: '19:45' }, { nombre: 'Viernes', inicio: '20:45', fin: '23:00' }] }]
  },
  { id: 'PPS', name: 'Práctica Supervisada', level: 5, type: 'Anual', correlCursada: [], correlAprobada: [] },
  
  // --- BOLSA DE ELECTIVAS ---
  { id: 'ELEC', name: 'Electivas necesarias (10 hs)', level: 5, type: 'Anual', isElectivePlaceholder: true, targetHours: 10, correlCursada: [], correlAprobada: [] }
];

export const ELECTIVAS = {
  5: [
    { 
      id: 'E1', name: 'Conducción de Personal Organizacional', type: 'Anual', correlCursada: [9, 10, 11, 12, 13, 14, 15, 16, 18], correlAprobada: [4, 5, 8, 10, 15], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:15', fin: '19:30' }] }]
    },
    { 
      id: 'E2', name: 'Logística / Cadenas de Abastecimiento', type: 'Anual', correlCursada: [17, 18, 19, 20, 21, 22, 23, 24, 25], correlAprobada: [26, 27, 31, 34], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '20:45', fin: '23:00' }] }]
    },
    { 
      id: 'E3', name: 'Simulación y Optimización de Industrias', type: '1° Cuatr.', correlCursada: [17, 18, 19, 20, 21, 22, 23, 24, 25], correlAprobada: [27, 31], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:15' }, { nombre: 'Viernes', inicio: '16:15', fin: '18:30' }] }]
    },
    { 
      id: 'E4', name: 'Finanzas en Organizaciones', type: 'Anual', correlCursada: [17, 18, 19, 20, 21, 22, 23, 24, 25], correlAprobada: [30, 35], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '18:00', fin: '20:15' }] }]
    },
    { 
      id: 'E5', name: 'Instrumentación y Automatización', type: 'Anual', correlCursada: [17, 18, 19, 20, 21, 22, 23, 24, 25], correlAprobada: [28, 31, 34], annualHours: 3, comisiones: []
    },
    { 
      id: 'E6', name: 'Gestión Pyme', type: 'Anual', correlCursada: [17, 18, 19, 20, 21, 22, 23, 24, 25], correlAprobada: [30, 31, 32], annualHours: 2, comisiones: []
    },
    { 
      id: 'E7', name: 'Gestión Ambiental', type: 'Anual', correlCursada: [17, 18, 19, 20, 21, 22, 23, 24, 25], correlAprobada: [26, 28, 34], annualHours: 2, comisiones: []
    },
    { 
      id: 'E8', name: 'Desarrollo Emprendedor', type: 'Anual', correlCursada: [32, 35], correlAprobada: [17, 19, 23], annualHours: 2,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '18:30' }] }]
    },
    { 
      id: 'E9', name: 'Responsabilidad Social Institucional', type: '1° Cuatr.', correlCursada: [17, 18, 19, 20, 21, 22, 23, 24, 25], correlAprobada: [26], annualHours: 2,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Jueves', inicio: '19:15', fin: '20:45' }, { nombre: 'Viernes', inicio: '17:00', fin: '18:30' }] }]
    },
    { 
      id: 'E10', name: 'Industrialización de Hidrocarburos', type: 'Anual', correlCursada: [17, 18, 19, 20, 21, 22, 23, 24, 25], correlAprobada: [24, 28, 34], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '19:15' }] }]
    },
    { 
      id: 'E11', name: 'Retórica Profesional', type: 'Anual', correlCursada: [17, 18, 19, 20, 21, 22, 23, 24, 25], correlAprobada: [8, 10, 18, 19], annualHours: 3, comisiones: []
    },
    { 
      id: 'E12', name: 'Aplicación en Tiempo Real en la Industria', type: '2° Cuatr.', correlCursada: [28], correlAprobada: [15, 24, 25], annualHours: 2, comisiones: []
    },
    { 
      id: 'E13', name: 'Industria 4.0', type: '2° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 2,
      comisiones: [{ id: 'Electiva', duration: '2', dias: [{ nombre: 'Sábado', inicio: '09:00', fin: '12:00' }] }]
    },
    { 
      id: 'E14', name: 'Desarrollo del Personal', type: '1° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 2,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Sábado', inicio: '09:00', fin: '13:45' }] }]
    }
  ]
};

export const ALL = [
  ...SUBJECTS,
  ...Object.values(ELECTIVAS).flat()
];

export const getSubjectById = (id: any) => {
  return ALL.find(subject => subject.id.toString() === id.toString());
};