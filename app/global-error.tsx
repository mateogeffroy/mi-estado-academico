'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

// Red de contención de último nivel: solo se activa si el error ocurre en el
// propio layout raíz (fuera del alcance de app/error.tsx). Reemplaza <html>
// por completo, así que no puede depender de ningún estilo/componente global.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="es">
      <body style={{ margin: 0, background: '#0d0f14', color: '#c8d0e0', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>
          <h1 style={{ color: '#ffffff', fontSize: '1.4rem', marginBottom: '10px' }}>Algo salió mal</h1>
          <p style={{ color: '#5a6278', marginBottom: '20px', lineHeight: 1.5 }}>
            Ya quedó registrado el error. Podés intentar de nuevo o volver más tarde.
          </p>
          <button
            onClick={() => reset()}
            style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
