import './globals.css';
import { PlanProvider } from '../src/context/PlanContext';
import LayoutClient from '../src/components/LayoutClient';

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
    <html lang="es" style={{ overflowX: 'hidden', maxWidth: '100%' }}>
      <body style={{ overflowX: 'hidden', maxWidth: '100%', position: 'relative' }}>
        <PlanProvider>
          <LayoutClient>
            {children}
          </LayoutClient>
        </PlanProvider>
      </body>
    </html>
  );
}