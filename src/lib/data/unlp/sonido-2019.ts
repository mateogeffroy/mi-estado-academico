export const careerInfo = {
  id: 'unlp-sonido-2023',
  universidad: 'UNLP - Facultad de Artes',
  nombre: 'Tecnicatura Universitaria en Sonido y Grabación',
  plan: 'Plan Vigente',
  tituloIntermedio: 'No posee',
  tituloFinal: 'Técnico/a Universitario/a en Sonido y Grabación',
  creditosTotales: 0,
};

export const SUBJECTS = [
  // ── PRIMER AÑO ──
  { id: 'M0210', name: 'Introducción a la Producción y el Análisis Musical', level: 1, duration: 'A', correlCursada: [], correlAprobada: [] },
  { id: 'M0213', name: 'Educación Auditiva', level: 1, duration: 'A', correlCursada: [], correlAprobada: [] },
  { id: 'M0005', name: 'Acústica Musical', level: 1, duration: 'A', correlCursada: [], correlAprobada: [] },
  { id: 'TU017', name: 'Instrumento Introductorio (Piano o Guitarra)', level: 1, duration: 'A', correlCursada: [], correlAprobada: [] },
  { id: 'TU018', name: 'Electrónica I', level: 1, duration: '1', correlCursada: [], correlAprobada: [] },
  { id: 'TU019', name: 'Electrónica II', level: 1, duration: '2', correlCursada: ['TU018'], correlAprobada: [] },

  // ── SEGUNDO AÑO ──
  { id: 'TU020', name: 'Análisis de Recursos I', level: 2, duration: '1', correlCursada: ['M0005'], correlAprobada: ['M0210'] },
  { id: 'TU021', name: 'Análisis de Recursos II', level: 2, duration: '2', correlCursada: ['TU020'], correlAprobada: [] },
  { id: 'M0013', name: 'Lenguaje Musical I', level: 2, duration: 'A', correlCursada: ['M0213', 'M0210', 'TU017'], correlAprobada: ['M0213'] },
  { id: 'TU022', name: 'Producción y Análisis Musical - Sonido', level: 2, duration: 'A', correlCursada: ['M0213', 'M0210', 'TU017'], correlAprobada: ['M0213'] },
  { id: 'M0023', name: 'Tecnología I', level: 2, duration: '1', correlCursada: ['M0005'], correlAprobada: ['TU019'] },
  { id: 'TU024', name: 'Tecnología II', level: 2, duration: '2', correlCursada: ['M0023'], correlAprobada: [] },
  { id: 'TU025', name: 'Software de Grabación I', level: 2, duration: '1', correlCursada: ['M0005'], correlAprobada: ['TU019'] },
  { id: 'TU026', name: 'Software de Grabación II', level: 2, duration: '2', correlCursada: ['TU025'], correlAprobada: [] },
  { id: 'A0006', name: 'Sonido I', level: 2, duration: 'A', correlCursada: ['M0210', 'TU019'], correlAprobada: [] },

  // ── TERCER AÑO ──
  { id: 'A0012', name: 'Sonido II', level: 3, duration: 'A', correlCursada: ['A0006'], correlAprobada: [] },
  { id: 'TU027', name: 'Técnicas de Mezcla y Masterización I', level: 3, duration: '1', correlCursada: ['TU024', 'TU026'], correlAprobada: [] },
  { id: 'TU028', name: 'Técnicas de Mezcla y Masterización II', level: 3, duration: '2', correlCursada: ['TU027'], correlAprobada: [] },
  { id: 'TU029', name: 'Taller de Sonido en Vivo I', level: 3, duration: '1', correlCursada: ['TU024', 'TU021'], correlAprobada: [] },
  { id: 'TU030', name: 'Taller de Sonido en Vivo II', level: 3, duration: '2', correlCursada: ['TU029'], correlAprobada: [] },
  { id: 'A0005', name: 'Montaje y Edición I', level: 3, duration: '1', correlCursada: ['A0006'], correlAprobada: [] },
  { id: 'A0011', name: 'Montaje y Edición II', level: 3, duration: '2', correlCursada: ['A0005'], correlAprobada: [] },
  { id: 'TU031', name: 'Seminario', level: 3, duration: 'C', correlCursada: ['TU024', 'TU022', 'TU021'], correlAprobada: [] },
  { id: 'TU032', name: 'Práctica Profesional Supervisada', level: 3, duration: 'A', correlCursada: ['TU024', 'TU026', 'TU021'], correlAprobada: [] }
];

export const ELECTIVAS = {};

export const ALL = [...SUBJECTS];

export function getSubjectById(id: any) { 
  return ALL.find((s: any) => s.id === id); 
}