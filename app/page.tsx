'use client';

import Link from 'next/link';
import { usePlan } from '../src/context/PlanContext';

export default function Dashboard() {
  const { stats } = usePlan();

  return (
    <main style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="header-titles" style={{ marginBottom: '40px' }}>
        <h1 className="logo" style={{ fontSize: '2rem' }}>Mi Estado <span>Académico</span></h1>
        <p className="subtitle">Dashboard de estudiante</p>
      </div>

      <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '30px' }}>
        <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '1.2rem' }}>📊 Resumen Rápido</h2>
        <div className="stats-bar" style={{ position: 'relative', border: 'none', padding: '0', background: 'transparent' }}>
          <div className="stat">
            <span className="stat-val" style={{ color: 'var(--aprobada)' }}>{stats.aprobadas}</span>
            <span className="stat-label">Aprobadas</span>
          </div>
          <div className="stat">
            <span className="stat-val" style={{ color: 'var(--cursada)' }}>{stats.cursadas}</span>
            <span className="stat-label">Cursadas</span>
          </div>
          <div className="progress-bar" style={{ width: '100%', margin: '15px 0' }}>
            <div className="progress-fill" style={{ width: `${stats.porcentaje}%` }}></div>
          </div>
          <span style={{ color: 'var(--muted)' }}>Progreso de la carrera: {stats.porcentaje}%</span>
        </div>
      </div>

      <Link href="/plan" style={{ textDecoration: 'none' }}>
        <button className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
          Ver mi Plan de Estudios 🚀
        </button>
      </Link>
    </main>
  );
}