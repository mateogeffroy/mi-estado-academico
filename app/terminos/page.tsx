// app/terminos/page.tsx
'use client';

import Link from 'next/link';

export default function TerminosPage() {
  return (
    <main style={{ paddingTop: '120px', paddingBottom: '80px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '800px', margin: '0 auto', minHeight: '100vh', color: 'var(--text)' }}>
      
      <Link href="/" style={{ textDecoration: 'none' }}>
        <button className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginBottom: '30px' }}>
          ← Volver
        </button>
      </Link>

      <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px' }}>Términos y Condiciones</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', lineHeight: '1.6', marginTop: '30px' }}>
        <section>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>1. Naturaleza del Proyecto</h2>
          <p><strong>Mi Estado Académico</strong> es una herramienta desarrollada de manera independiente. <strong>No es un sistema oficial de la Universidad Tecnológica Nacional (UTN) ni de la Facultad Regional La Plata (FRLP).</strong></p>
        </section>

        <section>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>2. Responsabilidad del Usuario</h2>
          <p>La información reflejada en esta plataforma depende enteramente de la carga manual realizada por el usuario. El creador de esta plataforma no se hace responsable por discrepancias, errores de cálculo, correlatividades mal aplicadas o fechas incorrectas. El usuario acepta que <strong>el único medio oficial y válido para consultar su estado académico es el sistema SYSACAD</strong>.</p>
        </section>

        <section>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>3. Disponibilidad del Servicio</h2>
          <p>El servicio se ofrece "tal cual es". Nos reservamos el derecho de modificar, suspender o discontinuar la plataforma (o cualquier parte de la misma) en cualquier momento y sin previo aviso. Al tratarse de una herramienta gratuita, no se garantizan tiempos de actividad ininterrumpidos.</p>
        </section>

        <section>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>4. Cuentas de Usuario</h2>
          <p>El usuario es responsable de mantener la confidencialidad de su cuenta y contraseña. Nos reservamos el derecho de suspender o eliminar cuentas que realicen un uso abusivo del sistema (como spam, intentos de vulneración de seguridad, o sobrecarga intencional de la base de datos).</p>
        </section>
      </div>
    </main>
  );
}