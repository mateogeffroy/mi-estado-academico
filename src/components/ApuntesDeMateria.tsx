'use client';

import { useCallback, useEffect, useState } from 'react';
import Card from './Card';
import Avatar from './Avatar';
import Badge from './Badge';
import Button from './Button';
import Input from './Input';
import CustomSelect from './CustomSelect';
import ConfirmModal from './ConfirmModal';
import { supabase } from '../lib/supabase';
import { amistadesRepository, apuntesRepository } from '../infrastructure/repositorios';
import { PerfilPublico } from '../application/ports/AmistadesRepository';
import {
  Apunte,
  FORMATOS_APUNTE,
  TAMANO_MAXIMO_APUNTE,
  TipoApunte,
  VisibilidadApunte,
  extensionDe,
} from '../application/ports/ApuntesRepository';

const TIPOS: Record<string, TipoApunte> = {
  'Resumen': 'resumen',
  'Ejercicios resueltos': 'ejercicios',
  'Código': 'codigo',
  'Otro': 'otro',
};
const ETIQUETA_TIPO: Record<TipoApunte, string> = {
  resumen: 'Resumen',
  ejercicios: 'Ejercicios',
  codigo: 'Código',
  otro: 'Otro',
};

const VISIBILIDADES: Record<string, VisibilidadApunte> = {
  'Todos': 'publico',
  'Sólo mis amigos': 'amigos',
};

const ACEPTADOS = Object.keys(FORMATOS_APUNTE).map(ext => `.${ext}`).join(',');

const pesoLegible = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const claveDe = (etiquetas: Record<string, string>, valor: string) =>
  Object.keys(etiquetas).find(k => etiquetas[k] === valor) ?? Object.keys(etiquetas)[0];

