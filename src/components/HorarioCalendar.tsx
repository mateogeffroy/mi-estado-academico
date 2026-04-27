'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getInhabiles } from '../lib/data/calendario'; 
import { usePlan } from '../context/PlanContext'; 

interface HorarioCalendarProps {
  horarios: Record<string, any[]>;
  isEmpty?: boolean;
  title?: React.ReactNode;
  action?: React.ReactNode;
  detalles?: any;
  materiasData?: any[]; 
}

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS_CORTOS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

const HORA_INICIO = 8; 
const HORA_FIN = 24;
const TOTAL_MINUTOS = (HORA_FIN - HORA_INICIO) * 60; 

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

// Usa la hora local para evitar el bug de Timezone
const formatDateStr = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getEventColor = (tipo: string) => {
  const t = tipo.toLowerCase();
  if (t.includes('parcial')) return '#3b82f6'; 
  if (t.includes('trabajo') || t.includes('tp') || t.includes('práctico')) return '#ef4444'; 
  if (t.includes('exposi')) return '#22c55e'; 
  return 'var(--cursando)'; 
};

export default function HorarioCalendar({ horarios, isEmpty, title, action, detalles, materiasData }: HorarioCalendarProps) {
  const router = useRouter();
  
  const { careerId } = usePlan();
  const INHABILES = getInhabiles(careerId);

  const [baseDate, setBaseDate] = useState(new Date());
  const [tappedCard, setTappedCard] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(new Date());
  const [selectedDayStr, setSelectedDayStr] = useState<string>(formatDateStr(new Date()));
  const [showLegend, setShowLegend] = useState(false);

  const monday = getMonday(baseDate);
  const datesOfWeek = DIAS.map((_, i) => addDays(monday, i));

  const handlePrevWeek = () => setBaseDate(addDays(baseDate, -7));
  const handleNextWeek = () => setBaseDate(addDays(baseDate, 7));
  const handleCurrentWeek = () => setBaseDate(new Date());

  const horasBloque = Array.from({ length: 16 }, (_, i) => i + 8);
  const lineas = Array.from({ length: 17 }, (_, i) => i + 8);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (!(e.target as Element).closest('.event-card')) {
        setTappedCard(null);
      }
    };
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const calcularPosicion = (inicio: string, fin: string) => {
    const [hIn, mIn] = inicio.split(':').map(Number);
    const [hFin, mFin] = fin.split(':').map(Number);
    const minInicio = (hIn - HORA_INICIO) * 60 + mIn;
    const minFin = (hFin - HORA_INICIO) * 60 + mFin;
    const duracion = minFin - minInicio;
    const topNum = (minInicio / TOTAL_MINUTOS) * 100;

    return { top: `${topNum}%`, height: `${(duracion / TOTAL_MINUTOS) * 100}%`, topNum };
  };

  const getColoresInhabil = (tipo: string) => {
    switch(tipo) {
      case 'feriado': return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.4)', text: '#3b82f6' }; 
      case 'finales': return { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.4)', text: '#22c55e' }; 
      case 'paro': return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.4)', text: '#ef4444' }; 
      default: return { bg: 'rgba(100, 100, 100, 0.1)', border: 'rgba(100, 100, 100, 0.4)', text: '#888' };
    }
  };

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

        /* 🔥 LEYENDA BLINDADA Y CENTRADA 🔥 */
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
          animation: legendFix 0.2s ease forwards; /* 🔥 Nueva animación exclusiva */
          cursor: default; 
          text-align: left;
        }

        /* 🔥 Animación que respeta el centrado en PC */
        @keyframes legendFix {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* 🔥 Blindaje total para celulares (evita que se vaya de la pantalla) */
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
              
              {/* 🔥 Título y Botón de Leyenda reorganizados 🔥 */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <button 
                    className={`legend-btn ${showLegend ? 'active' : ''}`} 
                    onMouseEnter={() => setShowLegend(true)} 
                    onMouseLeave={() => setShowLegend(false)}
                    onClick={() => setShowLegend(!showLegend)}
                    /* Removido el title="Simbología" nativo del navegador */
                  >
                    ?
                  </button>

                  {/* Tooltip con white-space: nowrap y flex-shrink: 0 para proteger su contenido */}
                  {showLegend && (
                    <div className="legend-tooltip" onMouseEnter={() => setShowLegend(true)} onMouseLeave={() => setShowLegend(false)}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-strong)' }}>
                        
                        <div style={{ fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '4px', whiteSpace: 'nowrap' }}>Eventos (Puntos)</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ width: '8px', height: '8px', minWidth: '8px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}/> 
                          <span style={{ whiteSpace: 'nowrap' }}>Exámenes / Parciales</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ width: '8px', height: '8px', minWidth: '8px', borderRadius: '50%', background: '#ef4444', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}/> 
                          <span style={{ whiteSpace: 'nowrap' }}>Trabajos Prácticos</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                          <div style={{ width: '8px', height: '8px', minWidth: '8px', borderRadius: '50%', background: '#22c55e', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}/> 
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
            <button onClick={handlePrevWeek} style={{ background: 'transparent', border: 'none', color: 'var(--text-strong)', padding: '8px 12px', cursor: 'pointer', borderRadius: '12px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={e => e.currentTarget.style.background='var(--glass-bg)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            
            <div className="hc-nav-text">
              <span style={{ color: 'var(--text-strong)', fontWeight: '700', fontSize: '0.95rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                {monday.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })} al {datesOfWeek[5].toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
              </span>
              <button onClick={handleCurrentWeek} style={{ background: 'none', border: 'none', color: 'var(--cursando)', fontSize: '0.75rem', cursor: 'pointer', padding: '2px 5px', fontWeight: '700', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity=0.7} onMouseOut={e => e.currentTarget.style.opacity=1}>Ir a hoy</button>
            </div>

            <button onClick={handleNextWeek} style={{ background: 'transparent', border: 'none', color: 'var(--text-strong)', padding: '8px 12px', cursor: 'pointer', borderRadius: '12px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={e => e.currentTarget.style.background='var(--glass-bg)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
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
              .custom-calendar-container { overflow-x: auto; overflow-y: hidden; }
              .calendar-inner { min-width: 800px; display: flex; flex-direction: column; }
              .calendar-header { display: grid; grid-template-columns: clamp(45px, 4vw, 60px) repeat(6, 1fr); border-bottom: 1px solid var(--border); background: var(--glass-bg); }
              .header-cell { padding: clamp(10px, 1.5vh, 15px) 0; text-align: center; font-weight: 700; font-size: clamp(0.8rem, 1vw, 0.9rem); color: var(--text-strong); border-left: 1px solid var(--glass-border); }
              .header-cell:first-child { border-left: none; }
              
              .calendar-body { display: grid; grid-template-columns: clamp(45px, 4vw, 60px) repeat(6, 1fr); position: relative; height: clamp(400px, 58vh, 750px); }
              
              .grid-lines { position: absolute; top: 0; left: clamp(45px, 4vw, 60px); right: 0; bottom: 0; display: flex; flex-direction: column; pointer-events: none; }
              .grid-line { position: absolute; left: 0; right: 0; border-top: 1px dashed var(--glass-border); }
              .time-column { position: relative; border-right: 1px solid var(--border); background: var(--glass-bg); }
              .time-label { position: absolute; width: 100%; display: flex; align-items: center; justify-content: center; font-family: 'Space Mono', monospace; font-size: clamp(0.65rem, 0.8vw, 0.75rem); color: var(--muted); background: transparent; }
              .day-column { position: relative; border-right: 1px solid var(--glass-border); }
              .day-column:last-child { border-right: none; }
              
              .event-card { position: absolute; left: 4px; right: 4px; border-radius: 8px; padding: clamp(4px, 1vh, 8px) clamp(6px, 1vw, 10px); display: flex; flex-direction: column; overflow: visible; transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease; z-index: 10; backdrop-filter: blur(4px); cursor: pointer; }
              .event-card:hover, .event-card.mobile-active { transform: scale(1.03); z-index: 30; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
              
              .schedule-tooltip { position: absolute; left: 50%; transform: translateX(-50%) translateY(5px); background: var(--panel); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 100; width: max-content; max-width: 200px; opacity: 0; visibility: hidden; transition: opacity 0.2s ease, visibility 0.2s ease; cursor: default; }
              @media (hover: hover) { .event-card:hover .schedule-tooltip { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); } }
              .event-card.mobile-active .schedule-tooltip { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); }
              @media (max-width: 768px) {
                .schedule-tooltip { position: fixed !important; left: 50% !important; top: 50% !important; bottom: auto !important; transform: translate(-50%, -50%) !important; max-width: min(280px, 88vw); border-radius: 12px; }
                .event-card.mobile-active .schedule-tooltip { transform: translate(-50%, -50%) !important; }
                .schedule-tooltip::after, .schedule-tooltip::before { display: none !important; }
              }

              .schedule-tooltip::after, .schedule-tooltip::before { content: ''; position: absolute; left: 50%; border-style: solid; }
              .tooltip-upwards { bottom: calc(100% + 8px); }
              .tooltip-upwards::after { top: 100%; margin-left: -5px; border-width: 5px 5px 0 5px; border-color: var(--panel) transparent transparent transparent; z-index: 2; }
              .tooltip-upwards::before { top: 100%; margin-left: -6px; border-width: 6px 6px 0 6px; border-color: var(--border) transparent transparent transparent; z-index: 1; }
              .tooltip-downwards { top: calc(100% + 8px); }
              .tooltip-downwards::after { bottom: 100%; margin-left: -5px; border-width: 0 5px 5px 5px; border-color: transparent transparent var(--panel) transparent; z-index: 2; }
              .tooltip-downwards::before { bottom: 100%; margin-left: -6px; border-width: 0 6px 6px 6px; border-color: transparent transparent var(--border) transparent; z-index: 1; }

              .mobile-goto-btn { display: none; width: 100%; margin-top: 12px; font-size: 0.8rem; padding: 6px 0; justify-content: center; }
              @media (max-width: 768px) { .mobile-goto-btn { display: flex; } }

              .custom-calendar-container::-webkit-scrollbar { height: 8px; }
              .custom-calendar-container::-webkit-scrollbar-track { background: var(--panel); border-radius: 0 0 16px 16px; }
              .custom-calendar-container::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
              .custom-calendar-container::-webkit-scrollbar-thumb:hover { background: var(--muted); }
              
              .inhabilitado-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 5; display: flex; align-items: center; justify-content: center; pointer-events: none; }
              .inhabilitado-badge { padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 0.75rem; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); transform: rotate(-90deg); white-space: nowrap; }
            `}</style>

            <div className="calendar-inner">
              <div className="calendar-header">
                <div className="header-cell" style={{ borderLeft: 'none', background: 'transparent' }}></div>
                {DIAS.map((dia, idx) => {
                  const dateStr = formatDateStr(datesOfWeek[idx]);
                  const isToday = dateStr === formatDateStr(new Date());
                  return (
                    <div key={dia} className="header-cell" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '6px', color: isToday ? 'var(--cursando)' : 'inherit' }}>
                      <span>{dia}</span><span style={{ fontSize: '0.85rem', fontWeight: 'normal', opacity: 0.7 }}>{datesOfWeek[idx].getDate()}</span>
                    </div>
                  );
                })}
              </div>

              <div className="calendar-body">
                <div className="grid-lines">
                  {lineas.map(h => (<div key={`line-${h}`} className="grid-line" style={{ top: `${((h - HORA_INICIO) * 60 / TOTAL_MINUTOS) * 100}%` }} />))}
                </div>
                <div className="time-column">
                  {horasBloque.map(h => (<div key={`time-${h}`} className="time-label" style={{ top: `${((h - HORA_INICIO) * 60 / TOTAL_MINUTOS) * 100}%`, height: `${(60 / TOTAL_MINUTOS) * 100}%` }}>{`${h}:00`}</div>))}
                </div>

                {DIAS.map((dia, idx) => {
                  const dateStr = formatDateStr(datesOfWeek[idx]);
                  const inhabil = INHABILES.find(i => i.fecha === dateStr);
                  const clasesHoy = horarios[dia] || [];

                  const eventosFantasma: any[] = [];
                  if (detalles && materiasData) {
                    Object.keys(detalles).forEach(matId => {
                      const evs = detalles[matId]?.eventos?.filter((ev: any) => ev.fecha === dateStr) || [];
                      if (evs.length > 0) {
                        const tieneClase = clasesHoy.some(c => c.materiaId === matId);
                        if (!tieneClase) {
                          const matData = materiasData.find((m: any) => m.id == matId);
                          const nombreLimpio = matData ? matData.name.replace(/\s*\([^)]*\)/g, '').trim() : 'Examen';
                          eventosFantasma.push({ materiaId: matId, nombreLimpio, eventos: evs });
                        }
                      }
                    });
                  }

                  return (
                    <div key={dia} className="day-column">
                      {inhabil && (() => {
                        const colores = getColoresInhabil(inhabil.tipo);
                        return (
                          <div className="inhabilitado-overlay" style={{ background: `repeating-linear-gradient(45deg, ${colores.bg}, ${colores.bg} 10px, transparent 10px, transparent 20px)`, borderLeft: `2px solid ${colores.border}` }}>
                            <div className="inhabilitado-badge" style={{ background: 'var(--panel)', border: `1px solid ${colores.border}`, color: colores.text }}>{inhabil.motivo}</div>
                          </div>
                        );
                      })()}

                      <div style={{ opacity: inhabil ? 0.3 : 1, transition: 'opacity 0.3s' }}>
                        
                        {eventosFantasma.length > 0 && (
                          <div style={{ position: 'absolute', top: '8px', left: '4px', right: '4px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 25 }}>
                            {eventosFantasma.map((fantasma, fIdx) => (
                              <div 
                                key={`ghost-${fantasma.materiaId}-${fIdx}`} 
                                className="event-card ghost-card" 
                                style={{ position: 'relative', height: 'auto', background: 'var(--panel)', border: '1px dashed #f59e0b', borderLeft: '4px solid #f59e0b', padding: '8px 10px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', cursor: 'pointer' }}
                                onClick={() => router.push(`/materia/${fantasma.materiaId}`)}
                              >
                                <div style={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'var(--text-strong)', display: 'flex', alignItems: 'center', gap: '6px', lineHeight: 1.2 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                  {fantasma.nombreLimpio}
                                </div>
                                <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                                  {fantasma.eventos.map((ev: any, i: number) => (
                                    <span key={i} style={{ fontSize: '0.65rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                      {ev.tipo}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {clasesHoy.map(clase => {
                          const { top, height, topNum } = calcularPosicion(clase.inicio, clase.fin);
                          const eventosHoy = detalles?.[clase.materiaId]?.eventos?.filter((ev: any) => ev.fecha === dateStr) || [];
                          const isNearTop = topNum < 20;

                          return (
                            <div key={clase.id} className={`event-card ${tappedCard === clase.id ? 'mobile-active' : ''}`} style={{ top, height, background: clase.colorFondo, border: `1px solid ${clase.colorBorde}`, borderLeft: `4px solid ${clase.colorBorde}` }}
                              onClick={() => {
                                if (window.innerWidth <= 768 && eventosHoy.length > 0) {
                                  if (tappedCard !== clase.id) setTappedCard(clase.id); 
                                  else router.push(`/materia/${clase.materiaId}`);
                                } else { router.push(`/materia/${clase.materiaId}`); }
                              }}
                            >
                              {eventosHoy.length > 0 && (
                                <>
                                  <div style={{ position: 'absolute', top: '6px', right: '6px', display: 'flex', gap: '4px', zIndex: 5 }}>
                                    {eventosHoy.map((ev: any, idx: number) => (<div key={idx} style={{ width: '8px', height: '8px', borderRadius: '50%', background: getEventColor(ev.tipo), boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />))}
                                  </div>
                                  <div className={`schedule-tooltip ${isNearTop ? 'tooltip-downwards' : 'tooltip-upwards'}`}>
                                    <div style={{ color: 'var(--text)', fontSize: '0.75rem', fontWeight: 'bold', borderBottom: '1px solid var(--border)', paddingBottom: '4px', marginBottom: '8px', textAlign: 'center' }}>Eventos del día</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                      {eventosHoy.map((ev: any, idx: number) => (
                                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', borderLeft: `3px solid ${getEventColor(ev.tipo)}`, paddingLeft: '8px' }}>
                                          <span style={{ fontSize: '0.65rem', color: getEventColor(ev.tipo), fontWeight: 'bold', textTransform: 'uppercase' }}>{ev.tipo}</span>
                                          <span style={{ fontSize: '0.8rem', color: 'var(--text-strong)', lineHeight: 1.2, marginTop: '2px', whiteSpace: 'normal' }}>{ev.nombre}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <button className="btn-secondary mobile-goto-btn" onClick={(e) => { e.stopPropagation(); router.push(`/materia/${clase.materiaId}`); }}>Ir a la materia &rarr;</button>
                                  </div>
                                </>
                              )}
                              <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-strong)', lineHeight: 1.2, marginBottom: 'auto', paddingRight: eventosHoy.length > 0 ? '20px' : '0' }}>{clase.materiaLimpia}</div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4px' }}>
                                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: 'var(--text-strong)', opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '4px' }}>{clase.comision}</span>
                                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: 'var(--text-strong)', opacity: 0.6, fontWeight: 'bold', flexShrink: 0 }}>{clase.inicio}-{clase.fin}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}