'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePlan } from '../../../src/context/PlanContext';
import { getSubjectById } from '../../../src/lib/data';

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
    fecha: hoy // Arranca parado en hoy
  });

  if (!materia) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '150px', paddingBottom: '100px', color: 'white' }}>
        <h2>Materia no encontrada</h2>
        <button className="btn-primary" onClick={() => router.push('/')} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '6px' }}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  // --- NUEVO: Manejador para guardar la comisión seleccionada ---
  const handleSeleccionarComision = (comisionId: string) => {
    actualizarDetalleMateria(id as string, { 
      ...detalles[id as string], 
      comision: comisionId 
    });
  };

  // Manejador para guardar un evento nuevo
  const handleAgregarEvento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoEvento.nombre || !nuevoEvento.fecha) return;

    const eventoParaGuardar = {
      id: crypto.randomUUID(), 
      ...nuevoEvento
    };

    const nuevosEventos = [...eventosGuardados, eventoParaGuardar];
    
    // Guardamos en Supabase a través del Contexto
    actualizarDetalleMateria(id as string, { ...detalles[id as string], eventos: nuevosEventos });
    
    // Limpiamos el formulario
    setNuevoEvento({ nombre: '', tipo: 'Parcial', fecha: hoy });
  };

  // Manejador para borrar un evento
  const handleBorrarEvento = (idEvento: string) => {
    const nuevosEventos = eventosGuardados.filter((ev: any) => ev.id !== idEvento);
    actualizarDetalleMateria(id as string, { ...detalles[id as string], eventos: nuevosEventos });
  };

  return (
    <main style={{ paddingTop: '120px', paddingBottom: '40px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', minHeight: '100vh' }}>
      
      {/* Botón de regreso centrado en la usabilidad */}
      <div>
        <button 
          onClick={() => router.push('/#cursando')} 
          className="btn-primary"
          style={{ padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}
        >
          ← Volver al inicio
        </button>
      </div>

      {/* Título de la Materia */}
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
        <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '10px', fontWeight: 800 }}>{materia.name}</h1>
        <div style={{ display: 'flex', gap: '15px', color: 'var(--muted)', fontFamily: 'Space Mono', fontSize: '1rem' }}>
          <span>Nivel: {materia.level || 'Electiva'}</span>
          <span>•</span>
          <span>Carga horaria: {materia.hours}</span>
        </div>
      </div>

      {/* LAYOUT PRINCIPAL: Grid para contenido + Anuncios */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px', alignItems: 'start' }}>
        
        {/* COLUMNA IZQUIERDA: Funcionalidad principal */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* --- NUEVA SECCIÓN: Selección de Comisión de Cursada --- */}
          {materia.comisiones && materia.comisiones.length > 0 && (
            <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '12px', padding: '30px' }}>
              <h2 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '20px', fontWeight: 'bold' }}>🕒 Horarios de Cursada</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Seleccioná tu comisión para organizar tus horarios:</label>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                  {materia.comisiones.map((comision: any) => (
                    <button
                      key={comision.id}
                      onClick={() => handleSeleccionarComision(comision.id)}
                      style={{
                        flex: '1 1 200px', // Se adapta al espacio disponible
                        padding: '16px',
                        borderRadius: '10px',
                        border: comisionGuardada === comision.id ? '2px solid var(--cursando)' : '1px solid var(--border)',
                        background: comisionGuardada === comision.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '10px', color: comisionGuardada === comision.id ? 'var(--cursando)' : 'white' }}>
                        Comisión {comision.id}
                      </span>
                      {comision.dias.map((dia: any, index: number) => (
                        <div key={index} style={{ fontSize: '0.9rem', color: 'var(--muted)', fontFamily: 'Space Mono', display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '6px' }}>
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

          {/* Contenedor de Formulario Centrado */}
          <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '12px', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h2 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '25px', fontWeight: 'bold' }}>+ Agendar Nuevo Evento</h2>
            <form onSubmit={handleAgregarEvento} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
              <input 
                type="text" 
                placeholder="Ej: 1er Parcial..." 
                value={nuevoEvento.nombre}
                onChange={(e) => setNuevoEvento({...nuevoEvento, nombre: e.target.value})}
                style={{ flex: 1, minWidth: '200px', maxWidth: '300px', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'white' }}
                required
              />
              <select 
                value={nuevoEvento.tipo}
                onChange={(e) => setNuevoEvento({...nuevoEvento, tipo: e.target.value})}
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'white' }}
              >
                <option value="Parcial">Parcial</option>
                <option value="TP">Trabajo Práctico</option>
                <option value="Final">Examen Final</option>
                <option value="Otro">Otro</option>
              </select>
              <input 
                type="date" 
                value={nuevoEvento.fecha}
                onChange={(e) => setNuevoEvento({...nuevoEvento, fecha: e.target.value})}
                onClick={(e) => {
                    if ('showPicker' in HTMLInputElement.prototype) {
                    e.currentTarget.showPicker();
                    }
                }}
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'white', cursor: 'pointer' }}
                required
              />
              <button type="submit" className="btn-primary" style={{ padding: '12px 28px', borderRadius: '6px', fontWeight: 'bold' }}>
                Guardar
              </button>
            </form>
          </div>

          {/* Lista de Eventos Guardados */}
          <div>
            <h3 style={{ color: 'var(--cursando)', marginBottom: '15px', fontSize: '1.2rem', fontWeight: 'bold' }}>📅 Agenda de la materia</h3>
            {eventosGuardados.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontStyle: 'italic', background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '8px', border: '1px dashed var(--border)', textAlign: 'center' }}>
                No hay eventos agendados todavía.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {eventosGuardados.map((ev: any) => (
                  <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', padding: '15px 20px', borderRadius: '8px', transition: 'background 0.2s' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>{ev.nombre}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '4px' }}>{ev.tipo}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <span style={{ fontFamily: 'Space Mono', color: 'var(--cursando)' }}>{ev.fecha}</span>
                      <button 
                        onClick={() => handleBorrarEvento(ev.id)}
                        style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}
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

        {/* COLUMNA DERECHA: Zona de Monetización (AdSense) */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ 
            width: '100%', 
            height: '250px', 
            background: 'var(--bg)', 
            border: '2px dashed var(--muted)', 
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--muted)',
            textAlign: 'center',
            padding: '20px'
          }}>
            <span style={{ fontSize: '1.5rem', marginBottom: '10px' }}>💸</span>
            <span style={{ fontWeight: 'bold' }}>Espacio Publicitario</span>
            <span style={{ fontSize: '0.8rem', marginTop: '5px' }}>300 x 250 (AdSense)</span>
          </div>

          <div style={{ 
            width: '100%', 
            height: '600px', 
            background: 'var(--bg)', 
            border: '2px dashed var(--muted)', 
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--muted)',
            textAlign: 'center',
            padding: '20px'
          }}>
             <span style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🚀</span>
            <span style={{ fontWeight: 'bold' }}>Banner Vertical</span>
            <span style={{ fontSize: '0.8rem', marginTop: '5px' }}>300 x 600 (AdSense)</span>
          </div>
          
        </aside>

      </div>
    </main>
  );
}