import type { Metadata } from 'next';
import './globals.css';
import { PlanProvider } from '../src/context/PlanContext';
import LayoutClient from '../src/components/LayoutClient';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '../src/components/ThemeProvider';

// 🔥 METADATOS SEO OPTIMIZADOS PARA GOOGLE, BING Y REDES SOCIALES
export const metadata: Metadata = {
  title: 'Mi Estado Académico',
  description: 'Gestión inteligente, trazabilidad absoluta y control total de tu carrera universitaria. Organizá tus horarios, calculá tu promedio y llevá el seguimiento de tu plan de estudios.',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Mi Estado Académico',
    description: 'Tu herramienta para gestionar tu cursada.',
    url: 'https://miestadoacademico.com.ar',
    siteName: 'Mi Estado Académico',
    images: [
      {
        url: '/icon.png',
        width: 800,
        height: 800,
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body style={{ position: 'relative' }}>
        
        {/* 🔥 SCRIPT DE ADSENSE: Activo para que Google pueda verificar el sitio 🔥 */}
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive" 
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3038983835600086"
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <PlanProvider>
            <LayoutClient>
              {children}
            </LayoutClient>
          </PlanProvider>
        </ThemeProvider>

        <Analytics /> 
      </body>
    </html>
  );
}