import type { Metadata } from "next"
import "./globals.css"

export const metadata = {
  metadataBase: new URL('https://tigermind.fit'),
  title: {
    default: 'TigerMind Academy',
    template: '%s | TigerMind',
  },
  description: 'Cursos premium de mindset, disciplina y resultados. Transforma tu vida con TigerMind.',
  keywords: ['TigerMind', 'cursos', 'mindset', 'disciplina', 'fitness', 'suscripción'],
  alternates: { canonical: 'https://tigermind.fit' },
  openGraph: {
    type: 'website',
    url: 'https://tigermind.fit',
    title: 'TigerMind Academy',
    description: 'Acceso a cursos premium para transformar tu mentalidad y hábitos.',
    siteName: 'TigerMind',
    images: [
      {
        url: '/images/1_index.JPG',
        width: 1200,
        height: 630,
        alt: 'TigerMind Academy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TigerMind Academy',
    description: 'Cursos premium para transformar tu vida.',
    images: ['/images/1_index.JPG'],
    creator: '@tigermind',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },            // reemplázalo con tu icono de tigre
      { url: '/tiger-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/tiger-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  themeColor: '#ff6a00',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
