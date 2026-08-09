import { CareerData } from '../entities/Materia';
import { MateriasEstado } from '../entities/Progreso';

type EstadoPlaceholder = 'available' | 'cursada' | 'aprobada';

// Recalcula qué materias quedan disponibles/bloqueadas según las
// correlatividades cumplidas y, para las carreras que usan electivas por
// nivel (ver CareerData.ELECTIVAS), qué placeholder de electiva queda
// cursada/aprobada según las horas anuales acumuladas.
//
// Función pura: no llama a React ni a Supabase, así que es testeable sin
// mocks. Extraída de PlanContext.tsx (Fase 2 de la auditoría).
export function evaluarCorrelatividades(estadosActuales: MateriasEstado, careerData: CareerData): MateriasEstado {
  const { ALL, ELECTIVAS } = careerData;
  const estados: MateriasEstado = { ...estadosActuales };
  let huboCambios = true;

  while (huboCambios) {
    huboCambios = false;
    let horasAprobadasElectivas = 0;
    let horasCursadasElectivas = 0;

    if (ELECTIVAS) {
      Object.values(ELECTIVAS).flat().forEach((electiva) => {
        if (estados[electiva.id] === 'aprobada') horasAprobadasElectivas += electiva.annualHours || 0;
        else if (estados[electiva.id] === 'cursada') horasCursadasElectivas += electiva.annualHours || 0;
      });
    }

    ALL.forEach((materia) => {
      const id = materia.id;
      const estadoActual = estados[id];

      if (materia.isElectivePlaceholder) {
        const objetivo = materia.targetHours ?? 10;
        let nuevoEstado: EstadoPlaceholder = 'available';
        if (horasAprobadasElectivas >= objetivo) nuevoEstado = 'aprobada';
        else if (horasAprobadasElectivas + horasCursadasElectivas >= objetivo) nuevoEstado = 'cursada';
        if (estadoActual !== nuevoEstado) {
          estados[id] = nuevoEstado;
          huboCambios = true;
        }
        return;
      }

      const requisitosCursadaOk = materia.correlCursada?.every((reqId) => ['cursada', 'aprobada'].includes(estados[reqId])) ?? true;
      const requisitosAprobadaOk = materia.correlAprobada?.every((reqId) => estados[reqId] === 'aprobada') ?? true;
      const cumple = requisitosCursadaOk && requisitosAprobadaOk;

      if (!cumple && estadoActual !== 'disabled') {
        estados[id] = 'disabled';
        huboCambios = true;
      } else if (cumple && (estadoActual === 'disabled' || !estadoActual)) {
        estados[id] = 'available';
        huboCambios = true;
      }
    });
  }

  return estados;
}
