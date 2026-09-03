'use client';

import { useState } from 'react';
import Avatar from './Avatar';
import Badge from './Badge';
import Button from './Button';
import { MockPerson } from '../lib/data/mockPeople';

const TONE_BY_RELACION = { amigo: 'aprobada', companero: 'accent', ninguno: 'muted' } as const;
const LABEL_BY_RELACION = { amigo: 'Amigo', companero: 'Compañero', ninguno: 'Sin conexión' } as const;

export default function PersonCard({ person }: { person: MockPerson }) {
  const [esAmigo, setEsAmigo] = useState(person.relacion === 'amigo');
  const relacion = esAmigo ? 'amigo' : person.relacion === 'amigo' ? 'companero' : person.relacion;

  return (
    <div className="list-row" style={{ justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0 }}>
        <Avatar name={person.nombre} size="sm" />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: 'var(--text-strong)', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {person.nombre}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{person.carrera}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
        <Badge tone={TONE_BY_RELACION[relacion]}>{LABEL_BY_RELACION[relacion]}</Badge>
        <Button
          type="button"
          variant={esAmigo ? 'ghost' : 'secondary'}
          onClick={() => setEsAmigo(v => !v)}
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
        >
          {esAmigo ? 'Quitar amigo' : 'Agregar amigo'}
        </Button>
      </div>
    </div>
  );
}
