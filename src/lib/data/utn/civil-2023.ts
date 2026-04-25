import { COMISIONES_BASICAS } from './comisiones-basicas';

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
    id: 'UTN-AM1', name: 'Análisis Matemático I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-AM1']
  },
  { 
    id: 'UTN-AGA', name: 'Álgebra y Geometría Analítica', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-AGA']
  },
  { 
    id: 'UTN-IYS', name: 'Ingeniería y Sociedad', level: 1, type: '1° Cuatr.', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'C11 (Mañana)', duration: '1', dias: [{ nombre: 'Martes', inicio: '12:00', fin: '13:30' }] },
      { id: 'C12 (Noche)', duration: '1', dias: [{ nombre: 'Jueves', inicio: '16:30', fin: '18:30' }] }
    ]
  },
  { 
    id: 'CIV-4', name: 'Ingeniería Civil I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'C11 (Mañana)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '12:00', fin: '14:15' }] },
      { id: 'C12 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '19:15' }] }
    ]
  },
  { 
    id: 'UTN-SDR', name: 'Sistemas de Representación', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-SDR']
  },
  { 
    id: 'UTN-QG', name: 'Química General', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-QG']
  },
  { 
    id: 'UTN-F1', name: 'Física I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-F1']
  },
  { 
    id: 'UTN-FI', name: 'Fundamentos de Informática', level: 1, type: '2° Cuatr.', correlCursada: [], correlAprobada: [],
    comisiones: [
      { id: 'C11 (Mañana)', duration: '2', dias: [{ nombre: 'Martes', inicio: '14:00', fin: '17:00' }] },
      { id: 'C12 (Noche)', duration: '2', dias: [{ nombre: 'Lunes', inicio: '19:30', fin: '22:30' }] }
    ]
  },

  // --- NIVEL 2 ---
  { 
    id: 'UTN-AM2', name: 'Análisis Matemático II', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-AGA'], correlAprobada: [],
    comisiones: [{ id: 'C21 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:15' }, { nombre: 'Viernes', inicio: '20:45', fin: '22:15' }] }]
  },
  { 
    id: 'CIV-10', name: 'Estabilidad', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-AGA', 'UTN-SDR', 'UTN-F1', 'UTN-FI'], correlAprobada: [],
    comisiones: [{ id: 'C21 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '19:45', fin: '22:00' }, { nombre: 'Jueves', inicio: '18:30', fin: '20:00' }] }]
  },
  { 
    id: 'CIV-11', name: 'Ingeniería Civil II', level: 2, type: 'Anual', correlCursada: ['UTN-IYS', 'CIV-4', 'UTN-SDR', 'UTN-FI'], correlAprobada: [],
    comisiones: [{ id: 'C21 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '19:15' }] }]
  },
  { 
    id: 'CIV-12', name: 'Tecnología de los Materiales', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-SDR', 'UTN-QG', 'UTN-F1'], correlAprobada: [],
    comisiones: [{ id: 'C21 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '19:15', fin: '22:15' }] }]
  },
  { 
    id: 'UTN-F2', name: 'Física II', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-F1'], correlAprobada: [],
    comisiones: [{ id: 'C21 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:00', fin: '20:45' }] }]
  },
  { 
    id: 'UTN-PYE', name: 'Probabilidad y Estadística', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-AGA'], correlAprobada: [],
    comisiones: [{ id: 'C21 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:45', fin: '20:00' }] }]
  },
  { id: 'UTN-ING1', name: 'Inglés I', level: 2, type: 'Anual', correlCursada: ['UTN-IYS'], correlAprobada: [] },

  // --- NIVEL 3 ---
  { 
    id: 'CIV-16', name: 'Resistencia de Materiales', level: 3, type: 'Anual', correlCursada: ['CIV-10'], correlAprobada: ['UTN-AM1', 'UTN-AGA', 'UTN-F1', 'UTN-FI'],
    comisiones: [{ id: 'C31 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '18:30', fin: '20:00' }, { nombre: 'Miércoles', inicio: '17:00', fin: '18:30' }] }]
  },
  { 
    id: 'CIV-17', name: 'Tecnología del Hormigón', level: 3, type: '1° Cuatr.', correlCursada: ['CIV-12', 'UTN-PYE', 'UTN-ING1'], correlAprobada: ['UTN-AM1', 'UTN-AGA', 'UTN-QG', 'UTN-F1'],
    comisiones: [{ id: 'C31 (Noche)', duration: '1', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '18:30' }, { nombre: 'Miércoles', inicio: '20:45', fin: '22:15' }] }]
  },
  { 
    id: 'CIV-18', name: 'Tecnología de la Construcción', level: 3, type: 'Anual', correlCursada: ['CIV-10', 'CIV-11', 'CIV-12', 'UTN-ING1'], correlAprobada: ['UTN-AM1', 'UTN-AGA', 'CIV-4', 'UTN-SDR', 'UTN-QG', 'UTN-F1', 'UTN-FI'],
    comisiones: [{ id: 'C31 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '18:30', fin: '20:45' }, { nombre: 'Viernes', inicio: '18:30', fin: '20:45' }] }]
  },
  { 
    id: 'CIV-19', name: 'Geotopografía', level: 3, type: '1° Cuatr.', correlCursada: ['UTN-AM2', 'CIV-11', 'UTN-F2', 'UTN-PYE'], correlAprobada: ['UTN-AM1', 'UTN-AGA', 'CIV-4', 'UTN-SDR', 'UTN-F1'],
    comisiones: [{ id: 'C31 (Noche)', duration: '1', dias: [{ nombre: 'Jueves', inicio: '17:45', fin: '20:45' }, { nombre: 'Sábado', inicio: '08:45', fin: '11:45' }] }]
  },
  { 
    id: 'CIV-20', name: 'Hidráulica General y Aplicada', level: 3, type: 'Anual', correlCursada: ['UTN-AM2', 'CIV-10', 'CIV-11', 'UTN-F2', 'UTN-PYE'], correlAprobada: ['UTN-AM1', 'UTN-AGA', 'UTN-SDR', 'UTN-F1', 'UTN-FI'],
    comisiones: [{ id: 'C31 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '20:30', fin: '22:00' }, { nombre: 'Miércoles', inicio: '20:45', fin: '22:15' }, { nombre: 'Jueves', inicio: '20:45', fin: '23:00' }] }]
  },
  { 
    id: 'CIV-21', name: 'Cálculo Avanzado', level: 3, type: '1° Cuatr.', correlCursada: ['UTN-AM2', 'CIV-10', 'CIV-12', 'UTN-PYE'], correlAprobada: ['UTN-AM1', 'UTN-AGA', 'UTN-SDR', 'UTN-F1', 'UTN-FI'],
    comisiones: [{ id: 'C31 (Noche)', duration: '1', dias: [{ nombre: 'Lunes', inicio: '19:00', fin: '20:30' }, { nombre: 'Viernes', inicio: '17:00', fin: '18:30' }] }]
  },
  { 
    id: 'CIV-22', name: 'Instalaciones Eléctricas y Acústicas', level: 3, type: '2° Cuatr.', correlCursada: ['CIV-11', 'CIV-12', 'UTN-F2'], correlAprobada: ['UTN-AM1', 'UTN-AGA', 'CIV-4', 'UTN-SDR', 'UTN-QG', 'UTN-F1'],
    comisiones: [{ id: 'C31 (Noche)', duration: '2', dias: [{ nombre: 'Martes', inicio: '20:00', fin: '23:00' }] }]
  },
  { 
    id: 'CIV-23', name: 'Instalaciones Termomecánicas', level: 3, type: '2° Cuatr.', correlCursada: ['CIV-11', 'CIV-12', 'UTN-F2'], correlAprobada: ['UTN-AM1', 'UTN-AGA', 'CIV-4', 'UTN-SDR', 'UTN-QG', 'UTN-F1'],
    comisiones: [{ id: 'C31 (Noche)', duration: '2', dias: [{ nombre: 'Lunes', inicio: '19:15', fin: '22:15' }] }]
  },
  { 
    id: 'UTN-ECO', name: 'Economía', level: 3, type: '2° Cuatr.', correlCursada: ['CIV-11', 'UTN-PYE', 'UTN-ING1'], correlAprobada: ['UTN-AM1', 'UTN-AGA', 'UTN-IYS', 'CIV-4', 'UTN-FI'],
    comisiones: [{ id: 'C31 (Noche)', duration: '2', dias: [{ nombre: 'Jueves', inicio: '16:15', fin: '20:45' }] }]
  },
  { id: 'UTN-ING2', name: 'Inglés II', level: 3, type: 'Anual', correlCursada: ['UTN-ING1'], correlAprobada: ['UTN-IYS', 'CIV-4'] },
  { 
    id: 'UTN-LEG', name: 'Ingeniería Legal', level: 3, type: 'Anual', correlCursada: ['UTN-AM2', 'CIV-11', 'UTN-PYE', 'UTN-ING1'], correlAprobada: ['UTN-AM1', 'UTN-AGA', 'UTN-IYS', 'CIV-4', 'UTN-FI'],
    comisiones: [{ id: 'C31 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '16:45', fin: '19:00' }] }]
  },

  // --- NIVEL 4 ---
  { 
    id: 'CIV-26', name: 'Geotecnia', level: 4, type: '2° Cuatr.', correlCursada: ['CIV-16', 'CIV-17', 'CIV-18', 'CIV-19', 'CIV-20'], correlAprobada: ['UTN-AM2', 'CIV-10', 'CIV-11', 'CIV-12', 'UTN-F2', 'UTN-PYE'],
    comisiones: [{ id: 'C41 (Noche)', duration: '2', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '19:15' }, { nombre: 'Martes', inicio: '17:00', fin: '19:15' }, { nombre: 'Miércoles', inicio: '17:00', fin: '20:00' }] }]
  },
  { 
    id: 'CIV-27', name: 'Instalaciones Sanitarias y de Gas', level: 4, type: '1° Cuatr.', correlCursada: ['CIV-18', 'CIV-19', 'CIV-20', 'UTN-ECO'], correlAprobada: ['UTN-SDR', 'UTN-QG', 'UTN-F1', 'UTN-FI', 'CIV-12'],
    comisiones: [{ id: 'C41 (Noche)', duration: '1', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:15' }, { nombre: 'Miércoles', inicio: '17:00', fin: '19:15' }] }]
  },
  { 
    id: 'CIV-28', name: 'Diseño Arquit., Planeamiento y Urb.', level: 4, type: 'Anual', correlCursada: ['CIV-18', 'CIV-19', 'CIV-22', 'CIV-23', 'UTN-ECO', 'UTN-ING2'], correlAprobada: ['CIV-10', 'CIV-11', 'CIV-12', 'UTN-ING1'],
    comisiones: [{ id: 'C41 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '21:30', fin: '23:00' }, { nombre: 'Jueves', inicio: '18:30', fin: '20:45' }] }]
  },
  { 
    id: 'CIV-29', name: 'Análisis Estructural I', level: 4, type: 'Anual', correlCursada: ['CIV-16', 'CIV-17'], correlAprobada: ['UTN-AM2', 'CIV-10', 'CIV-11', 'UTN-PYE'],
    comisiones: [{ id: 'C41 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '19:15', fin: '21:30' }, { nombre: 'Jueves', inicio: '17:00', fin: '18:30' }] }]
  },
  { 
    id: 'CIV-30', name: 'Estructuras de Hormigón', level: 4, type: 'Anual', correlCursada: ['CIV-16', 'CIV-17', 'CIV-18', 'CIV-19', 'UTN-ING2'], correlAprobada: ['UTN-AM2', 'CIV-10', 'CIV-11', 'CIV-12', 'UTN-F2', 'UTN-PYE'],
    comisiones: [{ id: 'C41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '19:15', fin: '21:30' }, { nombre: 'Jueves', inicio: '20:45', fin: '22:15' }] }]
  },
  { 
    id: 'CIV-31', name: 'Hidrología y Obras Hidráulicas', level: 4, type: 'Anual', correlCursada: ['CIV-16', 'CIV-18', 'CIV-19', 'CIV-20', 'UTN-ECO', 'UTN-ING2'], correlAprobada: ['UTN-AM2', 'CIV-10', 'CIV-11', 'CIV-12', 'UTN-F2', 'UTN-PYE'],
    comisiones: [{ id: 'C41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '21:30', fin: '23:00' }, { nombre: 'Miércoles', inicio: '21:30', fin: '23:00' }, { nombre: 'Viernes', inicio: '17:00', fin: '20:00' }] }]
  },
  { 
    id: 'CIV-37', name: 'Vías de Comunicación I', level: 4, type: 'Anual', correlCursada: ['CIV-17', 'CIV-18', 'CIV-19'], correlAprobada: ['UTN-AM2', 'CIV-10', 'CIV-11', 'CIV-12', 'UTN-PYE', 'UTN-ING1'],
    comisiones: [{ id: 'C41 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '20:00', fin: '21:30' }, { nombre: 'Viernes', inicio: '20:00', fin: '21:30' }] }]
  },

  // --- NIVEL 5 ---
  { 
    id: 'CIV-33', name: 'Construcciones Metálicas y de Madera', level: 5, type: '2° Cuatr.', correlCursada: ['CIV-21', 'CIV-29'], correlAprobada: ['CIV-16', 'CIV-17', 'CIV-18', 'CIV-19'],
    comisiones: [{ id: 'C51 (Noche)', duration: '2', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '20:00' }, { nombre: 'Viernes', inicio: '18:30', fin: '21:30' }] }]
  },
  { 
    id: 'CIV-34', name: 'Cimentaciones', level: 5, type: '1° Cuatr.', correlCursada: ['CIV-21', 'CIV-26', 'CIV-29', 'CIV-30', 'CIV-31'], correlAprobada: ['CIV-16', 'CIV-17', 'CIV-18', 'CIV-19', 'CIV-20'],
    comisiones: [{ id: 'C51 (Noche)', duration: '1', dias: [{ nombre: 'Martes', inicio: '19:15', fin: '21:30' }, { nombre: 'Miércoles', inicio: '19:15', fin: '21:30' }] }]
  },
  { 
    id: 'CIV-35', name: 'Ingeniería Sanitaria', level: 5, type: '2° Cuatr.', correlCursada: ['CIV-26', 'CIV-27', 'CIV-31'], correlAprobada: ['CIV-17', 'CIV-18', 'CIV-19', 'CIV-20', 'UTN-ING2'],
    comisiones: [{ id: 'C51 (Noche)', duration: '2', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '20:00' }, { nombre: 'Miércoles', inicio: '20:00', fin: '21:30' }] }]
  },
  { 
    id: 'CIV-36', name: 'Organización y Conducción de Obras', level: 5, type: '1° Cuatr.', correlCursada: ['CIV-26', 'CIV-27', 'CIV-28', 'CIV-30', 'CIV-31'], correlAprobada: ['CIV-17', 'CIV-18', 'CIV-19', 'CIV-20', 'CIV-22', 'CIV-23', 'UTN-ECO', 'UTN-ING2'],
    comisiones: [{ id: 'C51 (Noche)', duration: '1', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '20:00' }, { nombre: 'Miércoles', inicio: '17:00', fin: '19:15' }, { nombre: 'Jueves', inicio: '17:45', fin: '20:00' }] }]
  },
  { 
    id: 'CIV-38', name: 'Análisis Estructural II', level: 5, type: 'Anual', correlCursada: ['CIV-21', 'CIV-26', 'CIV-29', 'CIV-30', 'CIV-31'], correlAprobada: ['CIV-16', 'CIV-17', 'CIV-18', 'CIV-19', 'UTN-ING2'],
    comisiones: [{ id: 'C51 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:15' }, { nombre: 'Jueves', inicio: '20:00', fin: '21:30' }] }]
  },
  { 
    id: 'CIV-39', name: 'Vías de Comunicación II', level: 5, type: 'Anual', correlCursada: ['CIV-26', 'CIV-30', 'CIV-31', 'UTN-LEG', 'CIV-37'], correlAprobada: ['CIV-16', 'CIV-17', 'CIV-18', 'CIV-19', 'CIV-20', 'UTN-ECO'],
    comisiones: [{ id: 'C51 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '21:30', fin: '23:00' }, { nombre: 'Viernes', inicio: '17:00', fin: '18:30' }] }]
  },

  // --- NIVEL 6 ---
  { 
    id: 'CIV-40', name: 'Gestión Ambiental y Des. Sust.', level: 6, type: '1° Cuatr.', correlCursada: ['CIV-26', 'CIV-28', 'CIV-31', 'UTN-LEG'], correlAprobada: ['CIV-20', 'UTN-ECO', 'UTN-ING2'],
    comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Martes', inicio: '19:15', fin: '22:15' }, { nombre: 'Miércoles', inicio: '21:30', fin: '23:00' }] }]
  },
  { 
    id: 'CIV-41', name: 'Proyecto Final', level: 6, type: '2° Cuatr.', correlCursada: ['CIV-26', 'CIV-27', 'CIV-28', 'CIV-29', 'CIV-30', 'CIV-31', 'UTN-LEG'], correlAprobada: ['UTN-ING1', 'CIV-16', 'CIV-17', 'CIV-18', 'CIV-19', 'CIV-20', 'CIV-22', 'CIV-23', 'UTN-ECO', 'UTN-ING2'],
    comisiones: [{ id: 'C51 (Noche)', duration: '2', dias: [{ nombre: 'Martes', inicio: '19:15', fin: '22:15' }] }]
  },
  { id: 'PPS', name: 'Práctica Supervisada', level: 6, type: 'Anual', correlCursada: ['CIV-26', 'CIV-27', 'CIV-28', 'CIV-29', 'CIV-30', 'CIV-31', 'UTN-LEG'], correlAprobada: ['UTN-ING1', 'CIV-16', 'CIV-17', 'CIV-18', 'CIV-19', 'CIV-20', 'CIV-22', 'CIV-23', 'UTN-ECO', 'UTN-ING2'] },
  
  // --- BOLSA DE ELECTIVAS ---
  { id: 'ELEC', name: 'Electivas necesarias (11 hs)', level: 6, type: 'Anual', isElectivePlaceholder: true, targetHours: 11, correlCursada: [], correlAprobada: [] }
];

export const ELECTIVAS = {
  5: [
    { id: 'CIV-E1', name: 'Ferrocarriles I', type: '1° Cuatr.', correlCursada: ['CIV-17', 'CIV-18'], correlAprobada: ['CIV-12'], annualHours: 3, comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Lunes', inicio: '20:00', fin: '23:00' }, { nombre: 'Jueves', inicio: '21:30', fin: '23:00' }] }] },
    { id: 'CIV-E2', name: 'Diseño Arq. y Planeamiento II', type: 'Anual', correlCursada: ['CIV-28'], correlAprobada: ['CIV-18'], annualHours: 3, comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:45', fin: '20:00' }, { nombre: 'Viernes', inicio: '18:30', fin: '20:45' }] }] },
    { id: 'CIV-E3', name: 'Rocas y Suelos', type: '1° Cuatr.', correlCursada: ['CIV-35'], correlAprobada: ['CIV-26'], annualHours: 2, comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '20:00' }] }] },
    { id: 'CIV-E4', name: 'Puentes y Prefabricaciones', type: '1° Cuatr.', correlCursada: ['CIV-26', 'CIV-30'], correlAprobada: ['CIV-17', 'CIV-20'], annualHours: 3, comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Lunes', inicio: '20:00', fin: '23:00' }, { nombre: 'Jueves', inicio: '21:30', fin: '23:00' }] }] },
    { id: 'CIV-E5', name: 'Centrales y Máquinas Hidráulicas', type: '1° Cuatr.', correlCursada: ['CIV-31'], correlAprobada: ['CIV-20', 'CIV-26'], annualHours: 3, comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:15' }, { nombre: 'Miércoles', inicio: '19:00', fin: '21:15' }] }] },
    { id: 'CIV-E6', name: 'Estructuras Especiales', type: '1° Cuatr.', correlCursada: ['CIV-30', 'CIV-34', 'CIV-35', 'CIV-38'], correlAprobada: ['CIV-29'], annualHours: 4, comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Miércoles', inicio: '19:15', fin: '21:30' }, { nombre: 'Jueves', inicio: '17:00', fin: '20:45' }] }] },
    { id: 'CIV-E7', name: 'Puertos y Vías Navegables', type: '1° Cuatr.', correlCursada: ['CIV-30'], correlAprobada: ['CIV-26'], annualHours: 3, comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Lunes', inicio: '19:15', fin: '23:00' }, { nombre: 'Martes', inicio: '22:15', fin: '23:00' }] }] },
    { id: 'CIV-E9', name: 'Vías III', type: '1° Cuatr.', correlCursada: ['CIV-39'], correlAprobada: ['CIV-33'], annualHours: 1.5, comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '19:15' }, { nombre: 'Viernes', inicio: '17:00', fin: '19:15' }] }] },
    { id: 'CIV-E10', name: 'Ferrocarriles II', type: '2° Cuatr.', correlCursada: ['CIV-16', 'CIV-26', 'CIV-E1'], correlAprobada: ['CIV-10'], annualHours: 2, comisiones: [{ id: 'Electiva', duration: '2', dias: [{ nombre: 'Lunes', inicio: '20:00', fin: '23:00' }] }] },
    { id: 'CIV-E11', name: 'Gestión de Comp. en la Ingeniería', type: '1° Cuatr.', correlCursada: ['CIV-18'], correlAprobada: ['CIV-11'], annualHours: 1.5, comisiones: [] },
  ]
};

export const ALL = [ ...SUBJECTS, ...Object.values(ELECTIVAS).flat() ];

export const getSubjectById = (id: any) => {
  return ALL.find(subject => subject.id.toString() === id.toString());
};