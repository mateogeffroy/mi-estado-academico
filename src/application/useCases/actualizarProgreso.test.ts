import { describe, expect, it, vi } from 'vitest';
import { cambiarEstadoMateria, actualizarDetalleMateria, marcarMultiplesAprobadas, reiniciarProgreso } from './actualizarProgreso';
import { CareerData } from '../../domain/entities/Materia';
import { DetalleMateria, DetallesMaterias, EstadoMateria, MateriasEstado, detalleVacio } from '../../domain/entities/Progreso';
import { ProgresoRepository } from '../ports/ProgresoRepository';
import { EventosRepository } from '../ports/EventosRepository';

function careerDeMuestra(): CareerData {
  return {
    careerInfo: {
      id: 'carrera-test', universidad: 'Test', nombre: 'Carrera de prueba', plan: '2026',
      tituloIntermedio: '', tituloFinal: '', creditosTotales: 0,
    },
    SUBJECTS: [],
    ALL: [
      { id: 'A', name: 'Materia A', level: 1, correlCursada: [], correlAprobada: [] },
      // B se destraba recién cuando A queda cursada.
      { id: 'B', name: 'Materia B', level: 2, correlCursada: ['A'], correlAprobada: [] },
    ],
    getSubjectById: () => undefined,
  };
}

// Fake en memoria del puerto ProgresoRepository: registra las llamadas para
// poder aserirlas, sin pegarle a Supabase.
interface LlamadaGuardarMateria {
  userId: string;
  materiaId: string;
  estado: EstadoMateria;
  detalle: DetalleMateria;
}

function progresoRepositoryFake(overrides: Partial<ProgresoRepository> = {}): ProgresoRepository & { llamadas: LlamadaGuardarMateria[] } {
  const llamadas: LlamadaGuardarMateria[] = [];
  return {
    llamadas,
    obtenerProgreso: vi.fn(async () => ({ materias: {}, detalles: {} })),
    guardarMateria: vi.fn(async (userId, materiaId, estado, detalle) => {
      llamadas.push({ userId, materiaId, estado, detalle });
    }),
    guardarMultiplesAprobadas: vi.fn(async () => {}),
    borrarTodo: vi.fn(async () => {}),
    borrarPorPrefijo: vi.fn(async () => ({ error: null })),
    ...overrides,
  };
}

describe('cambiarEstadoMateria', () => {
  it('cycle_cursada: de available pasa a cursando', async () => {
    const repo = progresoRepositoryFake();
    const { materias } = await cambiarEstadoMateria('u1', 'A', 'cycle_cursada', {}, {}, careerDeMuestra(), repo);
    expect(materias.A).toBe('cursando');
  });

  it('cycle_cursada: de cursando pasa a cursada', async () => {
    const repo = progresoRepositoryFake();
    const { materias } = await cambiarEstadoMateria('u1', 'A', 'cycle_cursada', { A: 'cursando' }, {}, careerDeMuestra(), repo);
    expect(materias.A).toBe('cursada');
  });

  it('cycle_cursada: de cursada vuelve a available (no queda en aprobada)', async () => {
    const repo = progresoRepositoryFake();
    const { materias } = await cambiarEstadoMateria('u1', 'A', 'cycle_cursada', { A: 'cursada' }, {}, careerDeMuestra(), repo);
    expect(materias.A).toBe('available');
  });

  it('toggle_aprobada alterna entre aprobada y available', async () => {
    const repo = progresoRepositoryFake();
    const primero = await cambiarEstadoMateria('u1', 'A', 'toggle_aprobada', {}, {}, careerDeMuestra(), repo);
    expect(primero.materias.A).toBe('aprobada');

    const segundo = await cambiarEstadoMateria('u1', 'A', 'toggle_aprobada', primero.materias, {}, careerDeMuestra(), repo);
    expect(segundo.materias.A).toBe('available');
  });

  it('reevalúa correlatividades: dejar A como cursada destraba B', async () => {
    const repo = progresoRepositoryFake();
    const { materias } = await cambiarEstadoMateria('u1', 'A', 'set_cursada', {}, {}, careerDeMuestra(), repo);
    expect(materias.B).toBe('available');
  });

  it('persiste el nuevo estado a través del repositorio', async () => {
    const repo = progresoRepositoryFake();
    await cambiarEstadoMateria('u1', 'A', 'cycle_cursada', {}, {}, careerDeMuestra(), repo);
    expect(repo.llamadas).toEqual([{ userId: 'u1', materiaId: 'A', estado: 'cursando', detalle: detalleVacio() }]);
  });

  it('propaga el error si falla el guardado, en vez de dejar el estado inconsistente', async () => {
    const repo = progresoRepositoryFake({
      guardarMateria: vi.fn(async () => { throw new Error('falló la red'); }),
    });
    await expect(cambiarEstadoMateria('u1', 'A', 'cycle_cursada', {}, {}, careerDeMuestra(), repo)).rejects.toThrow('falló la red');
  });
});

describe('actualizarDetalleMateria', () => {
  it('actualiza el detalle de la materia sin tocar su estado', async () => {
    const repo = progresoRepositoryFake();
    const detalles: DetallesMaterias = { A: detalleVacio() };
    const nuevoDetalle = { ...detalleVacio(), comision: 'S12' };

    const resultado = await actualizarDetalleMateria('u1', 'A', nuevoDetalle, { A: 'cursando' }, detalles, careerDeMuestra(), repo);

    expect(resultado.detalles.A.comision).toBe('S12');
    expect(repo.llamadas).toEqual([{ userId: 'u1', materiaId: 'A', estado: 'cursando', detalle: nuevoDetalle }]);
  });
});

describe('marcarMultiplesAprobadas', () => {
  it('marca aprobadas todas las materias indicadas', async () => {
    const guardarMultiplesAprobadas = vi.fn(async () => {});
    const repo = progresoRepositoryFake({ guardarMultiplesAprobadas });
    const materias: MateriasEstado = { A: 'cursando', B: 'disabled' };

    const { materias: resultado } = await marcarMultiplesAprobadas('u1', ['A', 'B'], materias, {}, careerDeMuestra(), repo);

    // B estaba disabled (bloqueada por correlativas): no se fuerza a aprobada.
    expect(resultado.A).toBe('aprobada');
    expect(resultado.B).not.toBe('aprobada');
    expect(guardarMultiplesAprobadas).toHaveBeenCalledWith('u1', ['A', 'B']);
  });
});

describe('reiniciarProgreso', () => {
  it('borra el progreso y los eventos del usuario', async () => {
    const progresoRepository = progresoRepositoryFake();
    const eventosRepository: EventosRepository = {
      obtenerEventosDeUsuario: vi.fn(async () => []),
      crearEvento: vi.fn(),
      borrarEvento: vi.fn(),
      borrarTodo: vi.fn(async () => {}),
      borrarPorPrefijo: vi.fn(async () => ({ error: null })),
    };

    await reiniciarProgreso('u1', progresoRepository, eventosRepository);

    expect(progresoRepository.borrarTodo).toHaveBeenCalledWith('u1');
    expect(eventosRepository.borrarTodo).toHaveBeenCalledWith('u1');
  });
});
