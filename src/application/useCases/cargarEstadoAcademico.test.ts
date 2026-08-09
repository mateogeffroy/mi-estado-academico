import { describe, expect, it, vi } from 'vitest';
import { cargarEstadoAcademico, reevaluarParaCarrera } from './cargarEstadoAcademico';
import { CareerData } from '../../domain/entities/Materia';
import { DetallesMaterias, EventoAcademico, MateriasEstado, detalleVacio } from '../../domain/entities/Progreso';
import { CarrerasRepository } from '../ports/CarrerasRepository';
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
      { id: 'B', name: 'Materia B', level: 2, correlCursada: ['A'], correlAprobada: [] },
    ],
    getSubjectById: () => undefined,
  };
}

function depsFake(config: {
  carreras: string[];
  materias?: MateriasEstado;
  detalles?: DetallesMaterias;
  eventos?: EventoAcademico[];
}) {
  const carrerasRepository: CarrerasRepository = {
    obtenerCarrerasDeUsuario: vi.fn(async () => config.carreras),
    agregarCarrera: vi.fn(),
    borrarCarrera: vi.fn(),
  };
  const progresoRepository: ProgresoRepository = {
    obtenerProgreso: vi.fn(async () => ({ materias: config.materias ?? {}, detalles: config.detalles ?? {} })),
    guardarMateria: vi.fn(),
    guardarMultiplesAprobadas: vi.fn(),
    borrarTodo: vi.fn(),
    borrarPorPrefijo: vi.fn(),
  };
  const eventosRepository: EventosRepository = {
    obtenerEventosDeUsuario: vi.fn(async () => config.eventos ?? []),
    crearEvento: vi.fn(),
    borrarEvento: vi.fn(),
    borrarTodo: vi.fn(),
    borrarPorPrefijo: vi.fn(),
  };
  return {
    carrerasRepository,
    progresoRepository,
    eventosRepository,
    obtenerCareerData: () => careerDeMuestra(),
  };
}

describe('cargarEstadoAcademico', () => {
  it('devuelve tieneCarreras: false si el usuario no tiene ninguna carrera', async () => {
    const deps = depsFake({ carreras: [] });
    const resultado = await cargarEstadoAcademico('u1', null, deps);
    expect(resultado).toEqual({ tieneCarreras: false });
  });

  it('usa la carrera preferida si es una de las del usuario', async () => {
    const deps = depsFake({ carreras: ['utn-sistemas-2023', 'utn-civil-2023'] });
    const resultado = await cargarEstadoAcademico('u1', 'utn-civil-2023', deps);
    expect(resultado.tieneCarreras && resultado.careerIdActiva).toBe('utn-civil-2023');
  });

  it('si la preferida no es válida (o no hay), cae a la primera carrera del usuario', async () => {
    const deps = depsFake({ carreras: ['utn-sistemas-2023', 'utn-civil-2023'] });

    const sinPreferida = await cargarEstadoAcademico('u1', null, deps);
    expect(sinPreferida.tieneCarreras && sinPreferida.careerIdActiva).toBe('utn-sistemas-2023');

    const preferidaInvalida = await cargarEstadoAcademico('u1', 'no-existe', deps);
    expect(preferidaInvalida.tieneCarreras && preferidaInvalida.careerIdActiva).toBe('utn-sistemas-2023');
  });

  it('evalúa correlatividades sobre las materias guardadas', async () => {
    const deps = depsFake({ carreras: ['utn-sistemas-2023'], materias: { A: 'cursando' } });
    const resultado = await cargarEstadoAcademico('u1', null, deps);
    // B requiere A cursada; con A solo "cursando" todavía debe quedar bloqueada.
    expect(resultado.tieneCarreras && resultado.materias.B).toBe('disabled');
  });

  it('mergea los eventos del usuario dentro del detalle de cada materia', async () => {
    const evento: EventoAcademico = { id: 'ev1', materiaId: 'A', nombre: '1er parcial', tipo: 'Parcial', fecha: '2026-09-01' };
    const deps = depsFake({
      carreras: ['utn-sistemas-2023'],
      detalles: { A: detalleVacio() },
      eventos: [evento],
    });

    const resultado = await cargarEstadoAcademico('u1', null, deps);

    expect(resultado.tieneCarreras && resultado.detalles.A.eventos).toEqual([evento]);
  });
});

describe('reevaluarParaCarrera', () => {
  it('recalcula materias y estadísticas sin pegarle a ningún repositorio', () => {
    const { materias, stats } = reevaluarParaCarrera({ A: 'cursando' }, {}, careerDeMuestra());
    expect(materias.B).toBe('disabled');
    expect(stats.cursando).toBe(1);
  });
});
