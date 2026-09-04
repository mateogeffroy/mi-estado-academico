'use client';

import { useRouter } from 'next/navigation';

// Colores de evento y de día no hábil. Viven acá porque los comparten el
// calendario, la home y cualquier vista que liste clases/eventos.
export const getEventColor = (tipo: string) => {
  const t = tipo.toLowerCase();
  if (t.includes('parcial')) return 'var(--cursando)';
  if (t.includes('trabajo') || t.includes('tp') || t.includes('práctico')) return 'var(--danger)';
  if (t.includes('exposi')) return 'var(--aprobada)';
  return 'var(--cursando)';
};

// Versión de fondo tenue de getEventColor, para chips/badges (no concatena
// alpha sobre un color hex porque el fallback es una custom property, no un hex).
export const getEventColorSoft = (tipo: string) => {
  const t = tipo.toLowerCase();
  if (t.includes('parcial')) return 'rgba(59, 130, 246, 0.15)';
  if (t.includes('trabajo') || t.includes('tp') || t.includes('práctico')) return 'rgba(239, 68, 68, 0.15)';
  if (t.includes('exposi')) return 'rgba(34, 197, 94, 0.15)';
  return 'rgba(59, 130, 246, 0.15)';
};

// Color del borde de la card según cuándo se cursa: verde 1º cuatrimestre,
// rojo 2º, azul anual.
export const getDuracionColor = (duracion?: string) => {
  if (duracion === '1') return 'var(--aprobada)';
  if (duracion === '2') return 'var(--danger)';
  return 'var(--cursando)';
};

export const getColoresInhabil = (tipo: string) => {
  switch (tipo) {
    case 'feriado': return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.4)', text: 'var(--cursando)' };
    case 'finales': return { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.4)', text: 'var(--aprobada)' };
    case 'paro': return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.4)', text: 'var(--danger)' };
    default: return { bg: 'rgba(100, 100, 100, 0.1)', border: 'rgba(100, 100, 100, 0.4)', text: '#888' };
  }
};

// Fecha en hora local (evita el corrimiento de timezone de toISOString()).
export const formatDateStr = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

/** Nombre del día de una fecha, con la semana arrancando en lunes. */
export const diaDe = (date: Date) => DIAS[(date.getDay() + 6) % 7]; // getDay(): 0 = domingo

interface BuildDayDataArgs {
  dia: string;
  dateStr: string;
  horarios: Record<string, any[]>;
  detalles?: any;
  materiasData?: any[];
  inhabiles?: any[];
}

// Datos de un día: clases + "eventos fantasma" (exámenes/TPs de materias que
// ese día no tienen clase agendada) + si el día es no hábil. Lo usan la grilla
// semanal, la agenda mobile y la sección "Hoy" de la home.
export const buildDayData = ({ dia, dateStr, horarios, detalles, materiasData, inhabiles = [] }: BuildDayDataArgs) => {
  const inhabil = inhabiles.find((i: any) => i.fecha === dateStr) || null;
  const clases = horarios[dia] || [];

  const eventosFantasma: any[] = [];
  if (detalles && materiasData) {
    Object.keys(detalles).forEach(matId => {
      const evs = detalles[matId]?.eventos?.filter((ev: any) => ev.fecha === dateStr) || [];
      if (evs.length > 0 && !clases.some(c => c.materiaId === matId)) {
        const matData = materiasData.find((m: any) => m.id == matId);
        const nombreLimpio = matData ? matData.name.replace(/\s*\([^)]*\)/g, '').trim() : 'Examen';
        eventosFantasma.push({ materiaId: matId, nombreLimpio, eventos: evs });
      }
    });
  }

  return { inhabil, clases, eventosFantasma };
};

interface DayAgendaProps {
  clases: any[];
  eventosFantasma?: any[];
  inhabil?: { tipo: string; motivo: string } | null;
  /** Eventos de esa materia en ese día, para mostrarlos como chips en la card. */
  eventosDeClase?: (materiaId: string) => any[];
  emptyText?: string;
}

/**
 * Lista de clases de un día como cards de alto automático: el nombre de la
 * materia wrapea completo en vez de quedar recortado en un bloque cuya altura
 * dependía de la duración de la clase.
 */
export default function DayAgenda({
  clases,
  eventosFantasma = [],
  inhabil,
  eventosDeClase,
  emptyText = 'Sin actividades.',
}: DayAgendaProps) {
  const router = useRouter();

  if (inhabil) {
    const colores = getColoresInhabil(inhabil.tipo);
    return (
      <div className="agenda-empty" style={{ background: colores.bg, border: `1px solid ${colores.border}`, color: colores.text }}>
        {inhabil.motivo}
      </div>
    );
  }

  if (clases.length === 0 && eventosFantasma.length === 0) {
    return <div className="agenda-empty">{emptyText}</div>;
  }

  const minutos = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };
  const ordenadas = [...clases].sort((a, b) => minutos(a.inicio) - minutos(b.inicio));

  return (
    <>
      {eventosFantasma.map((fantasma, fIdx) => (
        <div
          key={`ghost-${fantasma.materiaId}-${fIdx}`}
          className="agenda-item ghost"
          onClick={() => router.push(`/materia/${fantasma.materiaId}`)}
        >
          <div className="agenda-item-top">
            <span className="agenda-item-title">{fantasma.nombreLimpio}</span>
          </div>
          <div className="agenda-chips">
            {fantasma.eventos.map((ev: any, i: number) => (
              <span key={i} className="agenda-event-chip" style={{ background: 'var(--warning-soft)', color: 'var(--warning)' }}>
                {ev.tipo}
              </span>
            ))}
          </div>
        </div>
      ))}

      {ordenadas.map(clase => {
        const eventosHoy = eventosDeClase?.(clase.materiaId) || [];
        return (
          <div
            key={clase.id}
            className="agenda-item"
            style={{ borderLeftColor: getDuracionColor(clase.duracion) }}
            onClick={() => router.push(`/materia/${clase.materiaId}`)}
          >
            <div className="agenda-item-top">
              <span className="agenda-item-title">{clase.materiaLimpia}</span>
              <span className="agenda-item-time">{clase.inicio}-{clase.fin}</span>
            </div>
            <div className="agenda-item-meta">{clase.comision} · {clase.cuatrimestre}</div>
            {eventosHoy.length > 0 && (
              <div className="agenda-chips">
                {eventosHoy.map((ev: any, i: number) => (
                  <span key={i} className="agenda-event-chip" style={{ background: getEventColorSoft(ev.tipo), color: getEventColor(ev.tipo) }} title={ev.nombre}>
                    {ev.tipo}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
