import { describe, expect, it, vi } from 'vitest';
import { agregarCarrera, borrarCarrera } from './gestionarCarreras';
import { CarrerasRepository } from '../ports/CarrerasRepository';
import { ProgresoRepository } from '../ports/ProgresoRepository';
import { EventosRepository } from '../ports/EventosRepository';

// Fakes en memoria de los tres puertos que usa el borrado en cascada.
// borrarPorPrefijo/borrarCarrera devuelven { error } en vez de tirar,
// así que los fakes por default "tienen éxito" devolviendo error: null.
function depsFake(overrides: {
  progreso?: Partial<ProgresoRepository>;
  eventos?: Partial<EventosRepository>;
  carreras?: Partial<CarrerasRepository>;
} = {}) {
  const progresoRepository: ProgresoRepository = {
    obtenerProgreso: vi.fn(async () => ({ materias: {}, detalles: {} })),
    guardarMateria: vi.fn(),
    guardarMultiplesAprobadas: vi.fn(),
    borrarTodo: vi.fn(),
    borrarPorPrefijo: vi.fn(async () => ({ error: null })),
    ...overrides.progreso,
  };
  const eventosRepository: EventosRepository = {
    obtenerEventosDeUsuario: vi.fn(async () => []),
    crearEvento: vi.fn(),
    borrarEvento: vi.fn(),
    borrarTodo: vi.fn(),
    borrarPorPrefijo: vi.fn(async () => ({ error: null })),
    ...overrides.eventos,
  };
  const carrerasRepository: CarrerasRepository = {
    obtenerCarrerasDeUsuario: vi.fn(async () => []),
    agregarCarrera: vi.fn(async () => {}),
    borrarCarrera: vi.fn(async () => ({ error: null })),
    ...overrides.carreras,
  };
  return { progresoRepository, eventosRepository, carrerasRepository };
}

describe('agregarCarrera', () => {
  it('agrega la carrera nueva y persiste', async () => {
    const { carrerasRepository } = depsFake();
    const resultado = await agregarCarrera('u1', 'utn-civil-2023', ['utn-sistemas-2023'], carrerasRepository);

    expect(resultado).toEqual(['utn-sistemas-2023', 'utn-civil-2023']);
    expect(carrerasRepository.agregarCarrera).toHaveBeenCalledWith('u1', 'utn-civil-2023');
  });

  it('no duplica ni persiste si la carrera ya estaba', async () => {
    const { carrerasRepository } = depsFake();
    const resultado = await agregarCarrera('u1', 'utn-sistemas-2023', ['utn-sistemas-2023'], carrerasRepository);

    expect(resultado).toEqual(['utn-sistemas-2023']);
    expect(carrerasRepository.agregarCarrera).not.toHaveBeenCalled();
  });
});

describe('borrarCarrera', () => {
  it('con prefijo propio y sin otra carrera UTN activa, borra también las materias UTN compartidas', async () => {
    const deps = depsFake();
    const todas = ['utn-sistemas-2023'];

    await borrarCarrera('u1', 'utn-sistemas-2023', todas, deps);

    expect(deps.progresoRepository.borrarPorPrefijo).toHaveBeenCalledWith('u1', 'SIS-');
    expect(deps.progresoRepository.borrarPorPrefijo).toHaveBeenCalledWith('u1', 'UTN-');
    expect(deps.eventosRepository.borrarPorPrefijo).toHaveBeenCalledWith('u1', 'SIS-');
    expect(deps.eventosRepository.borrarPorPrefijo).toHaveBeenCalledWith('u1', 'UTN-');
    expect(deps.carrerasRepository.borrarCarrera).toHaveBeenCalledWith('u1', 'utn-sistemas-2023');
  });

  it('con otra carrera UTN activa, NO borra las materias UTN compartidas', async () => {
    const deps = depsFake();
    const todas = ['utn-sistemas-2023', 'utn-civil-2023'];

    await borrarCarrera('u1', 'utn-sistemas-2023', todas, deps);

    expect(deps.progresoRepository.borrarPorPrefijo).toHaveBeenCalledWith('u1', 'SIS-');
    expect(deps.progresoRepository.borrarPorPrefijo).not.toHaveBeenCalledWith('u1', 'UTN-');
  });

  it('carrera sin prefijo seguro no dispara borrado por prefijo, solo la relación', async () => {
    const deps = depsFake();

    await borrarCarrera('u1', 'unlp-sistemas-2021', ['unlp-sistemas-2021'], deps);

    expect(deps.progresoRepository.borrarPorPrefijo).not.toHaveBeenCalled();
    expect(deps.eventosRepository.borrarPorPrefijo).not.toHaveBeenCalled();
    expect(deps.carrerasRepository.borrarCarrera).toHaveBeenCalledWith('u1', 'unlp-sistemas-2021');
  });

  it('devuelve la lista de carreras sin la eliminada', async () => {
    const deps = depsFake();
    const resultado = await borrarCarrera('u1', 'utn-civil-2023', ['utn-sistemas-2023', 'utn-civil-2023'], deps);
    expect(resultado).toEqual(['utn-sistemas-2023']);
  });

  it('agrega todos los errores parciales y lanza en vez de tragárselos en silencio', async () => {
    const deps = depsFake({
      progreso: { borrarPorPrefijo: vi.fn(async () => ({ error: 'timeout' })) },
      carreras: { borrarCarrera: vi.fn(async () => ({ error: 'fk violation' })) },
    });

    await expect(borrarCarrera('u1', 'utn-sistemas-2023', ['utn-sistemas-2023'], deps)).rejects.toThrow(/timeout/);
    await expect(borrarCarrera('u1', 'utn-sistemas-2023', ['utn-sistemas-2023'], deps)).rejects.toThrow(/fk violation/);
  });
});
