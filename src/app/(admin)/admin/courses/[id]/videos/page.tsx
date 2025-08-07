'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Video {
  id: string
  title: string
  description: string | null
  video_url: string
  order_index: number
  is_free_preview: boolean
  duration_seconds: number | null
  course_modules: {
    title: string
  } | null
}

interface Course {
  title: string
}

export default function CourseVideosPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [id, setId] = useState<string>('')
  const [course, setCourse] = useState<Course | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const { id: courseId } = await params
        setId(courseId)
        
        // Verificar autenticación y cargar datos
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError) {
          console.error('Auth error:', authError)
          router.push('/login')
          return
        }

        if (!user) {
          console.log('No user found, redirecting to login')
          router.push('/login')
          return
        }

        // Verificar rol de administrador
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('Profile error:', profileError)
          router.push('/student')
          return
        }

        if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
          console.log(`User ${user.id} has role ${profile?.role}, redirecting to student`)
          router.push('/student')
          return
        }

        console.log(`User ${user.id} authenticated with role ${profile.role}`)

        // Obtener información del curso
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('title')
          .eq('id', courseId)
          .single()

        if (courseError || !courseData) {
          console.error('Course error:', courseError)
          router.push('/admin/courses')
          return
        }

        setCourse(courseData)

        // Obtener videos del curso
        const { data: videosData, error: videosError } = await supabase
          .from('videos')
          .select(`
            *,
            course_modules(title)
          `)
          .eq('course_id', courseId)
          .order('order_index')

        if (videosError) {
          console.error('Videos error:', videosError)
        }

        console.log(`Found ${videosData?.length || 0} videos for course ${courseId}`)
        setVideos(videosData || [])
        
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params, router])

  const handleDelete = async (videoId: string) => {
    if (!confirm('¿Estás seguro de eliminar este video? Esta acción no se puede deshacer.')) {
      return
    }

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId)

    if (error) {
      alert('Error al eliminar el video')
    } else {
      setVideos(videos.filter(video => video.id !== videoId))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

  if (!course) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Gestión de Videos</h1>
              <p className="mt-1 text-sm text-gray-300">{course.title}</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Link
                href={`/admin/courses/${id}`}
                className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                Volver al curso
              </Link>
              <Link
                href={`/admin/courses/${id}/videos/new`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors"
              >
                Subir Nuevo Video
              </Link>
            </div>
          </div>
        </div>

        {videos && videos.length > 0 ? (
          <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-700">
              {videos.map((video) => (
                <div key={video.id} className="p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-orange-400 mb-2">
                        Módulo: {video.course_modules?.title || 'Sin módulo'}
                      </p>
                      {video.description && (
                        <p className="text-sm text-gray-300 mb-3">
                          {video.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          video.is_free_preview 
                            ? 'bg-orange-900 text-orange-200' 
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {video.is_free_preview ? 'Vista previa gratuita' : 'Contenido premium'}
                        </span>
                        <span className="text-sm text-gray-400">
                          {video.duration_seconds ? `${Math.floor(video.duration_seconds / 60)}:${(video.duration_seconds % 60).toString().padStart(2, '0')}` : 'Sin duración'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex space-x-3">
                      <a
                        href={video.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 border border-orange-600 text-orange-400 text-sm font-medium rounded-md hover:bg-orange-600 hover:text-white transition-colors"
                      >
                        Ver Video
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDelete(video.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-400 bg-red-900/30 hover:bg-red-800 hover:text-red-200 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No hay videos aún</h3>
            <p className="text-gray-400 mb-4">Comienza creando tu primer video para este curso.</p>
            <Link
              href={`/admin/courses/${id}/videos/new`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
            >
              Crear Primer Video
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}