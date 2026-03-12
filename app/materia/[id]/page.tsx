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

  // Estados para el formulario de nuevo evento
    const [nuevoEvento, setNuevoEvento] = useState({
        nombre: '',
        tipo: 'Parcial',
        fecha: hoy // Ahora el calendario nativo arranca parado en hoy
    });

  // Buscamos la materia en la base de datos local
  const materia = getSubjectById(id);
  
  // Obtenemos los eventos guardados en Supabase o inicializamos un array vacío
  const eventosGuardados = detalles[id as string]?.eventos || [];

  if (!materia) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: 'white' }}>
        <h2>Materia no encontrada</h2>
        <button className="btn-primary" onClick={() => router.push('/')} style={{ marginTop: '20px' }}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  // Manejador para guardar un evento nuevo
  const handleAgregarEvento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoEvento.nombre || !nuevoEvento.fecha) return;

    const eventoParaGuardar = {
      id: crypto.randomUUID(), // Generamos un ID único rápido
      ...nuevoEvento
    };

    const nuevosEventos = [...eventosGuardados, eventoParaGuardar];
    
    // Guardamos en Supabase a través del Contexto
    actualizarDetalleMateria(id as string, { ...detalles[id as string], eventos: nuevosEventos });
    
    // Limpiamos el formulario
    setNuevoEvento({ nombre: '', tipo: 'Parcial', fecha: '' });
  };

  // Manejador para borrar un evento
  const handleBorrarEvento = (idEvento: string) => {
    const nuevosEventos = eventosGuardados.filter((ev: any) => ev.id !== idEvento);
    actualizarDetalleMateria(id as string, { ...detalles[id as string], eventos: nuevosEventos });
  };

  return (
    <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px', minHeight: '100vh' }}>
      
      {/* Botón de regreso */}
      <div>
        <button 
          onClick={() => router.push('/')} 
          style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '1rem' }}
        >
          ← Volver al Dashboard
        </button>
      </div>

      {/* Cabecera de la Materia */}
      <header style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '10px' }}>{materia.name}</h1>
        <div style={{ display: 'flex', gap: '15px', color: 'var(--muted)', fontFamily: 'Space Mono', fontSize: '0.9rem' }}>
          <span>Nivel: {materia.level || 'Electiva'}</span>
          <span>•</span>
          <span>Carga horaria: {materia.hours}</span>
        </div>
      </header>

      {/* LAYOUT PRINCIPAL: Grid para contenido + Anuncios */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px', alignItems: 'start' }}>
        
        {/* COLUMNA IZQUIERDA: Funcionalidad principal */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Formulario de Eventos */}
          <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '12px', padding: '25px' }}>
            <h2 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '20px' }}>+ Agendar Nuevo Evento</h2>
            <form onSubmit={handleAgregarEvento} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="Ej: 1er Parcial, TP Integrador..." 
                value={nuevoEvento.nombre}
                onChange={(e) => setNuevoEvento({...nuevoEvento, nombre: e.target.value})}
                style={{ flex: 1, minWidth: '200px', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'white' }}
                required
              />
              <select 
                value={nuevoEvento.tipo}
                onChange={(e) => setNuevoEvento({...nuevoEvento, tipo: e.target.value})}
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'white' }}
              >
                <option value="Parcial">Parcial</option>
                <option value="TP">Trabajo Práctico</option>
              </select>
              <input 
                type="date" 
                value={nuevoEvento.fecha}
                onChange={(e) => setNuevoEvento({...nuevoEvento, fecha: e.target.value})}
                onClick={(e) => {
                    // Al hacer clic en cualquier lado del input, forzamos a que se abra el calendario
                    if ('showPicker' in HTMLInputElement.prototype) {
                    e.currentTarget.showPicker();
                    }
                }}
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'white', cursor: 'pointer' }}
                required
              />
              <button type="submit" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold' }}>
                Guardar
              </button>
            </form>
          </div>

          {/* Lista de Eventos Guardados */}
          <div>
            <h3 style={{ color: 'var(--cursando)', marginBottom: '15px', fontSize: '1.1rem' }}>📅 Agenda de la materia</h3>
            {eventosGuardados.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>No hay eventos agendados todavía.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {eventosGuardados.map((ev: any) => (
                  <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', padding: '15px 20px', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>{ev.nombre}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '4px' }}>{ev.tipo}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <span style={{ fontFamily: 'Space Mono', color: 'var(--cursando)' }}>{ev.fecha}</span>
                      <button 
                        onClick={() => handleBorrarEvento(ev.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem' }}
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
          
          {/* Bloque Cuadrado (Ideal para Display Ads) */}
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

          {/* Bloque Vertical (Ideal para Skyscraper Ads) */}
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