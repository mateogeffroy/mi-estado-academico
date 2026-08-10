import { CareerData } from '../../domain/entities/Materia';
import { DetallesMaterias, MateriasEstado } from '../../domain/entities/Progreso';
import { evaluarCorrelatividades } from '../../domain/services/evaluarCorrelatividades';
import { calcularEstadisticas } from '../../domain/services/calcularEstadisticas';
import { CarrerasRepository } from '../ports/CarrerasRepository';
import { ProgresoRepository } from '../ports/ProgresoRepository';
import { EventosRepository } from '../ports/EventosRepository';

export type ResultadoCargaEstado =
  | { tieneCarreras: false }
  | {
      tieneCarreras: true;
      carreras: string[];
      careerIdActiva: string;
      materias: MateriasEstado;
      detalles: DetallesMaterias;
    };

interface Dependencias {
  carrerasRepository: CarrerasRepository;
  progresoRepository: ProgresoRepository;
  eventosRepository: EventosRepository;
  obtenerCareerData: (careerId: string) => CareerData;
}

// Orquesta la carga inicial del estado académico de un usuario: sus
// carreras, su progreso por materia y sus eventos, y evalúa correlatividades
// contra la carrera activa. `careerIdPreferido` es lo que haya guardado la
// UI (ej. localStorage); si no es válido, se usa la primera carrera del
// usuario — esa resolución de preferencia es la única parte que decide este
// caso de uso, el guardado de la preferencia en sí queda en la capa de UI.
export async function cargarEstadoAcademico(
  userId: string,
  careerIdPreferido: string | null,
  deps: Dependencias
): Promise<ResultadoCargaEstado> {
  const [carreras, { materias: materiasGuardadas, detalles: detallesSinEventos }, eventos] = await Promise.all([
    deps.carrerasRepository.obtenerCarrerasDeUsuario(userId),
    deps.progresoRepository.obtenerProgreso(userId),
    deps.eventosRepository.obtenerEventosDeUsuario(userId),
  ]);

  if (carreras.length === 0) return { tieneCarreras: false };

  const careerIdActiva = careerIdPreferido && carreras.includes(careerIdPreferido) ? careerIdPreferido : carreras[0];

  const detalles: DetallesMaterias = {};
  for (const materiaId of Object.keys(detallesSinEventos)) {
    detalles[materiaId] = {
      ...detallesSinEventos[materiaId],
      eventos: eventos.filter((e) => e.materiaId === materiaId),
    };
  }

  const careerData = deps.obtenerCareerData(careerIdActiva);
  const materias = evaluarCorrelatividades(materiasGuardadas, careerData);

  return { tieneCarreras: true, carreras, careerIdActiva, materias, detalles };
}

// Recalcula correlatividades + estadísticas al cambiar de carrera activa,
// sin volver a pegarle a la base (los datos ya están en memoria).
export function reevaluarParaCarrera(materias: MateriasEstado, detalles: DetallesMaterias, careerData: CareerData) {
  const materiasEvaluadas = evaluarCorrelatividades(materias, careerData);
  const stats = calcularEstadisticas(materiasEvaluadas, detalles, careerData);
  return { materias: materiasEvaluadas, stats };
}
