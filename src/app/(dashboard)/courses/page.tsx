'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  thumbnail_url?: string
  created_at: string
  price: number
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setCourses(data || [])
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
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
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Tiger Mind</h1>
              <p className="text-gray-300">Mis Cursos</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="text-gray-300 hover:text-white"
              >
                Volver al Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Cursos Disponibles
            </h2>
            <p className="text-gray-300">
              Accede a todos los cursos de tu membresía Tiger Mind
            </p>
          </div>

          {error && (
            <div className="bg-red-600 text-white p-4 rounded mb-4">
              {error}
            </div>
          )}

          {courses.length === 0 ? (
            <div className="text-center">
              <div className="bg-gray-800 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">
                  No hay cursos disponibles aún
                </h3>
                <p className="text-gray-300 mb-4">
                  Pronto agregaremos contenido exclusivo para ti
                </p>
                <Link 
                  href="/dashboard"
                  className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
                >
                  Volver al Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  {course.thumbnail_url && (
                    <img 
                      src={course.thumbnail_url} 
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      {course.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-500 font-bold">
                        ${course.price}
                      </span>
                      <Link 
                        href={`/dashboard/courses/${course.id}`}
                        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                      >
                        Ver curso
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}