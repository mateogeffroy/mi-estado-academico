'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import Link from 'next/link';

// Boundary de errores para todo lo que cuelga del layout raíz (que sí se
// sigue renderizando alrededor de esto, con header/nav intactos).
export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div style={{ textAlign: 'center', paddingTop: '150px', paddingBottom: '100px', color: 'var(--text-strong)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <h2 style={{ margin: 0 }}>Algo salió mal</h2>
      <p style={{ color: 'var(--muted)', maxWidth: '420px', lineHeight: 1.5 }}>
        Ya quedó registrado el error. Podés intentar de nuevo o volver al inicio.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="btn-primary" onClick={() => reset()}>Reintentar</button>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button className="btn-secondary">Volver al inicio</button>
        </Link>
      </div>
    </div>
  );
}
