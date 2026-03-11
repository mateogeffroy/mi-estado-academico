import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Esto desactiva el chequeo estricto de TypeScript en el build de Vercel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;