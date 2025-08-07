import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Tiger Mind - Desarrolla tu Mentalidad de Éxito",
  description: "Domina las habilidades más demandadas con cursos intensivos diseñados para personas con ambición feroz. Aprende como un tigre.",
  keywords: "cursos online, desarrollo personal, habilidades digitales, educación premium",
}

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
