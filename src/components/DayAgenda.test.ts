import { describe, it, expect } from 'vitest';
import { buildDayData, diaDe, formatDateStr } from './DayAgenda';

const horarios = {
  Lunes: [{ id: 'a', materiaId: '1', materiaLimpia: 'Análisis', inicio: '08:00', fin: '10:00', comision: 'K1', cuatrimestre: 'Anual' }],
  Martes: [],
};

const detalles = {
  '1': { eventos: [{ fecha: '2026-09-07', tipo: 'Parcial', nombre: '1er parcial' }] },
  '2': { eventos: [{ fecha: '2026-09-07', tipo: 'TP', nombre: 'Entrega' }] },
};

const materiasData = [{ id: '1', name: 'Análisis (Anual)' }, { id: '2', name: 'Física II (2º Cuatr.)' }];

describe('buildDayData', () => {
  it('deja como evento fantasma solo a las materias sin clase ese día', () => {
    const { clases, eventosFantasma } = buildDayData({
      dia: 'Lunes', dateStr: '2026-09-07', horarios, detalles, materiasData,
    });

    expect(clases).toHaveLength(1);
    // La materia 1 tiene clase el lunes: su parcial va como chip en la card,
    // no como card fantasma aparte. La 2 no cursa ese día, así que sí.
    expect(eventosFantasma.map(f => f.materiaId)).toEqual(['2']);
    expect(eventosFantasma[0].nombreLimpio).toBe('Física II');
  });

  it('marca el día no hábil cuando la fecha está en el calendario académico', () => {
    const inhabiles = [{ fecha: '2026-09-07', tipo: 'feriado', motivo: 'Feriado' }];
    const { inhabil } = buildDayData({ dia: 'Lunes', dateStr: '2026-09-07', horarios, inhabiles });
    expect(inhabil?.motivo).toBe('Feriado');
  });

  it('formatea la fecha en hora local, sin corrimiento de timezone', () => {
    expect(formatDateStr(new Date(2026, 8, 7))).toBe('2026-09-07');
  });
});

describe('diaDe', () => {
  it('arranca la semana en lunes y deja el domingo al final', () => {
    // 2026-09-07 fue lunes; 2026-09-13, domingo.
    expect(diaDe(new Date(2026, 8, 7))).toBe('Lunes');
    expect(diaDe(new Date(2026, 8, 12))).toBe('Sábado');
    expect(diaDe(new Date(2026, 8, 13))).toBe('Domingo');
  });
});
