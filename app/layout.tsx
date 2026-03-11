import './globals.css';
import { PlanProvider } from '../src/context/PlanContext';
import LayoutClient from '../src/components/LayoutClient'; // Importamos el layout

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
      <body>
        <PlanProvider>
          {/* Envolvemos los hijos con nuestro LayoutClient */}
          <LayoutClient>
            {children}
          </LayoutClient>
        </PlanProvider>
      </body>
    </html>
  );
}