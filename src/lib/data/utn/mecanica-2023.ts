export const careerInfo = {
  id: 'utn-mecanica-2023',
  universidad: 'UTN FRLP',
  nombre: 'Ingeniería Mecánica',
  plan: 'Ord. 1027',
  tituloIntermedio: 'No posee',
  tituloFinal: 'Ingeniero/a Mecánico/a',
  creditosTotales: 39 
};

export const SUBJECTS = [
  // --- NIVEL 1 ---
  { 
    id: 1, name: 'Análisis Matemático I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'M11 (Mañana)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '12:00' }] },
      { id: 'M12 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '19:00', fin: '23:00' }] }
    ]
  },
  { 
    id: 2, name: 'Química General', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'M11 (Mañana)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '08:00', fin: '12:00' }] },
      { id: 'M12 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '18:00', fin: '22:00' }] }
    ]
  },
  { 
    id: 3, name: 'Álgebra y Geometría Analítica', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'M11 (Mañana)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '08:00', fin: '12:00' }] },
      { id: 'M12 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '21:00' }] }
    ]
  },
  { 
    id: 4, name: 'Física I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'M11 (Mañana)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '09:30', fin: '13:30' }] },
      { id: 'M12 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:30', fin: '21:30' }] }
    ]
  },
  { 
    id: 5, name: 'Ingeniería y Sociedad', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'M11 (Mañana)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '11:45', fin: '13:15' }] },
      { id: 'M12 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '18:30' }] }
    ]
  },
  { 
    id: 6, name: 'Ingeniería Mecánica I (Int.)', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'M11 (Mañana)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '08:00', fin: '09:30' }] },
      { id: 'M12 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '21:00', fin: '22:30' }] }
    ]
  },
  { 
    id: 7, name: 'Sistemas de Representación', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'M11 (Mañana)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '08:00', fin: '10:15' }] },
      { id: 'M12 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '16:45', fin: '19:00' }] }
    ]
  },

  // --- NIVEL 2 ---
  { 
    id: 8, name: 'Fundamentos de Informática', level: 2, type: 'Cuatrimestral', correlCursada: [2], correlAprobada: [2],
    comisiones: [
      { id: 'M11 (Mañana)', duration: 'C', dias: [{ nombre: 'Jueves', inicio: '10:15', fin: '11:45' }] },
      { id: 'M12 (Noche)', duration: 'C', dias: [{ nombre: 'Jueves', inicio: '18:30', fin: '20:00' }] }
    ]
  },
  { 
    id: 9, name: 'Química Aplicada (Mat. No Metálicos)', level: 2, type: 'Cuatrimestral', correlCursada: [2], correlAprobada: [2],
    comisiones: [
      { id: 'M21 (Mañana)', duration: 'C', dias: [{ nombre: 'Miércoles', inicio: '10:30', fin: '12:45' }] },
      { id: 'M22 (Noche)', duration: 'C', dias: [{ nombre: 'Martes', inicio: '17:30', fin: '19:45' }] }
    ]
  },
  { 
    id: 10, name: 'Estabilidad I', level: 2, type: 'Anual', correlCursada: [3, 4], correlAprobada: [3, 4],
    comisiones: [
      { id: 'M21 (Mañana)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '10:15', fin: '13:15' }] },
      { id: 'M22 (Noche)', duration: 'A', dias: [{ nombre: 'Lun y Mie', inicio: '20:45', fin: '22:15' }] }
    ]
  },
  { 
    id: 11, name: 'Materiales Metálicos', level: 2, type: 'Anual', correlCursada: [2], correlAprobada: [2],
    comisiones: [
      { id: 'M21 (Mañana)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '08:30', fin: '10:30' }, { nombre: 'Jueves', inicio: '08:30', fin: '10:15' }] },
      { id: 'M22 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '20:45', fin: '22:30' }, { nombre: 'Viernes', inicio: '19:45', fin: '21:45' }] }
    ]
  },
  { 
    id: 12, name: 'Análisis Matemático II', level: 2, type: 'Anual', correlCursada: [1, 3], correlAprobada: [1, 3],
    comisiones: [
      { id: 'M21 (Mañana)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '10:30', fin: '12:00' }, { nombre: 'Miércoles', inicio: '08:00', fin: '10:30' }] },
      { id: 'M22 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '20:00', fin: '21:30' }, { nombre: 'Jueves', inicio: '18:30', fin: '20:45' }] }
    ]
  },
  { 
    id: 13, name: 'Física II', level: 2, type: 'Anual', correlCursada: [1, 4], correlAprobada: [1, 4],
    comisiones: [
      { id: 'M21 (Mañana)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '11:00', fin: '12:45' }, { nombre: 'Viernes', inicio: '08:30', fin: '10:45' }] },
      { id: 'M22 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '20:45' }] }
    ]
  },
  { 
    id: 14, name: 'Ing. Ambiental y Seguridad Ind.', level: 2, type: 'Anual', correlCursada: [2], correlAprobada: [2],
    comisiones: [
      { id: 'M21 (Mañana)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '10:15' }] },
      { id: 'M22 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:30', fin: '19:45' }] }
    ]
  },
  { 
    id: 15, name: 'Ingeniería Mecánica II (Int.)', level: 2, type: 'Anual', correlCursada: [1, 4, 6], correlAprobada: [1, 4, 6],
    comisiones: [
      { id: 'M21 (Mañana)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '11:00', fin: '12:30' }] },
      { id: 'M22 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '19:00', fin: '20:30' }] }
    ]
  },
  { id: 16, name: 'Inglés I', level: 2, type: 'Anual', correlCursada: [], correlAprobada: [] },

  // --- NIVEL 3 ---
  { 
    id: 17, name: 'Termodinámica', level: 3, type: 'Anual', correlCursada: [12, 13], correlAprobada: [1, 3, 4],
    comisiones: [{ id: 'M31 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:30', fin: '21:15' }] }]
  },
  { 
    id: 18, name: 'Mecánica Racional', level: 3, type: 'Anual', correlCursada: [10, 12], correlAprobada: [1, 3, 4],
    comisiones: [{ id: 'M31 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '20:45' }] }]
  },
  { 
    id: 19, name: 'Mediciones y Ensayos', level: 3, type: 'Anual', correlCursada: [11, 13], correlAprobada: [1, 2, 4],
    comisiones: [{ id: 'M31 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '19:00', fin: '22:00' }] }]
  },
  { 
    id: 20, name: 'Diseño Mecánico', level: 3, type: 'Anual', correlCursada: [], correlAprobada: [6, 7],
    comisiones: [{ id: 'M31 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '20:45', fin: '23:00' }] }]
  },
  { 
    id: 21, name: 'Cálculo Avanzado', level: 3, type: 'Anual', correlCursada: [12], correlAprobada: [1, 3],
    comisiones: [{ id: 'M31 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '19:15' }] }]
  },
  { 
    id: 22, name: 'Ingeniería Mecánica III (Int.)', level: 3, type: 'Anual', correlCursada: [9, 11, 15], correlAprobada: [1, 2, 4, 6, 8],
    comisiones: [{ id: 'M31 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '18:30' }] }]
  },
  { 
    id: 23, name: 'Probabilidad y Estadística', level: 3, type: 'Anual', correlCursada: [1, 3], correlAprobada: [],
    comisiones: [{ id: 'M31 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '19:15', fin: '21:30' }] }]
  },
  { 
    id: 24, name: 'Estabilidad II', level: 3, type: 'Anual', correlCursada: [10, 12], correlAprobada: [1, 3, 4],
    comisiones: [{ id: 'M31 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:00', fin: '20:00' }] }]
  },
  { id: 25, name: 'Inglés II', level: 3, type: 'Anual', correlCursada: [], correlAprobada: [16] },
  { 
    id: 26, name: 'Economía', level: 3, type: 'Anual', correlCursada: [15], correlAprobada: [5],
    comisiones: [{ id: 'M41 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '19:15' }] }]
  },

  // --- NIVEL 4 ---
  { 
    id: 27, name: 'Elementos de Máquinas (Int.)', level: 4, type: 'Anual', correlCursada: [11, 18, 22, 24], correlAprobada: [2, 9, 10, 12, 15, 16],
    comisiones: [{ id: 'M41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '18:30', fin: '22:15' }] }]
  },
  { 
    id: 28, name: 'Tecnología del Calor', level: 4, type: 'Anual', correlCursada: [17], correlAprobada: [12, 13],
    comisiones: [{ id: 'M41 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '20:15', fin: '22:30' }] }]
  },
  { 
    id: 29, name: 'Mecánica de los Fluidos', level: 4, type: 'Anual', correlCursada: [17], correlAprobada: [12, 13],
    comisiones: [{ id: 'M41 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '19:15', fin: '22:15' }] }]
  },
  { 
    id: 30, name: 'Electrotecnia y Máquinas Eléctricas', level: 4, type: 'Anual', correlCursada: [12, 13], correlAprobada: [1, 3, 4],
    comisiones: [{ id: 'M41 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '20:00', fin: '23:00' }] }]
  },
  { 
    id: 31, name: 'Electrónica y Sistemas de Control', level: 4, type: 'Anual', correlCursada: [12, 13], correlAprobada: [1, 3, 4],
    comisiones: [{ id: 'M41 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '19:15', fin: '23:00' }] }]
  },
  { 
    id: 32, name: 'Tecnología de Fabricación', level: 4, type: 'Anual', correlCursada: [9, 11, 20], correlAprobada: [2],
    comisiones: [{ id: 'M51 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '20:45' }] }]
  },
  { 
    id: 33, name: 'Organización Industrial', level: 4, type: 'Anual', correlCursada: [26], correlAprobada: [15],
    comisiones: [{ id: 'M51 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '19:15' }] }]
  },

  // --- NIVEL 5 ---
  { 
    id: 34, name: 'Mantenimiento', level: 5, type: 'Anual', correlCursada: [27, 30], correlAprobada: [9, 10, 11, 13, 20, 22, 24],
    comisiones: [{ id: 'M51 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '21:00', fin: '22:30' }] }]
  },
  { 
    id: 35, name: 'Máquinas Alternativas y Turbom.', level: 5, type: 'Anual', correlCursada: [28, 29], correlAprobada: [17],
    comisiones: [{ id: 'M51 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '18:45', fin: '21:45' }] }]
  },
  { 
    id: 36, name: 'Instalaciones Industriales', level: 5, type: 'Anual', correlCursada: [29, 30, 31], correlAprobada: [17],
    comisiones: [{ id: 'M51 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '20:45' }] }]
  },
  { 
    id: 37, name: 'Metrología e Ing. de la Calidad', level: 5, type: 'Anual', correlCursada: [19, 23], correlAprobada: [3, 11, 13],
    comisiones: [{ id: 'M41 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:00', fin: '20:00' }] }]
  },
  { 
    id: 38, name: 'Legislación', level: 5, type: 'Anual', correlCursada: [15], correlAprobada: [5],
    comisiones: [{ id: 'M51 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '16:45', fin: '18:15' }] }]
  },
  { 
    id: 39, name: 'Proyecto Final (Integradora)', level: 5, type: 'Anual', correlCursada: [27], correlAprobada: [18, 20, 21, 22, 24, 25],
    comisiones: [{ id: 'M51 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '18:15', fin: '22:00' }] }]
  },
  { id: 'PPS', name: 'Práctica Profesional Supervisada', level: 5, type: 'Anual', correlCursada: [], correlAprobada: [] },
  
  // --- BOLSA DE ELECTIVAS ---
  { id: 'ELEC', name: 'Electivas necesarias (10 hs)', level: 5, type: 'Anual', isElectivePlaceholder: true, targetHours: 10, correlCursada: [], correlAprobada: [] }
];

export const ELECTIVAS = {
  5: [
    { 
      id: 'E1', name: 'Tecnología del Frío', type: '1° Cuatr.', correlCursada: [11, 17, 20], correlAprobada: [13], annualHours: 2,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Jueves', inicio: '16:00', fin: '19:00' }] }]
    },
    { 
      id: 'E2', name: 'Mecánica de Materiales Granulares', type: '2° Cuatr.', correlCursada: [17, 18, 19, 23], correlAprobada: [8, 12, 13], annualHours: 2, comisiones: []
    },
    { 
      id: 'E3', name: 'Sistemas CAD-CAM', type: 'Anual', correlCursada: [11, 20, 21], correlAprobada: [7, 8], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '16:00', fin: '18:15' }] }]
    },
    { 
      id: 'E4', name: 'Física III', type: 'Anual', correlCursada: [12, 13], correlAprobada: [1, 3, 4], annualHours: 4,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Martes', inicio: '15:00', fin: '18:00' }] }]
    },
    { 
      id: 'E5', name: 'Máquinas Cuánticas', type: '2° Cuatr.', correlCursada: [17], correlAprobada: [], annualHours: 2, comisiones: []
    },
    { 
      id: 'E6', name: 'Geomecánica de Reservorios', type: 'Anual', correlCursada: [18, 19, 24], correlAprobada: [13], annualHours: 3, comisiones: []
    },
    { 
      id: 'E7', name: 'Automatización Industrial', type: 'Anual', correlCursada: [20, 27, 29], correlAprobada: [17], annualHours: 4, comisiones: []
    },
    { 
      id: 'E8', name: 'Diseño Mecánico de Cañerías', type: 'Anual', correlCursada: [17, 20, 29], correlAprobada: [11, 24], annualHours: 4,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '14:00', fin: '17:00' }] }]
    },
    { 
      id: 'E9', name: 'Intro. a los Elementos Finitos', type: 'Anual', correlCursada: [17, 21, 24], correlAprobada: [4, 10, 11, 12], annualHours: 4,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '19:30', fin: '22:45' }] }]
    },
    { 
      id: 'E10', name: 'Vibraciones Mecánicas', type: '2° Cuatr.', correlCursada: [18, 19, 27, 31], correlAprobada: [13], annualHours: 2, comisiones: []
    },
    { 
      id: 'E11', name: 'Conducción de Grupos', type: '1° Cuatr.', correlCursada: [6, 14], correlAprobada: [5], annualHours: 2, comisiones: []
    },
    { 
      id: 'E12', name: 'Automotores', type: 'Anual', correlCursada: [27, 28], correlAprobada: [2, 9, 10, 11, 13, 15], annualHours: 4,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Martes', inicio: '15:00', fin: '18:00' }] }]
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