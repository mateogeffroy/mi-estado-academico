'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePlan } from '../../src/context/PlanContext';
import { ALL } from '../../src/lib/data';
import SpotlightCard from '../../src/components/SpotlightCard';

export default function CursadaPage() {
  const { materias, detalles } = usePlan();
  const [hoveredDayData, setHoveredDayData] = useState<{ day: number, events: string[] } | null>(null);

  const cursando = ALL.filter((s: any) => materias[s.id] === 'cursando');

  const obtenerProximosEventos = () => {
    let eventosMapeados: any[] = [];
    const hoyStr = new Date().toISOString().split('T')[0];

    Object.keys(detalles || {}).forEach(materiaId => {
      const detalleMateria = detalles[materiaId];
      if (detalleMateria?.eventos && detalleMateria.eventos.length > 0) {
        const materiaData = ALL.find((m: any) => m.id == materiaId);
        detalleMateria.eventos.forEach((ev: any) => {
          if (ev.fecha >= hoyStr) {
            eventosMapeados.push({
              id: ev.id,
              materiaId: materiaId,
              materia: materiaData?.name || 'Materia Desconocida',
              nombre: ev.nombre,
              tipo: ev.tipo,
              fecha: ev.fecha
            });
          }
        });
      }
    });

    eventosMapeados.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    return eventosMapeados.slice(0, 5);
  };

  const proximosEventos = obtenerProximosEventos();

  const formatearFecha = (fechaISO: string) => {
    const partes = fechaISO.split('-');
    if (partes.length === 3) return `${partes[2]}/${partes[1]}`;
    return fechaISO;
  };

  const hoy = new Date();
  const currentMonth = hoy.getMonth();
  const currentYear = hoy.getFullYear();
  const currentDay = hoy.getDate();

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const nombreMesActual = `${meses[currentMonth]} ${currentYear}`;

  const diasDelMes = new Date(currentYear, currentMonth + 1, 0).getDate();
  const primerDiaDelMes = new Date(currentYear, currentMonth, 1).getDay();

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
          eventosPorDia[dia].push(`${materiaData?.name || 'Materia'}|${ev.nombre}`); 
        }
      });
    }
  });

  // --- LÓGICA DE DÍAS DINÁMICA ---
  const horariosSemanales: Record<string, any[]> = { 'Lunes': [], 'Martes': [], 'Miércoles': [], 'Jueves': [], 'Viernes': [], 'Sábado': [] };
  
  cursando.forEach((m: any) => {
    const comisionId = detalles[m.id]?.comision;
    if (comisionId && m.comisiones) {
      const comisionData = m.comisiones.find((c: any) => c.id === comisionId);
      if (comisionData && comisionData.dias) {
        // En tu data algunos días están marcados como "Jueves (1°C)", extraemos el nombre base para agrupar si querés, 
        // o lo dejamos tal cual. Por diseño, los agrupamos por el primer día coincidente.
        comisionData.dias.forEach((dia: any) => {
          let nombreDiaLimpio = dia.nombre.split(' ')[0]; // Limpia el "(1°C)" si existe para agrupar la columna
          if (horariosSemanales[nombreDiaLimpio]) {
            horariosSemanales[nombreDiaLimpio].push({
              id: `${m.id}-${dia.nombre}`,
              materia: m.name,
              inicio: dia.inicio,
              fin: dia.fin,
              comision: comisionId,
              notaExtra: dia.nombre.includes('(') ? dia.nombre.split(' ')[1] : '' // Guarda el (1°C) para mostrarlo
            });
          }
        });
      }
    }
  });

  Object.keys(horariosSemanales).forEach(dia => {
    horariosSemanales[dia].sort((a, b) => a.inicio.localeCompare(b.inicio));
  });

  // Filtramos solo los días que tienen al menos una materia cargada
  const ordenDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diasMostrar = ordenDias.filter(dia => horariosSemanales[dia].length > 0);

  return (
    <main style={{ paddingTop: '120px', paddingBottom: '80px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '60px', minHeight: '100vh' }}>
      
      {/* --- ENCABEZADO Y BOTÓN DE REGRESO --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '20px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 className="logo" style={{ fontSize: '2.8rem', marginBottom: '10px' }}>
            Mi <span>Cursada</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>Horarios, parciales y materias activas de este cuatrimestre.</p>
        </div>
        <Link href="/" style={{ textDecoration: 'none', marginTop: '10px' }}>
          <button className="btn-secondary">
            ← Volver al Dashboard
          </button>
        </Link>
      </div>

      {/* --- GRILLA DE HORARIOS SEMANALES DINÁMICA --- */}
      <div>
        <h3 style={{ color: 'var(--cursando)', fontSize: '1.4rem', marginBottom: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🕒 Horario Semanal
        </h3>
        
        {diasMostrar.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)', background: 'var(--panel)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
            No tenés horarios guardados. Entrá a tus materias en curso y seleccioná una comisión.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${100 / diasMostrar.length}%, 1fr))`, gap: '15px', display: 'flex', flexWrap: 'wrap' } as any}>
            {diasMostrar.map((dia) => (
              <div key={dia} style={{ flex: '1 1 200px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', textAlign: 'center', fontWeight: 'bold', color: 'white', borderBottom: '1px solid var(--border)' }}>
                  {dia}
                </div>
                <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '120px' }}>
                  {horariosSemanales[dia].map((clase: any) => (
                    <div key={clase.id} style={{ background: 'rgba(59, 130, 246, 0.1)', borderLeft: '3px solid var(--cursando)', padding: '10px', borderRadius: '6px' }}>
                      <div style={{ fontWeight: 'bold', color: 'white', fontSize: '0.95rem', lineHeight: 1.2 }}>
                        {clase.materia} <span style={{ color: 'var(--cursando)', fontSize: '0.8rem' }}>{clase.notaExtra}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'Space Mono' }}>
                        <span>Com. {clase.comision}</span>
                        <span>{clase.inicio}-{clase.fin}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- AGENDA Y CALENDARIO --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* Próximos Eventos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3 style={{ color: 'var(--cursando)', fontSize: '1.4rem', fontWeight: 'bold' }}>📅 Próximos Parciales</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {proximosEventos.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)', background: 'var(--panel)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                No tenés eventos próximos agendados.
              </div>
            ) : (
              proximosEventos.map(evento => (
                <Link href={`/materia/${evento.materiaId}`} key={evento.id} style={{ textDecoration: 'none' }}>
                  <div className="event-card-modern">
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'white' }}>{evento.materia}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--cursando)', marginTop: '4px' }}>{evento.tipo}: {evento.nombre}</div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 15px', borderRadius: '8px', fontFamily: 'Space Mono', fontSize: '1.1rem', color: 'white', fontWeight: 'bold' }}>
                      {formatearFecha(evento.fecha)}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Calendario Dinámico */}
        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '24px', padding: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <h2 style={{ color: 'white', marginBottom: '25px', fontSize: '1.3rem', textAlign: 'center', fontWeight: 'bold' }}>{nombreMesActual}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '15px', fontWeight: 'bold' }}>
            <span>DOM</span><span>LUN</span><span>MAR</span><span>MIE</span><span>JUE</span><span>VIE</span><span>SAB</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center' }}>
            {Array.from({ length: primerDiaDelMes }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: diasDelMes }, (_, i) => {
              const dia = i + 1;
              const esHoy = dia === currentDay;
              const eventosDelDia = eventosPorDia[dia];
              const tieneEvento = !!eventosDelDia;
              const isHovered = hoveredDayData?.day === dia;

              return (
                <div 
                  key={dia} 
                  onMouseEnter={() => { if (tieneEvento) setHoveredDayData({ day: dia, events: eventosDelDia }); }}
                  onMouseLeave={() => setHoveredDayData(null)}
                  style={{ 
                    position: 'relative', 
                    aspectRatio: '1', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem', 
                    borderRadius: '12px',
                    background: esHoy ? 'var(--cursando)' : (tieneEvento ? 'rgba(255,255,255,0.03)' : 'transparent'), 
                    color: esHoy ? 'black' : 'var(--text)',
                    fontWeight: esHoy || tieneEvento ? 'bold' : 'normal',
                    border: tieneEvento && !esHoy ? '1px solid var(--cursando)' : '1px solid transparent',
                    cursor: tieneEvento ? 'pointer' : 'default',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {dia}
                  {isHovered && tieneEvento && (
                    <div className="calendar-tooltip-card">
                      <div className="tooltip-title">{`${nombreMesActual.split(' ')[0]} ${dia}`}</div>
                      <div className="tooltip-event-list">
                        {eventosDelDia.map((evStr, idx) => {
                          const [mName, eType] = evStr.split('|');
                          return (
                            <div key={idx} className="tooltip-event-item">
                              <div className="tooltip-materia-name">{mName}</div>
                              <div className="tooltip-event-type">{eType}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- MATERIAS EN CURSO --- */}
      <div>
        <h3 style={{ color: 'var(--cursando)', fontSize: '1.4rem', marginBottom: '20px', fontWeight: 'bold' }}>🎓 Gestionar Materias</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
          {cursando.length === 0 ? (
             <div style={{ gridColumn: '1 / -1', padding: '30px', textAlign: 'center', color: 'var(--muted)', background: 'var(--panel)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
               No tenés materias marcadas como "Cursando" actualmente.
             </div>
          ) : (
            cursando.map(m => (
              <Link href={`/materia/${m.id}`} key={m.id} style={{ textDecoration: 'none', height: '100%' }}>
                <SpotlightCard className="premium-card" spotlightColor="rgba(0, 229, 255, 0.15)">
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'Space Mono', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {m.level ? `Nivel ${m.level}` : 'Electiva'}
                  </div>
                  <div style={{ fontWeight: '800', color: 'white', marginTop: '10px', fontSize: '1.3rem', lineHeight: 1.3, flexGrow: 1 }}>
                    {m.name}
                  </div>
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', color: 'var(--cursando)', fontWeight: 'bold' }}>
                    → Configurar comisión y parciales
                  </div>
                </SpotlightCard>
              </Link>
            ))
          )}
        </div>
      </div>

    </main>
  );
}