import { describe, expect, it } from 'vitest';
import { calcularEstadisticas } from './calcularEstadisticas';
import { CareerData } from '../entities/Materia';
import { detalleVacio } from '../entities/Progreso';

function careerDeMuestra(): CareerData {
  return {
    careerInfo: {
      id: 'carrera-test', universidad: 'Test', nombre: 'Carrera de prueba', plan: '2026',
      tituloIntermedio: '', tituloFinal: '', creditosTotales: 0,
    },
    SUBJECTS: [],
    ALL: [
      { id: 'A', name: 'Materia A', level: 1 },
      { id: 'B', name: 'Materia B', level: 1 },
      { id: 'C', name: 'Materia C', level: 1 },
      { id: 'REQ', name: 'Electiva requerida', level: 2, isElectivePlaceholder: true, targetHours: 2 },
      { id: 'E1', name: 'Electiva 1', level: 2, annualHours: 2 },
    ],
    getSubjectById: () => undefined,
  };
}

describe('calcularEstadisticas', () => {
  it('cuenta aprobadas, cursadas y cursando por separado', () => {
    const stats = calcularEstadisticas(
      { A: 'aprobada', B: 'cursada', C: 'cursando' },
      {},
      careerDeMuestra()
    );
    expect(stats.aprobadas).toBe(1);
    expect(stats.cursadas).toBe(1);
    expect(stats.cursando).toBe(1);
  });

  it('el porcentaje se calcula sobre el total (core + electivas cursadas/aprobadas), no sobre todo ALL', () => {
    // 3 materias core (A,B,C) + 1 electiva aprobada (E1) = total 4.
    // "aprobadas" cuenta cualquier no-placeholder aprobada (A y la electiva E1) => 2/4 = 50%.
    // El placeholder REQ nunca cuenta ni en el total ni en aprobadas.
    const stats = calcularEstadisticas({ A: 'aprobada', E1: 'aprobada' }, {}, careerDeMuestra());
    expect(stats.totalMaterias).toBe(4);
    expect(stats.aprobadas).toBe(2);
    expect(stats.porcentaje).toBe(50);
  });

  it('el placeholder de electiva nunca se cuenta como materia aprobada/cursada', () => {
    const stats = calcularEstadisticas({ REQ: 'aprobada' }, {}, careerDeMuestra());
    expect(stats.aprobadas).toBe(0);
  });

  it('el promedio solo considera materias aprobadas con nota final cargada', () => {
    const stats = calcularEstadisticas(
      { A: 'aprobada', B: 'aprobada', C: 'cursada' },
      {
        A: { ...detalleVacio(), notaFinal: 8 },
        B: { ...detalleVacio(), notaFinal: 6 },
        C: { ...detalleVacio(), notaFinal: 10 }, // C no está aprobada, no debe contar
      },
      careerDeMuestra()
    );
    expect(stats.promedio).toBe(7);
  });

  it('el promedio es 0 si ninguna materia aprobada tiene nota cargada', () => {
    const stats = calcularEstadisticas({ A: 'aprobada' }, {}, careerDeMuestra());
    expect(stats.promedio).toBe(0);
  });

  it('el porcentaje es 0 si el total da 0 (evita dividir por cero)', () => {
    const stats = calcularEstadisticas({}, {}, { ...careerDeMuestra(), ALL: [] });
    expect(stats.porcentaje).toBe(0);
    expect(stats.totalMaterias).toBe(0);
  });
});
