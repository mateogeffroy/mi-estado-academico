import { CareerData } from '../entities/Materia';
import { MateriasEstado } from '../entities/Progreso';

type EstadoPlaceholder = 'available' | 'cursando' | 'aprobada';

// Recalcula qué materias quedan disponibles/bloqueadas según las
// correlatividades cumplidas y, para las carreras que usan electivas por
// nivel (ver CareerData.ELECTIVAS), qué placeholder de electiva queda
// cursando/aprobada según las horas anuales acumuladas EN SU PROPIO NIVEL
// (cada placeholder solo cuenta las electivas de su `level`, nunca las de
// otros niveles — sumarlas todas juntas hacía que aprobar una sola electiva
// de 4to completara de rebote el bloque con horas "prestadas" de 3ro/5to).
//
// Función pura: no llama a React ni a Supabase, así que es testeable sin
// mocks. Extraída de PlanContext.tsx (Fase 2 de la auditoría).
export function evaluarCorrelatividades(estadosActuales: MateriasEstado, careerData: CareerData): MateriasEstado {
  const { ALL, ELECTIVAS } = careerData;
  const estados: MateriasEstado = { ...estadosActuales };
  let huboCambios = true;

  while (huboCambios) {
    huboCambios = false;

    ALL.forEach((materia) => {
      const id = materia.id;
      const estadoActual = estados[id];

      if (materia.isElectivePlaceholder) {
        const objetivo = materia.targetHours ?? 10;
        const electivasDelNivel = ELECTIVAS?.[materia.level ?? -1] ?? [];
        let horasAprobadas = 0;
        let horasEnProgreso = 0;
        electivasDelNivel.forEach((electiva) => {
          if (estados[electiva.id] === 'aprobada') horasAprobadas += electiva.annualHours || 0;
          else if (['cursada', 'cursando'].includes(estados[electiva.id] ?? '')) horasEnProgreso += electiva.annualHours || 0;
        });

        let nuevoEstado: EstadoPlaceholder = 'available';
        if (horasAprobadas >= objetivo) nuevoEstado = 'aprobada';
        else if (horasAprobadas + horasEnProgreso > 0) nuevoEstado = 'cursando';
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
