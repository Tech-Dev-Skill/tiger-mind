'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Award, User, LogOut, PlayCircle } from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url: string
  role: string
}

interface Course {
  id: string
  title: string
  slug: string
  description: string
  thumbnail_url: string
  price: number
  duration: string
  category: {
    name: string
  }
}

interface Subscription {
  id: string
  status: string
  course: Course
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/login')
        return
      }

      // Obtener perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profile) {
        setUser(profile)
      }

      // Obtener suscripciones activas
      const { data: subs } = await supabase
        .from('subscriptions')
        .select(`
          *,
          course:courses(*, category:categories(*))
        `)
        .eq('user_id', authUser.id)
        .eq('status', 'active')

      if (subs) {
        setSubscriptions(subs)
      }

      // Obtener cursos disponibles
      const { data: availableCourses } = await supabase
        .from('courses')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(6)

      if (availableCourses) {
        setCourses(availableCourses)
      }

    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">TigerMind Academy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                {user?.full_name || user?.email || 'Estudiante'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            ¡Bienvenido, {user?.full_name || 'Estudiante'}!
          </h2>
          <p className="text-gray-400">
            Continúa tu aprendizaje y alcanza tus objetivos
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/student/courses"
            className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <BookOpen className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Mis Cursos</h3>
            <p className="text-orange-100">
              {subscriptions.length} cursos activos
            </p>
          </Link>

          <Link
            href="/student/certificates"
            className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Award className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Certificados</h3>
            <p className="text-purple-100">Ver tus logros</p>
          </Link>

          <Link
            href="/profile"
            className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <User className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Mi Perfil</h3>
            <p className="text-blue-100">Actualiza tus datos</p>
          </Link>
        </div>

        {/* My Active Courses */}
        {subscriptions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Tus Cursos Activos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((sub) => (
                <Link
                  key={sub.course.id}
                  href={`/student/courses/${sub.course.slug}`}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-orange-500 transition-all"
                >
                  <img
                    src={sub.course.thumbnail_url}
                    alt={sub.course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {sub.course.title}
                    </h4>
                    <p className="text-gray-400 text-sm mb-2">
                      {sub.course.description.slice(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-500 text-sm">
                        {sub.course.category.name}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {sub.course.duration}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Available Courses */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Cursos Disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-orange-500 transition-all"
              >
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {course.title}
                  </h4>
                  <p className="text-gray-400 text-sm mb-2">
                    {course.description.slice(0, 100)}...
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-orange-500 text-sm">
                      {course.category.name}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">
                      ${course.price}
                    </span>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Ver Curso</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}