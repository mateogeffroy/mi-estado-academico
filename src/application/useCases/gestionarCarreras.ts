import { getCareerPrefix } from '../../lib/data/registry';
import { CarrerasRepository } from '../ports/CarrerasRepository';
import { ProgresoRepository } from '../ports/ProgresoRepository';
import { EventosRepository } from '../ports/EventosRepository';

export async function agregarCarrera(
  userId: string,
  nuevaCarreraId: string,
  carrerasActuales: string[],
  carrerasRepository: CarrerasRepository
): Promise<string[]> {
  if (carrerasActuales.includes(nuevaCarreraId)) return carrerasActuales;
  await carrerasRepository.agregarCarrera(userId, nuevaCarreraId);
  return [...carrerasActuales, nuevaCarreraId];
}

interface DependenciasBorrado {
  carrerasRepository: CarrerasRepository;
  progresoRepository: ProgresoRepository;
  eventosRepository: EventosRepository;
}

// Borrado en cascada de una carrera: materias/eventos exclusivos (por
// prefijo, ver registry.ts sobre por qué algunas carreras no tienen uno
// seguro), materias/eventos básicos compartidos de UTN si no queda otra
// carrera de UTN activa, y por último la relación usuario_carreras. Tira una
// excepción si algo falla, en vez de tragarse el error como antes de la
// Fase 0.
export async function borrarCarrera(
  userId: string,
  carreraAEliminar: string,
  todasLasCarreras: string[],
  deps: DependenciasBorrado
): Promise<string[]> {
  const prefijo = getCareerPrefix(carreraAEliminar);
  const errores: string[] = [];

  if (prefijo) {
    const { error: errMaterias } = await deps.progresoRepository.borrarPorPrefijo(userId, prefijo);
    if (errMaterias) errores.push(`materias exclusivas: ${errMaterias}`);

    const { error: errEventos } = await deps.eventosRepository.borrarPorPrefijo(userId, prefijo);
    if (errEventos) errores.push(`eventos exclusivos: ${errEventos}`);
  }

  const esUTN = carreraAEliminar.startsWith('utn-');
  const otrasCarrerasUTN = todasLasCarreras.filter((id) => id !== carreraAEliminar && id.startsWith('utn-'));

  if (esUTN && otrasCarrerasUTN.length === 0) {
    const { error: errMateriasUTN } = await deps.progresoRepository.borrarPorPrefijo(userId, 'UTN-');
    if (errMateriasUTN) errores.push(`materias UTN compartidas: ${errMateriasUTN}`);

    const { error: errEventosUTN } = await deps.eventosRepository.borrarPorPrefijo(userId, 'UTN-');
    if (errEventosUTN) errores.push(`eventos UTN compartidos: ${errEventosUTN}`);
  }

  const { error: errCarrera } = await deps.carrerasRepository.borrarCarrera(userId, carreraAEliminar);
  if (errCarrera) errores.push(`relación de carrera: ${errCarrera}`);

  if (errores.length > 0) {
    throw new Error(`No se pudo completar el borrado de la carrera: ${errores.join(' | ')}`);
  }

  return todasLasCarreras.filter((id) => id !== carreraAEliminar);
}
