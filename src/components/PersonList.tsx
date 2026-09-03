'use client';

import { useState } from 'react';
import Tabs from './Tabs';
import PersonCard from './PersonCard';
import { MockPerson } from '../lib/data/mockPeople';

const TABS = [
  { id: 'amigo', label: 'Amigos' },
  { id: 'companero', label: 'Compañeros' },
] as const;

export default function PersonList({ people }: { people: MockPerson[] }) {
  const [activeId, setActiveId] = useState<'amigo' | 'companero'>('companero');
  const filtrados = people.filter(p => p.relacion === activeId || (activeId === 'amigo' && p.relacion === 'amigo'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Tabs items={[...TABS]} activeId={activeId} onChange={id => setActiveId(id as 'amigo' | 'companero')} />
      {filtrados.length === 0 ? (
        <div style={{ color: 'var(--muted)', fontSize: '0.85rem', padding: 'var(--space-4) 0', textAlign: 'center' }}>
          Todavía no hay nadie acá.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {filtrados.map(p => <PersonCard key={p.id} person={p} />)}
        </div>
      )}
    </div>
  );
}
