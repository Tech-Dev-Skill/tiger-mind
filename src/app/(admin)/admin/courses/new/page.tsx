import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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

async function checkAdmin() {
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

    return true
  } catch (error) {
    console.error('Error checking admin:', error)
    redirect('/login')
  }
}

export default async function NewCoursePage() {
  await checkAdmin()
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
              <h1 className="text-2xl font-bold text-white">Nuevo Curso</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form action="/api/admin/courses" method="POST" className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">Información Básica</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                  Título del Curso *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ej: Curso Completo de Desarrollo Web"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-300">
                  URL Amigable *
                </label>
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ej: curso-desarrollo-web"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                  Descripción *
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Describe brevemente el curso y sus beneficios"
                />
              </div>

              <div>
                <label htmlFor="long_description" className="block text-sm font-medium text-gray-300">
                  Descripción Detallada
                </label>
                <textarea
                  name="long_description"
                  id="long_description"
                  rows={6}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Descripción completa del curso, incluyendo temas cubiertos y resultados esperados"
                />
              </div>
            </div>
          </div>

          {/* Pricing and Category */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">Precio y Categoría</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                  Precio (USD) *
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  min="0"
                  step="0.01"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="99.99"
                />
              </div>

              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-300">
                  Categoría *
                </label>
                <select
                  name="category_id"
                  id="category_id"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">Imágenes y Videos</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-300">
                  URL de Miniatura
                </label>
                <input
                  type="url"
                  name="thumbnail_url"
                  id="thumbnail_url"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div>
                <label htmlFor="video_url" className="block text-sm font-medium text-gray-300">
                  URL del Video Promocional
                </label>
                <input
                  type="url"
                  name="video_url"
                  id="video_url"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">Configuración</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_published"
                  id="is_published"
                  className="h-4 w-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="is_published" className="ml-2 block text-sm text-gray-300">
                  Publicar inmediatamente
                </label>
              </div>

              <div>
                <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-300">
                  Duración Estimada (minutos)
                </label>
                <input
                  type="number"
                  name="duration_minutes"
                  id="duration_minutes"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="120"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/courses"
              className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              Crear Curso
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}