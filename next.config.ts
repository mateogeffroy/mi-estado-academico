import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  typescript: {
    // Esto desactiva el chequeo estricto de TypeScript en el build de Vercel
    ignoreBuildErrors: true,
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Solo hace falta en el build de CI/Vercel para subir source maps; en
  // local, sin token, el plugin simplemente no sube nada (no rompe el build).
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  // Proxea los eventos por una ruta propia (/monitoring) para que un
  // adblocker en el navegador del usuario no descarte los reportes.
  tunnelRoute: "/monitoring",
});
