import { describe, expect, it } from 'vitest';
import { evaluarCorrelatividades } from './evaluarCorrelatividades';
import { calcularEstadisticas } from './calcularEstadisticas';
import { getCareerData } from '../../lib/data/registry';

// Corre las funciones puras contra el catálogo real (no una fixture) para
// detectar cualquier diferencia de comportamiento frente a la lógica
// original de PlanContext.tsx antes de la extracción.
describe('regresión contra el catálogo real', () => {
  const career = getCareerData('utn-sistemas-2023');

  it('sin ningún progreso, solo las materias de primer nivel sin correlativas quedan disponibles', () => {
    const estados = evaluarCorrelatividades({}, career);
    expect(estados['UTN-AM1']).toBe('available'); // primer nivel, sin correlativas
    expect(estados['UTN-AM2']).toBe('disabled'); // requiere UTN-AM1 y UTN-AGA cursadas
  });

  it('aprobar todo el primer nivel habilita (como cursable) el segundo nivel', () => {
    const primerNivel = career.ALL.filter((m) => m.level === 1).map((m) => m.id);
    const estados = evaluarCorrelatividades(
      Object.fromEntries(primerNivel.map((id) => [id, 'aprobada'])),
      career
    );
    expect(estados['UTN-AM2']).toBe('available');
    expect(estados['SIS-13']).toBe('available'); // requiere SIS-5 y SIS-6 cursadas
  });

  it('calcularEstadisticas no explota con el catálogo real y da 0% sin progreso', () => {
    const stats = calcularEstadisticas({}, {}, career);
    expect(stats.porcentaje).toBe(0);
    expect(stats.totalMaterias).toBeGreaterThan(0);
  });
});
