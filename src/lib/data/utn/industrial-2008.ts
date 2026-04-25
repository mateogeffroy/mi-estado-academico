import { COMISIONES_BASICAS } from './comisiones-basicas';

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
    id: 'UTN-AM1', name: 'Análisis Matemático I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-AM1']
  },
  { 
    id: 'UTN-QG', name: 'Química General', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-QG']
  },
  { 
    id: 'UTN-SDR', name: 'Sistemas de Representación', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-SDR']
  },
  { 
    id: 'IND-4', name: 'Informática I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'I11 (Mañana)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '08:00', fin: '10:15' }] },
      { id: 'I12 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '20:30', fin: '22:45' }] }
    ]
  },
  { 
    id: 'IND-5', name: 'Pensamiento Sistémico', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'I11 (Mañana)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '10:30', fin: '12:45' }] },
      { id: 'I12 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '20:30', fin: '22:45' }] }
    ]
  },
  { 
    id: 'UTN-F1', name: 'Física I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-F1']
  },
  { 
    id: 'UTN-AGA', name: 'Álgebra y Geometría Analítica', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-AGA']
  },
  { 
    id: 'UTN-IYS', name: 'Ingeniería y Sociedad', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'I11 (Mañana)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '12:30', fin: '14:00' }] },
      { id: 'I12 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '16:30', fin: '18:00' }] }
    ]
  },

  // --- NIVEL 2 ---
  { 
    id: 'UTN-AM2', name: 'Análisis Matemático II', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-AGA'], correlAprobada: ['UTN-AM1', 'UTN-AGA'],
    comisiones: [
      { id: 'I21 (Mañana)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '12:00', fin: '13:30' }, { nombre: 'Martes', inicio: '08:00', fin: '10:15' }] },
      { id: 'I22 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '19:15' }, { nombre: 'Martes', inicio: '20:00', fin: '21:30' }] }
    ]
  },
  { 
    id: 'IND-10', name: 'Administración General', level: 2, type: 'Anual', correlCursada: ['IND-4', 'IND-5', 'UTN-AGA', 'UTN-IYS'], correlAprobada: ['IND-4', 'IND-5', 'UTN-AGA', 'UTN-IYS'],
    comisiones: [
      { id: 'I21 (Mañana)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '08:00', fin: '11:00' }] },
      { id: 'I22 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '19:15', fin: '22:15' }] }
    ]
  },
  { 
    id: 'UTN-PYE', name: 'Probabilidad y Estadística', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-AGA'], correlAprobada: ['UTN-AM1', 'UTN-AGA'],
    comisiones: [
      { id: 'I21 (Mañana)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '08:00', fin: '10:15' }] },
      { id: 'I22 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:30', fin: '19:45' }] }
    ]
  },
  { 
    id: 'IND-12', name: 'Ciencia de los Materiales', level: 2, type: 'Anual', correlCursada: ['UTN-QG', 'UTN-F1'], correlAprobada: ['UTN-QG', 'UTN-F1'],
    comisiones: [
      { id: 'I21 (Mañana)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '10:30', fin: '12:00' }, { nombre: 'Jueves', inicio: '10:30', fin: '12:00' }] },
      { id: 'I22 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '18:00', fin: '19:30' }, { nombre: 'Jueves', inicio: '17:30', fin: '19:00' }] }
    ]
  },
  { 
    id: 'UTN-F2', name: 'Física II', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-F1'], correlAprobada: ['UTN-AM1', 'UTN-F1'],
    comisiones: [
      { id: 'I21 (Mañana)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '08:00', fin: '12:00' }] },
      { id: 'I22 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:15', fin: '21:15' }] }
    ]
  },
  { 
    id: 'IND-14', name: 'Economía General', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'IND-5', 'UTN-IYS'], correlAprobada: ['UTN-AM1', 'IND-5', 'UTN-IYS'],
    comisiones: [
      { id: 'I21 (Mañana)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '09:30' }, { nombre: 'Viernes', inicio: '11:15', fin: '12:45' }] },
      { id: 'I22 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '21:30', fin: '23:00' }, { nombre: 'Viernes', inicio: '20:00', fin: '21:30' }] }
    ]
  },
  { 
    id: 'IND-15', name: 'Informática II', level: 2, type: 'Anual', correlCursada: ['IND-4'], correlAprobada: ['IND-4'],
    comisiones: [
      { id: 'I21 (Mañana)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '09:45', fin: '12:00' }] },
      { id: 'I22 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '19:15', fin: '21:30' }] }
    ]
  },
  { id: 'UTN-ING1', name: 'Inglés I', level: 2, type: 'Anual', correlCursada: [], correlAprobada: [] },

  // --- NIVEL 3 ---
  { 
    id: 'IND-17', name: 'Costos y Presupuestos', level: 3, type: 'Anual', correlCursada: ['IND-10', 'IND-14'], correlAprobada: ['UTN-AM1', 'IND-4', 'IND-5', 'UTN-AGA', 'UTN-IYS'],
    comisiones: [{ id: 'I31 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '18:00', fin: '20:15' }] }]
  },
  { 
    id: 'IND-18', name: 'Estudio del Trabajo', level: 3, type: 'Anual', correlCursada: ['IND-10', 'UTN-PYE'], correlAprobada: ['UTN-AM1', 'IND-4', 'IND-5', 'UTN-AGA', 'UTN-IYS'],
    comisiones: [{ id: 'I31 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '19:00', fin: '20:30' }, { nombre: 'Martes', inicio: '18:00', fin: '19:30' }] }]
  },
  { 
    id: 'IND-19', name: 'Comercialización', level: 3, type: 'Anual', correlCursada: ['IND-10', 'UTN-PYE', 'IND-14'], correlAprobada: ['UTN-AM1', 'IND-4', 'IND-5', 'UTN-AGA', 'UTN-IYS'],
    comisiones: [{ id: 'I31 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '20:45', fin: '23:00' }] }]
  },
  { 
    id: 'IND-20', name: 'Termodinámica y Máquinas Térmicas', level: 3, type: 'Anual', correlCursada: ['UTN-QG', 'UTN-F2'], correlAprobada: ['UTN-AM1', 'UTN-F1'],
    comisiones: [{ id: 'I31 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '19:45', fin: '23:00' }] }]
  },
  { 
    id: 'IND-21', name: 'Estática y Resistencia de Materiales', level: 3, type: 'Anual', correlCursada: ['UTN-AM2', 'IND-12'], correlAprobada: ['UTN-AM1', 'UTN-QG', 'UTN-F1', 'UTN-AGA'],
    comisiones: [{ id: 'I31 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:30', fin: '20:45' }] }]
  },
  { 
    id: 'IND-22', name: 'Mecánica de los Fluidos', level: 3, type: 'Anual', correlCursada: ['UTN-AM2'], correlAprobada: ['UTN-AM1', 'UTN-F1', 'UTN-AGA'],
    comisiones: [{ id: 'I31 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '20:30', fin: '22:45' }] }]
  },
  { 
    id: 'IND-23', name: 'Economía de la Empresa', level: 3, type: 'Anual', correlCursada: ['IND-10', 'IND-14'], correlAprobada: ['UTN-AM1', 'IND-4', 'IND-5', 'UTN-AGA', 'UTN-IYS'],
    comisiones: [{ id: 'I31 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '20:45', fin: '23:00' }] }]
  },
  { 
    id: 'IND-24', name: 'Electrotecnia y Máquinas Eléctricas', level: 3, type: 'Anual', correlCursada: ['UTN-F2'], correlAprobada: ['UTN-AM1', 'UTN-F1'],
    comisiones: [{ id: 'I31 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:30', fin: '19:00' }, { nombre: 'Jueves', inicio: '20:45', fin: '23:00' }] }]
  },
  { 
    id: 'IND-25', name: 'Análisis Numérico y Cálculo Avanzado', level: 3, type: 'Anual', correlCursada: ['UTN-AM2'], correlAprobada: ['UTN-AM1', 'UTN-AGA'],
    comisiones: [{ id: 'I31 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '19:00', fin: '20:30' }] }]
  },

  // --- NIVEL 4 ---
  { 
    id: 'IND-26', name: 'Seguridad, Higiene e Ing. Ambiental', level: 4, type: 'Anual', correlCursada: ['IND-18'], correlAprobada: ['IND-10', 'UTN-PYE'],
    comisiones: [{ id: 'I41 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:30', fin: '19:45' }] }]
  },
  { 
    id: 'IND-27', name: 'Investigación Operativa', level: 4, type: 'Anual', correlCursada: ['UTN-AM2', 'UTN-PYE'], correlAprobada: ['UTN-AM1', 'UTN-AGA'],
    comisiones: [{ id: 'I41 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '20:00', fin: '23:00' }] }]
  },
  { 
    id: 'IND-28', name: 'Procesos Industriales', level: 4, type: 'Anual', correlCursada: ['IND-18', 'IND-20', 'IND-24'], correlAprobada: ['UTN-QG', 'IND-10', 'UTN-PYE', 'UTN-F2'],
    comisiones: [{ id: 'I41 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '18:00', fin: '22:00' }] }]
  },
  { 
    id: 'IND-29', name: 'Mecánica y Mecanismos', level: 4, type: 'Anual', correlCursada: ['UTN-AM2'], correlAprobada: ['UTN-AM1', 'UTN-F1', 'UTN-AGA'],
    comisiones: [{ id: 'I41 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '20:45', fin: '23:00' }] }]
  },
  { 
    id: 'IND-30', name: 'Evaluación de Proyectos', level: 4, type: 'Anual', correlCursada: ['IND-18', 'IND-19', 'IND-23'], correlAprobada: ['IND-10', 'UTN-PYE', 'IND-14', 'UTN-ING1'],
    comisiones: [{ id: 'I41 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '19:15', fin: '23:00' }] }]
  },
  { 
    id: 'IND-31', name: 'Planificación y Control de la Producción', level: 4, type: 'Anual', correlCursada: ['IND-18'], correlAprobada: ['IND-10', 'UTN-PYE'],
    comisiones: [{ id: 'I41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '20:00', fin: '23:00' }] }]
  },
  { 
    id: 'IND-32', name: 'Diseño de Producto', level: 4, type: 'Anual', correlCursada: ['IND-15', 'IND-19'], correlAprobada: ['UTN-SDR', 'IND-4', 'IND-10', 'UTN-PYE', 'IND-14'],
    comisiones: [{ id: 'I41 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:30', fin: '19:00' }] }]
  },
  { id: 'UTN-ING2', name: 'Inglés II', level: 4, type: 'Anual', correlCursada: ['UTN-ING1'], correlAprobada: [] },
  { 
    id: 'IND-34', name: 'Instalaciones Industriales', level: 4, type: 'Anual', correlCursada: ['IND-20', 'IND-21', 'IND-22', 'IND-24'], correlAprobada: ['UTN-QG', 'UTN-AM2', 'IND-12', 'UTN-F2'],
    comisiones: [{ id: 'I41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:30', fin: '19:45' }] }]
  },
  { 
    id: 'UTN-LEG', name: 'Legislación', level: 4, type: 'Anual', correlCursada: ['IND-10'], correlAprobada: [],
    comisiones: [{ id: 'I41 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '19:15', fin: '20:45' }] }]
  },

  // --- NIVEL 5 ---
  { 
    id: 'IND-36', name: 'Mantenimiento', level: 5, type: '1° Cuatr.', correlCursada: ['IND-34'], correlAprobada: ['IND-20', 'IND-21', 'IND-24'],
    comisiones: [{ id: 'I51 (Noche)', duration: '1', dias: [{ nombre: 'Viernes', inicio: '18:30', fin: '20:45' }] }]
  },
  { 
    id: 'IND-37', name: 'Manejo de Materiales y Distribución', level: 5, type: 'Anual', correlCursada: ['IND-18', 'IND-29'], correlAprobada: ['UTN-AM2', 'IND-10', 'UTN-PYE'],
    comisiones: [{ id: 'I51 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '19:15', fin: '21:30' }] }]
  },
  { 
    id: 'IND-38', name: 'Comercio Exterior', level: 5, type: '1° Cuatr.', correlCursada: ['IND-30'], correlAprobada: ['IND-18', 'IND-19', 'IND-23'],
    comisiones: [{ id: 'I51 (Noche)', duration: '1', dias: [{ nombre: 'Martes', inicio: '17:30', fin: '19:45' }, { nombre: 'Viernes', inicio: '20:45', fin: '23:00' }] }]
  },
  { 
    id: 'IND-39', name: 'Relaciones Industriales', level: 5, type: 'Anual', correlCursada: ['IND-18'], correlAprobada: ['IND-10', 'UTN-PYE'],
    comisiones: [{ id: 'I51 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '19:15' }] }]
  },
  { 
    id: 'IND-40', name: 'Proyecto Final', level: 5, type: 'Anual', correlCursada: [], correlAprobada: ['IND-18', 'IND-19', 'IND-20', 'IND-21', 'IND-22', 'IND-23', 'IND-24', 'IND-25', 'IND-26', 'IND-27', 'IND-28', 'IND-30', 'IND-31', 'UTN-ING2'],
    comisiones: [{ id: 'I51 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '19:15', fin: '20:45' }, { nombre: 'Martes', inicio: '20:00', fin: '23:00' }] }]
  },
  { 
    id: 'IND-41', name: 'Ingeniería en Calidad', level: 5, type: 'Anual', correlCursada: ['IND-18'], correlAprobada: ['IND-10', 'UTN-PYE'],
    comisiones: [{ id: 'I51 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '20:45', fin: '23:00' }] }]
  },
  { 
    id: 'IND-42', name: 'Control de Gestión', level: 5, type: '2° Cuatr.', correlCursada: ['IND-17', 'IND-23'], correlAprobada: ['IND-10', 'IND-14'],
    comisiones: [{ id: 'I51 (Noche)', duration: '2', dias: [{ nombre: 'Martes', inicio: '17:30', fin: '19:45' }, { nombre: 'Viernes', inicio: '20:45', fin: '23:00' }] }]
  },
  { id: 'PPS', name: 'Práctica Supervisada', level: 5, type: 'Anual', correlCursada: [], correlAprobada: [] },
  
  // --- BOLSA DE ELECTIVAS ---
  { id: 'ELEC', name: 'Electivas necesarias (10 hs)', level: 5, type: 'Anual', isElectivePlaceholder: true, targetHours: 10, correlCursada: [], correlAprobada: [] }
];

export const ELECTIVAS = {
  5: [
    { 
      id: 'IND-E1', name: 'Conducción de Personal Organizacional', type: 'Anual', correlCursada: ['UTN-AM2', 'IND-10', 'UTN-PYE', 'IND-12', 'UTN-F2', 'IND-14', 'IND-15', 'UTN-ING1', 'IND-18'], correlAprobada: ['IND-4', 'IND-5', 'UTN-IYS', 'IND-10', 'IND-15'], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:15', fin: '19:30' }] }]
    },
    { 
      id: 'IND-E2', name: 'Logística / Cadenas de Abastecimiento', type: 'Anual', correlCursada: ['IND-17', 'IND-18', 'IND-19', 'IND-20', 'IND-21', 'IND-22', 'IND-23', 'IND-24', 'IND-25'], correlAprobada: ['IND-26', 'IND-27', 'IND-31', 'IND-34'], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '20:45', fin: '23:00' }] }]
    },
    { 
      id: 'IND-E3', name: 'Simulación y Optimización de Industrias', type: '1° Cuatr.', correlCursada: ['IND-17', 'IND-18', 'IND-19', 'IND-20', 'IND-21', 'IND-22', 'IND-23', 'IND-24', 'IND-25'], correlAprobada: ['IND-27', 'IND-31'], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:15' }, { nombre: 'Viernes', inicio: '16:15', fin: '18:30' }] }]
    },
    { 
      id: 'IND-E4', name: 'Finanzas en Organizaciones', type: 'Anual', correlCursada: ['IND-17', 'IND-18', 'IND-19', 'IND-20', 'IND-21', 'IND-22', 'IND-23', 'IND-24', 'IND-25'], correlAprobada: ['IND-30', 'UTN-LEG'], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '18:00', fin: '20:15' }] }]
    },
    { 
      id: 'IND-E5', name: 'Instrumentación y Automatización', type: 'Anual', correlCursada: ['IND-17', 'IND-18', 'IND-19', 'IND-20', 'IND-21', 'IND-22', 'IND-23', 'IND-24', 'IND-25'], correlAprobada: ['IND-28', 'IND-31', 'IND-34'], annualHours: 3, comisiones: []
    },
    { 
      id: 'IND-E6', name: 'Gestión Pyme', type: 'Anual', correlCursada: ['IND-17', 'IND-18', 'IND-19', 'IND-20', 'IND-21', 'IND-22', 'IND-23', 'IND-24', 'IND-25'], correlAprobada: ['IND-30', 'IND-31', 'IND-32'], annualHours: 2, comisiones: []
    },
    { 
      id: 'IND-E7', name: 'Gestión Ambiental', type: 'Anual', correlCursada: ['IND-17', 'IND-18', 'IND-19', 'IND-20', 'IND-21', 'IND-22', 'IND-23', 'IND-24', 'IND-25'], correlAprobada: ['IND-26', 'IND-28', 'IND-34'], annualHours: 2, comisiones: []
    },
    { 
      id: 'IND-E8', name: 'Desarrollo Emprendedor', type: 'Anual', correlCursada: ['IND-32', 'UTN-LEG'], correlAprobada: ['IND-17', 'IND-19', 'IND-23'], annualHours: 2,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '18:30' }] }]
    },
    { 
      id: 'IND-E9', name: 'Responsabilidad Social Institucional', type: '1° Cuatr.', correlCursada: ['IND-17', 'IND-18', 'IND-19', 'IND-20', 'IND-21', 'IND-22', 'IND-23', 'IND-24', 'IND-25'], correlAprobada: ['IND-26'], annualHours: 2,
      comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Jueves', inicio: '19:15', fin: '20:45' }, { nombre: 'Viernes', inicio: '17:00', fin: '18:30' }] }]
    },
    { 
      id: 'IND-E10', name: 'Industrialización de Hidrocarburos', type: 'Anual', correlCursada: ['IND-17', 'IND-18', 'IND-19', 'IND-20', 'IND-21', 'IND-22', 'IND-23', 'IND-24', 'IND-25'], correlAprobada: ['IND-24', 'IND-28', 'IND-34'], annualHours: 3,
      comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '19:15' }] }]
    },
    { 
      id: 'IND-E11', name: 'Retórica Profesional', type: 'Anual', correlCursada: ['IND-17', 'IND-18', 'IND-19', 'IND-20', 'IND-21', 'IND-22', 'IND-23', 'IND-24', 'IND-25'], correlAprobada: ['UTN-IYS', 'IND-10', 'IND-18', 'IND-19'], annualHours: 3, comisiones: []
    },
    { 
      id: 'IND-E12', name: 'Aplicación en Tiempo Real en la Industria', type: '2° Cuatr.', correlCursada: ['IND-28'], correlAprobada: ['IND-15', 'IND-24', 'IND-25'], annualHours: 2, comisiones: []
    },
    { 
      id: 'IND-E13', name: 'Industria 4.0', type: '2° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 2,
      comisiones: [{ id: 'Electiva', duration: '2', dias: [{ nombre: 'Sábado', inicio: '09:00', fin: '12:00' }] }]
    },
    { 
      id: 'IND-E14', name: 'Desarrollo del Personal', type: '1° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 2,
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