import dynamic from 'next/dynamic'

// Importar el componente de forma dinámica con SSR desactivado
const DashboardPageClient = dynamic(
  () => import('./dashboard-client'),
  { ssr: false }
)

export default function DashboardPage() {
  return <DashboardPageClient />
}