export default function ApuntesDeMateria({ materiaId }: { materiaId: string }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [apuntes, setApuntes] = useState<Apunte[]>([]);
  const [autores, setAutores] = useState<Record<string, PerfilPublico>>({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [abierto, setAbierto] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState<TipoApunte>('resumen');
  const [visibilidad, setVisibilidad] = useState<VisibilidadApunte>('publico');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [aBorrar, setABorrar] = useState<Apunte | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const cargar = useCallback(async () => {
    const lista = await apuntesRepository.listarDeMateria(materiaId);
    setApuntes(lista);
    const perfiles = await amistadesRepository.obtenerPerfiles([...new Set(lista.map(a => a.userId))]);
    setAutores(Object.fromEntries(perfiles.map(p => [p.userId, p])));
  }, [materiaId]);

  useEffect(() => {
    if (!userId) return;
    setCargando(true);
    cargar()
      .catch(e => setError(e.message))
      .finally(() => setCargando(false));
  }, [userId, cargar]);

  const limpiarFormulario = () => {
    setTitulo('');
    setDescripcion('');
    setTipo('resumen');
    setVisibilidad('publico');
    setArchivo(null);
  };

  const handleSubir = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !archivo) return;

    setSubiendo(true);
    setError(null);
    try {
      await apuntesRepository.subir(userId, { materiaId, titulo, descripcion, tipo, visibilidad, archivo });
      await cargar();
      limpiarFormulario();
      setAbierto(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubiendo(false);
    }
  };

  const handleDescargar = async (apunte: Apunte) => {
    setError(null);
    try {
      const url = await apuntesRepository.urlDeDescarga(apunte.archivoPath);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBorrar = async (apunte: Apunte) => {
    if (!userId) return;
    setError(null);
    try {
      await apuntesRepository.borrar(userId, apunte);
      await cargar();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!userId) return null;

  const extensionInvalida = archivo != null && !FORMATOS_APUNTE[extensionDe(archivo.name)];
  const demasiadoGrande = archivo != null && archivo.size > TAMANO_MAXIMO_APUNTE;
  const puedeSubir = Boolean(archivo) && titulo.trim().length > 0 && !extensionInvalida && !demasiadoGrande && !subiendo;

  return (
    <Card style={{ marginTop: 'var(--space-5)' }}>
      <style>{`
        .apunte-item { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-3); flex-wrap: wrap; background: var(--glass-bg); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px 14px; }
        .apunte-titulo { font-weight: 600; color: var(--text-strong); font-size: 0.92rem; overflow-wrap: anywhere; }
        .apunte-desc { font-size: 0.8rem; color: var(--text); margin-top: 4px; overflow-wrap: anywhere; }
        .apunte-meta { font-size: 0.72rem; color: var(--muted); margin-top: 6px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .apunte-acciones { display: flex; align-items: center; gap: var(--space-2); flex-shrink: 0; }
        .apunte-acciones button { padding: 6px 12px; font-size: 0.8rem; }
        .apunte-form { display: flex; flex-direction: column; gap: 12px; background: var(--glass-bg); padding: 18px; border-radius: var(--radius-md); border: 1px dashed var(--border); margin-top: 14px; }
        .apunte-form-fila { display: flex; gap: 12px; flex-wrap: wrap; }
        .apunte-form-fila > * { flex: 1 1 180px; min-width: 0; }
        .apunte-label { font-size: 0.7rem; color: var(--muted); text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 6px; display: block; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
        <h2 style={{ color: 'var(--text-strong)', fontSize: '1.2rem', margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Apuntes
        </h2>
        <button type="button" className="add-toggle-btn" onClick={() => setAbierto(!abierto)}>
          {abierto ? '– Cerrar' : '+ Subir apunte'}
        </button>
      </div>

      {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: 'var(--space-3)' }}>{error}</p>}

      {abierto && (
        <form onSubmit={handleSubir} className="apunte-form">
          <div>
            <label className="apunte-label">Título</label>
            <Input
              type="text"
              placeholder="Ej: Resumen unidad 3"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              maxLength={120}
              required
            />
          </div>

          <div>
            <label className="apunte-label">Descripción (opcional)</label>
            <Input
              type="text"
              placeholder="Qué contiene, de qué año es..."
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              maxLength={280}
            />
          </div>

          <div className="apunte-form-fila">
            <div>
              <label className="apunte-label">Tipo</label>
              <CustomSelect
                value={claveDe(TIPOS, tipo)}
                options={Object.keys(TIPOS)}
                onChange={val => setTipo(TIPOS[val])}
              />
            </div>
            <div>
              <label className="apunte-label">Quién lo puede ver</label>
              <CustomSelect
                value={claveDe(VISIBILIDADES, visibilidad)}
                options={Object.keys(VISIBILIDADES)}
                onChange={val => setVisibilidad(VISIBILIDADES[val])}
              />
            </div>
          </div>

          <div>
            <label className="apunte-label">Archivo ({Object.keys(FORMATOS_APUNTE).join(', ')} · hasta 10 MB)</label>
            <input
              type="file"
              accept={ACEPTADOS}
              onChange={e => setArchivo(e.target.files?.[0] ?? null)}
              style={{ width: '100%', color: 'var(--text)', fontSize: '0.85rem' }}
              required
            />
            {extensionInvalida && (
              <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '6px' }}>
                Ese formato no se acepta. Sólo {Object.keys(FORMATOS_APUNTE).join(', ')}.
              </p>
            )}
            {demasiadoGrande && (
              <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '6px' }}>
                El archivo pesa {pesoLegible(archivo!.size)} y el máximo son 10 MB.
              </p>
            )}
          </div>

          <p style={{ color: 'var(--muted)', fontSize: '0.75rem', margin: 0, lineHeight: 1.5 }}>
            Subí sólo material propio o de libre circulación. No subas libros ni material con derechos de autor.
          </p>

          <Button type="submit" variant="primary" disabled={!puedeSubir}>
            {subiendo ? 'Subiendo...' : 'Subir apunte'}
          </Button>
        </form>
      )}

      <div style={{ marginTop: abierto ? 'var(--space-4)' : 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {cargando ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0 }}>Cargando apuntes...</p>
        ) : apuntes.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0 }}>
            Todavía no hay apuntes en esta materia. Podés ser el primero.
          </p>
        ) : (
          apuntes.map(apunte => {
            const autor = autores[apunte.userId];
            const esMio = apunte.userId === userId;
            return (
              <div key={apunte.id} className="apunte-item">
                <div style={{ minWidth: 0, flex: '1 1 240px' }}>
                  <div className="apunte-titulo">{apunte.titulo}</div>
                  {apunte.descripcion && <div className="apunte-desc">{apunte.descripcion}</div>}
                  <div className="apunte-meta">
                    <Avatar name={autor?.nombre ?? 'Alguien'} size="sm" />
                    <span>{esMio ? 'Vos' : autor?.nombre ?? 'Usuario'}</span>
                    <span>·</span>
                    <span>{ETIQUETA_TIPO[apunte.tipo]}</span>
                    <span>·</span>
                    <span>{extensionDe(apunte.archivoPath).toUpperCase()} · {pesoLegible(apunte.tamano)}</span>
                    {esMio && apunte.visibilidad === 'amigos' && <Badge tone="muted">Sólo amigos</Badge>}
                  </div>
                </div>

                <div className="apunte-acciones">
                  <Button type="button" variant="secondary" onClick={() => handleDescargar(apunte)}>
                    Abrir
                  </Button>
                  {esMio && (
                    <Button type="button" variant="ghost" style={{ color: 'var(--danger)' }} onClick={() => setABorrar(apunte)}>
                      Borrar
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <ConfirmModal
        isOpen={aBorrar !== null}
        title="Borrar apunte"
        message={aBorrar ? `¿Seguro que querés borrar "${aBorrar.titulo}"? Se elimina el archivo y no se puede recuperar.` : ''}
        confirmText="Sí, borrar"
        isDanger
        onConfirm={() => {
          const apunte = aBorrar;
          setABorrar(null);
          if (apunte) handleBorrar(apunte);
        }}
        onCancel={() => setABorrar(null)}
      />
    </Card>
  );
}
