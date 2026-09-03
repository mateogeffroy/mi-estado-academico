'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePlan } from '../src/context/PlanContext';
import SpotlightCard from '../src/components/SpotlightCard';
import HorarioCalendar from '../src/components/HorarioCalendar';
import DayAgenda, { buildDayData, formatDateStr, getEventColor } from '../src/components/DayAgenda';
import { getCuatrimestreActual, getInhabiles } from '../src/lib/data/calendario';

// Diccionario para mostrar nombres limpios en el selector
const NOMBRES_CARRERAS: Record<string, string> = {
  'utn-sistemas-2023': 'Ingeniería en Sistemas',
  'utn-civil-2023': 'Ingeniería Civil',
  'utn-industrial-2008': 'Ingeniería Industrial',
  'utn-mecanica-2023': 'Ingeniería Mecánica',
  'utn-quimica-2008': 'Ingeniería Química',
  'utn-electrica-2023': 'Ingeniería Eléctrica',
  'unlp-apu-2021': 'APU (UNLP)',
  'unlp-sistemas-2021': 'Lic. en Sistemas (UNLP)',
  'unlp-informatica-2021': 'Lic. en Informática (UNLP)',
  'unlp-psicologia-2012': 'Psicología (UNLP)',
  'unlp-computacion-2024': 'Ing. en Computación (UNLP)',
  'unlp-sonido-2023': 'Tec. en Sonido (UNLP)',
};

