'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getInhabiles } from '../lib/data/calendario';
import { usePlan } from '../context/PlanContext';
import DayAgenda, { buildDayData, diaDe, formatDateStr, getEventColor, getColoresInhabil } from './DayAgenda';

interface HorarioCalendarProps {
  horarios: Record<string, any[]>;
  isEmpty?: boolean;
  title?: React.ReactNode;
  action?: React.ReactNode;
  detalles?: any;
  materiasData?: any[]; 
}

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS_CORTOS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

const getMonday = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); 
  return new Date(date.setDate(diff));
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export default function HorarioCalendar({ horarios, isEmpty, title, action, detalles, materiasData }: HorarioCalendarProps) {
  const router = useRouter();
  
  const { careerId } = usePlan();
  const INHABILES = getInhabiles(careerId);

  // Día marcado por las flechas. Las columnas quedan siempre en el mismo
  // orden (lunes a domingo): lo que se mueve es esta marca, y la semana
  // mostrada es la que contiene al día marcado.
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(new Date());
  const [selectedDayStr, setSelectedDayStr] = useState<string>(formatDateStr(new Date()));
  const [showLegend, setShowLegend] = useState(false);

  const hoyStr = formatDateStr(new Date());
  const selectedStr = formatDateStr(selectedDate);

  const monday = getMonday(selectedDate);
  const datesOfWeek = Array.from({ length: 7 }, (_, i) => addDays(monday, i));

  const desplazar = (dias: number) => setSelectedDate(addDays(selectedDate, dias));
  const handleCurrentWeek = () => setSelectedDate(new Date());

  // Datos de un día de la semana visible. La lógica vive en DayAgenda para
  // que la comparta la sección "Hoy" de la home.
  const dayData = (idx: number) => {
    const date = datesOfWeek[idx];
    const dia = diaDe(date);
    const dateStr = formatDateStr(date);
    return {
      dia,
      dateStr,
      isToday: dateStr === hoyStr,
      isSelected: dateStr === selectedStr,
      ...buildDayData({ dia, dateStr, horarios, detalles, materiasData, inhabiles: INHABILES }),
    };
  };

  // Eventos de una materia en un día puntual, para los chips de la card.
  const eventosDeClase = (dateStr: string) => (materiaId: string) =>
    detalles?.[materiaId]?.eventos?.filter((ev: any) => ev.fecha === dateStr) || [];

  const getEventsForDate = (dateStr: string) => {
    const dayEvents: any[] = [];
    if (detalles && materiasData) {
      Object.keys(detalles).forEach(matId => {
        const evs = detalles[matId]?.eventos?.filter((ev: any) => ev.fecha === dateStr) || [];
        if (evs.length > 0) {
          const matData = materiasData.find((m: any) => m.id == matId);
          const nombreLimpio = matData ? matData.name.replace(/\s*\([^)]*\)/g, '').trim() : 'Examen';
          evs.forEach((ev: any) => {
            dayEvents.push({ ...ev, materiaNombre: nombreLimpio, materiaId: matId });
          });
        }
      });
    }
    return dayEvents;
  };

  const currentYear = modalDate.getFullYear();
  const currentMonth = modalDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const startDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1; 
  
  const modalDays = [];
  
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    modalDays.push({ day: prevMonthDays - i, month: currentMonth - 1, year: currentYear, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    modalDays.push({ day: i, month: currentMonth, year: currentYear, isCurrentMonth: true });
  }
  const remainder = modalDays.length % 7;
  if (remainder !== 0) {
    const nextDays = 7 - remainder;
    for (let i = 1; i <= nextDays; i++) {
      modalDays.push({ day: i, month: currentMonth + 1, year: currentYear, isCurrentMonth: false });
    }
  }

  const selectedEvents = getEventsForDate(selectedDayStr);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <style>{`
        .calendar-window {
          display: flex;
          flex-direction: column;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: var(--panel);
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          overflow: hidden; 
        }

        .hc-header-wrapper { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          flex-wrap: wrap; 
          gap: 15px; 
          padding: 12px 20px; 
          border-bottom: 1px solid var(--border); 
          background: transparent; 
        }

        .hc-title-box { flex: 1 1 0%; display: flex; justify-content: flex-start; min-width: max-content; }
        .hc-nav-box { display: flex; align-items: center; justify-content: center; }
        .hc-nav-text { display: flex; flex-direction: column; align-items: center; padding: 0 20px; min-width: 200px; }
        .hc-action-box { flex: 1 1 0%; display: flex; justify-content: flex-end; min-width: max-content; }
        
        .calendar-btn { background: transparent; border: none; color: var(--text-strong); padding: 8px; cursor: pointer; border-radius: 12px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; margin-left: 5px; }
        .calendar-btn:hover { background: var(--glass-bg); color: var(--cursando); }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px; opacity: 0; visibility: hidden; transition: all 0.3s ease; }
        .modal-overlay.open { opacity: 1; visibility: visible; }
        .calendar-modal { background: var(--bg); border: 1px solid var(--border); border-radius: 20px; width: 100%; max-width: 420px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); display: flex; flex-direction: column; transform: translateY(20px) scale(0.95); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .modal-overlay.open .calendar-modal { transform: translateY(0) scale(1); }
        .cm-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: var(--panel); border-bottom: 1px solid var(--border); border-radius: 20px 20px 0 0; }
        .cm-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; padding: 20px 20px 10px 20px; }
        .cm-day-name { text-align: center; font-size: 0.75rem; color: var(--muted); font-weight: bold; text-transform: uppercase; }
        .cm-day { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 6px; border-radius: 12px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; font-weight: 600; font-size: 0.9rem; color: var(--text-strong); }
        .cm-day:hover { background: var(--glass-hover); border-color: var(--border); }
        
        .cm-day.ghost { opacity: 0.35; }
        .cm-day.selected { border-color: var(--cursando) !important; background: rgba(59, 130, 246, 0.1) !important; color: var(--cursando); opacity: 1; }
        .cm-day.today { background: var(--cursando) !important; color: #fff !important; box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3); border-color: transparent !important; opacity: 1; }
        
        .cm-dots { display: flex; gap: 3px; margin-top: auto; padding-bottom: 6px; flex-wrap: wrap; justify-content: center; width: 80%; }
        .cm-dot { width: 6px; height: 6px; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
        .cm-events-list { padding: 10px 20px 20px 20px; max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }

        .legend-btn { 
          background: transparent; 
          color: var(--muted); 
          border: 1px solid var(--border); 
          border-radius: 50%; 
          width: 24px; 
          height: 24px; 
          min-width: 24px; 
          padding: 0;
          font-weight: bold; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 0.75rem; 
          transition: all 0.2s; 
          margin-right: 10px; 
        }
        .legend-btn:hover, .legend-btn.active { 
          color: var(--text-strong); 
          border-color: var(--text-strong); 
          background: var(--glass-bg); 
        }
        .legend-tooltip { 
          position: absolute; 
          bottom: calc(100% + 12px); 
          left: 50%; 
          transform: translateX(-50%); 
          background: var(--panel); 
          border: 1px solid var(--border); 
          border-radius: 12px; 
          padding: 16px; 
          width: max-content; 
          max-width: none; 
          box-shadow: 0 10px 40px rgba(0,0,0,0.6); 
          z-index: 100000; 
          animation: legendFix 0.2s ease forwards; 
          cursor: default; 
          text-align: left;
        }

        @keyframes legendFix {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        @media (max-width: 600px) {
          .legend-tooltip {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            bottom: auto !important;
            right: auto !important;
            transform: translate(-50%, -50%) !important;
            animation: none !important;
            max-width: min(300px, 90vw);
          }
          .legend-tooltip::after, .legend-tooltip::before { display: none !important; }
        }

        @keyframes legendFixMobile {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .legend-tooltip::after { 
          content: ''; 
          position: absolute; 
          top: 100%; 
          left: 50%; 
          margin-left: -6px; 
          border-width: 6px 6px 0 6px; 
          border-style: solid; 
          border-color: var(--panel) transparent transparent transparent; 
          z-index: 2; 
        }
        .legend-tooltip::before { 
          content: ''; 
          position: absolute; 
          top: 100%; 
          left: 50%; 
          margin-left: -7px; 
          border-width: 7px 7px 0 7px; 
          border-style: solid; 
          border-color: var(--border) transparent transparent transparent; 
          z-index: 1; 
        }

        @media (max-width: 768px) {
          .hc-header-wrapper { flex-direction: column; justify-content: center; gap: 14px; }
          .hc-title-box { justify-content: center; flex: none; width: 100%; min-width: auto; }
          .hc-nav-box { width: 100%; max-width: 380px; justify-content: space-between; }
          .hc-nav-text { min-width: auto; padding: 0 10px; }
          .hc-action-box { justify-content: center; flex: none; width: 100%; min-width: auto; }
        }
      `}</style>

      {/* --- MODAL DEL CALENDARIO --- */}
      <div className={`modal-overlay ${isModalOpen ? 'open' : ''}`} onClick={() => setIsModalOpen(false)}>
        <div className="calendar-modal" onClick={e => e.stopPropagation()}>
          <div className="cm-header">
            <button onClick={() => setModalDate(new Date(currentYear, currentMonth - 1, 1))} style={{ background: 'transparent', border: 'none', color: 'var(--text-strong)', cursor: 'pointer', padding: '5px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-strong)', textTransform: 'capitalize' }}>{MESES[currentMonth]}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 'bold' }}>{currentYear}</span>
            </div>
            <button onClick={() => setModalDate(new Date(currentYear, currentMonth + 1, 1))} style={{ background: 'transparent', border: 'none', color: 'var(--text-strong)', cursor: 'pointer', padding: '5px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>

          <div className="cm-grid">
            {DIAS_CORTOS.map(d => <div key={d} className="cm-day-name">{d}</div>)}
            {modalDays.map((diaObj, idx) => {
              const cellDate = new Date(diaObj.year, diaObj.month, diaObj.day);
              const dateStr = formatDateStr(cellDate);
              const isToday = dateStr === formatDateStr(new Date());
              const isSelected = dateStr === selectedDayStr;
              const evs = getEventsForDate(dateStr);
              
              const inhabilInfo = INHABILES.find((i: any) => i.fecha === dateStr);
              const inhabilStyle = inhabilInfo ? getColoresInhabil(inhabilInfo.tipo) : null;

              return (
                <div 
                  key={idx} 
                  className={`cm-day ${isToday ? 'today' : ''} ${isSelected && !isToday ? 'selected' : ''} ${!diaObj.isCurrentMonth ? 'ghost' : ''}`}
                  onClick={() => {
                    setSelectedDayStr(dateStr);
                    if (!diaObj.isCurrentMonth) setModalDate(new Date(diaObj.year, diaObj.month, 1));
                  }}
                  title={inhabilInfo ? inhabilInfo.motivo : ''}
                  style={inhabilStyle && !isToday && !isSelected ? { 
                    backgroundColor: inhabilStyle.bg, 
                    borderColor: inhabilStyle.border, 
                    color: inhabilStyle.text 
                  } : {}}
                >
                  {diaObj.day}
                  {evs.length > 0 && (
                    <div className="cm-dots">
                      {evs.map((e, i) => (
                        <div key={`dot-${i}`} className="cm-dot" style={{ background: isToday ? '#fff' : getEventColor(e.tipo) }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ padding: '0 20px 10px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <button 
                    className={`legend-btn ${showLegend ? 'active' : ''}`} 
                    onMouseEnter={() => setShowLegend(true)} 
                    onMouseLeave={() => setShowLegend(false)}
                    onClick={() => setShowLegend(!showLegend)}
                  >
                    ?
                  </button>

                  {showLegend && (
                    <div className="legend-tooltip" onMouseEnter={() => setShowLegend(true)} onMouseLeave={() => setShowLegend(false)}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-strong)' }}>
                        
                        <div style={{ fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '4px', whiteSpace: 'nowrap' }}>Eventos (Puntos)</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ width: '8px', height: '8px', minWidth: '8px', borderRadius: '50%', background: 'var(--cursando)', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}/>
                          <span style={{ whiteSpace: 'nowrap' }}>Exámenes / Parciales</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ width: '8px', height: '8px', minWidth: '8px', borderRadius: '50%', background: 'var(--danger)', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}/>
                          <span style={{ whiteSpace: 'nowrap' }}>Trabajos Prácticos</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                          <div style={{ width: '8px', height: '8px', minWidth: '8px', borderRadius: '50%', background: 'var(--aprobada)', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}/>
                          <span style={{ whiteSpace: 'nowrap' }}>Exposiciones</span>
                        </div>
                        
                        <div style={{ fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '4px', whiteSpace: 'nowrap' }}>Días No Hábiles (Fondo)</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ width: '14px', height: '14px', minWidth: '14px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.4)', flexShrink: 0 }}/> 
                          <span style={{ whiteSpace: 'nowrap' }}>Feriados</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ width: '14px', height: '14px', minWidth: '14px', borderRadius: '4px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.4)', flexShrink: 0 }}/> 
                          <span style={{ whiteSpace: 'nowrap' }}>Mesas de Finales</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '14px', height: '14px', minWidth: '14px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', flexShrink: 0 }}/> 
                          <span style={{ whiteSpace: 'nowrap' }}>Paros</span>
                        </div>

                      </div>
                    </div>
                  )}
                </div>

                <h4 style={{ margin: 0, color: 'var(--text-strong)', fontSize: '0.9rem' }}>
                  Eventos del {selectedDayStr.split('-').reverse().join('/')}
                </h4>
              </div>

              <button onClick={() => { setModalDate(new Date()); setSelectedDayStr(formatDateStr(new Date())); }} style={{ background: 'none', border: 'none', color: 'var(--cursando)', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
                Ir a hoy
              </button>
            </div>
          </div>

          <div className="cm-events-list custom-scrollbar">
            {selectedEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                Sin eventos agendados para este día.
              </div>
            ) : (
              selectedEvents.map((ev, i) => (
                <div key={i} onClick={() => { setIsModalOpen(false); router.push(`/materia/${ev.materiaId}`); }} style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'var(--panel)', border: '1px solid var(--border)', borderLeft: `4px solid ${getEventColor(ev.tipo)}`, borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = getEventColor(ev.tipo)} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <div style={{ fontSize: '0.7rem', color: getEventColor(ev.tipo), fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>{ev.tipo}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-strong)', marginBottom: '4px' }}>{ev.materiaNombre}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{ev.nombre}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* --------------------------------- */}

      {/* ACÁ EMPIEZA LA VENTANA UNIFICADA */}
      <div className="calendar-window">
        
        {/* LA BARRA DE TÍTULO */}
        <div className="hc-header-wrapper">
          <div className="hc-title-box">{title}</div>
          <div className="hc-nav-box">
            <button className="calendar-btn" onClick={() => desplazar(-7)} title="Semana anterior">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="11 18 5 12 11 6"></polyline><polyline points="18 18 12 12 18 6"></polyline></svg>
            </button>
            <button className="calendar-btn" onClick={() => desplazar(-1)} title="Día anterior">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>

            <div className="hc-nav-text">
              <span style={{ color: 'var(--text-strong)', fontWeight: '700', fontSize: '0.95rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                {datesOfWeek[0].toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })} al {datesOfWeek[6].toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
              </span>
              <button onClick={handleCurrentWeek} style={{ background: 'none', border: 'none', color: 'var(--cursando)', fontSize: '0.75rem', cursor: 'pointer', padding: '2px 5px', fontWeight: '700', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity='0.7'} onMouseOut={e => e.currentTarget.style.opacity='1'}>Ir a hoy</button>
            </div>

            <button className="calendar-btn" onClick={() => desplazar(1)} title="Día siguiente">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
            <button className="calendar-btn" onClick={() => desplazar(7)} title="Semana siguiente">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="13 18 19 12 13 6"></polyline><polyline points="6 18 12 12 6 6"></polyline></svg>
            </button>

            <div style={{ height: '24px', width: '1px', background: 'var(--border)', margin: '0 5px' }}></div>
            <button className="calendar-btn" onClick={() => setIsModalOpen(true)} title="Ver mes completo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </button>

          </div>
          <div className="hc-action-box">{action}</div>
        </div>

        {/* EL CONTENIDO DE LA VENTANA */}
        {isEmpty ? (
          <div style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5"><path d="M21 10V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
            <div style={{ color: 'var(--text-strong)', fontWeight: 'bold', fontSize: '1.1rem' }}>Tu horario está vacío</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: '400px', lineHeight: 1.5 }}>Para visualizar tu grilla acá, andá a <strong>Plan de Estudios</strong> y marcá las materias que estás haciendo como "Cursando".</div>
            <Link href="/plan" style={{ textDecoration: 'none', marginTop: '10px' }}><button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Ir al Plan de Estudios</button></Link>
          </div>
        ) : (
          <div className="custom-calendar-container">
            <style>{`
              .custom-calendar-container { overflow: visible; }

              /* Semana en columnas (desktop) vs agenda día por día (mobile).
                 Las clases se listan como cards de alto automático en ambas,
                 así que el nombre de la materia nunca queda cortado. */
              .agenda-view { display: none; }
              @media (max-width: 768px) {
                .week-view { display: none; }
                .agenda-view { display: flex; flex-direction: column; gap: 16px; padding: 16px; }
              }

              .agenda-day-tabs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; }
              .agenda-tab { flex: 1 0 auto; min-width: 44px; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 6px; border-radius: 12px; border: 1px solid var(--border); background: var(--glass-bg); color: var(--muted); cursor: pointer; transition: all 0.2s; }
              .agenda-tab-day { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
              .agenda-tab-date { font-size: 0.9rem; font-weight: 700; font-family: 'Space Mono', monospace; }
              .agenda-tab-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--cursando); }
              .agenda-tab.active { background: var(--cursando); border-color: var(--cursando); color: #fff; }
              .agenda-tab.today:not(.active) { border-color: var(--cursando); color: var(--cursando); }
            `}</style>

            {/* --- SEMANA EN COLUMNAS (desktop / tablet) --- */}
            <div className="week-columns week-view">
              {datesOfWeek.map((date, idx) => {
                const { dia, dateStr, isToday, isSelected, inhabil, clases, eventosFantasma } = dayData(idx);
                return (
                  <div key={dateStr} className={`week-col ${isSelected ? 'selected' : ''}`}>
                    <div className={`week-col-header ${isToday ? 'today' : ''}`}>
                      <span className="week-col-day">{dia}</span>
                      <span className="week-col-date">{date.getDate()}</span>
                    </div>
                    <DayAgenda
                      clases={clases}
                      eventosFantasma={eventosFantasma}
                      inhabil={inhabil}
                      eventosDeClase={eventosDeClase(dateStr)}
                    />
                  </div>
                );
              })}
            </div>

            {/* --- AGENDA MOBILE: un día por vez, elegido con los tabs --- */}
            <div className="agenda-view">
              <div className="agenda-day-tabs">
                {datesOfWeek.map(date => {
                  const dia = diaDe(date);
                  const dateStr = formatDateStr(date);
                  const tieneItems = (horarios[dia] && horarios[dia].length > 0) || getEventsForDate(dateStr).length > 0;
                  return (
                    <button
                      key={dateStr}
                      className={`agenda-tab ${dateStr === selectedStr ? 'active' : ''} ${dateStr === hoyStr ? 'today' : ''}`}
                      onClick={() => setSelectedDate(date)}
                    >
                      <span className="agenda-tab-day">{DIAS_CORTOS[DIAS.indexOf(dia)]}</span>
                      <span className="agenda-tab-date">{date.getDate()}</span>
                      {tieneItems && <span className="agenda-tab-dot" />}
                    </button>
                  );
                })}
              </div>

              {(() => {
                // El día marcado siempre cae dentro de la semana mostrada
                // (la semana se calcula a partir de él); el guard es por las dudas.
                const diaIdx = Math.max(0, datesOfWeek.findIndex(d => formatDateStr(d) === selectedStr));
                const { dateStr, inhabil, clases, eventosFantasma } = dayData(diaIdx);
                return (
                  <DayAgenda
                    clases={clases}
                    eventosFantasma={eventosFantasma}
                    inhabil={inhabil}
                    eventosDeClase={eventosDeClase(dateStr)}
                  />
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}