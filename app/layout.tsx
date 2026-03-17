import './globals.css';
import { PlanProvider } from '../src/context/PlanContext';
import LayoutClient from '../src/components/LayoutClient';
import Script from 'next/script';

export const metadata = {
  title: 'Mi Estado Académico',
  description: 'Ing. en Sistemas UTN-FRLP',
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={{ position: 'relative' }}>
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive" 
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3038983835600086"
        />

        <PlanProvider>
          <LayoutClient>
            {children}
          </LayoutClient>
        </PlanProvider>
      </body>
    </html>
  );
}