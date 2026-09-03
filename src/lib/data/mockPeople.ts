export interface MockPerson {
  id: string;
  nombre: string;
  iniciales: string;
  relacion: 'amigo' | 'companero' | 'ninguno';
  carrera: string;
}

const NOMBRES = [
  'Agustín Torres', 'Valentina Rodríguez', 'Bruno Fernández', 'Camila López',
  'Santiago Gómez', 'Martina Díaz', 'Lucas Martínez', 'Sofía Pérez',
  'Mateo Sánchez', 'Emma Romero', 'Joaquín Álvarez', 'Julieta García',
  'Benjamín Ruiz', 'Delfina Flores', 'Tomás Acosta', 'Catalina Suárez',
  'Facundo Molina', 'Isabella Ortiz', 'Nicolás Castro', 'Renata Silva',
  'Federico Vega', 'Abril Medina', 'Ignacio Herrera', 'Victoria Núñez',
  'Ramiro Aguirre', 'Lucía Cabrera', 'Emiliano Ríos', 'Antonella Paz',
  'Franco Godoy', 'Milagros Luna', 'Gonzalo Peralta', 'Zoe Campos',
  'Matías Reyes', 'Pilar Vargas', 'Thiago Ibarra', 'Morena Contreras',
  'Dante Sosa', 'Amparo Leiva', 'Rodrigo Correa', 'Alma Benítez',
];

const CARRERAS = [
  'Ing. en Sistemas', 'Ing. Civil', 'Ing. Industrial', 'Ing. Mecánica',
  'Ing. Química', 'Ing. Eléctrica', 'Lic. en Computación', 'Lic. en Informática',
];

// Hash simple djb2 → semilla determinística por string.
const hash = (str: string) => {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h;
};

// LCG mulberry32: generador pseudoaleatorio determinístico a partir de una semilla.
const mulberry32 = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const getInitials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');

const buildPerson = (nombre: string, rand: () => number): MockPerson => {
  const r = rand();
  const relacion = r < 0.2 ? 'amigo' : r < 0.7 ? 'companero' : 'ninguno';
  return {
    id: nombre,
    nombre,
    iniciales: getInitials(nombre),
    relacion,
    carrera: CARRERAS[Math.floor(rand() * CARRERAS.length)],
  };
};

// Misma materia+comisión siempre devuelve la misma lista (sin persistir nada).
export const getPeopleForComision = (materiaId: string, comisionId: string): MockPerson[] => {
  const rand = mulberry32(hash(`${materiaId}:${comisionId}`));
  const cantidad = 4 + Math.floor(rand() * 6); // 4 a 9 personas
  const pool = [...NOMBRES];
  const elegidos: string[] = [];
  for (let i = 0; i < cantidad && pool.length > 0; i++) {
    const idx = Math.floor(rand() * pool.length);
    elegidos.push(pool.splice(idx, 1)[0]);
  }
  return elegidos.map(nombre => buildPerson(nombre, rand));
};

// Pool completo para la búsqueda global, con relación/carrera fijas (semilla constante).
const TODAS_LAS_PERSONAS: MockPerson[] = (() => {
  const rand = mulberry32(hash('pool-global'));
  return NOMBRES.map(nombre => buildPerson(nombre, rand));
})();

export const searchPeople = (query: string): MockPerson[] => {
  const q = query.trim().toLowerCase();
  if (!q) return TODAS_LAS_PERSONAS;
  return TODAS_LAS_PERSONAS.filter(p => p.nombre.toLowerCase().includes(q));
};
