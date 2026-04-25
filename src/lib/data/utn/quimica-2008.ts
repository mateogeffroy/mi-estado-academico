import { COMISIONES_BASICAS } from './comisiones-basicas';

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
    id: 'QUI-1', name: 'Introducción a la Ing. Química (Int. I)', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'Q11 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '18:45', fin: '21:00' }] }]
  },
  { 
    id: 'UTN-IYS', name: 'Ingeniería y Sociedad', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'Q11 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '16:30', fin: '18:00' }] }]
  },
  { 
    id: 'UTN-AGA', name: 'Álgebra y Geometría Analítica', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-AGA']
  },
  { 
    id: 'UTN-AM1', name: 'Análisis Matemático I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-AM1']
  },
  { 
    id: 'UTN-F1', name: 'Física I', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-F1']
  },
  { 
    id: 'UTN-QG', name: 'Química General', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-QG']
  },
  { 
    id: 'UTN-FI', name: 'Fundamentos de Informática', level: 1, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: [{ id: 'Q11 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '21:00', fin: '22:30' }] }]
  },

  // --- NIVEL 2 ---
  { 
    id: 'QUI-8', name: 'Intro. a Equipos y Procesos (Int. II)', level: 2, type: 'Anual', correlCursada: ['QUI-1', 'UTN-AM1', 'UTN-QG'], correlAprobada: ['QUI-1', 'UTN-AM1', 'UTN-QG'],
    comisiones: [{ id: 'Q21 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '19:15', fin: '21:30' }] }]
  },
  { 
    id: 'UTN-PYE', name: 'Probabilidad y Estadística', level: 2, type: 'Anual', correlCursada: ['UTN-AGA', 'UTN-AM1'], correlAprobada: ['UTN-AGA', 'UTN-AM1'],
    comisiones: [{ id: 'Q21 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:45', fin: '20:00' }] }]
  },
  { 
    id: 'QUI-10', name: 'Química Inorgánica', level: 2, type: 'Anual', correlCursada: ['UTN-QG'], correlAprobada: ['UTN-QG'],
    comisiones: [{ id: 'Q21 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '19:15', fin: '22:30' }] }]
  },
  { 
    id: 'UTN-AM2', name: 'Análisis Matemático II', level: 2, type: 'Anual', correlCursada: ['UTN-AGA', 'UTN-AM1'], correlAprobada: ['UTN-AGA', 'UTN-AM1'],
    comisiones: [{ id: 'Q21 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '16:15', fin: '18:15' }, { nombre: 'Viernes', inicio: '19:15', fin: '21:00' }] }]
  },
  { 
    id: 'UTN-F2', name: 'Física II', level: 2, type: 'Anual', correlCursada: ['UTN-AM1', 'UTN-F1'], correlAprobada: ['UTN-AM1', 'UTN-F1'],
    comisiones: [{ id: 'Q21 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '18:15', fin: '22:15' }] }]
  },
  { 
    id: 'QUI-13', name: 'Química Orgánica', level: 2, type: 'Anual', correlCursada: ['UTN-QG'], correlAprobada: ['UTN-QG'],
    comisiones: [{ id: 'Q21 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:15' }, { nombre: 'Viernes', inicio: '17:00', fin: '18:30' }] }]
  },
  { id: 'UTN-ING1', name: 'Inglés I', level: 2, type: 'Anual', correlCursada: [], correlAprobada: [] },
  { 
    id: 'UTN-SDR', name: 'Sistemas de Representación', level: 2, type: 'Anual', correlCursada: [], correlAprobada: [],
    comisiones: COMISIONES_BASICAS['UTN-SDR']
  },

  // --- NIVEL 3 ---
  { 
    id: 'QUI-16', name: 'Balances de Masa y Energía (Int. III)', level: 3, type: 'Anual', correlCursada: ['QUI-8', 'UTN-AM2', 'UTN-F2'], correlAprobada: ['QUI-1', 'UTN-AM1', 'UTN-F1', 'UTN-QG', 'UTN-FI'],
    comisiones: [{ id: 'Q31 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '20:00', fin: '22:15' }] }]
  },
  { 
    id: 'QUI-17', name: 'Matemática Superior Aplicada', level: 3, type: '2° Cuatr.', correlCursada: ['UTN-AM2'], correlAprobada: ['UTN-AGA', 'UTN-AM1', 'UTN-AM2'],
    comisiones: [{ id: 'Q31 (Noche)', duration: '2', dias: [{ nombre: 'Lunes', inicio: '20:00', fin: '22:15' }] }]
  },
  { 
    id: 'QUI-18', name: 'Termodinámica', level: 3, type: '1° Cuatr.', correlCursada: ['UTN-AM2', 'UTN-F2'], correlAprobada: ['UTN-AGA', 'UTN-AM1', 'UTN-F1', 'UTN-QG', 'UTN-AM2', 'UTN-F2'],
    comisiones: [{ id: 'Q31 (Noche)', duration: '1', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '20:00' }] }]
  },
  { 
    id: 'UTN-ECO', name: 'Economía', level: 3, type: 'Anual', correlCursada: ['QUI-8'], correlAprobada: ['UTN-IYS', 'QUI-8'],
    comisiones: [{ id: 'Q41 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '19:30', fin: '21:45' }] }]
  },
  { 
    id: 'UTN-LEG', name: 'Legislación', level: 3, type: '1° Cuatr.', correlCursada: ['QUI-8'], correlAprobada: ['UTN-IYS', 'QUI-8'],
    comisiones: [{ id: 'Q21 (Noche)', duration: '1', dias: [{ nombre: 'Lunes', inicio: '20:00', fin: '23:00' }] }]
  },
  { 
    id: 'QUI-21', name: 'Mecánica - Eléctrica Industrial', level: 3, type: 'Anual', correlCursada: ['UTN-F2'], correlAprobada: ['UTN-AM1', 'UTN-F1', 'UTN-F2'],
    comisiones: [{ id: 'Q51 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '20:00' }, { nombre: 'Lunes', inicio: '20:00', fin: '22:15' }] }]
  },
  { 
    id: 'QUI-22', name: 'Fisicoquímica', level: 3, type: 'Anual', correlCursada: ['QUI-10', 'UTN-AM2', 'UTN-F2', 'QUI-18'], correlAprobada: ['UTN-AGA', 'UTN-AM1', 'UTN-F1', 'UTN-QG', 'QUI-10', 'UTN-AM2', 'UTN-F2', 'QUI-18'],
    comisiones: [{ id: 'Q31 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '20:00' }] }]
  },
  { 
    id: 'QUI-23', name: 'Fenómenos de Transporte', level: 3, type: 'Anual', correlCursada: ['UTN-AM2', 'UTN-F2', 'QUI-18'], correlAprobada: ['UTN-AGA', 'UTN-AM1', 'UTN-F1', 'UTN-QG', 'UTN-AM2', 'UTN-F2', 'QUI-18'],
    comisiones: [{ id: 'Q31 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:30', fin: '19:00' }, { nombre: 'Viernes', inicio: '17:45', fin: '20:00' }] }]
  },
  { 
    id: 'QUI-24', name: 'Química Analítica', level: 3, type: 'Anual', correlCursada: ['QUI-10', 'UTN-F2'], correlAprobada: ['UTN-AM1', 'UTN-F1', 'UTN-QG', 'QUI-10', 'UTN-F2'],
    comisiones: [{ id: 'Q31 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '20:00', fin: '21:30' }, { nombre: 'Viernes', inicio: '20:15', fin: '21:45' }] }]
  },
  { id: 'UTN-ING2', name: 'Inglés II', level: 3, type: 'Anual', correlCursada: ['UTN-ING1'], correlAprobada: [] },

  // --- NIVEL 4 ---
  { 
    id: 'QUI-26', name: 'Diseño y Simulación de Procesos (Int. IV)', level: 4, type: 'Anual', correlCursada: ['QUI-16', 'QUI-21', 'QUI-23'], correlAprobada: ['QUI-8', 'QUI-10', 'UTN-AM2', 'UTN-F2', 'UTN-ING1', 'UTN-SDR', 'QUI-16', 'QUI-21', 'QUI-23'],
    comisiones: [{ id: 'Q41 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '19:30', fin: '22:30' }] }]
  },
  { 
    id: 'QUI-27', name: 'Operaciones Unitarias I', level: 4, type: 'Anual', correlCursada: ['QUI-18', 'QUI-23'], correlAprobada: ['UTN-AM2', 'UTN-F2', 'QUI-23'],
    comisiones: [{ id: 'Q41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '20:45', fin: '23:00' }, { nombre: 'Jueves', inicio: '20:45', fin: '22:15' }] }]
  },
  { 
    id: 'QUI-28', name: 'Tecnología de la Energía Térmica', level: 4, type: 'Anual', correlCursada: ['QUI-18', 'QUI-23'], correlAprobada: ['UTN-AM2', 'UTN-F2', 'QUI-23'],
    comisiones: [{ id: 'Q41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '18:30', fin: '20:45' }, { nombre: 'Jueves', inicio: '19:15', fin: '20:45' }] }]
  },
  { 
    id: 'QUI-29', name: 'Microbiología y Biotecnología', level: 4, type: 'Anual', correlCursada: ['QUI-22'], correlAprobada: ['QUI-10', 'UTN-AM2', 'UTN-F2', 'QUI-13', 'QUI-22'],
    comisiones: [{ id: 'Q31 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '19:15', fin: '21:30' }] }]
  },
  { 
    id: 'QUI-30', name: 'Operaciones Unitarias II', level: 4, type: 'Anual', correlCursada: ['QUI-22', 'QUI-23'], correlAprobada: ['QUI-10', 'UTN-AM2', 'UTN-F2', 'QUI-22', 'QUI-23'],
    comisiones: [{ id: 'Q41 (Noche)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '19:15' }, { nombre: 'Viernes', inicio: '18:00', fin: '19:30' }] }]
  },
  { 
    id: 'QUI-31', name: 'Ingeniería de las Reacciones Químicas', level: 4, type: 'Anual', correlCursada: ['QUI-22', 'QUI-23'], correlAprobada: ['QUI-10', 'UTN-AM2', 'UTN-F2', 'QUI-22', 'QUI-23'],
    comisiones: [{ id: 'Q41 (Noche)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '18:30' }, { nombre: 'Jueves', inicio: '17:00', fin: '19:15' }] }]
  },
  { 
    id: 'QUI-32', name: 'Organización Industrial', level: 4, type: 'Anual', correlCursada: ['UTN-ECO', 'UTN-LEG'], correlAprobada: ['QUI-8', 'UTN-ECO', 'UTN-LEG'],
    comisiones: [{ id: 'Q41 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:15' }] }]
  },

  // --- NIVEL 5 ---
  { 
    id: 'QUI-33', name: 'Calidad y Control Estadístico de Procesos', level: 5, type: '2° Cuatr.', correlCursada: ['QUI-22'], correlAprobada: ['UTN-PYE', 'QUI-10', 'UTN-AM2', 'UTN-F2', 'QUI-22'],
    comisiones: [{ id: 'Q41 (Noche)', duration: '2', dias: [{ nombre: 'Martes', inicio: '19:15', fin: '21:30' }] }]
  },
  { 
    id: 'QUI-34', name: 'Control Automático de Procesos', level: 5, type: 'Anual', correlCursada: ['QUI-17', 'QUI-27', 'QUI-28'], correlAprobada: ['QUI-17', 'QUI-23', 'QUI-27', 'QUI-28'],
    comisiones: [{ id: 'Q51 (Noche)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '20:00', fin: '23:00' }] }]
  },
  { 
    id: 'QUI-35', name: 'Proyecto Final', level: 5, type: 'Anual', correlCursada: ['QUI-26', 'QUI-27', 'QUI-31'], correlAprobada: ['QUI-16', 'QUI-21', 'QUI-23', 'UTN-ING2'],
    comisiones: [{ id: 'Q51 (Noche)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '19:30', fin: '22:30' }] }]
  },
  { id: 'PPS', name: 'Práctica Profesional Supervisada', level: 5, type: 'Anual', correlCursada: [], correlAprobada: [] },
  { id: 'ELEC', name: 'Electivas necesarias', level: 5, type: 'Anual', isElectivePlaceholder: true, targetHours: 10, correlCursada: [], correlAprobada: [] }
];

export const ELECTIVAS = {
  3: [
    { id: 'QUI-E1', name: 'Ciencia de los Materiales', type: '1° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 2, comisiones: [{ id: 'Q31 (Noche)', duration: '1', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '20:00' }] }] },
    { id: 'QUI-E2', name: 'Química Aplicada', type: '2° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 2, comisiones: [{ id: 'Q31 (Noche)', duration: '2', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '20:00' }] }] }
  ],
  5: [
    { id: 'QUI-E3', name: 'Química Verde y Ecología Industrial', type: '1° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 3, comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '20:00' }] }] },
    { id: 'QUI-E4', name: 'Introducción a la Energía Nuclear', type: '2° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 3, comisiones: [{ id: 'Electiva', duration: '2', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '20:00' }] }] },
    { id: 'QUI-E5', name: 'Corrosión Metálica y Protección', type: 'Anual', correlCursada: ['QUI-10', 'QUI-13', 'QUI-22'], correlAprobada: ['QUI-8', 'QUI-10', 'QUI-13', 'QUI-22'], annualHours: 3, comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:30', fin: '19:45' }] }] },
    { id: 'QUI-E6', name: 'Energías Alternativas en el Siglo XXI', type: 'Anual', correlCursada: ['QUI-18', 'QUI-22', 'QUI-23'], correlAprobada: ['QUI-10', 'UTN-F2', 'QUI-18', 'QUI-22', 'QUI-23'], annualHours: 3, comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '20:00', fin: '22:15' }] }] },
    { id: 'QUI-E7', name: 'Operaciones Logísticas', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 3, comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '20:00', fin: '21:30' }] }] },
    { id: 'QUI-E8', name: 'Retórica Profesional', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 3, comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '14:30', fin: '16:45' }] }] },
    { id: 'QUI-E9', name: 'Nanotecnología de Materiales Porosos', type: '1° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 3, comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '20:00' }] }] },
    { id: 'QUI-E10', name: 'Polímeros', type: '2° Cuatr.', correlCursada: ['QUI-10', 'QUI-13', 'QUI-22'], correlAprobada: ['QUI-8', 'QUI-10', 'QUI-13', 'QUI-22'], annualHours: 2, comisiones: [{ id: 'Electiva', duration: '2', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '20:00' }] }] },
    { id: 'QUI-E11', name: 'Industrialización de Hidrocarburos', type: 'Anual', correlCursada: [], correlAprobada: [], annualHours: 3, comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '19:15' }] }] },
    { id: 'QUI-E12', name: 'Responsabilidad Social Institucional', type: '1° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 2, comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Jueves', inicio: '19:15', fin: '20:45' }, { nombre: 'Viernes', inicio: '17:00', fin: '18:30' }] }] },
    { id: 'QUI-E13', name: 'Protección de Materiales', type: 'Anual', correlCursada: ['QUI-10', 'QUI-13', 'QUI-22'], correlAprobada: ['QUI-8', 'QUI-10', 'QUI-13', 'QUI-22'], annualHours: 3, comisiones: [{ id: 'Electiva', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:00', fin: '19:15' }] }] },
    { id: 'QUI-E14', name: 'Ingeniería de los Procesos Catalíticos', type: '1° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 3, comisiones: [{ id: 'Electiva', duration: '1', dias: [{ nombre: 'Viernes', inicio: '16:30', fin: '19:30' }] }] },
    { id: 'QUI-E15', name: 'Higiene y Seguridad / Problem. Ambiental', type: '1° Cuatr.', correlCursada: [], correlAprobada: [], annualHours: 3, comisiones: [{ id: 'Q51 (Noche)', duration: '1', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '20:00' }] }] },
    { id: 'QUI-E16', name: 'Ingeniería Ambiental', type: 'Anual', correlCursada: ['QUI-16', 'QUI-23', 'QUI-24', 'QUI-27'], correlAprobada: ['QUI-10', 'QUI-13', 'QUI-16', 'QUI-23', 'QUI-24', 'QUI-27'], annualHours: 3, comisiones: [{ id: 'Q51 (Noche)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:15' }] }] }
  ]
};

export const ALL = [ ...SUBJECTS, ...(ELECTIVAS[3] || []), ...(ELECTIVAS[5] || []) ];

export const getSubjectById = (id: any) => { return ALL.find(subject => subject.id.toString() === id.toString()); };