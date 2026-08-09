import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Duration: traza cada navegación/carga de página. Escala local pequeña,
  // así que capturamos el 100% en vez de samplear.
  tracesSampleRate: 1.0,
  // No usamos Session Replay: esta app maneja notas y progreso académico
  // de usuarios reales, y grabar la sesión es más invasivo de lo que
  // necesitamos para cubrir Errors/Duration.
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
