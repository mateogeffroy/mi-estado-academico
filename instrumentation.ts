import * as Sentry from '@sentry/nextjs';

// Next.js llama a register() una vez al arrancar, tanto en el runtime de
// Node (SSR/API routes) como en el edge (middleware). Inicializamos Sentry
// distinto en cada uno porque cada runtime soporta opciones distintas.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1.0,
      enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1.0,
      enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
    });
  }
}

// Hook de Next.js que Sentry usa para capturar errores de servidor que no
// pasan por un try/catch nuestro: fallos en route handlers, server
// components y layouts anidados.
export const onRequestError = Sentry.captureRequestError;
