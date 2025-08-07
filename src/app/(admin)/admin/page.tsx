import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, Users, BookOpen, DollarSign, Settings, LogOut, PlusCircle, Edit3 } from 'lucide-react'

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

async function getAdminData() {
  const supabase = await createServerSupabaseClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      redirect('/login')
    }

    // Verificar que sea admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      redirect('/login')
    }

    // Obtener estadísticas
    const [
      { count: totalUsers },
      { count: totalCourses },
      { count: totalSubscriptions },
      { data: recentUsers },
      { data: recentCourses }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('courses').select('*', { count: 'exact', head: true }),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }),
      supabase
        .from('profiles')
        .select('id, full_name, email, created_at, role')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('courses')
        .select('id, title, price, is_published, created_at')
        .order('created_at', { ascending: false })
        .limit(5)
    ])

    return {
      stats: {
        totalUsers: totalUsers || 0,
        totalCourses: totalCourses || 0,
        totalSubscriptions: totalSubscriptions || 0,
      },
      recentUsers: recentUsers || [],
      recentCourses: recentCourses || [],
      user: { ...user, role: profile.role }
    }

  } catch (error) {
    console.error('Error loading admin data:', error)
    redirect('/login')
  }
}

export default async function AdminDashboard() {
  const data = await getAdminData()

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                Admin: {data.user.user_metadata?.full_name || data.user.email}
              </span>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Total Usuarios</p>
                <p className="text-2xl font-bold text-white">{data.stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Total Cursos</p>
                <p className="text-2xl font-bold text-white">{data.stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Suscripciones</p>
                <p className="text-2xl font-bold text-white">{data.stats.totalSubscriptions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/courses"
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span>Gestionar Cursos</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>Gestionar Usuarios</span>
            </Link>
            <Link
              href="/admin/courses/new"
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Nuevo Curso</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Usuarios Recientes</h3>
            <div className="space-y-3">
              {data.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-white">{user.full_name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    user.role === 'admin' ? 'bg-red-600 text-white' : 
                    user.role === 'student' ? 'bg-blue-600 text-white' : 
                    'bg-gray-600 text-white'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Courses */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Cursos Recientes</h3>
            <div className="space-y-3">
              {data.recentCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-white">{course.title}</p>
                    <p className="text-xs text-gray-400">${course.price}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    course.is_published ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                  }`}>
                    {course.is_published ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}