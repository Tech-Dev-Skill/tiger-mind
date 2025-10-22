'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from '@/lib/auth-helpers'

// --- Tipos ---
type Category = {
  name: string;
} | null;

type Course = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  price: number;
  created_at: string;
  categories: Category;
};

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  is_active?: boolean;
  activation_date?: string | null;
  expiration_date?: string | null;
};

type Subscription = {
  id: string;
  user_id: string;
  status: string;
  start_date?: string | null;
  end_date?: string | null;
};

type Video = {
  id: string;
  title: string;
  video_url: string;
  course_id: string;
};

export default function StudentDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        redirect('/login')
        return
      }

      const [profileRes, subscriptionRes, coursesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('subscriptions').select('*, subscription_plans(*)').eq('user_id', user.id).single(),
        supabase.from('courses').select('*, categories(*)').eq('is_published', true).order('created_at', { ascending: false })
      ])

      setProfile(profileRes.data)
      setSubscription(subscriptionRes.data)
      setCourses(coursesRes.data || [])

      // Si el usuario está activo, traemos los videos
      if (profileRes.data?.is_active) {
        const { data: videosData } = await supabase.from('course_videos').select('*')
        setVideos(videosData || [])
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-8 text-center">Cargando...</div>
  if (!profile) return <div className="p-8 text-center text-red-500">Error al cargar el perfil.</div>

  const hasActiveSubscription =
    subscription &&
    subscription.status === 'active' &&
    subscription.end_date &&
    new Date(subscription.end_date) > new Date()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ¡Hola, {profile.full_name || profile.email || 'Estudiante'}! 👋
            </h1>
            <p className="text-gray-600 mt-2">Bienvenido a tu panel de estudiante</p>
          </div>
          <button
            onClick={async () => {
              await signOut()
              window.location.href = '/login'
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Clase gratuita */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Clase gratuita</h2>
          <div className="aspect-video rounded-lg overflow-hidden shadow-md">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/QkR1_hVlBcQ"
              title="Clase gratuita"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Mis cursos activos */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis Cursos Activos</h2>

          {profile.is_active ? (
            // --- Si el usuario está activo, mostramos los videos ---
            videos.length > 0 ? (
              <div className="space-y-6">
                {videos.map((video) => (
                  <div key={video.id} className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{video.title}</h3>
                    <div className="aspect-video rounded-lg overflow-hidden shadow">
                      <iframe
                        width="100%"
                        height="100%"
                        src={video.video_url}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Aún no hay videos disponibles.</p>
            )
          ) : (
            // --- Si el usuario NO está activo ---
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-gray-700">
              <p className="mb-3">Actualmente no tienes una suscripción activa.</p>
              <Link
                href="/checkout"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                Suscribirse
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
