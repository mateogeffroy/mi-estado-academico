import { CareerData } from '../../domain/entities/Materia';
import { DetalleMateria, DetallesMaterias, EstadoMateria, MateriasEstado, detalleVacio } from '../../domain/entities/Progreso';
import { evaluarCorrelatividades } from '../../domain/services/evaluarCorrelatividades';
import { calcularEstadisticas } from '../../domain/services/calcularEstadisticas';
import { ProgresoRepository } from '../ports/ProgresoRepository';
import { EventosRepository } from '../ports/EventosRepository';

export type AccionMateria = 'cycle_cursada' | 'toggle_aprobada' | `set_${EstadoMateria}`;

function siguienteEstado(actual: EstadoMateria, accion: AccionMateria): EstadoMateria {
  if (accion === 'cycle_cursada') {
    return actual === 'cursando' ? 'cursada' : actual === 'cursada' ? 'available' : 'cursando';
  }
  if (accion === 'toggle_aprobada') {
    return actual === 'aprobada' ? 'available' : 'aprobada';
  }
  return accion.replace('set_', '') as EstadoMateria;
}

interface ResultadoProgreso {
  materias: MateriasEstado;
  stats: ReturnType<typeof calcularEstadisticas>;
}

// Cambia el estado de una materia (cursando/cursada/aprobada/...), reevalúa
// correlatividades y estadísticas, y persiste. Si la persistencia falla, se
// propaga el error para que la UI pueda avisar en vez de quedar con un
// estado local que nunca se guardó (gap que señaló la auditoría de Fase 0).
export async function cambiarEstadoMateria(
  userId: string,
  materiaId: string,
  accion: AccionMateria,
  materias: MateriasEstado,
  detalles: DetallesMaterias,
  careerData: CareerData,
  progresoRepository: ProgresoRepository
): Promise<ResultadoProgreso> {
  const actual = materias[materiaId] || 'available';
  const nuevoEstado = siguienteEstado(actual, accion);

  const materiasEvaluadas = evaluarCorrelatividades({ ...materias, [materiaId]: nuevoEstado }, careerData);
  const stats = calcularEstadisticas(materiasEvaluadas, detalles, careerData);

  await progresoRepository.guardarMateria(userId, materiaId, materiasEvaluadas[materiaId], detalles[materiaId] ?? detalleVacio());

  return { materias: materiasEvaluadas, stats };
}

// Actualiza el detalle de una materia (nota, dificultad, comisión, horarios
// custom) sin cambiar su estado de progreso.
export async function actualizarDetalleMateria(
  userId: string,
  materiaId: string,
  nuevoDetalle: DetalleMateria,
  materias: MateriasEstado,
  detalles: DetallesMaterias,
  careerData: CareerData,
  progresoRepository: ProgresoRepository
): Promise<{ detalles: DetallesMaterias; stats: ReturnType<typeof calcularEstadisticas> }> {
  const detallesActualizados = { ...detalles, [materiaId]: nuevoDetalle };
  const stats = calcularEstadisticas(materias, detallesActualizados, careerData);

  await progresoRepository.guardarMateria(userId, materiaId, materias[materiaId] ?? 'available', nuevoDetalle);

  return { detalles: detallesActualizados, stats };
}

export async function marcarMultiplesAprobadas(
  userId: string,
  materiaIds: string[],
  materias: MateriasEstado,
  detalles: DetallesMaterias,
  careerData: CareerData,
  progresoRepository: ProgresoRepository
): Promise<ResultadoProgreso> {
  const conAprobadas = { ...materias };
  for (const id of materiaIds) {
    if (conAprobadas[id] !== 'disabled') conAprobadas[id] = 'aprobada';
  }
  const materiasEvaluadas = evaluarCorrelatividades(conAprobadas, careerData);
  const stats = calcularEstadisticas(materiasEvaluadas, detalles, careerData);

  await progresoRepository.guardarMultiplesAprobadas(userId, materiaIds);

  return { materias: materiasEvaluadas, stats };
}

export async function reiniciarProgreso(userId: string, progresoRepository: ProgresoRepository, eventosRepository: EventosRepository): Promise<void> {
  await progresoRepository.borrarTodo(userId);
  await eventosRepository.borrarTodo(userId);
}