export default function Dashboard() {
  const { careerData, materias, detalles, todasLasCarreras, careerId, setCarreraActiva } = usePlan();
  const { ALL } = careerData;

  // Único filtro de cuatrimestre: controla tanto el horario semanal como
  // qué materias se consideran "sin horario asignado" más abajo. Arranca
  // en el cuatrimestre que corresponde a la fecha real (ver
  // getCuatrimestreActual); si el usuario ya había elegido uno a mano, el
  // useEffect de abajo lo pisa con lo guardado en localStorage.
  const [filtroCuatri, setFiltroCuatri] = useState<string>(() => getCuatrimestreActual());
  const [tourStep, setTourStep] = useState(0);
  const [mostrarTodosEventos, setMostrarTodosEventos] = useState(false);

  useEffect(() => {
    const filtroGuardado = localStorage.getItem('filtroCuatrimestre');
    if (filtroGuardado && filtroGuardado !== 'Ambos') {
      setFiltroCuatri(filtroGuardado);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasViewedTour = localStorage.getItem('mea_tutorial_home_v3');
      if (!hasViewedTour) {
        setTimeout(() => setTourStep(1), 600);
      }
    }
  }, []);

  const closeTour = () => {
    setTourStep(0);
    localStorage.setItem('mea_tutorial_home_v3', 'true');
  };

  const skipTour = () => {
    setTourStep(0);
    localStorage.setItem('mea_tutorial_home_v3', 'true');
  };

  // isElectivePlaceholder ("Electivas N° Nivel") puede quedar en estado
  // 'cursando' automáticamente cuando el usuario tiene alguna electiva de
  // ese nivel en curso (evaluarCorrelatividades.ts) — no es una materia
  // real, no tiene horario propio para cargar. calcularEstadisticas.ts ya
  // lo excluye de las stats; acá hay que hacer lo mismo o termina pidiendo
  // agendarle un horario a algo que no existe como cursada en sí misma.
  const cursando = ALL.filter((s: any) => materias[s.id] === 'cursando' && !s.isElectivePlaceholder);

  const obtenerProximosEventos = () => {
    const eventosMapeados: any[] = [];
    const d = new Date();
    const hoyStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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
    return eventosMapeados;
  };

  const proximosEventos = obtenerProximosEventos();

  // Lista corta por default (5) con el 6to transparentado detrás de
  // "Mostrar más" en vez de siempre mostrar todo o siempre cortar en 5.
  const eventosVisibles = mostrarTodosEventos ? proximosEventos : proximosEventos.slice(0, 5);
  const eventoTeaser = !mostrarTodosEventos && proximosEventos.length > 5 ? proximosEventos[5] : null;

  const formatearFecha = (fechaISO: string) => {
    const partes = fechaISO.split('-');
    if (partes.length === 3) return `${partes[2]}/${partes[1]}`;
    return fechaISO;
  };

  const horariosSemanales: Record<string, any[]> = { 'Lunes': [], 'Martes': [], 'Miércoles': [], 'Jueves': [], 'Viernes': [], 'Sábado': [], 'Domingo': [] };
  
  cursando.forEach((m: any) => {
    const tieneComisiones = m.comisiones && m.comisiones.length > 0;
    const nombreMateriaLimpio = m.name.replace(/\s*\([^)]*\)/g, '').trim();

    if (tieneComisiones) {
      const comisionId = detalles[m.id]?.comision;
      if (comisionId) {
        const comisionData = m.comisiones.find((c: any) => c.id === comisionId);
        if (comisionData && comisionData.dias) {
          const duracion = comisionData.duration || 'A';
          if (filtroCuatri === '1' && duracion === '2') return; 
          if (filtroCuatri === '2' && duracion === '1') return; 

          let cuatrimestre = 'Anual';
          if (duracion === '1') cuatrimestre = '1° Cuatr.';
          else if (duracion === '2') cuatrimestre = '2° Cuatr.';

          comisionData.dias.forEach((dia: any) => {
            let nombreDiaLimpio = dia.nombre.split(' ')[0];
            if (horariosSemanales[nombreDiaLimpio]) {
              horariosSemanales[nombreDiaLimpio].push({ id: `${m.id}-${dia.nombre}`, materiaId: m.id, materiaLimpia: nombreMateriaLimpio, cuatrimestre, duracion, inicio: dia.inicio, fin: dia.fin, comision: comisionId });
            }
          });
        }
      }
    } else {
      const horariosCustom = detalles[m.id]?.horariosCustom;
      if (horariosCustom && horariosCustom.length > 0) {
        horariosCustom.forEach((horario: any) => {
          const hDur = horario.duracion || 'Anual';
          let dCode = 'A';
          if (hDur.includes('1º')) dCode = '1';
          if (hDur.includes('2º')) dCode = '2';

          if (filtroCuatri === '1' && dCode === '2') return; 
          if (filtroCuatri === '2' && dCode === '1') return; 

          let cuatrimestre = 'Anual';
          if (dCode === '1') cuatrimestre = '1º Cuatr.';
          else if (dCode === '2') cuatrimestre = '2º Cuatr.';

          let nombreDiaLimpio = horario.dia.split(' ')[0];
          if (horariosSemanales[nombreDiaLimpio]) {
            horariosSemanales[nombreDiaLimpio].push({ id: `${m.id}-${horario.id}`, materiaId: m.id, materiaLimpia: nombreMateriaLimpio, cuatrimestre, duracion: dCode, inicio: horario.inicio, fin: horario.fin, comision: 'Pers.' });
          }
        });
      }
    }
  });

  const ordenDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const diasMostrar = ordenDias.filter(dia => horariosSemanales[dia].length > 0);

  // Sección "Hoy": lo que pasa en el día en curso, arriba de todo, sin tener
  // que buscar la columna correcta en la grilla semanal.
  const hoy = new Date();
  const hoyStr = formatDateStr(hoy);
  const diaHoy = ordenDias[(hoy.getDay() + 6) % 7]; // getDay(): 0 = domingo
  const datosHoy = buildDayData({
    dia: diaHoy,
    dateStr: hoyStr,
    horarios: horariosSemanales,
    detalles,
    materiasData: ALL,
    inhabiles: getInhabiles(careerId),
  });
  const fechaHoyTexto = hoy.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  const eventosDeClaseHoy = (materiaId: string) =>
    detalles?.[materiaId]?.eventos?.filter((ev: any) => ev.fecha === hoyStr) || [];

  // Materias "cursando" que no tienen ninguna forma de horario cargado (ni
  // comisión elegida, ni horario personalizado): no aparecen en el calendario
  // y por eso ameritan un aviso propio en vez de perderse silenciosamente.
  const materiasSinHorario = cursando.filter((m: any) => {
    const tieneComisiones = m.comisiones && m.comisiones.length > 0;
    if (tieneComisiones) return !detalles[m.id]?.comision;
    const horariosCustom = detalles[m.id]?.horariosCustom;
    return !horariosCustom || horariosCustom.length === 0;
  });

  // Duración (1°/2°/Anual) de una materia cursando, para filtrarla en la
  // lista de abajo con el mismo criterio que ya usa el calendario: primero
  // la comisión elegida o el horario custom, y si no hay ninguno cargado
  // todavía, la duración default del catálogo.
  const getSubjectDuration = (m: any) => {
    const tieneComisiones = m.comisiones && m.comisiones.length > 0;
    if (tieneComisiones) {
      const comisionId = detalles[m.id]?.comision;
      if (comisionId) {
        const comisionData = m.comisiones.find((c: any) => c.id === comisionId);
        if (comisionData && comisionData.duration) return String(comisionData.duration);
      }
    } else {
      const horariosCustom = detalles[m.id]?.horariosCustom;
      if (horariosCustom && horariosCustom.length > 0) {
        const hDur = horariosCustom[0].duracion || 'Anual';
        if (hDur.includes('1º') || hDur === '1') return '1';
        if (hDur.includes('2º') || hDur === '2') return '2';
        return 'A';
      }
    }
    return m.duration ? String(m.duration) : 'A';
  };

  // Las anuales se muestran siempre, sin importar qué cuatrimestre esté
  // seleccionado; el resto sigue al mismo filtro único del calendario.
  const cursandoFiltrado = cursando.filter((m: any) => {
    const dur = getSubjectDuration(m);
    if (dur === 'A' || dur.toLowerCase() === 'anual') return true;
    return dur === filtroCuatri;
  });

  return (
    <>
      <style>{`
        .tour-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--overlay-bg); z-index: 9998; backdrop-filter: blur(3px); transition: opacity 0.3s ease; }
        .tour-dialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 420px; background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 24px; z-index: 10000; box-shadow: 0 20px 40px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 16px; text-align: center; }

        .dashboard-main { padding-bottom: 80px; display: flex; flex-direction: column; gap: clamp(20px, 3vh, 40px); max-width: 1200px; margin: 0 auto; padding-left: clamp(12px, 2vw, 20px); padding-right: clamp(12px, 2vw, 20px); }

        .career-selector { background: var(--bg); border: 1px solid var(--border); color: var(--text-strong); padding: 4px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; outline: none; cursor: pointer; transition: all 0.2s; width: fit-content; max-width: 250px; text-overflow: ellipsis; }
        .career-selector:hover { border-color: var(--cursando); }

        .schedule-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: clamp(12px, 2.5vh, 25px); }
        .schedule-toggle { display: flex; background: var(--panel); padding: 4px; border-radius: 12px; border: 1px solid var(--border); }

        .home-section-title { color: var(--text-strong); font-size: 1.1rem; margin: 0 0 14px 0; font-weight: bold; display: flex; align-items: center; gap: 8px; }

        .hoy-list { display: flex; flex-direction: column; gap: 10px; }

        /* Agenda: lo urgente/accionable (próximos parciales, materias sin
           horario) primero y en una tira horizontal, antes del calendario.
           Antes vivía en una columna lateral al lado del calendario, donde
           en mobile quedaba después de todo. */
        .agenda-strip { display: flex; gap: 12px; overflow-x: auto; padding: 4px 2px 10px; -webkit-overflow-scrolling: touch; }
        .agenda-card { flex-shrink: 0; width: 240px; padding: 14px; border-radius: 12px; background: var(--panel); border: 1px solid var(--border); text-decoration: none; display: flex; flex-direction: column; gap: 8px; }
        .agenda-card-evento { border-left: 3px solid var(--evento-color, var(--cursando)); }
        .agenda-card-alerta { border-left: 3px solid var(--danger); }
        .agenda-card-title { font-size: 0.9rem; font-weight: 700; color: var(--text-strong); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .agenda-card-sub { font-size: 0.75rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .agenda-card-date { align-self: flex-start; background: var(--bg); padding: 4px 10px; border-radius: 8px; font-family: 'Space Mono', monospace; font-weight: bold; font-size: 0.8rem; color: var(--text-strong); }
        .agenda-card-cta { font-size: 0.75rem; color: var(--danger); font-weight: bold; }

        /* Próximos eventos: lista vertical (no tira horizontal), con el 6to
           registro transparentado detrás de "Mostrar más" en vez de cortar
           en seco o mostrar todo de una. */
        .eventos-list { display: flex; flex-direction: column; gap: 10px; }
        .evento-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px; border-radius: 12px; background: var(--panel); border: 1px solid var(--border); border-left: 3px solid var(--cursando); text-decoration: none; }
        .evento-row-text { flex: 1; min-width: 0; }
        .evento-row-materia { display: block; font-weight: bold; color: var(--text-strong); font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .evento-row-tipo { display: block; font-size: 0.75rem; font-weight: 700; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .evento-row-date { flex-shrink: 0; background: var(--bg); padding: 6px 10px; border-radius: 8px; font-family: 'Space Mono', monospace; font-weight: bold; font-size: 0.85rem; color: var(--text-strong); }
        .eventos-teaser-wrap { position: relative; margin-top: 10px; }
        .eventos-teaser-row { opacity: 0.35; pointer-events: none; filter: blur(1px); }
        .eventos-mostrar-mas { position: absolute; inset: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(to bottom, transparent, var(--bg) 65%); border: none; border-radius: 12px; color: var(--cursando); font-weight: bold; font-size: 0.85rem; cursor: pointer; }

        @media (max-width: 600px) {
          .career-selector { margin: 0 auto; }
          .schedule-header { flex-direction: column; justify-content: center; gap: 14px; margin-bottom: 12px; }
          .schedule-toggle { justify-content: center; width: 100%; max-width: 320px; }
          .schedule-toggle > div { flex: 1; text-align: center; }
        }
      `}</style>

      {/* Tutorial Overlay */}
      {tourStep > 0 && (
        <>
          <div className="tour-overlay" />
          <div className="tour-dialog">
            {tourStep === 1 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.3rem' }}>¡Bienvenido/a a bordo!</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  Tu interfaz principal (el <strong>Home</strong>) ahora es un Dashboard inteligente. Todo lo que apruebes o curses se va a reflejar automáticamente acá.
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={skipTour} className="btn-secondary" style={{ flex: 1 }}>Omitir</button>
                  <button onClick={() => setTourStep(2)} className="btn-primary" style={{ flex: 1 }}>Siguiente</button>
                </div>
              </>
            )}
            {tourStep === 2 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.2rem' }}>Plan de Estudios</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  Es el corazón de la app. Al ir a tu <strong>Plan de Estudios</strong>, podés destrabar correlatividades y poner tus materias en estado "Aprobada" o "Cursando".
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={skipTour} className="btn-secondary" style={{ flex: 1 }}>Omitir</button>
                  <button onClick={() => setTourStep(3)} className="btn-primary" style={{ flex: 1 }}>Siguiente</button>
                </div>
              </>
            )}
            {tourStep === 3 && (
              <>
                <h3 style={{ color: 'var(--text-strong)', margin: 0, fontSize: '1.2rem' }}>Armá tu Horario</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  Las materias que pongas en <strong>"Cursando"</strong> aparecerán en tu Home. Al entrar a cada una, vas a poder elegir la comisión real para que se dibuje sola en tu grilla de horarios.
                </p>
                <button onClick={closeTour} className="btn-primary" style={{ width: '100%', marginTop: '10px', padding: '12px' }}>
                  ¡Entendido, a organizar!
                </button>
              </>
            )}
          </div>
        </>
      )}

      <main className="dashboard-main">

        {/* --- Hoy: fecha, clases y eventos del día en curso --- */}
        <div>
          <h3 className="home-section-title" style={{ textTransform: 'capitalize' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {fechaHoyTexto}
          </h3>
          <div className="hoy-list">
            <DayAgenda
              clases={datosHoy.clases}
              eventosFantasma={datosHoy.eventosFantasma}
              inhabil={datosHoy.inhabil}
              eventosDeClase={eventosDeClaseHoy}
              emptyText="Hoy no tenés clases ni eventos."
            />
          </div>
        </div>

        {/* --- Horario Semanal: primer foco al abrir la app --- */}
        <div id="seccion-horarios">
          <HorarioCalendar
            horarios={horariosSemanales}
            isEmpty={diasMostrar.length === 0}
            detalles={detalles}
            materiasData={ALL}
            title={
              <h3 style={{ color: 'var(--cursando)', fontSize: '1.4rem', margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Horario Semanal
              </h3>
            }
            action={
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {todasLasCarreras?.length > 1 && (
                  <select
                    value={careerId}
                    onChange={(e) => setCarreraActiva(e.target.value)}
                    className="career-selector"
                    title="Cambiar carrera actual"
                  >
                    {todasLasCarreras.map(id => (
                      <option key={id} value={id}>{NOMBRES_CARRERAS[id] || id}</option>
                    ))}
                  </select>
                )}
                <div className="schedule-toggle" style={{ display: 'flex', background: 'var(--bg)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  {['1', '2'].map((opcion) => (
                    <div key={opcion} onClick={() => { setFiltroCuatri(opcion); localStorage.setItem('filtroCuatrimestre', opcion); }}
                      style={{ padding: '8px 20px', fontSize: '0.85rem', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', transition: '0.3s',
                        color: filtroCuatri === opcion ? '#fff' : 'var(--muted)',
                        background: filtroCuatri === opcion ? 'var(--cursando)' : 'transparent'
                      }}>
                      {opcion === '1' ? '1º Cuatri' : '2º Cuatri'}
                    </div>
                  ))}
                </div>
              </div>
            }
          />
        </div>

        {/* --- Materias sin horario cargado: aviso corto, horizontal --- */}
        {materiasSinHorario.length > 0 && (
          <div>
            <h3 className="home-section-title" style={{ color: 'var(--danger)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Sin horario asignado ({materiasSinHorario.length})
            </h3>
            <div className="agenda-strip">
              {materiasSinHorario.map((m: any) => (
                <Link href={`/materia/${m.id}`} key={m.id} className="agenda-card agenda-card-alerta">
                  <span className="agenda-card-title">{m.name}</span>
                  <span className="agenda-card-cta">Cargar horario &rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* --- Próximos eventos: lista, 5 por default + teaser del 6to --- */}
        {proximosEventos.length > 0 && (
          <div>
            <h3 className="home-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              Próximos eventos
            </h3>
            <div className="eventos-list">
              {eventosVisibles.map(evento => (
                <Link href={`/materia/${evento.materiaId}`} key={evento.id} className="evento-row" style={{ borderLeftColor: getEventColor(evento.tipo) }}>
                  <div className="evento-row-text">
                    <span className="evento-row-materia">{evento.materia}</span>
                    <span className="evento-row-tipo" style={{ color: getEventColor(evento.tipo) }}>{evento.tipo}: {evento.nombre}</span>
                  </div>
                  <span className="evento-row-date">{formatearFecha(evento.fecha)}</span>
                </Link>
              ))}
            </div>

            {eventoTeaser && (
              <div className="eventos-teaser-wrap">
                <div className="evento-row eventos-teaser-row" style={{ borderLeftColor: getEventColor(eventoTeaser.tipo) }}>
                  <div className="evento-row-text">
                    <span className="evento-row-materia">{eventoTeaser.materia}</span>
                    <span className="evento-row-tipo" style={{ color: getEventColor(eventoTeaser.tipo) }}>{eventoTeaser.tipo}: {eventoTeaser.nombre}</span>
                  </div>
                  <span className="evento-row-date">{formatearFecha(eventoTeaser.fecha)}</span>
                </div>
                <button className="eventos-mostrar-mas" onClick={() => setMostrarTodosEventos(true)}>
                  Mostrar {proximosEventos.length - 5} más
                </button>
              </div>
            )}
          </div>
        )}

        {/* Lista de materias filtrada por el mismo cuatrimestre del calendario:
            queda como acceso directo a una materia aunque no se vea su bloque
            en el calendario (otra semana, sin horario, etc). */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--text-strong)', fontSize: '1.3rem', margin: 0, fontWeight: 'bold' }}>Materias</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>({cursandoFiltrado.length})</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {cursandoFiltrado.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '30px', textAlign: 'center', color: 'var(--muted)', background: 'var(--panel)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                {cursando.length === 0
                  ? 'No tenés materias marcadas como "Cursando" actualmente.'
                  : `No tenés materias marcadas en el ${filtroCuatri}º Cuatrimestre.`}
              </div>
            ) : (
              cursandoFiltrado.map((m: any) => {
                const comisionSeleccionada = detalles[m.id]?.comision;
                const horariosCustom = detalles[m.id]?.horariosCustom;

                return (
                  <Link href={`/materia/${m.id}`} key={m.id} style={{ textDecoration: 'none' }}>
                    <SpotlightCard className="premium-card" spotlightColor="rgba(59, 130, 246, 0.1)">
                      <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'Space Mono', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        NIVEL {m.level}
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--text-strong)', marginTop: '8px', fontSize: '1.15rem' }}>
                        {m.name}
                      </div>

                      <div style={{ marginTop: '16px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        {m.comisiones && m.comisiones.length > 0 ? (
                          comisionSeleccionada ? (
                            <span style={{ color: 'var(--cursando)' }}>Comisión: {comisionSeleccionada}</span>
                          ) : (
                            <span style={{ color: 'var(--danger)' }}>No hay comisión</span>
                          )
                        ) : (
                          horariosCustom && horariosCustom.length > 0 ? (
                            <span style={{ color: '#f59e0b' }}>Horario Personalizado</span>
                          ) : (
                            <span style={{ color: 'var(--danger)' }}>Sin horario asignado</span>
                          )
                        )}
                      </div>
                    </SpotlightCard>
                  </Link>
                );
              })
            )}
          </div>
        </div>

      </main>
    </>
  );
}