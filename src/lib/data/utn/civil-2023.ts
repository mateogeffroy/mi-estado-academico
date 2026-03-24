// src/lib/data/utn/civil-2023.ts

export const careerInfo = {
  id: 'utn-civil-2023',
  universidad: 'UTN FRLP',
  nombre: 'Ingeniería Civil',
  plan: '2023',
  tituloIntermedio: 'No posee',
  tituloFinal: 'Ingeniero/a Civil',
  creditosTotales: 41 
};

export const SUBJECTS = [
  // --- NIVEL 1 ---
  { 
    id: 1, name: 'Análisis Matemático I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'C11 (Mañana)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '12:00' }] },
      { id: 'C12 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:15', fin: '21:15' }] }
    ]
  },
  { 
    id: 2, name: 'Álgebra y Geometría Analítica', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'C11 (Mañana)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '08:00', fin: '12:00' }] },
      { id: 'C12 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '20:45' }] }
    ]
  },
  { 
    id: 3, name: 'Ingeniería y Sociedad', level: 1, type: '1° Cuatr.', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'C11 (Mañana)', duration: '1', dias: [{ nombre: 'Martes', inicio: '12:00', fin: '13:30' }] },
      { id: 'C12 (Noche)', duration: '1', dias: [{ nombre: 'Jueves', inicio: '16:30', fin: '18:30' }] }
    ]
  },
  { 
    id: 4, name: 'Ingeniería Civil I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'C11 (Mañana)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '12:00', fin: '14:15' }] },
      { id: 'C12 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '19:15' }] }
    ]
  },
  { 
    id: 5, name: 'Sistemas de Representación', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'C11 (Mañana)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '13:00', fin: '15:15' }] },
      { id: 'C12 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '18:30', fin: '20:45' }] }
    ]
  },
  { 
    id: 6, name: 'Química General', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'C11 (Mañana)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '08:00', fin: '12:00' }] },
      { id: 'C12 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '20:45', fin: '23:00' }, { nombre: 'Jueves', inicio: '20:45', fin: '22:15' }] }
    ]
  },
  { 
    id: 7, name: 'Física I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'C11 (Mañana)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '08:30', fin: '12:30' }] },
      { id: 'C12 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '18:00', fin: '21:45' }] }
    ]
  },
  { 
    id: 8, name: 'Fundamentos de Informática', level: 1, type: '2° Cuatr.', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'C11 (Mañana)', duration: '2', dias: [{ nombre: 'Martes', inicio: '14:00', fin: '17:00' }] },
      { id: 'C12 (Noche)', duration: '2', dias: [{ nombre: 'Lunes', inicio: '19:30', fin: '22:30' }] }
    ]
  },

  // --- NIVEL 2 ---
  { 
    id: 9, name: 'Análisis Matemático II', level: 2, type: 'Anual', correlCursada: [1, 2], correlAprobada: [],
    comisiones: [{ id: 'C21 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:15' }, { nombre: 'Viernes', inicio: '20:45', fin: '22:15' }] }]
  },
  { 
    id: 10, name: 'Estabilidad', level: 2, type: 'Anual', correlCursada: [1, 2, 5, 7, 8], correlAprobada: [],
    comisiones: [{ id: 'C21 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '19:45', fin: '22:00' }, { nombre: 'Jueves', inicio: '18:30', fin: '20:00' }] }]
  },
  { 
    id: 11, name: 'Ingeniería Civil II', level: 2, type: 'Anual', correlCursada: [3, 4, 5, 8], correlAprobada: [],
    comisiones: [{ id: 'C21 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '19:15' }] }]
  },
  { 
    id: 12, name: 'Tecnología de los Materiales', level: 2, type: 'Anual', correlCursada: [1, 5, 6, 7], correlAprobada: [],
    comisiones: [{ id: 'C21 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '19:15', fin: '22:15' }] }]
  },
  { 
    id: 13, name: 'Física II', level: 2, type: 'Anual', correlCursada: [1, 7], correlAprobada: [],
    comisiones: [{ id: 'C21 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:00', fin: '20:45' }] }]
  },
  { 
    id: 14, name: 'Probabilidad y Estadística', level: 2, type: 'Anual', correlCursada: [1, 2], correlAprobada: [],
    comisiones: [{ id: 'C21 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:45', fin: '20:00' }] }]
  },
  { id: 15, name: 'Inglés I', level: 2, type: 'Anual', correlCursada: [3], correlAprobada: [] },

  // --- NIVEL 3 ---
  { 
    id: 16, name: 'Resistencia de Materiales', level: 3, type: 'Anual', correlCursada: [10], correlAprobada: [1, 2, 7, 8],
    comisiones: [{ id: 'C31 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '18:30', fin: '20:00' }, { nombre: 'Miércoles', inicio: '17:00', fin: '18:30' }] }]
  },
  { 
    id: 17, name: 'Tecnología del Hormigón', level: 3, type: '1° Cuatr.', correlCursada: [12, 14, 15], correlAprobada: [1, 2, 6, 7],
    comisiones: [{ id: 'C31 (Noche)', duration: '1', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '18:30' }, { nombre: 'Miércoles', inicio: '20:45', fin: '22:15' }] }]
  },
  { 
    id: 18, name: 'Tecnología de la Construcción', level: 3, type: 'Anual', correlCursada: [10, 11, 12, 15], correlAprobada: [1, 2, 4, 5, 6, 7, 8],
    comisiones: [{ id: 'C31 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '18:30', fin: '20:45' }, { nombre: 'Viernes', inicio: '18:30', fin: '20:45' }] }]
  },
  { 
    id: 19, name: 'Geotopografía', level: 3, type: '1° Cuatr.', correlCursada: [9, 11, 13, 14], correlAprobada: [1, 2, 4, 5, 7],
    comisiones: [{ id: 'C31 (Noche)', duration: '1', dias: [{ nombre: 'Jueves', inicio: '17:45', fin: '20:45' }, { nombre: 'Sábado', inicio: '08:45', fin: '11:45' }] }]
  },
  { 
    id: 20, name: 'Hidráulica General y Aplicada', level: 3, type: 'Anual', correlCursada: [9, 10, 11, 13, 14], correlAprobada: [1, 2, 5, 7, 8],
    comisiones: [{ id: 'C31 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '20:30', fin: '22:00' }, { nombre: 'Miércoles', inicio: '20:45', fin: '22:15' }, { nombre: 'Jueves', inicio: '20:45', fin: '23:00' }] }]
  },
  { 
    id: 21, name: 'Cálculo Avanzado', level: 3, type: '1° Cuatr.', correlCursada: [9, 10, 12, 14], correlAprobada: [1, 2, 5, 7, 8],
    comisiones: [{ id: 'C31 (Noche)', duration: '1', dias: [{ nombre: 'Lunes', inicio: '19:00', fin: '20:30' }, { nombre: 'Viernes', inicio: '17:00', fin: '18:30' }] }]
  },
  { 
    id: 22, name: 'Instalaciones Eléctricas y Acústicas', level: 3, type: '2° Cuatr.', correlCursada: [11, 12, 13], correlAprobada: [1, 2, 4, 5, 6, 7],
    comisiones: [{ id: 'C31 (Noche)', duration: '2', dias: [{ nombre: 'Martes', inicio: '20:00', fin: '23:00' }] }]
  },
  { 
    id: 23, name: 'Instalaciones Termomecánicas', level: 3, type: '2° Cuatr.', correlCursada: [11, 12, 13], correlAprobada: [1, 2, 4, 5, 6, 7],
    comisiones: [{ id: 'C31 (Noche)', duration: '2', dias: [{ nombre: 'Lunes', inicio: '19:15', fin: '22:15' }] }]
  },
  { 
    id: 24, name: 'Economía', level: 3, type: '2° Cuatr.', correlCursada: [11, 14, 15], correlAprobada: [1, 2, 3, 4, 8],
    comisiones: [{ id: 'C31 (Noche)', duration: '2', dias: [{ nombre: 'Jueves', inicio: '16:15', fin: '20:45' }] }]
  },
  { id: 25, name: 'Inglés II', level: 3, type: 'Anual', correlCursada: [15], correlAprobada: [3, 4] },
  { 
    id: 32, name: 'Ingeniería Legal', level: 3, type: 'Anual', correlCursada: [9, 11, 14, 15], correlAprobada: [1, 2, 3, 4, 8],
    comisiones: [{ id: 'C31 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '16:45', fin: '19:00' }] }]
  },

  // --- NIVEL 4 ---
  { 
    id: 26, name: 'Geotecnia', level: 4, type: '2° Cuatr.', correlCursada: [16, 17, 18, 19, 20], correlAprobada: [9, 10, 11, 12, 13, 14],
    comisiones: [{ id: 'C41 (Noche)', duration: '2', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '19:15' }, { nombre: 'Martes', inicio: '17:00', fin: '19:15' }, { nombre: 'Miércoles', inicio: '17:00', fin: '20:00' }] }]
  },
  { 
    id: 27, name: 'Instalaciones Sanitarias y de Gas', level: 4, type: '1° Cuatr.', correlCursada: [18, 19, 20, 24], correlAprobada: [5, 6, 7, 8, 12],
    comisiones: [{ id: 'C41 (Noche)', duration: '1', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:15' }, { nombre: 'Miércoles', inicio: '17:00', fin: '19:15' }] }]
  },
  { 
    id: 28, name: 'Diseño Arquit., Planeamiento y Urb.', level: 4, type: 'Anual', correlCursada: [18, 19, 22, 23, 24, 25], correlAprobada: [10, 11, 12, 15],
    comisiones: [{ id: 'C41 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '21:30', fin: '23:00' }, { nombre: 'Jueves', inicio: '18:30', fin: '20:45' }] }]
  },
  { 
    id: 29, name: 'Análisis Estructural I', level: 4, type: 'Anual', correlCursada: [16, 17], correlAprobada: [9, 10, 11, 14],
    comisiones: [{ id: 'C41 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '19:15', fin: '21:30' }, { nombre: 'Jueves', inicio: '17:00', fin: '18:30' }] }]
  },
  { 
    id: 30, name: 'Estructuras de Hormigón', level: 4, type: 'Anual', correlCursada: [16, 17, 18, 19, 25], correlAprobada: [9, 10, 11, 12, 13, 14],
    comisiones: [{ id: 'C41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '19:15', fin: '21:30' }, { nombre: 'Jueves', inicio: '20:45', fin: '22:15' }] }]
  },
  { 
    id: 31, name: 'Hidrología y Obras Hidráulicas', level: 4, type: 'Anual', correlCursada: [16, 18, 19, 20, 24, 25], correlAprobada: [9, 10, 11, 12, 13, 14],
    comisiones: [{ id: 'C41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '21:30', fin: '23:00' }, { nombre: 'Miércoles', inicio: '21:30', fin: '23:00' }, { nombre: 'Viernes', inicio: '17:00', fin: '20:00' }] }]
  },
  { 
    id: 37, name: 'Vías de Comunicación I', level: 4, type: 'Anual', correlCursada: [17, 18, 19], correlAprobada: [9, 10, 11, 12, 14, 15],
    comisiones: [{ id: 'C41 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '20:00', fin: '21:30' }, { nombre: 'Viernes', inicio: '20:00', fin: '21:30' }] }]
  },

  // --- NIVEL 5 ---
  { 
    id: 33, name: 'Construcciones Metálicas y de Madera', level: 5, type: '2° Cuatr.', correlCursada: [21, 29], correlAprobada: [16, 17, 18, 19],
    comisiones: [{ id: 'C51 (Noche)', duration: '2', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '20:00' }, { nombre: 'Viernes', inicio: '18:30', fin: '21:30' }] }]
  },
  { 
    id: 34, name: 'Cimentaciones', level: 5, type: '1° Cuatr.', correlCursada: [21, 26, 29, 30, 31], correlAprobada: [16, 17, 18, 19, 20],
    comisiones: [{ id: 'C51 (Noche)', duration: '1', dias: [{ nombre: 'Martes', inicio: '19:15', fin: '21:30' }, { nombre: 'Miércoles', inicio: '19:15', fin: '21:30' }] }]
  },
  { 
    id: 35, name: 'Ingeniería Sanitaria', level: 5, type: '2° Cuatr.', correlCursada: [26, 27, 31], correlAprobada: [17, 18, 19, 20, 25],
    comisiones: [{ id: 'C51 (Noche)', duration: '2', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '20:00' }, { nombre: 'Miércoles', inicio: '20:00', fin: '21:30' }] }]
  },
  { 
    id: 36, name: 'Organización y Conducción de Obras', level: 5, type: '1° Cuatr.', correlCursada: [26, 27, 28, 30, 31], correlAprobada: [17, 18, 19, 20, 22, 23, 24, 25],
    comisiones: [{ id: 'C51 (Noche)', duration: '1', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '20:00' }, { nombre: 'Miércoles', inicio: '17:00', fin: '19:15' }, { nombre: 'Jueves', inicio: '17:45', fin: '20:00' }] }]
  },
  { 
    id: 38, name: 'Análisis Estructural II', level: 5, type: 'Anual', correlCursada: [21, 26, 29, 30, 31], correlAprobada: [16, 17, 18, 19, 25],
    comisiones: [{ id: 'C51 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:15' }, { nombre: 'Jueves', inicio: '20:00', fin: '21:30' }] }]
  },
  { 
    id: 39, name: 'Vías de Comunicación II', level: 5, type: 'Anual', correlCursada: [26, 30, 31, 32, 37], correlAprobada: [16, 17, 18, 19, 20, 24],
    comisiones: [{ id: 'C51 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '21:30', fin: '23:00' }, { nombre: 'Viernes', inicio: '17:00', fin: '18:30' }] }]
  },

  // --- NIVEL 6 ---
  { 
    id: 40, name: 'Gestión Ambiental y Des. Sust.', level: 6, type: '1° Cuatr.', correlCursada: [26, 28, 31, 32], correlAprobada: [20, 24, 25],
    comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Martes', inicio: '19:15', fin: '22:15' }, { nombre: 'Miércoles', inicio: '21:30', fin: '23:00' }] }]
  },
  { 
    id: 41, name: 'Proyecto Final', level: 6, type: '2° Cuatr.', correlCursada: [26, 27, 28, 29, 30, 31, 32], correlAprobada: [15, 16, 17, 18, 19, 20, 22, 23, 24, 25],
    comisiones: [{ id: 'C51 (Noche)', duration: '2', dias: [{ nombre: 'Martes', inicio: '19:15', fin: '22:15' }] }]
  },
  { id: 'PPS', name: 'Práctica Supervisada', level: 6, type: 'Anual', correlCursada: [26, 27, 28, 29, 30, 31, 32], correlAprobada: [15, 16, 17, 18, 19, 20, 22, 23, 24, 25] },
  
  // --- BOLSA DE ELECTIVAS ---
  { id: 'ELEC', name: 'Electivas necesarias (11 hs)', level: 6, type: 'Anual', isElectivePlaceholder: true, targetHours: 11, correlCursada: [], correlAprobada: [] }
];

export const ELECTIVAS = {
  5: [
    { 
      id: 'E1', name: 'Ferrocarriles I', type: '1° Cuatr.', correlCursada: [17, 18], correlAprobada: [12], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Lunes', inicio: '20:00', fin: '23:00' }, { nombre: 'Jueves', inicio: '21:30', fin: '23:00' }] }]
    },
    { 
      id: 'E2', name: 'Diseño Arq. y Planeamiento II', type: 'Anual', correlCursada: [28], correlAprobada: [18], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:45', fin: '20:00' }, { nombre: 'Viernes', inicio: '18:30', fin: '20:45' }] }]
    },
    { 
      id: 'E3', name: 'Rocas y Suelos', type: '1° Cuatr.', correlCursada: [35], correlAprobada: [26], annualHours: 2,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '20:00' }] }]
    },
    { 
      id: 'E4', name: 'Puentes y Prefabricaciones', type: '1° Cuatr.', correlCursada: [26, 30], correlAprobada: [17, 20], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Lunes', inicio: '20:00', fin: '23:00' }, { nombre: 'Jueves', inicio: '21:30', fin: '23:00' }] }]
    },
    { 
      id: 'E5', name: 'Centrales y Máquinas Hidráulicas', type: '1° Cuatr.', correlCursada: [31], correlAprobada: [20, 26], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:15' }, { nombre: 'Miércoles', inicio: '19:00', fin: '21:15' }] }]
    },
    { 
      id: 'E6', name: 'Estructuras Especiales', type: '1° Cuatr.', correlCursada: [30, 34, 35, 38], correlAprobada: [29], annualHours: 4,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Miércoles', inicio: '19:15', fin: '21:30' }, { nombre: 'Jueves', inicio: '17:00', fin: '20:45' }] }]
    },
    { 
      id: 'E7', name: 'Puertos y Vías Navegables', type: '1° Cuatr.', correlCursada: [30], correlAprobada: [26], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Lunes', inicio: '19:15', fin: '23:00' }, { nombre: 'Martes', inicio: '22:15', fin: '23:00' }] }]
    },
    { 
      id: 'E9', name: 'Vías III', type: '1° Cuatr.', correlCursada: [39], correlAprobada: [33], annualHours: 1.5,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '19:15' }, { nombre: 'Viernes', inicio: '17:00', fin: '19:15' }] }]
    },
    { 
      id: 'E10', name: 'Ferrocarriles II', type: '2° Cuatr.', correlCursada: [16, 26, 'E1'], correlAprobada: [10], annualHours: 2,
      comisiones: [{ id: 'Electiva', duration: '2', dias: [{ nombre: 'Lunes', inicio: '20:00', fin: '23:00' }] }]
    },
    { 
      id: 'E11', name: 'Gestión de Comp. en la Ingeniería', type: '1° Cuatr.', correlCursada: [18], correlAprobada: [11], annualHours: 1.5,
      comisiones: [] 
    },
  ]
};

export const ALL = [
  ...SUBJECTS,
  ...Object.values(ELECTIVAS).flat()
];

export const getSubjectById = (id: any) => {
  return ALL.find(subject => subject.id.toString() === id.toString());
};