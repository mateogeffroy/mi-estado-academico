import { CareerData, Materia } from '../entities/Materia';
import { MateriasEstado } from '../entities/Progreso';
import { evaluarCorrelatividades } from './evaluarCorrelatividades';

export interface Desbloqueos {
  // Materias que pasan a disponibles apenas la materia consultada queda cursada.
  siCursada: Materia[];
  // Materias adicionales (no incluidas en siCursada) que recién se destraban
  // cuando la materia consultada queda aprobada, no solo cursada.
  siAprobadaAdicional: Materia[];
}

// Para una materia 'cursando' o 'cursada', calcula qué otras materias
// pasarían de bloqueadas a disponibles si esta se marcara como cursada y/o
// aprobada. Reutiliza evaluarCorrelatividades (el mismo motor que ya corre
// en producción) en vez de reimplementar la lógica de dependencias hacia
// adelante, para que el hint nunca pueda desincronizarse del comportamiento
// real de la app.
export function calcularDesbloqueos(
  materiaId: string,
  materiasActuales: MateriasEstado,
  careerData: CareerData
): Desbloqueos {
  // Baseline evaluada de verdad (no el estado crudo): así "recién se
  // destraba" significa realmente "no estaba available antes y ahora sí",
  // no solo "no tenía todavía un estado guardado".
  const actual = evaluarCorrelatividades(materiasActuales, careerData);

  const nuevosDisponibles = (estadoHipotetico: 'cursada' | 'aprobada') => {
    const hipotetico = evaluarCorrelatividades({ ...materiasActuales, [materiaId]: estadoHipotetico }, careerData);
    return careerData.ALL.filter((materia) => {
      if (materia.id === materiaId) return false;
      const yaDestrabada = actual[materia.id] && actual[materia.id] !== 'disabled';
      return !yaDestrabada && hipotetico[materia.id] === 'available';
    });
  };

  const siCursada = nuevosDisponibles('cursada');
  const idsSiCursada = new Set(siCursada.map((m) => m.id));
  const siAprobadaAdicional = nuevosDisponibles('aprobada').filter((m) => !idsSiCursada.has(m.id));

  return { siCursada, siAprobadaAdicional };
}
