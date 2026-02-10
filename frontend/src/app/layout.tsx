import type { Metadata } from 'next';
import '../styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'Nutricion IA',
  description: 'Aplicación de gestión de dietas y recetas con IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
