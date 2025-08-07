import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Eye, Edit3, PlusCircle, Trash2, BookOpen, PlayCircle, Clock, Users } from 'lucide-react'

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
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}

async function getCourse(id: string) {
  const supabase = await createServerSupabaseClient()
  
  // Verificar autenticación
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Verificar rol de administrador
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    redirect('/student')
  }

  // Obtener información del curso con estadísticas
  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      categories (name, slug),
      profiles!instructor_id (full_name, email)
    `)
    .eq('id', id)
    .single()

  if (error || !course) {
    redirect('/admin/courses')
  }

  // Obtener módulos del curso
  const { data: modules } = await supabase
    .from('course_modules')
    .select('*, videos(count)')
    .eq('course_id', id)
    .order('order_index')

  // Obtener total de videos
  const { data: videos, error: videosError } = await supabase
    .from('videos')
    .select('id')
    .eq('course_id', id)

  // Obtener total de estudiantes inscritos
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('id')
    .eq('course_id', id)

  return {
    course,
    modules: modules || [],
    totalVideos: videos?.length || 0,
    totalStudents: enrollments?.length || 0
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { course, modules, totalVideos, totalStudents } = await getCourse(id)

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin/courses"
                className="inline-flex items-center text-gray-300 hover:text-white mb-4"
              >
                ← Volver a Cursos
              </Link>
              <h1 className="text-3xl font-bold text-white">{course.title}</h1>
              <p className="mt-1 text-sm text-gray-300">
                Instructor: {course.profiles?.full_name || 'Sin asignar'}
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/admin/courses/${id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Editar
              </Link>
              <Link
                href={`/admin/courses/${id}/videos`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Videos ({totalVideos})
              </Link>
            </div>
          </div>
        </div>

        {/* Course Info Card */}
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">${course.price}</div>
                <div className="text-sm text-gray-300">Precio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{totalStudents}</div>
                <div className="text-sm text-gray-300">Estudiantes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{totalVideos}</div>
                <div className="text-sm text-gray-300">Videos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-white mb-4">Detalles del Curso</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Descripción</label>
                <p className="text-gray-100 mt-1">{course.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Categoría</label>
                <p className="text-gray-100 mt-1">{course.categories?.name || 'Sin categoría'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Estado</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  course.is_published 
                    ? 'bg-green-900 text-green-200' 
                    : 'bg-yellow-900 text-yellow-200'
                }`}>
                  {course.is_published ? 'Publicado' : 'Borrador'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Módulos</h2>
              <Link
                href={`/admin/courses/${id}/videos/new`}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Agregar Video
              </Link>
            </div>
            
            {modules.length > 0 ? (
              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-white">{module.title}</h3>
                        <p className="text-sm text-gray-300 mt-1">{module.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-400">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {module.duration_minutes} min
                          </span>
                          <span className="text-sm text-gray-400">
                            <PlayCircle className="w-4 h-4 inline mr-1" />
                            {module.videos?.count || 0} videos
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/courses/${id}/videos`}
                          className="text-orange-500 hover:text-orange-400 text-sm"
                        >
                          Ver videos
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No hay módulos</h3>
                <p className="text-gray-400 mb-4">Este curso aún no tiene módulos definidos.</p>
                <Link
                  href={`/admin/courses/${id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar curso
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}