'use client';

import React from 'react';

interface HorarioCalendarProps {
  horarios: Record<string, any[]>;
}

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const HORA_INICIO = 8; // 08:00 AM
const HORA_FIN = 23.5; // 23:30 PM
const TOTAL_MINUTOS = (HORA_FIN - HORA_INICIO) * 60; // 930 minutos totales en la grilla

export default function HorarioCalendar({ horarios }: HorarioCalendarProps) {
  // Generar etiquetas de hora para el eje Y (8:00 a 23:00)
  const horas = Array.from({ length: 16 }, (_, i) => i + 8);

  // Función matemática para posicionar la tarjeta absolutamente
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

  return (
    <div className="custom-calendar-container">
      <style>{`
        .custom-calendar-container {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow-x: auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        
        .calendar-inner {
          min-width: 800px;
          display: flex;
          flex-direction: column;
        }

        /* --- HEADER (DÍAS) --- */
        .calendar-header {
          display: grid;
          /* Hacemos la primer columna líquida */
          grid-template-columns: clamp(45px, 4vw, 60px) repeat(6, 1fr);
          border-bottom: 1px solid var(--border);
          background: var(--glass-bg);
        }
        .header-cell {
          padding: clamp(10px, 1.5vh, 15px) 0;
          text-align: center;
          font-weight: 700;
          font-size: clamp(0.8rem, 1vw, 0.9rem);
          color: var(--text-strong);
          border-left: 1px solid var(--glass-border);
        }
        .header-cell:first-child { border-left: none; }

        /* --- CUERPO DEL CALENDARIO --- */
        .calendar-body {
          display: grid;
          grid-template-columns: clamp(45px, 4vw, 60px) repeat(6, 1fr);
          position: relative;
          /* ALTURA LÍQUIDA: Intenta ocupar el 50% de la pantalla, mín 350px, máx 550px */
          height: clamp(350px, 50vh, 550px); 
        }

        /* Líneas horizontales de fondo (Punteadas) */
        .grid-lines { position: absolute; top: 0; left: clamp(45px, 4vw, 60px); right: 0; bottom: 0; display: flex; flex-direction: column; pointer-events: none; }
        .grid-line { flex: 1; border-top: 1px dashed var(--glass-border); }
        .grid-line:first-child { border-top: none; }

        /* Columna lateral de Horas */
        .time-column { display: flex; flex-direction: column; border-right: 1px solid var(--border); background: var(--glass-bg); }
        .time-label { 
          flex: 1; 
          display: flex; 
          align-items: flex-start; 
          justify-content: center; 
          font-family: 'Space Mono', monospace; 
          font-size: clamp(0.65rem, 0.8vw, 0.75rem); 
          color: var(--muted); 
          padding-top: 0; 
          transform: translateY(-0.45rem); /* Sube el texto para que la línea lo atraviese al medio */
        }

        /* Columnas de los días */
        .day-column { position: relative; border-right: 1px solid var(--glass-border); }
        .day-column:last-child { border-right: none; }

        /* --- TARJETAS DE MATERIAS --- */
        .event-card {
          position: absolute; left: 4px; right: 4px; border-radius: 8px;
          padding: clamp(4px, 1vh, 8px) clamp(6px, 1vw, 10px);
          display: flex; flex-direction: column; overflow: hidden;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease; z-index: 10; backdrop-filter: blur(4px);
        }
        .event-card:hover { transform: scale(1.03); z-index: 20; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }

        .custom-calendar-container::-webkit-scrollbar { height: 8px; }
        .custom-calendar-container::-webkit-scrollbar-track { background: var(--panel); border-radius: 0 0 16px 16px; }
        .custom-calendar-container::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        .custom-calendar-container::-webkit-scrollbar-thumb:hover { background: var(--muted); }
      `}</style>

      <div className="calendar-inner">
        {/* CABECERA */}
        <div className="calendar-header">
          <div className="header-cell" style={{ borderLeft: 'none', background: 'transparent' }}></div>
          {DIAS.map(dia => (
            <div key={dia} className="header-cell">{dia}</div>
          ))}
        </div>

        {/* CUERPO PRINCIPAL */}
        <div className="calendar-body">
          {/* Líneas de fondo */}
          <div className="grid-lines">
             {horas.map(h => <div key={`line-${h}`} className="grid-line" />)}
          </div>

          {/* Eje Y: Horas */}
          <div className="time-column">
            {horas.map(h => (
              <div key={`time-${h}`} className="time-label">{`${h}:00`}</div>
            ))}
          </div>

          {/* Eje X: Columnas de Días y sus Eventos */}
          {DIAS.map(dia => (
            <div key={dia} className="day-column">
              {horarios[dia]?.map(clase => {
                const { top, height } = calcularPosicion(clase.inicio, clase.fin);
                return (
                  <div
                    key={clase.id}
                    className="event-card"
                    style={{
                      top,
                      height,
                      background: clase.colorFondo,
                      border: `1px solid ${clase.colorBorde}`,
                      borderLeft: `4px solid ${clase.colorBorde}`,
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-strong)', lineHeight: 1.2, marginBottom: 'auto' }}>
                      {clase.materiaLimpia}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4px' }}>
                      {/* 🔥 Se eliminó el "Com. " para dejar solo el valor dinámico 🔥 */}
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: 'var(--text-strong)', opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '4px' }}>
                        {clase.comision}
                      </span>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: 'var(--text-strong)', opacity: 0.6, fontWeight: 'bold', flexShrink: 0 }}>
                        {clase.inicio}-{clase.fin}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}