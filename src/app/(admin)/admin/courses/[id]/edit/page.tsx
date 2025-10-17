import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'// Importa el tipo PageProps

async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            console.error('Error setting cookies:', error)
          }
        },
      },
    }
  )
}

async function getCourse(id: string) {
  const supabase = await createServerSupabaseClient()
  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login')
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      redirect('/login')
    }
    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()
    if (error || !course) {
      redirect('/admin/courses')
    }
    return course
  } catch (error) {
    console.error('Error loading course:', error)
    redirect('/admin/courses')
  }
}

async function getCategories() {
  const supabase = await createServerSupabaseClient()
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name')
  if (error) {
    console.error('Error loading categories:', error)
    return []
  }
  return categories || []
}

// Define el tipo de las props usando PageProps de Next.js
interface EditCoursePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params  // Ahora usamos await para desestructurar
  const course = await getCourse(id)
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/courses" className="text-white hover:text-orange-500">
                ← Volver a Cursos
              </Link>
              <h1 className="text-2xl font-bold text-white">Editar Curso</h1>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-4">Función en desarrollo</h2>
            <p className="text-gray-300 mb-4">
              La edición de cursos está siendo implementada. Por ahora, puedes crear nuevos cursos
              y gestionarlos desde la lista principal.
            </p>
            <Link
              href="/admin/courses"
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              Volver a Cursos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}