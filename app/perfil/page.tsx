'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePlan } from '../../src/context/PlanContext';
import { supabase } from '../../src/lib/supabase';
import GradeModal from '../../src/components/GradeModal';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const UNIVERSIDADES = [
  { id: 'utn', name: 'UTN (FRLP)' },
  { id: 'unlp', name: 'UNLP' }
];

const CARRERAS_POR_UNI: Record<string, { id: string, name: string }[]> = {
  'utn': [
    { id: 'utn-sistemas-2023', name: 'Ingeniería en Sistemas de Información (Plan 2023)' },
    { id: 'utn-civil-2023', name: 'Ingeniería Civil (Plan 2023)' },
    { id: 'utn-industrial-2008', name: 'Ingeniería Industrial (Plan 2008)' },
    { id: 'utn-mecanica-2023', name: 'Ingeniería Mecánica (Plan 2023)' },
    { id: 'utn-quimica-2008', name: 'Ingeniería Química (Plan 2008)' },
    { id: 'utn-electrica-2023', name: 'Ingeniería Eléctrica (Plan 2023)' },
  ],
  'unlp': [
    { id: 'unlp-apu-2021', name: 'Analista Programador Universitario (Plan 2021)' },
    { id: 'unlp-sistemas-2021', name: 'Licenciatura en Sistemas (Plan 2021)' },
    { id: 'unlp-informatica-2021', name: 'Licenciatura en Informática (Plan 2021)' },
    { id: 'unlp-psicologia-2012', name: 'Licenciatura y Profesorado en Psicología (Plan 2012)' },
    { id: 'unlp-computacion-2024', name: 'Ingeniería en Computación (Plan 2024)' },
    { id: 'unlp-sonido-2023', name: 'Tecnicatura Universitaria en Sonido y Grabación (Plan 2019)' },
  ]
};

// Función helper para buscar el nombre de la carrera
const getNombreCarrera = (id: string) => {
  for (const uni of Object.values(CARRERAS_POR_UNI)) {
    const found = uni.find(c => c.id === id);
    if (found) return found.name;
  }
  return id;
};

// 🔥 Función auxiliar para determinar el prefijo de la carrera
const getCareerPrefix = (careerId: string) => {
  if (careerId.includes('sistemas')) return 'SIS-';
  if (careerId.includes('industrial')) return 'IND-';
  if (careerId.includes('mecanica')) return 'MEC-';
  if (careerId.includes('civil')) return 'CIV-';
  if (careerId.includes('electrica')) return 'ELE-';
  if (careerId.includes('quimica')) return 'QUI-';
  return null;
};

