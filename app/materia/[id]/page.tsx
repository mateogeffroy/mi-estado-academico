'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePlan } from '../../../src/context/PlanContext';
import { supabase } from '../../../src/lib/supabase';
import Link from 'next/link';
import CustomSelect from '../../../src/components/CustomSelect';

export default function MateriaPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { detalles, actualizarDetalleMateria, careerData } = usePlan();
  const { getSubjectById } = careerData;
  const hoy = new Date().toISOString().split('T')[0];
  const materia = getSubjectById(id);
  
  const tieneComisiones = materia?.comisiones && materia.comisiones.length > 0;
  
  const eventosGuardados = detalles[id as string]?.eventos || [];
  const comisionGuardada = detalles[id as string]?.comision || '';
  const horariosCustomGuardados = detalles[id as string]?.horariosCustom || [];

  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: '',
    tipo: 'Parcial',
    fecha: hoy
  });

  // 🔥 LÓGICA DE DURACIÓN FIJA O VARIABLE 🔥
  const isDuracionFija = materia?.duration === '1' || materia?.duration === '2' || materia?.duration === 'A';
  
  const getInitialDuracion = () => {
    if (materia?.duration === '1') return '1º Cuatrimestre';
    if (materia?.duration === '2') return '2º Cuatrimestre';
    if (materia?.duration === 'C') return '1º Cuatrimestre'; // Por defecto si es variable
    return 'Anual'; 
  };

  const getOpcionesDuracion = () => {
    if (materia?.duration === 'C') return ['1º Cuatrimestre', '2º Cuatrimestre'];
    return ['Anual', '1º Cuatrimestre', '2º Cuatrimestre'];
  };

  const [nuevoHorario, setNuevoHorario] = useState({
    dia: 'Lunes',
    inicio: '18:00',
    fin: '22:00',
    duracion: getInitialDuracion()
  });

  const [showDificultadInfo, setShowDificultadInfo] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [statsDificultad, setStatsDificultad] = useState({
    promedio: 0, total: 0, loading: true
  });

  useEffect(() => {
    const fetchEstadisticas = async () => {
      const { data, error } = await supabase.rpc('obtener_estadisticas_materia', { 
        p_materia_id: id as string 
      });

      if (!error && data && data.length > 0) {
        setStatsDificultad({
          promedio: Number(data[0].promedio),
          total: Number(data[0].total_votos),
          loading: false
        });
      } else {
        setStatsDificultad({ promedio: 0, total: 0, loading: false });
      }
    };
    if (id) fetchEstadisticas();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) setShowDificultadInfo(false);
    };
    if (showDificultadInfo) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDificultadInfo]);

  if (!materia) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '150px', paddingBottom: '100px', color: 'var(--text-strong)' }}>
        <h2>Materia no encontrada</h2>
        <button className="btn-secondary" onClick={() => router.push('/')} style={{ marginTop: '20px', whiteSpace: 'nowrap' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
          </svg>
          Volver a Cursada
        </button>
      </div>
    );
  }

  const handleSeleccionarComision = (comisionId: string) => {
    actualizarDetalleMateria(id as string, { ...detalles[id as string], comision: comisionId });
  };

  const handleAgregarEvento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoEvento.nombre || !nuevoEvento.fecha) return;
    const eventoParaGuardar = { id: crypto.randomUUID(), ...nuevoEvento };
    const nuevosEventos = [...eventosGuardados, eventoParaGuardar];
    actualizarDetalleMateria(id as string, { ...detalles[id as string], eventos: nuevosEventos });
    setNuevoEvento({ nombre: '', tipo: 'Parcial', fecha: hoy });
  };

  const handleBorrarEvento = (idEvento: string) => {
    const nuevosEventos = eventosGuardados.filter((ev: any) => ev.id !== idEvento);
    actualizarDetalleMateria(id as string, { ...detalles[id as string], eventos: nuevosEventos });
  };

  const handleAgregarHorarioCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoHorario.inicio || !nuevoHorario.fin) return;
    const nuevosHorarios = [...horariosCustomGuardados, { id: crypto.randomUUID(), ...nuevoHorario }];
    actualizarDetalleMateria(id as string, { ...detalles[id as string], horariosCustom: nuevosHorarios });
  };

  const handleBorrarHorarioCustom = (idHorario: string) => {
    const nuevosHorarios = horariosCustomGuardados.filter((h: any) => h.id !== idHorario);
    actualizarDetalleMateria(id as string, { ...detalles[id as string], horariosCustom: nuevosHorarios });
  };

  const formatearFecha = (fechaISO: string) => {
    if (!fechaISO) return '';
    const partes = fechaISO.split('-');
    if (partes.length === 3) return `${partes[2]}-${partes[1]}-${partes[0]}`; 
    return fechaISO;
  };

  const spaceIndex = materia.name.indexOf(' ');
  const primerPalabra = spaceIndex === -1 ? materia.name : materia.name.substring(0, spaceIndex);
  const restoNombre = spaceIndex === -1 ? '' : materia.name.substring(spaceIndex + 1);

  return (
    <>
      <style>{`
        .event-form { display: flex; gap: 15px; flex-wrap: wrap; width: 100%; align-items: stretch; }
        .event-input-name { flex: 1 1 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border); background: var(--glass-bg); color: var(--text-strong); outline: none; font-family: inherit; }
        .event-input-type { flex: 1 1 calc(50% - 10px); min-width: 140px; }
        .event-input-date { flex: 1 1 calc(50% - 10px); padding: 12px; border-radius: 8px; border: 1px solid var(--border); background: var(--glass-bg); color: var(--text-strong); outline: none; cursor: pointer; font-family: inherit; }
        .event-btn { flex: 1 1 100%; padding: 12px 28px; border-radius: 8px; font-weight: bold; }
        
        @media (min-width: 900px) {
          .event-input-name { flex: 2 1 200px; }
          .event-input-type { flex: 1 1 150px; }
          .event-input-date { flex: 1 1 140px; }
          .event-btn { flex: 0 0 auto; }
        }
      `}</style>

      <main style={{ paddingTop: '120px', paddingBottom: '40px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', minHeight: '100vh' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '20px', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 0%', minWidth: '250px' }}>
            <h1 className="logo" style={{ fontSize: 'clamp(1.4rem, 6vw, 2.8rem)', marginBottom: '10px', textTransform: 'uppercase', lineHeight: '1.1' }}>
              <span style={{ color: 'var(--text-strong)' }}>{primerPalabra}</span> {restoNombre && <span style={{ color: 'var(--cursando)' }}>{restoNombre}</span>}
            </h1>
            
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem', margin: 0, marginBottom: '12px' }}>
              Nivel: {materia.level || 'Electiva'} • Carga horaria: {materia.hours}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '24px' }}>
              {statsDificultad.loading ? (
                <span style={{ color: 'var(--muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Cargando valoraciones...</span>
              ) : statsDificultad.total === 0 ? (
                <span style={{ color: 'var(--muted)', fontSize: '0.9rem', background: 'var(--glass-bg)', padding: '4px 10px', borderRadius: '6px', border: '1px dashed var(--border)' }}>Sin valoraciones de dificultad aún.</span>
              ) : (
                <>
                  <span style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 800, fontFamily: 'Space Mono' }}>{statsDificultad.promedio.toFixed(1)}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const fillPorcentaje = Math.max(0, Math.min(100, (statsDificultad.promedio - star + 1) * 100));
                      return (
                        <div key={star} style={{ position: 'relative', width: '18px', height: '18px' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.5 }}>
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                          <div style={{ position: 'absolute', top: 0, left: 0, width: `${fillPorcentaje}%`, height: '100%', overflow: 'hidden' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--cursada)" stroke="var(--cursada)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>({statsDificultad.total})</span>
                  
                  <div style={{ position: 'relative' }} ref={tooltipRef}>
                    <button onClick={() => setShowDificultadInfo(!showDificultadInfo)} style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)', color: 'var(--muted)', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', cursor: 'pointer', padding: 0, fontWeight: 'bold' }} title="¿Qué es esto?">?</button>
                    {showDificultadInfo && (
                      <div style={{ position: 'absolute', top: 'calc(100% + 10px)', left: '0', background: 'var(--panel)', border: '1px solid var(--border)', padding: '14px', borderRadius: '12px', width: '240px', minWidth: '240px', maxWidth: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 100, textAlign: 'left', animation: 'fadeIn 0.2s ease-out' }}>
                        <div style={{ position: 'absolute', top: '-6px', left: '6px', width: '10px', height: '10px', background: 'var(--panel)', borderLeft: '1px solid var(--border)', borderTop: '1px solid var(--border)', transform: 'rotate(45deg)' }}></div>
                        <p style={{ color: 'var(--text-strong)', margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>Esta es la valoración promedio de <strong>dificultad</strong> (del 1 al 5) que le ponen los usuarios de la comunidad a la materia cuando la marcan como aprobada.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <button className="btn-secondary" style={{ whiteSpace: 'nowrap' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              Volver a Cursada
            </button>
          </Link>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'flex-start' }}>
          
          <section style={{ flex: '1 1 60%', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '16px', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <h2 style={{ color: 'var(--text-strong)', fontSize: '1.2rem', marginBottom: '25px', fontWeight: 'bold' }}>+ Agendar Nuevo Evento</h2>
              <form onSubmit={handleAgregarEvento} className="event-form">
                <input type="text" placeholder="Ej: 1er Parcial..." value={nuevoEvento.nombre} onChange={(e) => setNuevoEvento({...nuevoEvento, nombre: e.target.value})} className="event-input-name" required />
                <div className="event-input-type">
                  <CustomSelect value={nuevoEvento.tipo} options={['Parcial', 'Trabajo Práctico', 'Exposición']} onChange={(val) => setNuevoEvento({...nuevoEvento, tipo: val})} />
                </div>
                <input type="date" value={nuevoEvento.fecha} onChange={(e) => setNuevoEvento({...nuevoEvento, fecha: e.target.value})} className="event-input-date" required />
                <button type="submit" className="btn-primary event-btn">Guardar</button>
              </form>
            </div>

            <div style={{ background: 'transparent' }}>
              <h3 style={{ color: 'var(--cursando)', marginBottom: '15px', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Agenda de la materia
              </h3>
              {eventosGuardados.length === 0 ? (
                <div style={{ background: 'var(--panel)', padding: '30px', borderRadius: '16px', border: '1px dashed var(--border)', textAlign: 'center' }}>
                  <p style={{ color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>No hay eventos agendados todavía.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {eventosGuardados.map((ev: any) => (
                    <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--panel)', border: '1px solid var(--border)', padding: '20px', borderRadius: '16px', transition: 'transform 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-strong)', fontSize: '1.1rem' }}>{ev.nombre}</div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '6px' }}>{ev.tipo}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span style={{ fontFamily: 'Space Mono', color: 'var(--cursando)', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.9rem' }}>{formatearFecha(ev.fecha)}</span>
                        <button onClick={() => handleBorrarEvento(ev.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }} title="Borrar evento">×</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section style={{ flex: '1 1 35%', minWidth: '300px' }}>
            <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <h2 style={{ color: 'var(--text-strong)', fontSize: '1.2rem', marginBottom: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Horarios de Cursada
              </h2>

              {tieneComisiones ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: '0 0 5px 0' }}>Seleccioná tu comisión para organizar tus horarios:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {materia.comisiones.map((comision: any) => {
                      const duracion = comision.duration || 'A';
                      let labelDuracion = 'Anual';
                      let colorFondoDur = 'rgba(59, 130, 246, 0.15)'; let colorTextoDur = '#3b82f6';

                      if (duracion === '1') {
                        labelDuracion = '1º Cuatrimestre';
                        colorFondoDur = 'rgba(34, 197, 94, 0.15)'; colorTextoDur = '#22c55e';
                      } else if (duracion === '2') {
                        labelDuracion = '2º Cuatrimestre';
                        colorFondoDur = 'rgba(244, 63, 94, 0.15)'; colorTextoDur = '#f43f5e';
                      }

                      return (
                        <button
                          key={comision.id}
                          onClick={() => handleSeleccionarComision(comision.id)}
                          style={{
                            width: '100%', padding: '16px', borderRadius: '12px',
                            border: comisionGuardada === comision.id ? '2px solid var(--cursando)' : '1px solid var(--border)',
                            background: comisionGuardada === comision.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--glass-bg)',
                            color: 'var(--text-strong)', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                            alignItems: 'flex-start', transition: 'all 0.2s ease',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '12px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: comisionGuardada === comision.id ? 'var(--cursando)' : 'var(--text-strong)' }}>Comisión {comision.id}</span>
                            <span style={{ background: colorFondoDur, color: colorTextoDur, padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', border: `1px solid ${colorTextoDur}40` }}>
                              {labelDuracion}
                            </span>
                          </div>
                          {comision.dias.map((dia: any, index: number) => (
                            <div key={index} style={{ fontSize: '0.9rem', color: 'var(--muted)', fontFamily: 'Space Mono', display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}>
                              <span style={{ color: 'var(--text-strong)' }}>{dia.nombre}</span>
                              <span>{dia.inicio} - {dia.fin}</span>
                            </div>
                          ))}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
                    Esta materia no tiene comisiones precargadas en el sistema. ¡Armá tu propia cursada añadiendo los días y horarios manualmente!
                  </p>

                  {horariosCustomGuardados.length > 0 && (
                    <div style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid var(--cursando)', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--text-strong)', transition: 'all 0.2s ease' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--cursando)' }}>
                          Mi Comisión Personalizada
                        </span>
                      </div>
                      
                      {horariosCustomGuardados.map((h: any) => {
                        // Respetamos los mismos colores visuales que en las comisiones oficiales
                        let colorTextoDur = '#3b82f6';
                        if (h.duracion?.includes('1º')) colorTextoDur = '#22c55e';
                        if (h.duracion?.includes('2º')) colorTextoDur = '#f43f5e';

                        return (
                          <div key={h.id} style={{ fontSize: '0.9rem', color: 'var(--muted)', fontFamily: 'Space Mono', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-strong)', fontWeight: 'bold', minWidth: '80px' }}>{h.dia}</span>
                                <span>{h.inicio} - {h.fin}</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', color: colorTextoDur, fontWeight: 'bold', textTransform: 'uppercase' }}>
                                {h.duracion || 'Anual'}
                              </span>
                            </div>
                            
                            <button 
                              onClick={() => handleBorrarHorarioCustom(h.id)} 
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '6px', transition: 'background 0.2s' }} 
                              onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'} 
                              onMouseOut={e => e.currentTarget.style.background = 'transparent'} 
                              title="Eliminar horario"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <form onSubmit={handleAgregarHorarioCustom} style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--glass-bg)', padding: '20px', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-strong)', textTransform: 'uppercase', display: 'block', marginBottom: '2px', letterSpacing: '0.5px' }}>+ Añadir bloque horario</span>
                    
                    {/* 🔥 SELECTOR INTELIGENTE: Si es fija, no lo mostramos pero lo guarda internamente 🔥 */}
                    {!isDuracionFija && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                        <label style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>Duración del cursado</label>
                        <CustomSelect 
                          value={nuevoHorario.duracion} 
                          options={getOpcionesDuracion()} 
                          onChange={(val) => setNuevoHorario({...nuevoHorario, duracion: val})} 
                        />
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>Día de la semana</label>
                      <CustomSelect 
                        value={nuevoHorario.dia} 
                        options={['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']} 
                        onChange={(val) => setNuevoHorario({...nuevoHorario, dia: val})} 
                      />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>Hora Inicio</label>
                        <input type="time" value={nuevoHorario.inicio} onChange={e => setNuevoHorario({...nuevoHorario, inicio: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--text-strong)', outline: 'none', fontFamily: 'Space Mono' }} required />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>Hora Fin</label>
                        <input type="time" value={nuevoHorario.fin} onChange={e => setNuevoHorario({...nuevoHorario, fin: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--text-strong)', outline: 'none', fontFamily: 'Space Mono' }} required />
                      </div>
                    </div>
                    
                    <button type="submit" className="btn-secondary" style={{ marginTop: '10px', width: '100%', borderStyle: 'dashed' }}>
                      Agregar a mi cursada
                    </button>
                  </form>
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </>
  );
}