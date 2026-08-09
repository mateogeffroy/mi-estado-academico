import { describe, expect, it } from 'vitest';
import { calcularDesbloqueos } from './calcularDesbloqueos';
import { CareerData } from '../entities/Materia';

function careerDeMuestra(): CareerData {
  return {
    careerInfo: {
      id: 'carrera-test', universidad: 'Test', nombre: 'Carrera de prueba', plan: '2026',
      tituloIntermedio: '', tituloFinal: '', creditosTotales: 0,
    },
    SUBJECTS: [],
    ALL: [
      { id: 'A', name: 'Materia A', level: 1, correlCursada: [], correlAprobada: [] },
      // B requiere A cursada
      { id: 'B', name: 'Materia B', level: 2, correlCursada: ['A'], correlAprobada: [] },
      // C requiere A aprobada (no alcanza con cursada)
      { id: 'C', name: 'Materia C', level: 2, correlCursada: [], correlAprobada: ['A'] },
      // D requiere A y B cursadas
      { id: 'D', name: 'Materia D', level: 3, correlCursada: ['A', 'B'], correlAprobada: [] },
    ],
    getSubjectById: () => undefined,
  };
}

describe('calcularDesbloqueos', () => {
  it('detecta lo que se destraba con solo cursar la materia', () => {
    const { siCursada } = calcularDesbloqueos('A', { A: 'cursando' }, careerDeMuestra());
    expect(siCursada.map((m) => m.id)).toEqual(['B']);
  });

  it('separa lo que necesita aprobada de lo que ya alcanza con cursada', () => {
    const { siCursada, siAprobadaAdicional } = calcularDesbloqueos('A', { A: 'cursando' }, careerDeMuestra());
    expect(siCursada.map((m) => m.id)).toEqual(['B']);
    // C requiere A aprobada, no alcanza con cursada, así que aparece solo en el adicional.
    expect(siAprobadaAdicional.map((m) => m.id)).toEqual(['C']);
  });

  it('no repite en el adicional lo que ya se destraba con cursada', () => {
    const { siCursada, siAprobadaAdicional } = calcularDesbloqueos('A', { A: 'cursando' }, careerDeMuestra());
    const enAmbos = siCursada.map((m) => m.id).filter((id) => siAprobadaAdicional.map((m) => m.id).includes(id));
    expect(enAmbos).toEqual([]);
  });

  it('para una materia ya cursada, siCursada da vacío (B ya estaba destrabada por la cursada previa) y solo C es nuevo al aprobar', () => {
    const { siCursada, siAprobadaAdicional } = calcularDesbloqueos('A', { A: 'cursada' }, careerDeMuestra());
    expect(siCursada).toEqual([]);
    expect(siAprobadaAdicional.map((m) => m.id)).toEqual(['C']);
  });

  it('no incluye materias que ya están en curso, cursadas o aprobadas', () => {
    const { siCursada } = calcularDesbloqueos('A', { A: 'cursando', B: 'cursando' }, careerDeMuestra());
    expect(siCursada.map((m) => m.id)).not.toContain('B');
  });

  it('encadena correctamente: D necesita A y B, no se destraba solo con A', () => {
    const { siCursada } = calcularDesbloqueos('A', { A: 'cursando' }, careerDeMuestra());
    expect(siCursada.map((m) => m.id)).not.toContain('D');
  });

  it('devuelve vacío si no hay nada para destrabar', () => {
    const soloD = {
      careerInfo: { id: 't', universidad: 'T', nombre: 'T', plan: '', tituloIntermedio: '', tituloFinal: '', creditosTotales: 0 },
      SUBJECTS: [],
      ALL: [{ id: 'X', name: 'Materia X', level: 1, correlCursada: [], correlAprobada: [] }],
      getSubjectById: () => undefined,
    };
    const { siCursada, siAprobadaAdicional } = calcularDesbloqueos('X', { X: 'cursando' }, soloD);
    expect(siCursada).toEqual([]);
    expect(siAprobadaAdicional).toEqual([]);
  });
});
