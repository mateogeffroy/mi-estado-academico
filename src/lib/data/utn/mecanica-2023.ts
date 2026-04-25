import { COMISIONES_BASICAS } from './comisiones-basicas';

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
    id: 'UTN-AM1', name: 'Análisis Matemático I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-AM1']
  },
  { 
    id: 'UTN-QG', name: 'Química General', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-QG']
  },
  { 
    id: 'UTN-AGA', name: 'Álgebra y Geometría Analítica', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-AGA']
  },
  { 
    id: 'UTN-F1', name: 'Física I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-F1']
  },
  { 
    id: 'UTN-IYS', name: 'Ingeniería y Sociedad', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'M11 (Mañana)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '11:45', fin: '13:15' }] },
      { id: 'M12 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '18:30' }] }
    ]
  },
  { 
    id: 'MEC-6', name: 'Ingeniería Mecánica I (Int.)', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'M11 (Mañana)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '08:00', fin: '09:30' }] },
      { id: 'M12 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '21:00', fin: '22:30' }] }
    ]
  },
  { 
    id: 'UTN-SDR', name: 'Sistemas de Representación', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-SDR']
  },

  // --- NIVEL 2 ---
  { 
    id: 'UTN-FI', name: 'Fundamentos de Informática', level: 2, type: 'Cuatrimestral', correlCursada: ['UTN-QG'], correlAprobada: ['UTN-QG'],
    comisiones: [
      { id: 'M11 (Mañana)', duration: 'C', dias: [{ nombre: 'Jueves', inicio: '10:15', fin: '11:45' }] },
      { id: 'M12 (Noche)', duration: 'C', dias: [{ nombre: 'Jueves', inicio: '18:30', fin: '20:00' }] }
    ]
  },
  { 
    id: 'MEC-9', name: 'Química Aplicada (Mat. No Metálicos)', level: 2, type: 'Cuatrimestral', correlCursada: ['UTN-QG'], correlAprobada: ['UTN-QG'],
    comisiones: [
      { id: 'M21 (Mañana)', duration: 'C', dias: [{ nombre: 'Miércoles', inicio: '10:30', fin: '12:45' }] },
      { id: 'M22 (Noche)', duration: 'C', dias: [{ nombre: 'Martes', inicio: '17:30', fin: '19:45' }] }
    ]
  },
  { 
    id: 'MEC-10', name: 'Estabilidad I', level: 2, type: 'Anual', correlCursada: ['UTN-AGA', 'UTN-F1'], correlAprobada: ['UTN-AGA', 'UTN-F1'],
    comisiones: [
      { id: 'M21 (Mañana)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '10:15', fin: '13:15' }] },
      { id: 'M22 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '20:45', fin: '22:15' }, { nombre: 'Miércoles', inicio: '20:45', fin: '22:15' }] }
    ]
  },
  { 
    id: 'MEC-11', name: 'Materiales Metálicos', level: 2, type: 'Anual', correlCursada: ['UTN-QG'], correlAprobada: ['UTN-QG'],
    comisiones: [
      { id: 'M21 (Mañana)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '08:30', fin: '10:30' }, { nombre: 'Jueves', inicio: '08:30', fin: '10:15' }] },
      { id: 'M22 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '20:45', fin: '22:30' }, { nombre: 'Viernes', inicio: '19:45', fin: '21:45' }] }
    ]
  },
  { 
    id: 'UTN-AM2', name: 'Análisis Matemático II', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-AGA'], correlAprobada: ['UTN-AM1', 'UTN-AGA'],
    comisiones: [
      { id: 'M21 (Mañana)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '10:30', fin: '12:00' }, { nombre: 'Miércoles', inicio: '08:00', fin: '10:30' }] },
      { id: 'M22 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '20:00', fin: '21:30' }, { nombre: 'Jueves', inicio: '18:30', fin: '20:45' }] }
    ]
  },
  { 
    id: 'UTN-F2', name: 'Física II', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-F1'], correlAprobada: ['UTN-AM1', 'UTN-F1'],
    comisiones: [
      { id: 'M21 (Mañana)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '11:00', fin: '12:45' }, { nombre: 'Viernes', inicio: '08:30', fin: '10:45' }] },
      { id: 'M22 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '20:45' }] }
    ]
  },
  { 
    id: 'MEC-14', name: 'Ing. Ambiental y Seguridad Ind.', level: 2, type: 'Anual', correlCursada: ['UTN-QG'], correlAprobada: ['UTN-QG'],
    comisiones: [
      { id: 'M21 (Mañana)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '10:15' }] },
      { id: 'M22 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:30', fin: '19:45' }] }
    ]
  },
  { 
    id: 'MEC-15', name: 'Ingeniería Mecánica II (Int.)', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-F1', 'MEC-6'], correlAprobada: ['UTN-AM1', 'UTN-F1', 'MEC-6'],
    comisiones: [
      { id: 'M21 (Mañana)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '11:00', fin: '12:30' }] },
      { id: 'M22 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '19:00', fin: '20:30' }] }
    ]
  },
  { id: 'UTN-ING1', name: 'Inglés I', level: 2, type: 'Anual', correlCursada: [], correlAprobada: [] },

  // --- NIVEL 3 ---
  { 
    id: 'MEC-17', name: 'Termodinámica', level: 3, type: 'Anual', correlCursada: ['UTN-AM2', 'UTN-F2'], correlAprobada: ['UTN-AM1', 'UTN-AGA', 'UTN-F1'],
    comisiones: [{ id: 'M31 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:30', fin: '21:15' }] }]
  },
  { 
    id: 'MEC-18', name: 'Mecánica Racional', level: 3, type: 'Anual', correlCursada: ['MEC-10', 'UTN-AM2'], correlAprobada: ['UTN-AM1', 'UTN-AGA', 'UTN-F1'],
    comisiones: [{ id: 'M31 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '20:45' }] }]
  },
  { 
    id: 'MEC-19', name: 'Mediciones y Ensayos', level: 3, type: 'Anual', correlCursada: ['MEC-11', 'UTN-F2'], correlAprobada: ['UTN-AM1', 'UTN-QG', 'UTN-F1'],
    comisiones: [{ id: 'M31 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '19:00', fin: '22:00' }] }]
  },
  { 
    id: 'MEC-20', name: 'Diseño Mecánico', level: 3, type: 'Anual', correlCursada: [], correlAprobada: ['MEC-6', 'UTN-SDR'],
    comisiones: [{ id: 'M31 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '20:45', fin: '23:00' }] }]
  },
  { 
    id: 'MEC-21', name: 'Cálculo Avanzado', level: 3, type: 'Anual', correlCursada: ['UTN-AM2'], correlAprobada: ['UTN-AM1', 'UTN-AGA'],
    comisiones: [{ id: 'M31 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '19:15' }] }]
  },
  { 
    id: 'MEC-22', name: 'Ingeniería Mecánica III (Int.)', level: 3, type: 'Anual', correlCursada: ['MEC-9', 'MEC-11', 'MEC-15'], correlAprobada: ['UTN-AM1', 'UTN-QG', 'UTN-F1', 'MEC-6', 'UTN-FI'],
    comisiones: [{ id: 'M31 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '18:30' }] }]
  },
  { 
    id: 'UTN-PYE', name: 'Probabilidad y Estadística', level: 3, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-AGA'], correlAprobada: [],
    comisiones: [{ id: 'M31 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '19:15', fin: '21:30' }] }]
  },
  { 
    id: 'MEC-24', name: 'Estabilidad II', level: 3, type: 'Anual', correlCursada: ['MEC-10', 'UTN-AM2'], correlAprobada: ['UTN-AM1', 'UTN-AGA', 'UTN-F1'],
    comisiones: [{ id: 'M31 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:00', fin: '20:00' }] }]
  },
  { id: 'UTN-ING2', name: 'Inglés II', level: 3, type: 'Anual', correlCursada: [], correlAprobada: ['UTN-ING1'] },
  { 
    id: 'UTN-ECO', name: 'Economía', level: 3, type: 'Anual', correlCursada: ['MEC-15'], correlAprobada: ['UTN-IYS'],
    comisiones: [{ id: 'M41 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '19:15' }] }]
  },

  // --- NIVEL 4 ---
  { 
    id: 'MEC-27', name: 'Elementos de Máquinas (Int.)', level: 4, type: 'Anual', correlCursada: ['MEC-11', 'MEC-18', 'MEC-22', 'MEC-24'], correlAprobada: ['UTN-QG', 'MEC-9', 'MEC-10', 'UTN-AM2', 'MEC-15', 'UTN-ING1'],
    comisiones: [{ id: 'M41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '18:30', fin: '22:15' }] }]
  },
  { 
    id: 'MEC-28', name: 'Tecnología del Calor', level: 4, type: 'Anual', correlCursada: ['MEC-17'], correlAprobada: ['UTN-AM2', 'UTN-F2'],
    comisiones: [{ id: 'M41 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '20:15', fin: '22:30' }] }]
  },
  { 
    id: 'MEC-29', name: 'Mecánica de los Fluidos', level: 4, type: 'Anual', correlCursada: ['MEC-17'], correlAprobada: ['UTN-AM2', 'UTN-F2'],
    comisiones: [{ id: 'M41 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '19:15', fin: '22:15' }] }]
  },
  { 
    id: 'MEC-30', name: 'Electrotecnia y Máquinas Eléctricas', level: 4, type: 'Anual', correlCursada: ['UTN-AM2', 'UTN-F2'], correlAprobada: ['UTN-AM1', 'UTN-AGA', 'UTN-F1'],
    comisiones: [{ id: 'M41 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '20:00', fin: '23:00' }] }]
  },
  { 
    id: 'MEC-31', name: 'Electrónica y Sistemas de Control', level: 4, type: 'Anual', correlCursada: ['UTN-AM2', 'UTN-F2'], correlAprobada: ['UTN-AM1', 'UTN-AGA', 'UTN-F1'],
    comisiones: [{ id: 'M41 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '19:15', fin: '23:00' }] }]
  },
  { 
    id: 'MEC-32', name: 'Tecnología de Fabricación', level: 4, type: 'Anual', correlCursada: ['MEC-9', 'MEC-11', 'MEC-20'], correlAprobada: ['UTN-QG'],
    comisiones: [{ id: 'M51 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '20:45' }] }]
  },
  { 
    id: 'MEC-33', name: 'Organización Industrial', level: 4, type: 'Anual', correlCursada: ['UTN-ECO'], correlAprobada: ['MEC-15'],
    comisiones: [{ id: 'M51 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '19:15' }] }]
  },

  // --- NIVEL 5 ---
  { 
    id: 'MEC-34', name: 'Mantenimiento', level: 5, type: 'Anual', correlCursada: ['MEC-27', 'MEC-30'], correlAprobada: ['MEC-9', 'MEC-10', 'MEC-11', 'UTN-F2', 'MEC-20', 'MEC-22', 'MEC-24'],
    comisiones: [{ id: 'M51 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '21:00', fin: '22:30' }] }]
  },
  { 
    id: 'MEC-35', name: 'Máquinas Alternativas y Turbom.', level: 5, type: 'Anual', correlCursada: ['MEC-28', 'MEC-29'], correlAprobada: ['MEC-17'],
    comisiones: [{ id: 'M51 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '18:45', fin: '21:45' }] }]
  },
  { 
    id: 'MEC-36', name: 'Instalaciones Industriales', level: 5, type: 'Anual', correlCursada: ['MEC-29', 'MEC-30', 'MEC-31'], correlAprobada: ['MEC-17'],
    comisiones: [{ id: 'M51 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '20:45' }] }]
  },
  { 
    id: 'MEC-37', name: 'Metrología e Ing. de la Calidad', level: 5, type: 'Anual', correlCursada: ['MEC-19', 'UTN-PYE'], correlAprobada: ['UTN-AGA', 'MEC-11', 'UTN-F2'],
    comisiones: [{ id: 'M41 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:00', fin: '20:00' }] }]
  },
  { 
    id: 'UTN-LEG', name: 'Legislación', level: 5, type: 'Anual', correlCursada: ['MEC-15'], correlAprobada: ['UTN-IYS'],
    comisiones: [{ id: 'M51 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '16:45', fin: '18:15' }] }]
  },
  { 
    id: 'MEC-39', name: 'Proyecto Final (Integradora)', level: 5, type: 'Anual', correlCursada: ['MEC-27'], correlAprobada: ['MEC-18', 'MEC-20', 'MEC-21', 'MEC-22', 'MEC-24', 'UTN-ING2'],
    comisiones: [{ id: 'M51 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '18:15', fin: '22:00' }] }]
  },
  { id: 'PPS', name: 'Práctica Profesional Supervisada', level: 5, type: 'Anual', correlCursada: [], correlAprobada: [] },
  
  // --- BOLSA DE ELECTIVAS ---
  { id: 'ELEC', name: 'Electivas necesarias (10 hs)', level: 5, type: 'Anual', isElectivePlaceholder: true, targetHours: 10, correlCursada: [], correlAprobada: [] }
];

export const ELECTIVAS = {
  5: [
    { 
      id: 'MEC-E1', name: 'Tecnología del Frío', type: '1° Cuatr.', correlCursada: ['MEC-11', 'MEC-17', 'MEC-20'], correlAprobada: ['UTN-F2'], annualHours: 2,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Jueves', inicio: '16:00', fin: '19:00' }] }]
    },
    { 
      id: 'MEC-E2', name: 'Mecánica de Materiales Granulares', type: '2° Cuatr.', correlCursada: ['MEC-17', 'MEC-18', 'MEC-19', 'UTN-PYE'], correlAprobada: ['UTN-FI', 'UTN-AM2', 'UTN-F2'], annualHours: 2, comisiones: []
    },
    { 
      id: 'MEC-E3', name: 'Sistemas CAD-CAM', type: 'Anual', correlCursada: ['MEC-11', 'MEC-20', 'MEC-21'], correlAprobada: ['UTN-SDR', 'UTN-FI'], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '16:00', fin: '18:15' }] }]
    },
    { 
      id: 'MEC-E4', name: 'Física III', type: 'Anual', correlCursada: ['UTN-AM2', 'UTN-F2'], correlAprobada: ['UTN-AM1', 'UTN-AGA', 'UTN-F1'], annualHours: 4,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Martes', inicio: '15:00', fin: '18:00' }] }]
    },
    { 
      id: 'MEC-E5', name: 'Máquinas Cuánticas', type: '2° Cuatr.', correlCursada: ['MEC-17'], correlAprobada: [], annualHours: 2, comisiones: []
    },
    { 
      id: 'MEC-E6', name: 'Geomecánica de Reservorios', type: 'Anual', correlCursada: ['MEC-18', 'MEC-19', 'MEC-24'], correlAprobada: ['UTN-F2'], annualHours: 3, comisiones: []
    },
    { 
      id: 'MEC-E7', name: 'Automatización Industrial', type: 'Anual', correlCursada: ['MEC-20', 'MEC-27', 'MEC-29'], correlAprobada: ['MEC-17'], annualHours: 4, comisiones: []
    },
    { 
      id: 'MEC-E8', name: 'Diseño Mecánico de Cañerías', type: 'Anual', correlCursada: ['MEC-17', 'MEC-20', 'MEC-29'], correlAprobada: ['MEC-11', 'MEC-24'], annualHours: 4,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '14:00', fin: '17:00' }] }]
    },
    { 
      id: 'MEC-E9', name: 'Intro. a los Elementos Finitos', type: 'Anual', correlCursada: ['MEC-17', 'MEC-21', 'MEC-24'], correlAprobada: ['UTN-F1', 'MEC-10', 'MEC-11', 'UTN-AM2'], annualHours: 4,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '19:30', fin: '22:45' }] }]
    },
    { 
      id: 'MEC-E10', name: 'Vibraciones Mecánicas', type: '2° Cuatr.', correlCursada: ['MEC-18', 'MEC-19', 'MEC-27', 'MEC-31'], correlAprobada: ['UTN-F2'], annualHours: 2, comisiones: []
    },
    { 
      id: 'MEC-E11', name: 'Conducción de Grupos', type: '1° Cuatr.', correlCursada: ['MEC-6', 'MEC-14'], correlAprobada: ['UTN-IYS'], annualHours: 2, comisiones: []
    },
    { 
      id: 'MEC-E12', name: 'Automotores', type: 'Anual', correlCursada: ['MEC-27', 'MEC-28'], correlAprobada: ['UTN-QG', 'MEC-9', 'MEC-10', 'MEC-11', 'UTN-F2', 'MEC-15'], annualHours: 4,
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