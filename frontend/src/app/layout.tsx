import type { Metadata } from 'next';

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
      <body>{children}</body>
    </html>
  );
}
