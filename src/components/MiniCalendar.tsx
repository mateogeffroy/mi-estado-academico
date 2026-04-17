'use client';

import React, { useState, useEffect } from 'react';

interface MiniCalendarProps {
  detalles: any;
  ALL: any[];
}

export default function MiniCalendar({ detalles, ALL }: MiniCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date());
  const [hoveredDayData, setHoveredDayData] = useState<{ day: number, events: string[] } | null>(null);
  
  // 1. Detectamos si es un dispositivo táctil para cambiar el comportamiento
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Verificamos si el dispositivo soporta eventos táctiles
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

    // Cerramos el globo si se toca fuera del calendario en el celular
    const handleClickOutside = () => setHoveredDayData(null);
    document.addEventListener('click', handleClickOutside);
    
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const realToday = new Date();
  const isCurrentMonth = realToday.getMonth() === currentMonth && realToday.getFullYear() === currentYear;
  const currentDay = isCurrentMonth ? realToday.getDate() : null;

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const nombreMesActual = `${meses[currentMonth]} ${currentYear}`;
  
  const diasDelMes = new Date(currentYear, currentMonth + 1, 0).getDate();
  const primerDiaDelMes = new Date(currentYear, currentMonth, 1).getDay();
  const diasMesAnterior = new Date(currentYear, currentMonth, 0).getDate();

  const totalCeldas = Math.ceil((primerDiaDelMes + diasDelMes) / 7) * 7;
  const diasSiguientes = totalCeldas - (primerDiaDelMes + diasDelMes);

  const eventosPorDia: Record<number, string[]> = {};
  Object.keys(detalles || {}).forEach(materiaId => {
    const detalleMateria = detalles[materiaId];
    if (detalleMateria?.eventos) {
      const materiaData = ALL.find((m: any) => m.id == materiaId);
      detalleMateria.eventos.forEach((ev: any) => {
        const [evYear, evMonth, evDay] = ev.fecha.split('-');
        if (parseInt(evYear) === currentYear && parseInt(evMonth) - 1 === currentMonth) {
          const dia = parseInt(evDay);
          if (!eventosPorDia[dia]) eventosPorDia[dia] = [];
          eventosPorDia[dia].push(`${materiaData?.name || 'Materia'}|${ev.tipo}|${ev.nombre}`); 
        }
      });
    }
  });

  const handlePrevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

  const getDayStyles = (esHoy: boolean, eventosDelDia: string[] | undefined) => {
    const colorParcial = 'var(--cal-parcial, rgba(59, 130, 246, 0.25))'; 
    const colorTP = 'var(--cal-tp, rgba(239, 68, 68, 0.25))'; 
    const colorExpo = 'var(--cal-expo, rgba(34, 197, 94, 0.25))'; 
    
    let background = 'transparent';
    let borderColor = 'transparent';

    if (eventosDelDia) {
      const tipos = eventosDelDia.map(e => e.split('|')[1].toLowerCase());
      if (tipos.some(t => t.includes('parcial'))) {
        background = colorParcial;
      } else if (tipos.some(t => t.includes('trabajo') || t.includes('tp') || t.includes('práctico'))) {
        background = colorTP;
      } else if (tipos.some(t => t.includes('exposi'))) {
        background = colorExpo;
      } else {
        background = 'var(--glass-bg)'; 
      }
    }

    if (esHoy) borderColor = 'var(--cursando)';

    return { background, borderColor };
  };

  const getEventTextColor = (tipo: string) => {
    const t = tipo.toLowerCase();
    if (t.includes('parcial')) return '#3b82f6'; 
    if (t.includes('trabajo') || t.includes('tp') || t.includes('práctico')) return '#ef4444'; 
    if (t.includes('exposi')) return '#22c55e'; 
    return 'var(--cursando)'; 
  };

  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '24px', padding: '25px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={handlePrevMonth} className="calendar-nav-btn" style={{ background: 'transparent', border: 'none', color: 'var(--text-strong)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h4 style={{ color: 'var(--text-strong)', margin: 0, textTransform: 'capitalize', fontSize: '1.1rem' }}>{nombreMesActual}</h4>
        <button onClick={handleNextMonth} className="calendar-nav-btn" style={{ background: 'transparent', border: 'none', color: 'var(--text-strong)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '15px', fontWeight: 'bold' }}>
        <span>DOM</span><span>LUN</span><span>MAR</span><span>MIE</span><span>JUE</span><span>VIE</span><span>SAB</span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
        
        {/* Días fantasma mes anterior */}
        {Array.from({ length: primerDiaDelMes }).map((_, i) => (
          <div key={`prev-${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: 'var(--muted)', opacity: 0.35, pointerEvents: 'none' }}>
            {diasMesAnterior - primerDiaDelMes + i + 1}
          </div>
        ))}

        {/* Días mes actual */}
        {Array.from({ length: diasDelMes }, (_, i) => {
          const dia = i + 1; 
          const esHoy = dia === currentDay; 
          const eventosDelDia = eventosPorDia[dia]; 
          const tieneEvento = !!eventosDelDia; 
          const isOpen = hoveredDayData?.day === dia;

          const { background, borderColor } = getDayStyles(esHoy, eventosDelDia);

          return (
            <div key={dia} className="calendar-day"
              // 2. PC: Hover normal (Solo funciona si NO es dispositivo táctil)
              onPointerEnter={(e) => { if (e.pointerType === 'mouse' && tieneEvento) setHoveredDayData({ day: dia, events: eventosDelDia }); }}
              onPointerLeave={(e) => { if (e.pointerType === 'mouse') setHoveredDayData(null); }}
              
              // 3. Celular: Toque para abrir/cerrar
              onClick={(e) => { 
                if (tieneEvento) {
                  e.stopPropagation(); // Evita que el click llegue al document y cierre todo instantáneamente
                  setHoveredDayData(prev => prev?.day === dia ? null : { day: dia, events: eventosDelDia });
                }
              }}
              style={{ 
                position: 'relative', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '0.9rem', borderRadius: '10px', background: background, border: `2px solid ${borderColor}`,
                color: 'var(--text-strong)', fontWeight: esHoy || tieneEvento ? '900' : 'normal', 
                cursor: tieneEvento ? 'pointer' : 'default', transition: 'all 0.2s ease'
              }}>
              {dia}
              
              {/* Globo de texto (Tooltip) */}
              {isOpen && tieneEvento && (
                <div className="calendar-tooltip-card">
                  <div style={{ color: 'var(--text-strong)', borderBottom: '1px solid var(--border)', paddingBottom: '6px', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    {`${nombreMesActual.split(' ')[0]} ${dia}`}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                    {eventosDelDia.map((evStr, idx) => {
                      const [mName, eType, eName] = evStr.split('|');
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-strong)', lineHeight: 1.2 }}>{mName}</div>
                          <div style={{ fontSize: '0.75rem', color: getEventTextColor(eType), fontWeight: 'bold' }}>{eType}: {eName}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Días fantasma mes siguiente */}
        {Array.from({ length: diasSiguientes }).map((_, i) => (
          <div key={`next-${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: 'var(--muted)', opacity: 0.35, pointerEvents: 'none' }}>
            {i + 1}
          </div>
        ))}

      </div>
    </div>
  );
}