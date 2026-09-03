import { describe, expect, it } from 'vitest';
import { getPeopleForComision, searchPeople } from './mockPeople';

describe('mockPeople', () => {
  it('getPeopleForComision es determinístico para la misma materia+comisión', () => {
    const a = getPeopleForComision('materia-1', 'comision-A');
    const b = getPeopleForComision('materia-1', 'comision-A');
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThan(0);
  });

  it('distintas comisiones dan distinta lista', () => {
    const a = getPeopleForComision('materia-1', 'comision-A');
    const b = getPeopleForComision('materia-1', 'comision-B');
    expect(a).not.toEqual(b);
  });

  it('searchPeople filtra por nombre sin importar mayúsculas', () => {
    const resultados = searchPeople('agustín');
    expect(resultados.every(p => p.nombre.toLowerCase().includes('agustín'))).toBe(true);
  });
});
