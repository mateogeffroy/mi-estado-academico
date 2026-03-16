'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePlan } from '../../../src/context/PlanContext';
import { getSubjectById } from '../../../src/lib/data';
import Link from 'next/link';
import CustomSelect from '../../../src/components/CustomSelect';

export default function MateriaPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { detalles, actualizarDetalleMateria } = usePlan();
  const hoy = new Date().toISOString().split('T')[0];

  // Buscamos la materia en la base de datos local
  const materia = getSubjectById(id);
  
  // Obtenemos los eventos guardados y LA COMISIÓN en Supabase/Local
  const eventosGuardados = detalles[id as string]?.eventos || [];
  const comisionGuardada = detalles[id as string]?.comision || ''; // Estado de la comisión elegida

  // Estados para el formulario de nuevo evento
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: '',
    tipo: 'Parcial',
    fecha: hoy
  });

  if (!materia) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '150px', paddingBottom: '100px', color: 'white' }}>
        <h2>Materia no encontrada</h2>
        <button className="btn-primary" onClick={() => router.push('/cursada')} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '6px' }}>
          Volver a Cursada
        </button>
      </div>
    );
  }

  const handleSeleccionarComision = (comisionId: string) => {
    actualizarDetalleMateria(id as string, { 
      ...detalles[id as string], 
      comision: comisionId 
    });
  };

  const handleAgregarEvento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoEvento.nombre || !nuevoEvento.fecha) return;

    const eventoParaGuardar = {
      id: crypto.randomUUID(), 
      ...nuevoEvento
    };

    const nuevosEventos = [...eventosGuardados, eventoParaGuardar];
    
    actualizarDetalleMateria(id as string, { ...detalles[id as string], eventos: nuevosEventos });
    
    setNuevoEvento({ nombre: '', tipo: 'Parcial', fecha: hoy });
  };

  const handleBorrarEvento = (idEvento: string) => {
    const nuevosEventos = eventosGuardados.filter((ev: any) => ev.id !== idEvento);
    actualizarDetalleMateria(id as string, { ...detalles[id as string], eventos: nuevosEventos });
  };

  // --- FUNCIÓN PARA DAR VUELTA LA FECHA A dd-mm-aaaa ---
  const formatearFecha = (fechaISO: string) => {
    if (!fechaISO) return '';
    const partes = fechaISO.split('-');
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`; // Día - Mes - Año
    }
    return fechaISO;
  };

  // Separamos el nombre para hacer el efecto bicolor del título estilo Logo
  const primerPalabra = materia.name.split(' ')[0];
  const restoNombre = materia.name.substring(materia.name.indexOf(' ') + 1);

  return (
    <>
      {/* --- ESTILOS RESPONSIVOS PARA EL FORMULARIO --- */}
      <style>{`
        .event-form {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          width: 100%;
          align-items: stretch;
        }
        .event-input-name {
          flex: 1 1 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: rgba(0,0,0,0.2);
          color: white;
          outline: none;
          font-family: inherit;
        }
        .event-input-type {
          flex: 1 1 calc(50% - 10px);
          min-width: 140px;
        }
        .event-input-date {
          flex: 1 1 calc(50% - 10px);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: rgba(0,0,0,0.2);
          color: white;
          outline: none;
          cursor: pointer;
          font-family: inherit;
        }
        .event-btn {
          flex: 1 1 100%;
          padding: 12px 28px;
          border-radius: 8px;
          font-weight: bold;
        }
        
        /* En pantallas grandes, todo va en una sola fila */
        @media (min-width: 900px) {
          .event-input-name { flex: 2 1 200px; }
          .event-input-type { flex: 1 1 150px; }
          .event-input-date { flex: 1 1 140px; }
          .event-btn { flex: 0 0 auto; }
        }
      `}</style>

      <main style={{ paddingTop: '120px', paddingBottom: '40px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', minHeight: '100vh' }}>
        
        {/* --- ENCABEZADO MEJORADO --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '20px', gap: '20px', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1 1 0%', minWidth: '250px' }}>
            {/* 🔥 SOLUCIÓN: clamp() modificado para que baje hasta 1.4rem en celulares, pero mantenga los 2.8rem en PC */}
            <h1 className="logo" style={{ fontSize: 'clamp(1.4rem, 6vw, 2.8rem)', marginBottom: '10px', textTransform: 'uppercase', lineHeight: '1.1' }}>
              <span style={{ color: 'white' }}>{primerPalabra}</span> {restoNombre && <span style={{ color: 'var(--cursando)' }}>{restoNombre}</span>}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem', margin: 0 }}>
              Nivel: {materia.level || 'Electiva'} • Carga horaria: {materia.hours}
            </p>
          </div>

          <Link href="/cursada#gestionar-materias" style={{ textDecoration: 'none', flexShrink: 0 }}>
            {/* Botón alineado al estilo de las páginas anteriores */}
            <button 
              className="btn-secondary"
              style={{ textAlign: 'center', lineHeight: '1.4', padding: '8px 16px' }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--cursando)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              ← Volver a <br /> Cursada
            </button>
          </Link>
        </div>

        {/* LAYOUT PRINCIPAL: Grid a dos columnas invertidas */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'flex-start' }}>
          
          {/* COLUMNA IZQUIERDA (Ancha - Agenda y Eventos) */}
          <section style={{ flex: '1 1 60%', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Contenedor de Formulario Centrado y Responsivo */}
            <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '16px', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <h2 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '25px', fontWeight: 'bold' }}>+ Agendar Nuevo Evento</h2>
              
              <form onSubmit={handleAgregarEvento} className="event-form">
                <input 
                  type="text" 
                  placeholder="Ej: 1er Parcial..." 
                  value={nuevoEvento.nombre}
                  onChange={(e) => setNuevoEvento({...nuevoEvento, nombre: e.target.value})}
                  className="event-input-name"
                  required
                />
                
                <div className="event-input-type">
                  <CustomSelect 
                    value={nuevoEvento.tipo}
                    options={['Parcial', 'Trabajo Práctico', 'Exposición']}
                    onChange={(val) => setNuevoEvento({...nuevoEvento, tipo: val})}
                  />
                </div>

                <input 
                  type="date" 
                  value={nuevoEvento.fecha}
                  onChange={(e) => setNuevoEvento({...nuevoEvento, fecha: e.target.value})}
                  className="event-input-date"
                  required
                />
                
                <button type="submit" className="btn-primary event-btn">
                  Guardar
                </button>
              </form>
            </div>

            {/* Lista de Eventos Guardados */}
            <div style={{ background: 'transparent' }}>
              <h3 style={{ color: 'var(--cursando)', marginBottom: '15px', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Agenda de la materia
              </h3>
              {eventosGuardados.length === 0 ? (
                <div style={{ background: 'var(--panel)', padding: '30px', borderRadius: '16px', border: '1px dashed var(--border)', textAlign: 'center' }}>
                  <p style={{ color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>
                    No hay eventos agendados todavía.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {eventosGuardados.map((ev: any) => (
                    <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--panel)', border: '1px solid var(--border)', padding: '20px', borderRadius: '16px', transition: 'transform 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>{ev.nombre}</div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '6px' }}>{ev.tipo}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span style={{ fontFamily: 'Space Mono', color: 'var(--cursando)', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.9rem' }}>
                          {formatearFecha(ev.fecha)}
                        </span>
                        
                        <button 
                          onClick={() => handleBorrarEvento(ev.id)}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', transition: 'all 0.2s' }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                          title="Borrar evento"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* COLUMNA DERECHA (Flaca - Comisiones) */}
          <section style={{ flex: '1 1 35%', minWidth: '300px' }}>
            {materia.comisiones && materia.comisiones.length > 0 && (
              <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                <h2 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Horarios de Cursada
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: '0 0 5px 0' }}>Seleccioná tu comisión para organizar tus horarios:</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {materia.comisiones.map((comision: any) => (
                      <button
                        key={comision.id}
                        onClick={() => handleSeleccionarComision(comision.id)}
                        style={{
                          width: '100%',
                          padding: '16px',
                          borderRadius: '12px',
                          border: comisionGuardada === comision.id ? '2px solid var(--cursando)' : '1px solid var(--border)',
                          background: comisionGuardada === comision.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.2)',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '12px', color: comisionGuardada === comision.id ? 'var(--cursando)' : 'white' }}>
                          Comisión {comision.id}
                        </span>
                        {comision.dias.map((dia: any, index: number) => (
                          <div key={index} style={{ fontSize: '0.9rem', color: 'var(--muted)', fontFamily: 'Space Mono', display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}>
                            <span style={{ color: 'white' }}>{dia.nombre}</span>
                            <span>{dia.inicio} - {dia.fin}</span>
                          </div>
                        ))}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

        </div>
      </main>
    </>
  );
}