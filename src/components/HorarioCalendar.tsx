'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INHABILES } from '../lib/data/calendario';

interface HorarioCalendarProps {
  horarios: Record<string, any[]>;
  isEmpty?: boolean;
  title?: React.ReactNode;
  action?: React.ReactNode;
}

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
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

const formatDateStr = (date: Date) => {
  return date.toISOString().split('T')[0]; 
};

export default function HorarioCalendar({ horarios, isEmpty, title, action }: HorarioCalendarProps) {
  const [baseDate, setBaseDate] = useState(new Date());

  const monday = getMonday(baseDate);
  const datesOfWeek = DIAS.map((_, i) => addDays(monday, i));

  const handlePrevWeek = () => setBaseDate(addDays(baseDate, -7));
  const handleNextWeek = () => setBaseDate(addDays(baseDate, 7));
  const handleCurrentWeek = () => setBaseDate(new Date());

  const horasBloque = Array.from({ length: 16 }, (_, i) => i + 8);
  const lineas = Array.from({ length: 17 }, (_, i) => i + 8);

  const calcularPosicion = (inicio: string, fin: string) => {
    const [hIn, mIn] = inicio.split(':').map(Number);
    const [hFin, mFin] = fin.split(':').map(Number);
    const minInicio = (hIn - HORA_INICIO) * 60 + mIn;
    const minFin = (hFin - HORA_INICIO) * 60 + mFin;
    const duracion = minFin - minInicio;

    return {
      top: `${(minInicio / TOTAL_MINUTOS) * 100}%`,
      height: `${(duracion / TOTAL_MINUTOS) * 100}%`
    };
  };

  const getColoresInhabil = (tipo: string) => {
    switch(tipo) {
      case 'feriado': return { bg: 'rgba(59, 130, 246, 0.05)', border: 'rgba(59, 130, 246, 0.3)', text: '#3b82f6' }; 
      case 'finales': return { bg: 'rgba(34, 197, 94, 0.05)', border: 'rgba(34, 197, 94, 0.3)', text: '#22c55e' }; 
      case 'paro': return { bg: 'rgba(239, 68, 68, 0.05)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' }; 
      default: return { bg: 'rgba(100, 100, 100, 0.05)', border: 'rgba(100, 100, 100, 0.3)', text: '#888' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <style>{`
        .hc-header-wrapper { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
        .hc-title-box { flex: 1 1 0%; display: flex; justify-content: flex-start; min-width: max-content; }
        .hc-nav-box { display: flex; align-items: center; background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 6px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .hc-nav-text { display: flex; flex-direction: column; align-items: center; padding: 0 20px; min-width: 200px; }
        .hc-action-box { flex: 1 1 0%; display: flex; justify-content: flex-end; min-width: max-content; }
        
        /* 📱 ESTILOS MÓVILES PARA CENTRAR TODO 📱 */
        @media (max-width: 768px) {
          .hc-header-wrapper { flex-direction: column; justify-content: center; gap: 14px; }
          .hc-title-box { justify-content: center; flex: none; width: 100%; min-width: auto; }
          .hc-nav-box { width: 100%; max-width: 340px; justify-content: space-between; }
          .hc-nav-text { min-width: auto; padding: 0 10px; }
          .hc-action-box { justify-content: center; flex: none; width: 100%; min-width: auto; }
        }
      `}</style>

      {/* 🔥 ENCABEZADO UNIFICADO: Título, Navegación y Toggle 🔥 */}
      <div className="hc-header-wrapper">
        <div className="hc-title-box">
          {title}
        </div>

        {/* Iterador de semanas mejorado */}
        <div className="hc-nav-box">
          <button onClick={handlePrevWeek} style={{ background: 'transparent', border: 'none', color: 'var(--text-strong)', padding: '8px 12px', cursor: 'pointer', borderRadius: '12px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={e => e.currentTarget.style.background='var(--glass-bg)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>

          <div className="hc-nav-text">
            <span style={{ color: 'var(--text-strong)', fontWeight: '800', fontSize: '0.95rem', textAlign: 'center' }}>
              {monday.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })} al {datesOfWeek[5].toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
            </span>
            <button onClick={handleCurrentWeek} style={{ background: 'none', border: 'none', color: 'var(--cursando)', fontSize: '0.75rem', cursor: 'pointer', padding: '2px 5px', fontWeight: '800', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity=0.7} onMouseOut={e => e.currentTarget.style.opacity=1}>Ir a hoy</button>
          </div>

          <button onClick={handleNextWeek} style={{ background: 'transparent', border: 'none', color: 'var(--text-strong)', padding: '8px 12px', cursor: 'pointer', borderRadius: '12px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={e => e.currentTarget.style.background='var(--glass-bg)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        <div className="hc-action-box">
          {action}
        </div>
      </div>

      {isEmpty ? (
        <div style={{ padding: '40px', textAlign: 'center', background: 'var(--panel)', borderRadius: '20px', border: '1px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5"><path d="M21 10V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
          <div style={{ color: 'var(--text-strong)', fontWeight: 'bold', fontSize: '1.1rem' }}>Tu horario está vacío</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: '400px', lineHeight: 1.5 }}>
            Para visualizar tu grilla acá, andá a <strong>Plan de Estudios</strong> y marcá las materias que estás haciendo como "Cursando".
          </div>
          <Link href="/plan" style={{ textDecoration: 'none', marginTop: '10px' }}>
            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Ir al Plan de Estudios</button>
          </Link>
        </div>
      ) : (
        <div className="custom-calendar-container">
          <style>{`
          .custom-calendar-container { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; overflow-x: auto; overflow-y: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.15); }
          .calendar-inner { min-width: 800px; display: flex; flex-direction: column; border-radius: 16px; }
          .calendar-header { display: grid; grid-template-columns: clamp(45px, 4vw, 60px) repeat(6, 1fr); border-bottom: 1px solid var(--border); background: var(--glass-bg); border-top-left-radius: 16px; border-top-right-radius: 16px; }
          .header-cell { padding: clamp(10px, 1.5vh, 15px) 0; text-align: center; font-weight: 700; font-size: clamp(0.8rem, 1vw, 0.9rem); color: var(--text-strong); border-left: 1px solid var(--glass-border); }
          .header-cell:first-child { border-left: none; border-top-left-radius: 16px; }
          .header-cell:last-child { border-top-right-radius: 16px; }
          
          .calendar-body { display: grid; grid-template-columns: clamp(45px, 4vw, 60px) repeat(6, 1fr); position: relative; height: clamp(400px, 58vh, 750px); border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; }
          
          .grid-lines { position: absolute; top: 0; left: clamp(45px, 4vw, 60px); right: 0; bottom: 0; display: flex; flex-direction: column; pointer-events: none; }
          .grid-line { position: absolute; left: 0; right: 0; border-top: 1px dashed var(--glass-border); }
          .time-column { position: relative; border-right: 1px solid var(--border); background: var(--glass-bg); border-bottom-left-radius: 16px; }
          .time-label { 
            position: absolute; width: 100%; display: flex; align-items: center; justify-content: center;
            font-family: 'Space Mono', monospace; font-size: clamp(0.65rem, 0.8vw, 0.75rem); 
            color: var(--muted); background: transparent;
          }
          .day-column { position: relative; border-right: 1px solid var(--glass-border); }
          .day-column:last-child { border-right: none; border-bottom-right-radius: 16px; }
          
          .event-card { position: absolute; left: 4px; right: 4px; border-radius: 8px; padding: clamp(4px, 1vh, 8px) clamp(6px, 1vw, 10px); display: flex; flex-direction: column; overflow: hidden; transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease; z-index: 10; backdrop-filter: blur(4px); }
          .event-card:hover { transform: scale(1.03); z-index: 20; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
          .custom-calendar-container::-webkit-scrollbar { height: 8px; }
          .custom-calendar-container::-webkit-scrollbar-track { background: var(--panel); border-radius: 0 0 16px 16px; }
          .custom-calendar-container::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
          .custom-calendar-container::-webkit-scrollbar-thumb:hover { background: var(--muted); }
          .inhabilitado-overlay {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            z-index: 5; display: flex; align-items: center; justify-content: center; pointer-events: none;
          }
          .inhabilitado-badge {
            padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 0.75rem; 
            text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); transform: rotate(-90deg); white-space: nowrap;
          }
        `}</style>

          <div className="calendar-inner">
            <div className="calendar-header">
              <div className="header-cell" style={{ borderLeft: 'none', background: 'transparent' }}></div>
              {DIAS.map((dia, idx) => {
              const dateStr = formatDateStr(datesOfWeek[idx]);
              const isToday = dateStr === formatDateStr(new Date());
              return (
                <div key={dia} className="header-cell" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '6px', color: isToday ? 'var(--cursando)' : 'inherit' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'normal', opacity: 0.7 }}>{dia}</span>
                  <span>{datesOfWeek[idx].getDate()}</span>
                </div>
              );
            })}
            </div>

            <div className="calendar-body">
              <div className="grid-lines">
                {lineas.map(h => (
                  <div key={`line-${h}`} className="grid-line" style={{ top: `${((h - HORA_INICIO) * 60 / TOTAL_MINUTOS) * 100}%` }} />
                ))}
              </div>

              <div className="time-column">
                {horasBloque.map(h => (
                  <div 
                    key={`time-${h}`} 
                    className="time-label" 
                    style={{ 
                      top: `${((h - HORA_INICIO) * 60 / TOTAL_MINUTOS) * 100}%`,
                      height: `${(60 / TOTAL_MINUTOS) * 100}%` 
                    }}
                  >
                    {`${h}:00`}
                  </div>
                ))}
              </div>

              {DIAS.map((dia, idx) => {
                const dateStr = formatDateStr(datesOfWeek[idx]);
                const inhabil = INHABILES.find(i => i.fecha === dateStr);

                return (
                  <div key={dia} className="day-column">
                    {inhabil && (() => {
                      const colores = getColoresInhabil(inhabil.tipo);
                      return (
                        <div className="inhabilitado-overlay" style={{
                          background: `repeating-linear-gradient(45deg, ${colores.bg}, ${colores.bg} 10px, transparent 10px, transparent 20px)`,
                          borderLeft: `2px solid ${colores.border}`
                        }}>
                          <div className="inhabilitado-badge" style={{ background: 'var(--panel)', border: `1px solid ${colores.border}`, color: colores.text }}>
                            {inhabil.motivo}
                          </div>
                        </div>
                      );
                    })()}

                    <div style={{ opacity: inhabil ? 0.3 : 1, transition: 'opacity 0.3s' }}>
                      {horarios[dia]?.map(clase => {
                        const { top, height } = calcularPosicion(clase.inicio, clase.fin);
                        return (
                          <Link href={`/materia/${clase.materiaId}`} key={clase.id} className="event-card" style={{ top, height, background: clase.colorFondo, border: `1px solid ${clase.colorBorde}`, borderLeft: `4px solid ${clase.colorBorde}`, textDecoration: 'none' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-strong)', lineHeight: 1.2, marginBottom: 'auto' }}>
                              {clase.materiaLimpia}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4px' }}>
                              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: 'var(--text-strong)', opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '4px' }}>{clase.comision}</span>
                              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: 'var(--text-strong)', opacity: 0.6, fontWeight: 'bold', flexShrink: 0 }}>{clase.inicio}-{clase.fin}</span>
                            </div>
                          </Link>
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
  );
}