export default function PerfilPage() {
  const router = useRouter();
  // Traemos las nuevas funciones del Contexto Multi-Carrera
  const { materias, stats, detalles, actualizarDetalleMateria, careerData, careerId, todasLasCarreras, agregarCarrera, setCarreraActiva, borrarCarrera } = usePlan();
  const { ALL } = careerData;

  const [isMounted, setIsMounted] = useState(false);
  const [chartWidth, setChartWidth] = useState(0);

  const [nombre, setNombre] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempNombre, setTempNombre] = useState('');
  
  // Estados para el selector de nueva carrera
  const [universidad, setUniversidad] = useState('utn');
  const [nuevaCarreraId, setNuevaCarreraId] = useState('');
  const [isAddingMode, setIsAddingMode] = useState(false);
  
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const fetchUserData = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const currentName = data.user.user_metadata?.full_name || 'Usuario';
        setNombre(currentName);
        setTempNombre(currentName);
      }
    };
    fetchUserData();

    // Inicializar el selector con la primera carrera disponible
    setNuevaCarreraId(CARRERAS_POR_UNI['utn'][0].id);
  }, []);

  useEffect(() => {
    if (CARRERAS_POR_UNI[universidad]) {
      setNuevaCarreraId(CARRERAS_POR_UNI[universidad][0].id);
    }
  }, [universidad]);

  useEffect(() => {
    const container = document.getElementById('chart-container');
    if (!container) return;
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) { setChartWidth(entry.contentRect.width); }
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [isMounted]);

  const handleSaveName = async () => {
    if (!tempNombre.trim()) return;
    await supabase.auth.updateUser({ data: { full_name: tempNombre } });
    setNombre(tempNombre);
    setIsEditingName(false);
  };

  // Lógica: Inscribirse a una carrera (sin borrar nada)
  const handleInscribirse = async () => {
    if (todasLasCarreras.includes(nuevaCarreraId)) {
      alert("Ya estás inscripto en esta carrera.");
      return;
    }
    await agregarCarrera(nuevaCarreraId);
    setIsAddingMode(false);
  };

  // 🔥 NUEVA LÓGICA: Borrado en Cascada Seguro 🔥
  const handleEliminarCarrera = async (idToBorrar: string) => {
    if (!window.confirm(`¿Seguro que querés desanotarte de ${getNombreCarrera(idToBorrar)}? Esto borrará tus datos exclusivos de esta carrera.`)) return;

    try {
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;
      const prefix = getCareerPrefix(idToBorrar);

      if (prefix && userId) {
        // 1. Limpiar materias exclusivas de esta carrera
        const { error: errMaterias } = await supabase
          .from('usuario_materias')
          .delete()
          .eq('user_id', userId)
          .like('materia_id', `${prefix}%`);

        if (errMaterias) console.error('Error limpiando materias:', errMaterias);

        // 2. Limpiar eventos exclusivos de esta carrera
        const { error: errEventos } = await supabase
          .from('usuario_eventos')
          .delete()
          .eq('user_id', userId)
          .like('materia_id', `${prefix}%`);

        if (errEventos) console.error('Error limpiando eventos:', errEventos);
      }

      // Finalmente, la sacamos del array del perfil
      await borrarCarrera(idToBorrar);
      
    } catch (error) {
      console.error('Error crítico en borrado en cascada:', error);
    }
  };

  const aprobadasOrdenadas = ALL.filter((s: any) =>
    materias[s.id] === 'aprobada' && !s.isElectivePlaceholder && s.id !== 'SEM' && s.id !== 'PPS'
  ).sort((a, b) => {
    const nivelA = a.level || 99; 
    const nivelB = b.level || 99;
    if (nivelA !== nivelB) return nivelA - nivelB;
    const numA = parseInt(a.num) || parseInt(a.id) || 999;
    const numB = parseInt(b.num) || parseInt(b.id) || 999;
    return numA - numB;
  });

  const materiasConNota = aprobadasOrdenadas.filter(m => detalles[m.id]?.notaFinal != null);
  let sumaAcumulada = 0;
  
  const dataGrafico = materiasConNota.map((m, index) => {
    const notaNumerica = Number(detalles[m.id].notaFinal) || 0; 
    sumaAcumulada += notaNumerica;
    const promedioHastaAca = sumaAcumulada / (index + 1);
    return {
      nombreCorto: m.name.length > 15 ? m.name.substring(0, 15) + '...' : m.name,
      nombreCompleto: m.name,
      nota: notaNumerica,
      promedio: parseFloat(promedioHastaAca.toFixed(2))
    };
  }).filter(d => d.nota > 0); 

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: '12px', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}>
          <p style={{ color: 'var(--text-strong)', fontWeight: 'bold', margin: '0 0 8px 0', fontSize: '0.9rem' }}>{payload[0].payload.nombreCompleto}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: '#3b82f6', fontSize: '0.85rem', fontWeight: 'bold' }}>Promedio acumulado: {payload[0].value}</span>
            <span style={{ color: '#10b981', fontSize: '0.85rem' }}>Nota de la materia: {payload[1].value}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <style>{`
        .recharts-wrapper * { max-width: none !important; }
        .recharts-wrapper, .recharts-surface { outline: none !important; }
        @media (max-width: 600px) { .stars-container { display: none !important; } }
      `}</style>

      <main style={{ paddingBottom: '80px', display: 'flex', flexDirection: 'column', gap: '40px', minHeight: '100vh', paddingTop: '40px' }}>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Mi Perfil</div>
              
              {isEditingName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="text" value={tempNombre} onChange={(e) => setTempNombre(e.target.value)} style={{ background: 'var(--glass-bg)', border: '1px solid var(--cursando)', color: 'var(--text-strong)', padding: '8px 12px', borderRadius: '8px', fontSize: '1.5rem', fontWeight: 'bold', outline: 'none' }} autoFocus />
                  <button onClick={handleSaveName} className="btn-primary" style={{ padding: '8px 16px' }}>Guardar</button>
                  <button onClick={() => { setIsEditingName(false); setTempNombre(nombre); }} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancelar</button>
                </div>
              ) : (
                <h1 style={{ color: 'var(--text-strong)', margin: 0, fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {nombre}
                  <button onClick={() => setIsEditingName(true)} style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)', color: 'var(--muted)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }} onMouseOver={e => { e.currentTarget.style.color = 'var(--text-strong)'; e.currentTarget.style.borderColor = 'var(--text-strong)' }} onMouseOut={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  </button>
                </h1>
              )}
            </div>

            <Link href="/" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                Volver al Inicio
              </button>
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            <section style={{ width: '100%', background: 'var(--panel)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  Mis Carreras
                </h3>
                
                {!isAddingMode && (
                  <button onClick={() => setIsAddingMode(true)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                    + Agregar carrera
                  </button>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {todasLasCarreras.map(id => (
                  <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: id === careerId ? 'var(--glass-bg)' : 'transparent', border: `1px solid ${id === careerId ? 'var(--cursando)' : 'var(--border)'}`, borderRadius: '12px', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ color: 'var(--text-strong)', fontWeight: 'bold', fontSize: '0.95rem' }}>
                        {getNombreCarrera(id)}
                      </span>
                      {id === careerId && <span style={{ color: 'var(--cursando)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Plan Activo</span>}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {id !== careerId && (
                        <button onClick={() => setCarreraActiva(id)} className="btn-secondary" style={{ background: 'transparent', padding: '6px 12px', fontSize: '0.8rem' }}>
                          Cambiar a esta
                        </button>
                      )}
                      
                      {/* 🔥 Tacho de basura ahora usa el borrado en cascada 🔥 */}
                      {todasLasCarreras.length > 1 && (
                        <button 
                          onClick={() => handleEliminarCarrera(id)}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '6px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                          title="Desanotarse"
                          onMouseOver={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                          onMouseOut={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {isAddingMode && (
                  <div style={{ marginTop: '10px', padding: '16px', background: 'var(--glass-bg)', border: '1px dashed var(--border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '15px', animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-strong)' }}>Inscribirse a un nuevo plan</div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <select value={universidad} onChange={(e) => setUniversidad(e.target.value)} style={{ flex: 1, minWidth: '150px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--text-strong)', outline: 'none' }}>
                        {UNIVERSIDADES.map(uni => <option key={uni.id} value={uni.id}>{uni.name}</option>)}
                      </select>
                      <select value={nuevaCarreraId} onChange={(e) => setNuevaCarreraId(e.target.value)} style={{ flex: 2, minWidth: '250px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--text-strong)', outline: 'none' }}>
                        {CARRERAS_POR_UNI[universidad]?.map(c => <option key={c.id} value={c.id} disabled={todasLasCarreras.includes(c.id)}>{c.name} {todasLasCarreras.includes(c.id) ? '(Ya inscripto)' : ''}</option>)}
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button onClick={() => setIsAddingMode(false)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
                      <button onClick={handleInscribirse} className="btn-primary" disabled={todasLasCarreras.includes(nuevaCarreraId)}>Confirmar inscripción</button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section style={{ width: '100%', background: 'var(--panel)', borderRadius: '20px', padding: 'clamp(16px, 5vw, 28px)', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: 'var(--aprobada)', marginBottom: '16px', fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Materias Aprobadas del Plan Actual
              </h3>
              
              {aprobadasOrdenadas.length === 0 ? (
                <p style={{ color: 'var(--muted)', textAlign: 'center', fontStyle: 'italic', padding: '20px' }}>Todavía no tenés materias aprobadas en esta carrera.</p>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }} className="custom-scrollbar">
                  {aprobadasOrdenadas.map(m => (
                    <div key={m.id} className="list-row" style={{ cursor: 'pointer', padding: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => { setSelectedMateria({ id: m.id, name: m.name }); setIsGradeModalOpen(true); }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                        <span style={{ color: 'var(--muted)', fontSize: '0.75rem', fontFamily: 'Space Mono', whiteSpace: 'nowrap' }}>Nivel {m.level || '-'}</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</span>
                        <span style={{ color: detalles[m.id]?.notaFinal ? 'var(--aprobada)' : 'var(--muted)', fontSize: '0.9rem', fontWeight: 'bold', flexShrink: 0, fontVariantNumeric: 'tabular-nums', paddingLeft: '4px' }}>
                          {detalles[m.id]?.notaFinal ? `Nota: ${detalles[m.id].notaFinal}` : 'Sin nota'}
                        </span>
                      </div>
                      {detalles[m.id]?.dificultad && (
                        <div className="stars-container" style={{ display: 'flex', gap: '2px', marginLeft: '15px', flexShrink: 0 }}>
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < detalles[m.id].dificultad ? "var(--cursada)" : "none"} stroke={i < detalles[m.id].dificultad ? "var(--cursada)" : "var(--muted)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--muted)', fontSize: '1.1rem', fontWeight: 'bold' }}>Promedio del Plan</span>
                <span style={{ color: 'var(--text-strong)', fontSize: '2.2rem', fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{stats.promedio}</span>
              </div>
            </section>

            <section style={{ width: '100%', background: 'var(--panel)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'block' }}>
              <h3 style={{ color: 'var(--text-strong)', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                Evolución del Promedio
              </h3>
              {dataGrafico.length < 2 ? (
                <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--muted)', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                  Necesitás cargar notas en al menos 2 materias para ver tu gráfico de evolución en este plan.
                </div>
              ) : (
                <div id="chart-container" style={{ width: '100%', height: '350px', position: 'relative' }}>
                  {isMounted && chartWidth > 0 ? (
                    <LineChart style={{ userSelect: 'none' }} width={chartWidth} height={350} data={dataGrafico} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="nombreCompleto" stroke="var(--muted)" tick={false} tickLine={false} axisLine={false} tickMargin={10} />
                      <YAxis domain={[1, 10]} ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} stroke="var(--muted)" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                      <Line type="monotone" dataKey="promedio" name="Promedio Histórico" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: 'var(--panel)' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                      <Line type="monotone" dataKey="nota" name="Nota de la Materia" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#10b981', strokeWidth: 0 }} />
                    </LineChart>
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="spinner" style={{ width: '30px', height: '30px', border: '3px solid var(--border)', borderTopColor: 'var(--cursando)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    </div>
                  )}
                </div>
              )}
            </section>

          </div>
        </div>

        <GradeModal 
          isOpen={isGradeModalOpen} 
          onClose={() => setIsGradeModalOpen(false)} 
          materiaName={selectedMateria?.name || ''} 
          initialNota={selectedMateria ? detalles[selectedMateria?.id]?.notaFinal : null}
          initialDificultad={selectedMateria ? detalles[selectedMateria?.id]?.dificultad : null}
          onSubmit={(nota, dificultad) => { 
            if (selectedMateria) { 
              actualizarDetalleMateria(selectedMateria.id, { 
                ...detalles[selectedMateria.id], notaFinal: nota, dificultad: dificultad 
              }); 
            } 
          }} 
        />
      </main>
    </>
  );
}