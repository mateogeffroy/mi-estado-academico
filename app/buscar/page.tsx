'use client';

import { useState } from 'react';
import Input from '../../src/components/Input';
import Card from '../../src/components/Card';
import PersonCard from '../../src/components/PersonCard';
import { searchPeople } from '../../src/lib/data/mockPeople';

export default function BuscarPage() {
  const [query, setQuery] = useState('');
  const resultados = searchPeople(query);

  return (
    <>
      <style>{`
        .search-results-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3); }
        @media (max-width: 1150px) { .search-results-grid { grid-template-columns: 1fr; } }
      `}</style>

      <main style={{ paddingTop: '120px', paddingBottom: '60px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', minHeight: '100vh' }}>
        <div>
          <h1 style={{ color: 'var(--text-strong)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', margin: '0 0 8px 0' }}>Buscar gente</h1>
          <p style={{ color: 'var(--muted)', margin: 0 }}>Encontrá compañeros y agregalos como amigos.</p>
        </div>

        <Input
          type="text"
          placeholder="Buscar por nombre..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />

        {resultados.length === 0 ? (
          <Card style={{ textAlign: 'center', color: 'var(--muted)' }}>No encontramos a nadie con ese nombre.</Card>
        ) : (
          <div className="search-results-grid">
            {resultados.map(p => <PersonCard key={p.id} person={p} />)}
          </div>
        )}
      </main>
    </>
  );
}
