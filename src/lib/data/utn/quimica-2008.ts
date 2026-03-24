export const careerInfo = {
  id: 'utn-quimica-2008',
  universidad: 'UTN FRLP',
  nombre: 'Ingeniería Química',
  plan: 'Ord. 1028 (2008)',
  tituloIntermedio: 'Técnico Universitario en Química',
  tituloFinal: 'Ingeniero/a Químico/a',
  creditosTotales: 35 
};

export const SUBJECTS = [
  // --- NIVEL 1 ---
  { 
    id: 1, name: 'Introducción a la Ing. Química (Int. I)', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'Q11 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '18:45', fin: '21:00' }] }]
  },
  { 
    id: 2, name: 'Ingeniería y Sociedad', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'Q11 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '16:30', fin: '18:00' }] }]
  },
  { 
    id: 3, name: 'Álgebra y Geometría Analítica', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'Q11 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '18:00', fin: '22:00' }] }]
  },
  { 
    id: 4, name: 'Análisis Matemático I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'Q11 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '16:45', fin: '20:45' }] }]
  },
  { 
    id: 5, name: 'Física I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'Q11 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '18:45', fin: '22:45' }] }]
  },
  { 
    id: 6, name: 'Química General', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'Q11 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '21:00' }] }]
  },
  { 
    id: 7, name: 'Fundamentos de Informática', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'Q11 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '21:00', fin: '22:30' }] }]
  },

  // --- NIVEL 2 ---
  { 
    id: 8, name: 'Intro. a Equipos y Procesos (Int. II)', level: 2, type: 'Anual', correlCursada: [1, 4, 6], correlAprobada: [1, 4, 6],
    comisiones: [{ id: 'Q21 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '19:15', fin: '21:30' }] }]
  },
  { 
    id: 9, name: 'Probabilidad y Estadística', level: 2, type: 'Anual', correlCursada: [3, 4], correlAprobada: [3, 4],
    comisiones: [{ id: 'Q21 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:45', fin: '20:00' }] }]
  },
  { 
    id: 10, name: 'Química Inorgánica', level: 2, type: 'Anual', correlCursada: [6], correlAprobada: [6],
    comisiones: [{ id: 'Q21 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '19:15', fin: '22:30' }] }]
  },
  { 
    id: 11, name: 'Análisis Matemático II', level: 2, type: 'Anual', correlCursada: [3, 4], correlAprobada: [3, 4],
    comisiones: [{ id: 'Q21 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '16:15', fin: '18:15' }, { nombre: 'Viernes', inicio: '19:15', fin: '21:00' }] }]
  },
  { 
    id: 12, name: 'Física II', level: 2, type: 'Anual', correlCursada: [4, 5], correlAprobada: [4, 5],
    comisiones: [{ id: 'Q21 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '18:15', fin: '22:15' }] }]
  },
  { 
    id: 13, name: 'Química Orgánica', level: 2, type: 'Anual', correlCursada: [6], correlAprobada: [6],
    comisiones: [{ id: 'Q21 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:15' }, { nombre: 'Viernes', inicio: '17:00', fin: '18:30' }] }]
  },
  { id: 14, name: 'Inglés I', level: 2, type: 'Anual', correlCursada: [], correlAprobada: [] },
  { 
    id: 15, name: 'Sistemas de Representación', level: 2, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'Q21 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '15:30', fin: '17:45' }] }]
  },

  // --- NIVEL 3 ---
  { 
    id: 16, name: 'Balances de Masa y Energía (Int. III)', level: 3, type: 'Anual', correlCursada: [8, 11, 12], correlAprobada: [1, 4, 5, 6, 7],
    comisiones: [{ id: 'Q31 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '20:00', fin: '22:15' }] }]
  },
  { 
    id: 17, name: 'Matemática Superior Aplicada', level: 3, type: '2° Cuatr.', correlCursada: [11], correlAprobada: [3, 4, 11],
    comisiones: [{ id: 'Q31 (Noche)', duration: '2', dias: [{ nombre: 'Lunes', inicio: '20:00', fin: '22:15' }] }]
  },
  { 
    id: 18, name: 'Termodinámica', level: 3, type: '1° Cuatr.', correlCursada: [11, 12], correlAprobada: [3, 4, 5, 6, 11, 12],
    comisiones: [{ id: 'Q31 (Noche)', duration: '1', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '20:00' }] }]
  },
  { 
    id: 19, name: 'Economía', level: 3, type: 'Anual', correlCursada: [8], correlAprobada: [2, 8],
    comisiones: [{ id: 'Q41 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '19:30', fin: '21:45' }] }] // Se cursa generalmente en 4to
  },
  { 
    id: 20, name: 'Legislación', level: 3, type: '1° Cuatr.', correlCursada: [8], correlAprobada: [2, 8],
    comisiones: [{ id: 'Q21 (Noche)', duration: '1', dias: [{ nombre: 'Lunes', inicio: '20:00', fin: '23:00' }] }] // Se adelanta en 2do
  },
  { 
    id: 21, name: 'Mecánica - Eléctrica Industrial', level: 3, type: 'Anual', correlCursada: [12], correlAprobada: [4, 5, 12],
    comisiones: [{ id: 'Q51 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '20:00' }, { nombre: 'Lunes', inicio: '20:00', fin: '22:15' }] }] // Repartida en 5to
  },
  { 
    id: 22, name: 'Fisicoquímica', level: 3, type: 'Anual', correlCursada: [10, 11, 12, 18], correlAprobada: [3, 4, 5, 6, 10, 11, 12, 18],
    comisiones: [{ id: 'Q31 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '20:00' }] }]
  },
  { 
    id: 23, name: 'Fenómenos de Transporte', level: 3, type: 'Anual', correlCursada: [11, 12, 18], correlAprobada: [3, 4, 5, 6, 11, 12, 18],
    comisiones: [{ id: 'Q31 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:30', fin: '19:00' }, { nombre: 'Viernes', inicio: '17:45', fin: '20:00' }] }]
  },
  { 
    id: 24, name: 'Química Analítica', level: 3, type: 'Anual', correlCursada: [10, 12], correlAprobada: [4, 5, 6, 10, 12],
    comisiones: [{ id: 'Q31 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '20:00', fin: '21:30' }, { nombre: 'Viernes', inicio: '20:15', fin: '21:45' }] }]
  },
  { id: 25, name: 'Inglés II', level: 3, type: 'Anual', correlCursada: [14], correlAprobada: [] },

  // --- NIVEL 4 ---
  { 
    id: 26, name: 'Diseño y Simulación de Procesos (Int. IV)', level: 4, type: 'Anual', correlCursada: [16, 21, 23], correlAprobada: [8, 10, 11, 12, 14, 15, 16, 21, 23],
    comisiones: [{ id: 'Q41 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '19:30', fin: '22:30' }] }]
  },
  { 
    id: 27, name: 'Operaciones Unitarias I', level: 4, type: 'Anual', correlCursada: [18, 23], correlAprobada: [11, 12, 23],
    comisiones: [{ id: 'Q41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '20:45', fin: '23:00' }, { nombre: 'Jueves', inicio: '20:45', fin: '22:15' }] }]
  },
  { 
    id: 28, name: 'Tecnología de la Energía Térmica', level: 4, type: 'Anual', correlCursada: [18, 23], correlAprobada: [11, 12, 23],
    comisiones: [{ id: 'Q41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '18:30', fin: '20:45' }, { nombre: 'Jueves', inicio: '19:15', fin: '20:45' }] }]
  },
  { 
    id: 29, name: 'Microbiología y Biotecnología', level: 4, type: 'Anual', correlCursada: [22], correlAprobada: [10, 11, 12, 13, 22],
    comisiones: [{ id: 'Q31 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '19:15', fin: '21:30' }] }] // Programada en 3ro
  },
  { 
    id: 30, name: 'Operaciones Unitarias II', level: 4, type: 'Anual', correlCursada: [22, 23], correlAprobada: [10, 11, 12, 22, 23],
    comisiones: [{ id: 'Q41 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '19:15' }, { nombre: 'Viernes', inicio: '18:00', fin: '19:30' }] }]
  },
  { 
    id: 31, name: 'Ingeniería de las Reacciones Químicas', level: 4, type: 'Anual', correlCursada: [22, 23], correlAprobada: [10, 11, 12, 22, 23],
    comisiones: [{ id: 'Q41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '18:30' }, { nombre: 'Jueves', inicio: '17:00', fin: '19:15' }] }]
  },
  { 
    id: 32, name: 'Organización Industrial', level: 4, type: 'Anual', correlCursada: [19, 20], correlAprobada: [8, 19, 20],
    comisiones: [{ id: 'Q41 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:15' }] }]
  },

  // --- NIVEL 5 ---
  { 
    id: 33, name: 'Calidad y Control Estadístico de Procesos', level: 5, type: '2° Cuatr.', correlCursada: [22], correlAprobada: [9, 10, 11, 12, 22],
    comisiones: [{ id: 'Q41 (Noche)', duration: '2', dias: [{ nombre: 'Martes', inicio: '19:15', fin: '21:30' }] }] // Cursada en 4to
  },
  { 
    id: 34, name: 'Control Automático de Procesos', level: 5, type: 'Anual', correlCursada: [17, 27, 28], correlAprobada: [17, 23, 27, 28],
    comisiones: [{ id: 'Q51 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '20:00', fin: '23:00' }] }]
  },
  { 
    id: 35, name: 'Proyecto Final', level: 5, type: 'Anual', correlCursada: [26, 27, 31], correlAprobada: [16, 21, 23, 25],
    comisiones: [{ id: 'Q51 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '19:30', fin: '22:30' }] }]
  },
  { id: 'PPS', name: 'Práctica Profesional Supervisada', level: 5, type: 'Anual', correlCursada: [], correlAprobada: [] },
  
  // --- BOLSA DE ELECTIVAS ---
  { id: 'ELEC', name: 'Electivas necesarias', level: 5, type: 'Anual', isElectivePlaceholder: true, targetHours: 10, correlCursada: [], correlAprobada: [] }
];

export const ELECTIVAS = {
  3: [
    { id: 'MAT', name: 'Ciencia de los Materiales', type: '1° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 2, comisiones: [{ id: 'Q31 (Noche)', duration: '1', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '20:00' }] }] },
    { id: 'QA', name: 'Química Aplicada', type: '2° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 2, comisiones: [{ id: 'Q31 (Noche)', duration: '2', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '20:00' }] }] }
  ],
  5: [
    { 
      id: 'E1', name: 'Química Verde y Ecología Industrial', type: '1° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '20:00' }] }]
    },
    { 
      id: 'E2', name: 'Introducción a la Energía Nuclear', type: '2° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: '2', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '20:00' }] }]
    },
    { 
      id: 'E3', name: 'Corrosión Metálica y Protección', type: 'Anual', correlCursada: [10, 13, 22], correlAprobada: [8, 10, 13, 22], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:30', fin: '19:45' }] }]
    },
    { 
      id: 'E4', name: 'Energías Alternativas en el Siglo XXI', type: 'Anual', correlCursada: [18, 22, 23], correlAprobada: [10, 12, 18, 22, 23], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '20:00', fin: '22:15' }] }]
    },
    { 
      id: 'E5', name: 'Operaciones Logísticas', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '20:00', fin: '21:30' }] }]
    },
    { 
      id: 'E6', name: 'Retórica Profesional', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '14:30', fin: '16:45' }] }]
    },
    { 
      id: 'E7', name: 'Nanotecnología de Materiales Porosos', type: '1° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '20:00' }] }]
    },
    { 
      id: 'E8', name: 'Polímeros', type: '2° Cuatr.', correlCursada: [10, 13, 22], correlAprobada: [8, 10, 13, 22], annualHours: 2,
      comisiones: [{ id: 'Electiva', duration: '2', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '20:00' }] }]
    },
    { 
      id: 'E9', name: 'Industrialización de Hidrocarburos', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '19:15' }] }]
    },
    { 
      id: 'E10', name: 'Responsabilidad Social Institucional', type: '1° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 2,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Jueves', inicio: '19:15', fin: '20:45' }, { nombre: 'Viernes', inicio: '17:00', fin: '18:30' }] }]
    },
    { 
      id: 'E11', name: 'Protección de Materiales', type: 'Anual', correlCursada: [10, 13, 22], correlAprobada: [8, 10, 13, 22], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:00', fin: '19:15' }] }]
    },
    { 
      id: 'E12', name: 'Ingeniería de los Procesos Catalíticos', type: '1° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Viernes', inicio: '16:30', fin: '19:30' }] }]
    },
    { 
      id: 'E13', name: 'Higiene y Seguridad / Problem. Ambiental', type: '1° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 3,
      comisiones: [{ id: 'Q51 (Noche)', duration: '1', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '20:00' }] }]
    },
    { 
      id: 'E14', name: 'Ingeniería Ambiental', type: 'Anual', correlCursada: [16, 23, 24, 27], correlAprobada: [10, 13, 16, 23, 24, 27], annualHours: 3,
      comisiones: [{ id: 'Q51 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:15' }] }]
    }
  ]
};

export const ALL = [
  ...SUBJECTS,
  ...(ELECTIVAS[3] || []),
  ...(ELECTIVAS[5] || [])
];

export const getSubjectById = (id: any) => {
  return ALL.find(subject => subject.id.toString() === id.toString());
};