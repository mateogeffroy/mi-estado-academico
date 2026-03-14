// Each subject: { id, num, name, hours, level, correlCursada: [ids], correlAprobada: [ids], comisiones?: [...] }

const SUBJECTS = [
  // ── PRIMER NIVEL ──
  { 
    id:1, num:'01', name:'Analisis Matemático I', hours:'5 hs/sem', level:1, correlCursada:[], correlAprobada:[],
    comisiones: [
      { id: 'S10', dias: [{ nombre: 'Martes', inicio: '08:00', fin: '12:00' }] },
      { id: 'S11', dias: [{ nombre: 'Miércoles', inicio: '08:00', fin: '12:00' }] },
      { id: 'S12', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '12:30' }] },
      { id: 'S13', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '21:00' }] },
      { id: 'S14', dias: [{ nombre: 'Martes', inicio: '19:15', fin: '23:15' }] },
      { id: 'S15', dias: [{ nombre: 'Jueves', inicio: '13:15', fin: '17:15' }] },
      { id: 'S16', dias: [{ nombre: 'Martes', inicio: '13:00', fin: '15:15' }, { nombre: 'Miércoles', inicio: '09:45', fin: '11:15' }] }
    ]
  },
  { 
    id:2, num:'02', name:'Algebra y Geometría Analítica', hours:'5 hs/sem', level:1, correlCursada:[], correlAprobada:[],
    comisiones: [
      { id: 'S10', dias: [{ nombre: 'Viernes', inicio: '08:00', fin: '12:00' }] },
      { id: 'S11', dias: [{ nombre: 'Martes', inicio: '08:00', fin: '12:00' }] },
      { id: 'S12', dias: [{ nombre: 'Miércoles', inicio: '10:30', fin: '14:30' }] },
      { id: 'S13', dias: [{ nombre: 'Viernes', inicio: '18:00', fin: '22:00' }] },
      { id: 'S14', dias: [{ nombre: 'Jueves', inicio: '18:00', fin: '22:00' }] },
      { id: 'S15', dias: [{ nombre: 'Miércoles', inicio: '13:15', fin: '17:15' }] },
      { id: 'S16', dias: [{ nombre: 'Viernes', inicio: '11:00', fin: '15:00' }] }
    ]
  },
  { 
    id:3, num:'03', name:'Fisica I', hours:'5 hs/sem', level:1, correlCursada:[], correlAprobada:[],
    comisiones: [
      { id: 'S10', dias: [{ nombre: 'Miércoles', inicio: '09:00', fin: '13:00' }] },
      { id: 'S11', dias: [{ nombre: 'Jueves', inicio: '11:30', fin: '15:30' }] },
      { id: 'S12', dias: [{ nombre: 'Viernes', inicio: '10:00', fin: '14:00' }] },
      { id: 'S13', dias: [{ nombre: 'Martes', inicio: '19:30', fin: '23:30' }] },
      { id: 'S14', dias: [{ nombre: 'Viernes', inicio: '18:30', fin: '22:30' }] },
      { id: 'S15', dias: [{ nombre: 'Lunes', inicio: '15:00', fin: '19:00' }] },
      { id: 'S16', dias: [{ nombre: 'Jueves', inicio: '08:00', fin: '12:00' }] }
    ]
  },
  { id:4, num:'04', name:'Inglés I', hours:'2 hs/sem', level:1, correlCursada:[], correlAprobada:[] },
  { 
    id:5, num:'05', name:'Lógica y Estructuras Discretas', hours:'3 hs/sem', level:1, correlCursada:[], correlAprobada:[],
    comisiones: [
      { id: 'S10', dias: [{ nombre: 'Lunes', inicio: '12:00', fin: '14:15' }] },
      { id: 'S11', dias: [{ nombre: 'Viernes', inicio: '08:00', fin: '10:15' }] },
      { id: 'S12', dias: [{ nombre: 'Martes', inicio: '10:30', fin: '12:45' }] },
      { id: 'S13', dias: [{ nombre: 'Miércoles', inicio: '20:45', fin: '23:00' }] },
      { id: 'S14', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '19:15' }] },
      { id: 'S15', dias: [{ nombre: 'Lunes', inicio: '12:45', fin: '15:00' }] },
      { id: 'S16', dias: [{ nombre: 'Viernes', inicio: '08:00', fin: '10:15' }] }
    ]
  },
  { 
    id:6, num:'06', name:'Algoritmos y Estructuras de Datos', hours:'5 hs/sem', level:1, correlCursada:[], correlAprobada:[],
    comisiones: [
      { id: 'S10', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '10:15' }, { nombre: 'Jueves', inicio: '09:30', fin: '11:00' }] },
      { id: 'S11', dias: [{ nombre: 'Lunes', inicio: '10:30', fin: '12:45' }, { nombre: 'Jueves', inicio: '08:30', fin: '10:00' }] },
      { id: 'S12', dias: [{ nombre: 'Miércoles', inicio: '08:00', fin: '10:15' }, { nombre: 'Jueves', inicio: '10:30', fin: '12:00' }] },
      { id: 'S13', dias: [{ nombre: 'Lunes', inicio: '17:45', fin: '19:15' }, { nombre: 'Miércoles', inicio: '18:00', fin: '20:15' }] },
      { id: 'S14', dias: [{ nombre: 'Lunes', inicio: '20:30', fin: '22:45' }, { nombre: 'Miércoles', inicio: '21:30', fin: '23:00' }] },
      { id: 'S15', dias: [{ nombre: 'Miércoles', inicio: '18:00', fin: '19:30' }, { nombre: 'Jueves', inicio: '17:15', fin: '19:30' }] },
      { id: 'S16', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '10:15' }, { nombre: 'Miércoles', inicio: '08:00', fin: '09:30' }] }
    ]
  },
  { 
    id:7, num:'07', name:'Arquitecturas de Computadoras', hours:'4 hs/sem', level:1, correlCursada:[], correlAprobada:[],
    comisiones: [
      { id: 'S10', dias: [{ nombre: 'Jueves', inicio: '08:00', fin: '09:30' }, { nombre: 'Viernes', inicio: '12:00', fin: '13:30' }] },
      { id: 'S11', dias: [{ nombre: 'Jueves', inicio: '10:00', fin: '11:30' }, { nombre: 'Viernes', inicio: '10:30', fin: '12:00' }] },
      { id: 'S12', dias: [{ nombre: 'Martes', inicio: '08:45', fin: '10:15' }, { nombre: 'Jueves', inicio: '12:00', fin: '13:30' }] },
      { id: 'S13', dias: [{ nombre: 'Lunes', inicio: '19:30', fin: '22:30' }] },
      { id: 'S14', dias: [{ nombre: 'Martes', inicio: '17:45', fin: '19:15' }, { nombre: 'Miércoles', inicio: '19:45', fin: '21:15' }] },
      { id: 'S15', dias: [{ nombre: 'Martes', inicio: '14:30', fin: '17:30' }] },
      { id: 'S16', dias: [{ nombre: 'Martes', inicio: '11:15', fin: '12:45' }, { nombre: 'Jueves', inicio: '12:00', fin: '13:30' }] },
      { id: 'S17', dias: [{ nombre: 'Martes', inicio: '08:45', fin: '10:15' }, { nombre: 'Viernes', inicio: '12:00', fin: '13:30' }] }
    ]
  },
  { 
    id:8, num:'08', name:'Sistemas y Procesos de Negocio', hours:'3 hs/sem', level:1, correlCursada:[], correlAprobada:[],
    comisiones: [
      { id: 'S10', dias: [{ nombre: 'Jueves', inicio: '11:15', fin: '13:30' }] },
      { id: 'S11', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '10:15' }] },
      { id: 'S12', dias: [{ nombre: 'Jueves', inicio: '08:00', fin: '10:15' }] },
      { id: 'S13', dias: [{ nombre: 'Martes', inicio: '17:10', fin: '19:25' }] },
      { id: 'S14', dias: [{ nombre: 'Lunes', inicio: '18:00', fin: '20:15' }] },
      { id: 'S15', dias: [{ nombre: 'Martes', inicio: '12:00', fin: '14:15' }] },
      { id: 'S16', dias: [{ nombre: 'Lunes', inicio: '10:30', fin: '12:45' }] }
    ]
  },

  // ── SEGUNDO NIVEL ──
  { 
    id:9, num:'09', name:'Análisis Matemático II', hours:'5 hs/sem', level:2, correlCursada:[1,2], correlAprobada:[],
    comisiones: [
      { id: 'S21', dias: [{ nombre: 'Lunes', inicio: '10:30', fin: '12:45' }, { nombre: 'Jueves', inicio: '09:45', fin: '11:15' }] },
      { id: 'S22', dias: [{ nombre: 'Martes', inicio: '10:00', fin: '12:15' }, { nombre: 'Jueves', inicio: '08:15', fin: '09:45' }] },
      { id: 'S23', dias: [{ nombre: 'Lunes', inicio: '20:15', fin: '21:45' }, { nombre: 'Jueves', inicio: '17:45', fin: '20:00' }] },
      { id: 'S24', dias: [{ nombre: 'Lunes', inicio: '18:00', fin: '19:30' }, { nombre: 'Jueves', inicio: '14:00', fin: '16:15' }] }
    ]
  },
  { 
    id:10, num:'10', name:'Fisica II', hours:'5 hs/sem', level:2, correlCursada:[1,3], correlAprobada:[],
    comisiones: [
      { id: 'S21', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '10:15' }, { nombre: 'Martes', inicio: '13:00', fin: '15:00' }] },
      { id: 'S22', dias: [{ nombre: 'Lunes', inicio: '10:30', fin: '14:30' }] },
      { id: 'S23', dias: [{ nombre: 'Martes', inicio: '17:30', fin: '21:30' }] },
      { id: 'S24', dias: [{ nombre: 'Jueves', inicio: '12:00', fin: '16:00' }] }
    ]
  },
  { 
    id:11, num:'11', name:'Ingeniería y Sociedad', hours:'2 hs/sem', level:2, correlCursada:[], correlAprobada:[],
    comisiones: [
      { id: 'S21', dias: [{ nombre: 'Martes', inicio: '10:30', fin: '12:00' }] },
      { id: 'S22', dias: [{ nombre: 'Martes', inicio: '12:45', fin: '14:15' }] },
      { id: 'S23', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '18:30' }] },
      { id: 'S24', dias: [{ nombre: 'Viernes', inicio: '14:00', fin: '15:30' }] }
    ]
  },
  { id:12, num:'12', name:'Inglés II', hours:'2 hs/sem', level:2, correlCursada:[4], correlAprobada:[] },
  { 
    id:13, num:'13', name:'Sintaxis y Semántica del Lenguaje (1°Cuatr.)', hours:'4 hs/sem', level:2, correlCursada:[5,6], correlAprobada:[],
    comisiones: [
      { id: 'S21', dias: [{ nombre: 'Miércoles', inicio: '08:00', fin: '12:00' }, { nombre: 'Viernes', inicio: '10:30', fin: '12:45' }] },
      { id: 'S22', dias: [{ nombre: 'Jueves', inicio: '10:00', fin: '11:30' }, { nombre: 'Viernes', inicio: '08:00', fin: '12:45' }] },
      { id: 'S23', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '19:15' }, { nombre: 'Viernes', inicio: '18:30', fin: '22:30' }] },
      { id: 'S24', dias: [{ nombre: 'Lunes', inicio: '11:00', fin: '13:15' }, { nombre: 'Miércoles', inicio: '14:00', fin: '18:00' }] }
    ]
  },
  { 
    id:14, num:'14', name:'Paradigmas de Programación (2°Cuatr.)', hours:'4 hs/sem', level:2, correlCursada:[5,6], correlAprobada:[],
    comisiones: [
      { id: 'S21', dias: [{ nombre: 'Miércoles', inicio: '08:00', fin: '12:00' }, { nombre: 'Viernes', inicio: '10:30', fin: '12:45' }] },
      { id: 'S22', dias: [{ nombre: 'Jueves', inicio: '10:00', fin: '11:30' }, { nombre: 'Viernes', inicio: '08:00', fin: '12:45' }] },
      { id: 'S23', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '19:15' }, { nombre: 'Viernes', inicio: '18:30', fin: '22:30' }] },
      { id: 'S24', dias: [{ nombre: 'Lunes', inicio: '11:00', fin: '13:15' }, { nombre: 'Miércoles', inicio: '14:00', fin: '18:00' }] }
    ]
  },
  { 
    id:15, num:'15', name:'Sistemas Operativos', hours:'4 hs/sem', level:2, correlCursada:[7], correlAprobada:[],
    comisiones: [
      { id: 'S21', dias: [{ nombre: 'Miércoles', inicio: '12:00', fin: '13:30' }, { nombre: 'Jueves', inicio: '08:00', fin: '09:30' }] },
      { id: 'S22', dias: [{ nombre: 'Martes', inicio: '08:15', fin: '09:45' }, { nombre: 'Miércoles', inicio: '10:30', fin: '12:00' }] },
      { id: 'S23', dias: [{ nombre: 'Lunes', inicio: '18:30', fin: '20:00' }, { nombre: 'Viernes', inicio: '17:00', fin: '18:30' }] },
      { id: 'S24', dias: [{ nombre: 'Lunes', inicio: '16:30', fin: '18:00' }, { nombre: 'Viernes', inicio: '15:30', fin: '17:00' }] }
    ]
  },
  { 
    id:16, num:'16', name:'Análisis de Sistemas de Información (Integradora)', hours:'6 hs/sem', level:2, correlCursada:[6,8], correlAprobada:[],
    comisiones: [
      { id: 'S21', dias: [{ nombre: 'Martes', inicio: '08:00', fin: '10:15' }, { nombre: 'Viernes', inicio: '08:00', fin: '10:15' }] },
      { id: 'S22', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '10:15' }, { nombre: 'Miércoles', inicio: '08:00', fin: '10:15' }] },
      { id: 'S23', dias: [{ nombre: 'Miércoles', inicio: '19:15', fin: '21:30' }, { nombre: 'Jueves', inicio: '20:00', fin: '22:15' }] },
      { id: 'S24', dias: [{ nombre: 'Lunes', inicio: '14:15', fin: '16:30' }, { nombre: 'Martes', inicio: '16:15', fin: '18:30' }] }
    ]
  },

  // ── TERCER NIVEL ──
  { 
    id:17, num:'17', name:'Probabilidades y Estadística', hours:'3 hs/sem', level:3, correlCursada:[1,2], correlAprobada:[],
    comisiones: [
      { id: 'S31', dias: [{ nombre: 'Miércoles', inicio: '13:00', fin: '15:15' }] },
      { id: 'S32', dias: [{ nombre: 'Viernes', inicio: '20:00', fin: '22:15' }] },
      { id: 'S33', dias: [{ nombre: 'Miércoles', inicio: '10:15', fin: '12:30' }] }
    ]
  },
  { 
    id:18, num:'18', name:'Economía (2°Cuatr.)', hours:'3 hs/sem', level:3, correlCursada:[], correlAprobada:[1,2],
    comisiones: [
      { id: 'S31', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '10:15' }, { nombre: 'Jueves', inicio: '08:00', fin: '10:15' }] },
      { id: 'S32', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '19:30' }, { nombre: 'Jueves', inicio: '18:00', fin: '20:00' }] },
      { id: 'S33', dias: [{ nombre: 'Martes', inicio: '10:30', fin: '12:45' }, { nombre: 'Jueves', inicio: '10:30', fin: '12:45' }] }
    ]
  },
  { 
    id:19, num:'19', name:'Bases de Datos (1°Cuatr.)', hours:'4 hs/sem', level:3, correlCursada:[13,16], correlAprobada:[5,6],
    comisiones: [
      { id: 'S31', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '11:00' }, { nombre: 'Jueves', inicio: '11:00', fin: '14:00' }] },
      { id: 'S32', dias: [{ nombre: 'Martes', inicio: '17:00', fin: '20:00' }, { nombre: 'Viernes', inicio: '17:00', fin: '20:00' }] },
      { id: 'S33', dias: [{ nombre: 'Martes', inicio: '10:30', fin: '13:30' }, { nombre: 'Jueves', inicio: '08:00', fin: '11:00' }] }
    ]
  },
  { 
    id:20, num:'20', name:'Desarrollo de Software', hours:'4 hs/sem', level:3, correlCursada:[14,16], correlAprobada:[5,6],
    comisiones: [
      { id: 'S31', dias: [{ nombre: 'Jueves (1°C)', inicio: '08:00', fin: '11:00' }, { nombre: 'Jueves (2°C)', inicio: '10:30', fin: '13:00' }] },
      { id: 'S32', dias: [{ nombre: 'Lunes', inicio: '20:15', fin: '23:15' }, { nombre: 'Viernes', inicio: '17:00', fin: '20:00' }] },
      { id: 'S33', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '11:00' }] }
    ]
  },
  { 
    id:21, num:'21', name:'Comunicación de Datos (1°Cuatr.)', hours:'4 hs/sem', level:3, correlCursada:[], correlAprobada:[3,7],
    comisiones: [
      { id: 'S31', dias: [{ nombre: 'Miércoles', inicio: '10:15', fin: '13:00' }, { nombre: 'Viernes', inicio: '08:00', fin: '11:15' }] },
      { id: 'S32', dias: [{ nombre: 'Lunes', inicio: '20:15', fin: '23:15' }, { nombre: 'Jueves', inicio: '18:00', fin: '21:00' }] },
      { id: 'S33', dias: [{ nombre: 'Miércoles', inicio: '12:30', fin: '15:15' }, { nombre: 'Viernes', inicio: '08:00', fin: '11:15' }] }
    ]
  },
  { 
    id:22, num:'22', name:'Análisis Numérico', hours:'3 hs/sem', level:3, correlCursada:[9], correlAprobada:[1,2],
    comisiones: [
      { id: 'S31', dias: [{ nombre: 'Lunes', inicio: '11:00', fin: '14:00' }] },
      { id: 'S32', dias: [{ nombre: 'Miércoles', inicio: '20:15', fin: '23:15' }] },
      { id: 'S33', dias: [{ nombre: 'Lunes', inicio: '11:00', fin: '14:00' }] }
    ]
  },
  { 
    id:23, num:'23', name:'Diseño de Sistemas de Información (Integradora)', hours:'6 hs/sem', level:3, correlCursada:[14,16], correlAprobada:[4,6,8],
    comisiones: [
      { id: 'S31', dias: [{ nombre: 'Martes', inicio: '08:00', fin: '10:15' }, { nombre: 'Miércoles', inicio: '08:00', fin: '10:15' }] },
      { id: 'S32', dias: [{ nombre: 'Lunes', inicio: '18:00', fin: '20:15' }, { nombre: 'Miércoles', inicio: '18:00', fin: '20:15' }] },
      { id: 'S33', dias: [{ nombre: 'Martes', inicio: '08:00', fin: '10:15' }, { nombre: 'Miércoles', inicio: '08:00', fin: '10:15' }] }
    ]
  },
  { 
    id:'SEM', num:'SEM', name:'Seminario Integrador (Título Intermedio)', hours:'Extra', level:3, correlCursada:[], correlAprobada:[], isSeminario: true,
    comisiones: [
      { id: 'S31', dias: [{ nombre: 'Lunes', inicio: '16:00', fin: '17:30' }, { nombre: 'Jueves', inicio: '16:30', fin: '18:00' }] },
      { id: 'S32', dias: [{ nombre: 'Lunes', inicio: '16:00', fin: '17:30' }, { nombre: 'Jueves', inicio: '16:30', fin: '18:00' }] }
    ]
  },
  { id:'REQ3', num:'E3', name:'Electivas 3° Nivel', hours:'Req: 4 hs anuales', level:3, correlCursada:[], correlAprobada:[], isElectivePlaceholder:true, targetHours: 4 },

  // ── CUARTO NIVEL ──
  { 
    id:24, num:'24', name:'Legislación', hours:'2 hs/sem', level:4, correlCursada:[11], correlAprobada:[],
    comisiones: [
      { id: 'S41', dias: [{ nombre: 'Lunes', inicio: '20:15', fin: '23:15' }] },
      { id: 'S42', dias: [{ nombre: 'Jueves', inicio: '12:30', fin: '14:00' }] }
    ]
  },
  { 
    id:25, num:'25', name:'Ingeniería y Calidad de Software (1°Cuatr.)', hours:'3 hs/sem', level:4, correlCursada:[19,20,23], correlAprobada:[13,14],
    comisiones: [
      { id: 'S41', dias: [{ nombre: 'Lunes', inicio: '18:00', fin: '22:30' }] },
      { id: 'S42', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '12:30' }] }
    ]
  },
  { 
    id:26, num:'26', name:'Redes de Datos (2°Cuatr.)', hours:'4 hs/sem', level:4, correlCursada:[15,21], correlAprobada:[],
    comisiones: [
      { id: 'S41', dias: [{ nombre: 'Miércoles', inicio: '17:30', fin: '20:30' }, { nombre: 'Viernes', inicio: '18:00', fin: '21:00' }] },
      { id: 'S42', dias: [{ nombre: 'Miércoles', inicio: '08:00', fin: '12:30' }, { nombre: 'Viernes', inicio: '12:30', fin: '14:00' }] }
    ]
  },
  { 
    id:27, num:'27', name:'Investigación Operativa', hours:'4 hs/sem', level:4, correlCursada:[17,22], correlAprobada:[],
    comisiones: [
      { id: 'S41', dias: [{ nombre: 'Miércoles', inicio: '18:00', fin: '20:00' }, { nombre: 'Jueves', inicio: '18:00', fin: '22:00' }] },
      { id: 'S42', dias: [{ nombre: 'Jueves', inicio: '08:00', fin: '11:00' }] }
    ]
  },
  { 
    id:28, num:'28', name:'Simulación (1°Cuatr.)', hours:'3 hs/sem', level:4, correlCursada:[17], correlAprobada:[9],
    comisiones: [
      { id: 'S41', dias: [{ nombre: 'Miércoles', inicio: '20:15', fin: '22:30' }, { nombre: 'Viernes', inicio: '18:00', fin: '20:15' }] },
      { id: 'S42', dias: [{ nombre: 'Miércoles', inicio: '08:00', fin: '12:30' }] }
    ]
  },
  { 
    id:29, num:'29', name:'Tecnologías para la Automatización (2°Cuatr.)', hours:'3 hs/sem', level:4, correlCursada:[10,22], correlAprobada:[9],
    comisiones: [
      { id: 'S41', dias: [{ nombre: 'Jueves', inicio: '18:00', fin: '22:30' }] },
      { id: 'S42', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '12:30' }] }
    ]
  },
  { 
    id:30, num:'30', name:'Administración de Sistemas de Información (Integradora)', hours:'6 hs/sem', level:4, correlCursada:[18,23], correlAprobada:[16],
    comisiones: [
      { id: 'S41', dias: [{ nombre: 'Martes', inicio: '18:00', fin: '20:00' }, { nombre: 'Viernes (1°C)', inicio: '20:30', fin: '23:00' }, { nombre: 'Viernes (2°C)', inicio: '21:00', fin: '23:30' }] },
      { id: 'S42', dias: [{ nombre: 'Viernes', inicio: '08:00', fin: '12:30' }] }
    ]
  },
  { id:'REQ4', num:'E4', name:'Electivas 4° Nivel', hours:'Req: 6 hs anuales', level:4, correlCursada:[], correlAprobada:[], isElectivePlaceholder:true, targetHours: 6 },

  // ── QUINTO NIVEL ──
  { 
    id:31, num:'31', name:'Inteligencia Artificial (1°Cuatr.)', hours:'3 hs/sem', level:5, correlCursada:[28], correlAprobada:[17,22],
    comisiones: [
      { id: 'S51', dias: [{ nombre: 'Sábado', inicio: '08:00', fin: '12:30' }] }
    ]
  },
  { 
    id:32, num:'32', name:'Ciencia de Datos (1°Cuatr.)', hours:'3 hs/sem', level:5, correlCursada:[28], correlAprobada:[17,19],
    comisiones: [
      { id: 'S51', dias: [{ nombre: 'Miércoles', inicio: '18:00', fin: '20:15' }, { nombre: 'Jueves', inicio: '18:00', fin: '20:15' }] }
    ]
  },
  { 
    id:33, num:'33', name:'Sistemas de Gestión', hours:'4 hs/sem', level:5, correlCursada:[18,27], correlAprobada:[23],
    comisiones: [
      { id: 'S51', dias: [{ nombre: 'Lunes', inicio: '17:30', fin: '20:30' }] }
    ]
  },
  { 
    id:34, num:'34', name:'Gestión Gerencial (1°Cuatr.)', hours:'3 hs/sem', level:5, correlCursada:[24,30], correlAprobada:[18],
    comisiones: [
      { id: 'S51', dias: [{ nombre: 'Lunes', inicio: '20:30', fin: '22:45' }, { nombre: 'Martes', inicio: '18:00', fin: '20:15' }] }
    ]
  },
  { 
    id:35, num:'35', name:'Seguridad en los Sistemas de Información (2°Cuatr.)', hours:'3 hs/sem', level:5, correlCursada:[26,30], correlAprobada:[20,21],
    comisiones: [
      { id: 'S51', dias: [{ nombre: 'Lunes', inicio: '20:30', fin: '22:45' }, { nombre: 'Miércoles', inicio: '18:00', fin: '20:15' }] }
    ]
  },
  { 
    id:36, num:'36', name:'Proyecto Final (Integradora)', hours:'6 hs/sem', level:5, correlCursada:[25,26,30], correlAprobada:[12,20,23],
    comisiones: [
      { id: 'S51', dias: [{ nombre: 'Martes', inicio: '20:15', fin: '22:30' }, { nombre: 'Jueves', inicio: '20:30', fin: '22:45' }] }
    ]
  },
  { id:'REQ5', num:'E5', name:'Electivas 5° Nivel', hours:'Req: 10 hs anuales', level:5, correlCursada:[], correlAprobada:[], isElectivePlaceholder:true, targetHours: 10 },
  { id:'PPS', num:'PPS', name:'Práctica Profesional Supervisada', hours:'200Hrs', level:5, correlCursada:[], correlAprobada:[] },
];

