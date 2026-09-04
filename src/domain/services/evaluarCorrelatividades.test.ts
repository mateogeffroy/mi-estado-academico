import { describe, expect, it } from 'vitest';
import { evaluarCorrelatividades } from './evaluarCorrelatividades';
import { CareerData } from '../entities/Materia';
import { MateriasEstado } from '../entities/Progreso';

const ELECTIVA_1 = { id: 'E1', name: 'Electiva 1', annualHours: 2, correlCursada: [], correlAprobada: [] };
const ELECTIVA_2 = { id: 'E2', name: 'Electiva 2', annualHours: 2, correlCursada: [], correlAprobada: [] };

function careerDeMuestra(overrides: Partial<CareerData> = {}): CareerData {
  return {
    careerInfo: {
      id: 'carrera-test', universidad: 'Test', nombre: 'Carrera de prueba', plan: '2026',
      tituloIntermedio: '', tituloFinal: '', creditosTotales: 0,
    },
    SUBJECTS: [],
    // ALL replica cómo lo arman los archivos de catálogo reales: SUBJECTS + electivas aplanadas.
    ALL: [
      { id: 'A', name: 'Materia A', level: 1, correlCursada: [], correlAprobada: [] },
      { id: 'B', name: 'Materia B', level: 2, correlCursada: ['A'], correlAprobada: [] },
      { id: 'C', name: 'Materia C', level: 3, correlCursada: [], correlAprobada: ['B'] },
      { id: 'REQ', name: 'Electiva requerida', level: 3, isElectivePlaceholder: true, targetHours: 4, correlCursada: [], correlAprobada: [] },
      ELECTIVA_1,
      ELECTIVA_2,
    ],
    // Las electivas cuentan para el placeholder solo si están en ELECTIVAS, igual que en el catálogo real.
    ELECTIVAS: { 3: [ELECTIVA_1, ELECTIVA_2] },
    getSubjectById: () => undefined,
    ...overrides,
  };
}

describe('evaluarCorrelatividades', () => {
  it('deja disponible una materia sin correlativas', () => {
    const resultado = evaluarCorrelatividades({}, careerDeMuestra());
    expect(resultado.A).toBe('available');
  });

  it('bloquea una materia cuya correlativa de cursada no está cursada ni aprobada', () => {
    const resultado = evaluarCorrelatividades({}, careerDeMuestra());
    expect(resultado.B).toBe('disabled');
  });

  it('desbloquea B apenas A queda cursada', () => {
    const resultado = evaluarCorrelatividades({ A: 'cursada' }, careerDeMuestra());
    expect(resultado.B).toBe('available');
  });

  it('exige aprobada (no alcanza con cursada) para correlAprobada', () => {
    const conBCursada = evaluarCorrelatividades({ A: 'cursada', B: 'cursada' }, careerDeMuestra());
    expect(conBCursada.C).toBe('disabled');

    const conBAprobada = evaluarCorrelatividades({ A: 'aprobada', B: 'aprobada' }, careerDeMuestra());
    expect(conBAprobada.C).toBe('available');
  });

  it('no pisa un estado que el usuario ya llevó más allá de "available" (cursando/aprobada)', () => {
    const resultado = evaluarCorrelatividades({ A: 'cursada', B: 'cursando' }, careerDeMuestra());
    expect(resultado.B).toBe('cursando');
  });

  it('propaga en cascada: aprobar A debe eventualmente habilitar C vía B', () => {
    // B todavía no está cursada/aprobada, así que C sigue bloqueada aunque A esté aprobada.
    const resultado = evaluarCorrelatividades({ A: 'aprobada' }, careerDeMuestra());
    expect(resultado.B).toBe('available');
    expect(resultado.C).toBe('disabled');
  });

  it('el placeholder de electiva pasa a cursando cuando se acumulan las horas requeridas vía cursadas (sin final aprobado)', () => {
    const resultado = evaluarCorrelatividades({ E1: 'cursada', E2: 'cursada' }, careerDeMuestra());
    expect(resultado.REQ).toBe('cursando');
  });

  it('el placeholder de electiva pasa a aprobada cuando se acumulan las horas anuales requeridas vía aprobadas', () => {
    const resultado = evaluarCorrelatividades({ E1: 'aprobada', E2: 'aprobada' }, careerDeMuestra());
    expect(resultado.REQ).toBe('aprobada');
  });

  it('el placeholder de electiva pasa a cursando con progreso parcial (todavía no junta las horas)', () => {
    const resultado = evaluarCorrelatividades({ E1: 'cursada' }, careerDeMuestra());
    expect(resultado.REQ).toBe('cursando');
  });

  it('el placeholder de electiva sigue "available" sin ningún progreso', () => {
    const resultado = evaluarCorrelatividades({}, careerDeMuestra());
    expect(resultado.REQ).toBe('available');
  });

  it('no cuenta horas de electivas de OTRO nivel para completar el placeholder', () => {
    const carrera = careerDeMuestra({
      ALL: [
        { id: 'REQ3', name: 'Electiva requerida 3°', level: 3, isElectivePlaceholder: true, targetHours: 4, correlCursada: [], correlAprobada: [] },
        { id: 'REQ4', name: 'Electiva requerida 4°', level: 4, isElectivePlaceholder: true, targetHours: 6, correlCursada: [], correlAprobada: [] },
        { id: 'E4A', name: 'Electiva 4to A', level: 4, annualHours: 2, correlCursada: [], correlAprobada: [] },
      ],
      ELECTIVAS: { 4: [{ id: 'E4A', name: 'Electiva 4to A', annualHours: 2, correlCursada: [], correlAprobada: [] }] },
    });

    // Aprobar la única electiva de 4to (2hs) no debe completar ni el bloque
    // de 3° (target 4, sin electivas propias con progreso) ni el de 4°
    // (target 6, todavía falta): antes, sumar todo junto disparaba "aprobada"
    // de rebote.
    const resultado = evaluarCorrelatividades({ E4A: 'aprobada' }, carrera);
    expect(resultado.REQ3).toBe('available');
    expect(resultado.REQ4).toBe('cursando');
  });

  it('es determinística: correr dos veces el mismo estado da el mismo resultado', () => {
    const inicial: MateriasEstado = { A: 'aprobada', B: 'cursada' };
    const una = evaluarCorrelatividades(inicial, careerDeMuestra());
    const dos = evaluarCorrelatividades(una, careerDeMuestra());
    expect(dos).toEqual(una);
  });
});
