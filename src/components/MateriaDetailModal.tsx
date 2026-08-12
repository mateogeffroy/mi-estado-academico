'use client';

import { useEffect, useRef } from 'react';
import { CareerData, Materia } from '../domain/entities/Materia';
import { DetallesMaterias, EstadoMateria, MateriasEstado } from '../domain/entities/Progreso';
import { AccionMateria } from '../application/useCases/actualizarProgreso';
import { calcularDesbloqueos } from '../domain/services/calcularDesbloqueos';

interface MateriaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Materia | null;
  estadoActual: EstadoMateria;
  materias: MateriasEstado;
  detalles: DetallesMaterias;
  careerData: CareerData;
  onCambiarEstado: (accion: AccionMateria) => void;
  onEditarNota: () => void;
}

const ESTADO_INFO: Record<string, { label: string; color: string }> = {
  aprobada: { label: 'Aprobada', color: 'var(--aprobada)' },
  cursando: { label: 'Cursando', color: 'var(--cursando)' },
  cursada: { label: 'Cursada', color: 'var(--cursada)' },
  available: { label: 'Disponible', color: 'var(--muted)' },
  disabled: { label: 'Bloqueada', color: '#ef4444' },
};

const ACCIONES: { accion: AccionMateria; estado: EstadoMateria; label: string; color: string }[] = [
  { accion: 'set_aprobada', estado: 'aprobada', label: 'Aprobada', color: 'var(--aprobada)' },
  { accion: 'set_cursando', estado: 'cursando', label: 'Cursando', color: 'var(--cursando)' },
  { accion: 'set_cursada', estado: 'cursada', label: 'Cursada', color: 'var(--cursada)' },
  { accion: 'set_available', estado: 'available', label: 'Desmarcar', color: 'var(--muted)' },
];

const getCheckIcon = (ok: boolean) => ok
  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

export default function MateriaDetailModal({
  isOpen, onClose, subject, estadoActual, materias, detalles, careerData, onCambiarEstado, onEditarNota,
}: MateriaDetailModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeBtnRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !subject) return null;

  const { getSubjectById } = careerData;
  const info = ESTADO_INFO[estadoActual] ?? ESTADO_INFO.available;

  const aprobadasRequeridasStr = (subject.correlAprobada || []).map(String);
  const cursadasFiltradas = (subject.correlCursada || []).filter((id) => !aprobadasRequeridasStr.includes(String(id)));
  const tieneCorrelativas = cursadasFiltradas.length > 0 || aprobadasRequeridasStr.length > 0;

  const nombreLimpio = (id: string) => {
    const s = getSubjectById(id);
    return s ? s.name.replace(/\s*\(.*?\)/g, '') : id;
  };

  const puedeCambiarEstado = estadoActual !== 'disabled';
  const muestraDestraba = estadoActual === 'cursando' || estadoActual === 'cursada';
  const { siCursada, siAprobadaAdicional } = muestraDestraba
    ? calcularDesbloqueos(subject.id, materias, careerData)
    : { siCursada: [], siAprobadaAdicional: [] };

  const notaFinal = detalles[subject.id]?.notaFinal;

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'var(--overlay-bg, rgba(0, 0, 0, 0.8))',
        backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 10000, padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="materia-modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '24px',
          padding: '30px', maxWidth: '440px', width: '100%', maxHeight: '85vh', overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative',
        }}
      >
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none',
            color: 'var(--muted)', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', transition: 'color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--text-strong)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--muted)')}
        >
          ✕
        </button>

        <div style={{ color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>
          {subject.num}
        </div>
        <h3 id="materia-modal-title" style={{ color: 'var(--text-strong)', fontSize: '1.3rem', margin: '0 0 16px 0', paddingRight: '20px', lineHeight: 1.25 }}>
          {subject.name}
        </h3>

        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px',
          fontSize: '0.8rem', fontWeight: 800, color: info.color,
          background: estadoActual === 'available' ? 'var(--glass-bg)' : `color-mix(in srgb, ${info.color} 15%, transparent)`,
          marginBottom: '20px',
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: info.color }} />
          {info.label}
        </span>

        {estadoActual === 'disabled' && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '12px', padding: '14px', marginBottom: '20px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-strong)' }}>Todavía no cumplís las correlativas necesarias para cursarla.</div>
          </div>
        )}

        {tieneCorrelativas && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Correlativas</div>

            {cursadasFiltradas.length > 0 && (
              <>
                <b style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', opacity: 0.9 }}>Cursada(s):</b>
                {cursadasFiltradas.map((id) => {
                  const ok = materias[id] === 'cursada' || materias[id] === 'aprobada';
                  return (
                    <div key={`c-${id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.85rem' }}>
                      {getCheckIcon(ok)} <span style={{ opacity: ok ? 1 : 0.7 }}>{nombreLimpio(id)}</span>
                    </div>
                  );
                })}
              </>
            )}

            {aprobadasRequeridasStr.length > 0 && (
              <>
                <b style={{ display: 'block', marginTop: '10px', marginBottom: '4px', fontSize: '0.85rem', opacity: 0.9 }}>Aprobada(s):</b>
                {aprobadasRequeridasStr.map((id) => {
                  const ok = materias[id] === 'aprobada';
                  return (
                    <div key={`a-${id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.85rem' }}>
                      {getCheckIcon(ok)} <span style={{ opacity: ok ? 1 : 0.7 }}>{nombreLimpio(id)}</span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {estadoActual === 'aprobada' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--glass-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 14px', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
              Nota final: <b style={{ color: notaFinal ? 'var(--text-strong)' : 'var(--muted)' }}>{notaFinal ?? 'sin cargar'}</b>
            </span>
            <button onClick={onEditarNota} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              {notaFinal ? 'Editar nota' : 'Cargar nota'}
            </button>
          </div>
        )}

        {puedeCambiarEstado && (
          <div style={{ marginBottom: muestraDestraba ? '20px' : 0 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Marcar como</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {ACCIONES.map(({ accion, estado, label, color }) => {
                const activo = estadoActual === estado;
                return (
                  <button
                    key={accion}
                    onClick={() => onCambiarEstado(accion)}
                    style={{
                      padding: '10px 12px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                      border: `1.5px solid ${activo ? color : 'var(--border)'}`,
                      background: activo ? `color-mix(in srgb, ${color} 16%, transparent)` : 'transparent',
                      color: activo ? color : 'var(--text-strong)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {muestraDestraba && (siCursada.length > 0 || siAprobadaAdicional.length > 0) && (
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Qué destraba</div>
            {siCursada.length > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <b style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', opacity: 0.9 }}>Si la marcás Cursada:</b>
                {siCursada.map((m) => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.85rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    <span>{m.name.replace(/\s*\(.*?\)/g, '')}</span>
                  </div>
                ))}
              </div>
            )}
            {siAprobadaAdicional.length > 0 && (
              <div>
                <b style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', opacity: 0.9 }}>Si la apruebas, además:</b>
                {siAprobadaAdicional.map((m) => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.85rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    <span>{m.name.replace(/\s*\(.*?\)/g, '')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