const ELECTIVAS = {
  3: [
    { 
      id:'E2', num:'E1', name:'Sistemas de Tiempo Real (2°Cuatr.)', hours:'6 hs/sem (3 hs anuales)', annualHours: 3, correlCursada:[15], correlAprobada:[7],
      comisiones: [
        { id: 'S31', dias: [{ nombre: 'Miércoles', inicio: '15:30', fin: '17:45' }, { nombre: 'Viernes', inicio: '14:45', fin: '17:00' }] },
        { id: 'S32', dias: [{ nombre: 'Miércoles', inicio: '15:30', fin: '17:45' }, { nombre: 'Viernes', inicio: '14:45', fin: '17:00' }] }
      ]
    },
    { 
      id:'E3', num:'E2', name:'Tecnología y Gestión Web (1°Cuatr.)', hours:'4 hs/sem (2 hs anuales)', annualHours: 2, correlCursada:[13,15], correlAprobada:[6],
      comisiones: [
        { id: 'S31', dias: [{ nombre: 'Viernes', inicio: '11:15', fin: '14:15' }] },
        { id: 'S32', dias: [{ nombre: 'Viernes', inicio: '14:00', fin: '17:00' }] }
      ]
    },
    { 
      id:'E4', num:'E3', name:'Sistemas de Transmisión y Redes Inalámbricas (2°Cuatr.)', hours:'4 hs/sem (2 hs anuales)', annualHours: 2, correlCursada:[9], correlAprobada:[7],
      comisiones: [
        { id: 'S31', dias: [{ nombre: 'Sábado', inicio: '08:00', fin: '11:00' }] },
        { id: 'S32', dias: [{ nombre: 'Sábado', inicio: '08:00', fin: '11:00' }] }
      ]
    },
    { 
      id:'E5', num:'E4', name:'Responsabilidad Social e Institucional (1°Cuatr.)', hours:'4 hs/sem (2 hs anuales)', annualHours: 2, correlCursada:[8,16], correlAprobada:[],
      comisiones: [
        { id: 'S31', dias: [{ nombre: 'Jueves', inicio: '19:15', fin: '20:45' }, { nombre: 'Viernes', inicio: '17:00', fin: '18:30' }] }
      ]
    },
    { 
      id:'E6', num:'E5', name:'Comunicación Profesional', hours:'3 hs anuales', annualHours: 3, correlCursada:[11], correlAprobada:[8],
      comisiones: [
        { id: 'S31', dias: [{ nombre: 'Jueves', inicio: '14:00', fin: '16:15' }] },
        { id: 'S32', dias: [{ nombre: 'Jueves', inicio: '14:00', fin: '16:15' }] }
      ]
    },
    { id:'E22', num:'Fuera del plan', name:'Programación Concurrente (1°Cuatr.)', hours:'4 hs/sem (2 hs anuales)', annualHours: 2, correlCursada:[14,15], correlAprobada:[], isOutdated: true },
    { id:'QMC', num:'Fuera del plan', name:'Química', hours:'6 hs/sem (3 hs anuales)', annualHours: 3, correlCursada:[], correlAprobada:[], isOutdated: true, onlyIngenieria: true },
    { id:'SDR', num:'Fuera del plan', name:'Sistemas de Representación', hours:'6 hs/sem (3 hs anuales)', annualHours: 3, correlCursada:[], correlAprobada:[], isOutdated: true },
  ],
  4: [
    { 
      id:'E7', num:'E6', name:'Administración de Base de Datos (2°Cuatr.)', hours:'4 hs/sem (2 hs anuales)', annualHours: 2, correlCursada:[19], correlAprobada:[15],
      comisiones: [{ id: 'S41', dias: [{ nombre: 'Martes', inicio: '20:15', fin: '23:15' }] }]
    },
    { 
      id:'E8', num:'E7', name:'Desarrollo de Software Cloud (2°Cuatr.)', hours:'4 hs/sem (2 hs anuales)', annualHours: 2, correlCursada:[15,20,23], correlAprobada:[13,14],
      comisiones: [{ id: 'S41', dias: [{ nombre: 'Lunes', inicio: '17:15', fin: '20:15' }] }]
    },
    { 
      id:'E9', num:'E8', name:'Diseño Inclusivo para Usuarios con Discapacidad (1°Cuatr.)', hours:'4 hs/sem (2 hs anuales)', annualHours: 2, correlCursada:[23], correlAprobada:[16],
      comisiones: [{ id: 'S41', dias: [{ nombre: 'Sábado', inicio: '11:00', fin: '14:00' }] }]
    },
    { 
      id:'E11', num:'E9', name:'Metodologías Agiles (2°Cuatr.)', hours:'6 hs/sem (3 hs anuales)', annualHours: 3, correlCursada:[19,20,23], correlAprobada:[16],
      comisiones: [{ id: 'S41', dias: [{ nombre: 'Miércoles', inicio: '20:30', fin: '22:45' }, { nombre: 'Sábado', inicio: '08:30', fin: '10:45' }] }]
    },
    { 
      id:'E13', num:'E10', name:'Tecnologías para la Explotación de la Información (1ª Cuatr.)', hours:'4 hs/sem (2 hs anuales)', annualHours: 2, correlCursada:[17,23], correlAprobada:[14],
      comisiones: [{ id: 'S41', dias: [{ nombre: 'Sábado', inicio: '08:00', fin: '11:00' }] }]
    },
    { 
      id:'E14', num:'E11', name:'Aplicaciones Moviles (1°Cuatr.)', hours:'4 hs/sem (2 hs anuales)', annualHours: 2, correlCursada:[14,23], correlAprobada:[6],
      comisiones: [{ id: 'S41', dias: [{ nombre: 'Martes', inicio: '20:15', fin: '23:15' }] }]
    },
    { id:'E23', num:'Fuera del plan', name:'Metodología de la Investigación (2°Cuatr.)', hours:'4 hs/sem (2 hs anuales)', annualHours: 2, correlCursada:[23], correlAprobada:[], isOutdated: true },
    { id:'E24', num:'Fuera del plan', name:'Tecnología de Interfaces Interactivas (2°Cuatr.)', hours:'4 hs/sem (2 hs anuales)', annualHours: 2, correlCursada:[16], correlAprobada:[23], isOutdated: true },
  ],
  5: [
    { 
      id:'E15', num:'E12', name:'Ingeniería en Calidad', hours:'3 hs anuales', annualHours: 3, correlCursada:[30], correlAprobada:[23],
      comisiones: [{ id: 'S51', dias: [{ nombre: 'Miércoles', inicio: '20:15', fin: '22:30' }] }]
    },
    { 
      id:'E17', num:'E13', name:'Protocolos y Seguridad en Redes Inalámbricas (2°Cuatr.)', hours:'4 hs/sem (2 hs anuales)', annualHours: 2, correlCursada:[21,26], correlAprobada:[9,10],
      comisiones: [{ id: 'S51', dias: [{ nombre: 'Viernes', inicio: '20:15', fin: '23:15' }] }]
    },
    { 
      id:'E18', num:'E14', name:'Sistemas en la Industria 4.0 (2°Cuatr.)', hours:'6 hs/sem (3 hs anuales)', annualHours: 3, correlCursada:[19,21,25,26], correlAprobada:[7],
      comisiones: [{ id: 'S51', dias: [{ nombre: 'Viernes', inicio: '18:00', fin: '22:30' }] }]
    },
    { 
      id:'E19', num:'E15', name:'Tecnologias de Información para la Gestión Empresarial (1°Cuatr.)', hours:'4 hs/sem (2 hs anuales)', annualHours: 2, correlCursada:[25], correlAprobada:[23],
      comisiones: [{ id: 'S51', dias: [{ nombre: 'Viernes', inicio: '17:15', fin: '20:15' }] }]
    },
    { 
      id:'E20', num:'E16', name:'Emprendedorismo', hours:'2 hs anuales', annualHours: 2, correlCursada:[18,24], correlAprobada:[],
      comisiones: [{ id: 'S51', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '18:30' }] }]
    },
    { 
      id:'E21', num:'E17', name:'Gestión Operativa y Seguridad en Redes (2° Cuatr.)', hours:'6 hs/sem (3 hs anuales)', annualHours: 3, correlCursada:[], correlAprobada:[26],
      comisiones: [{ id: 'S51', dias: [{ nombre: 'Martes', inicio: '18:00', fin: '20:15' }, { nombre: 'Jueves', inicio: '18:00', fin: '20:15' }] }]
    },
  ]
};

const ALL = [
  ...SUBJECTS,
  ...ELECTIVAS[3], ...ELECTIVAS[4], ...ELECTIVAS[5]
];

function getSubjectById(id: any) { 
  return ALL.find((s: any) => s.id == id); 
}

export { ALL, SUBJECTS, ELECTIVAS, getSubjectById };