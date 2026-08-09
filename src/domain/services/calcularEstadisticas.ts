import { CareerData } from '../entities/Materia';
import { DetallesMaterias, EstadisticasCarrera, MateriasEstado } from '../entities/Progreso';

// Función pura, extraída de PlanContext.tsx (Fase 2 de la auditoría).
//
// Nota: la exclusión histórica del id 'ELEC' se removió acá porque las
// entradas 'ELEC' del catálogo (utn/quimica-2008.ts, civil-2023.ts,
// mecanica-2023.ts, electrica-2023.ts, industrial-2008.ts) ya tienen
// isElectivePlaceholder: true, así que el filtro de placeholders de abajo
// ya las excluye — la condición extra era redundante, no un caso real.
export function calcularEstadisticas(
  materias: MateriasEstado,
  detalles: DetallesMaterias,
  careerData: CareerData
): EstadisticasCarrera {
  const { ALL } = careerData;
  const core = ALL.filter((s) => !s.isElectivePlaceholder && s.annualHours === undefined);
  const electivas = ALL.filter((s) => s.annualHours !== undefined);

  const aprobadas = ALL.filter((s) => materias[s.id] === 'aprobada' && !s.isElectivePlaceholder).length;
  const cursadas = ALL.filter((s) => materias[s.id] === 'cursada' && !s.isElectivePlaceholder).length;
  const cursando = ALL.filter((s) => materias[s.id] === 'cursando' && !s.isElectivePlaceholder).length;

  const total = core.length + electivas.filter((s) => ['cursada', 'aprobada'].includes(materias[s.id])).length;
  const porcentaje = total > 0 ? Math.round((aprobadas / total) * 100) : 0;

  const notas = ALL
    .filter((s) => materias[s.id] === 'aprobada' && detalles[s.id]?.notaFinal != null && !s.isElectivePlaceholder)
    .map((s) => detalles[s.id].notaFinal as number);
  const promedio = notas.length > 0 ? Number((notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2)) : 0;

  return { aprobadas, cursadas, cursando, porcentaje, promedio, totalMaterias: total };
}
