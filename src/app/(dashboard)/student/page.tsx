// src/app/(dashboard)/student/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { signOut } from '@/lib/auth-helpers';

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

type Video = {
  id: string;
  title: string;
  video_url: string;
  course_id: string;
  description?: string | null; // <- opcional por si tu typing no lo tenía
};

export default function StudentDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        redirect('/login');
        return;
      }

      // Traer perfil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData || null);

      // Si el usuario está activo → traer cursos y videos
      if (profileData?.is_active) {
        // Cursos publicados
        const { data: coursesData } = await supabase
          .from('courses')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        setCourses(coursesData || []);

        // Traer videos
        if (coursesData && coursesData.length > 0) {
          const courseIds = coursesData.map((c: Course) => c.id);
          const { data: videosData } = await supabase
            .from('videos')
            .select('*')
            .in('course_id', courseIds);

          setVideos(videosData || []);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (!profile) return <div className="p-8 text-center text-red-500">Error al cargar el perfil.</div>;

  // Utilidades para limpiar URLs (sin cambios)
  const isYouTubeUrl = (url: string) => /youtube\.com|youtu\.be/.test(url);
  const extractYouTubeId = (url: string) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
      if (u.pathname.includes('/embed/')) return u.pathname.split('/embed/')[1].split(/[?&]/)[0];
      return u.searchParams.get('v');
    } catch {
      const m = url.match(/(?:v=|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
      return m ? m[1] : null;
    }
  };
  const isLocalVideoFile = (url: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.startsWith('/') || /\.(mp4|webm|ogg|mov|mkv)$/i.test(lower);
  };
  const buildCleanEmbedUrl = (rawUrl: string) => {
    if (!rawUrl) return '';
    if (isYouTubeUrl(rawUrl)) {
      const id = extractYouTubeId(rawUrl);
      return id ? `https://www.youtube.com/embed/${id}?autoplay=0&rel=0&modestbranding=1` : rawUrl;
    }
    try {
      const u = new URL(rawUrl);
      u.searchParams.delete('autoplay');
      return u.toString();
    } catch {
      return rawUrl;
    }
  };

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
              await signOut();
              window.location.href = '/login';
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
              src="https://www.youtube.com/embed/QkR1_hVlBcQ?autoplay=0&rel=0&modestbranding=1"
              title="Clase gratuita"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Mis cursos activos */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis Cursos Activos</h2>

          {profile.is_active ? (
            courses.length > 0 ? (
              <div className="space-y-10">
                {courses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{course.title}</h3>
                    <p className="text-gray-600 mb-4">{course.short_description || 'Sin descripción disponible.'}</p>

                    {/* Videos del curso */}
                    <div className="space-y-4">
                      {videos.filter(v => v.course_id === course.id).length > 0 ? (
                        videos
                          .filter(v => v.course_id === course.id)
                          .map(video => {
                            const url = 'https://tigermind.fit/' + video.video_url || '';

                            return (
                              <div key={video.id} className="border rounded-lg p-4 bg-white shadow">
                                
                                <h4 className="text-lg font-semibold text-gray-800 mb-1">
                                  {video.title}
                                </h4>

                                {/* ⭐ DESCRIPCIÓN AGREGADA ⭐ */}
                                {video.description && (
                                  <p className="text-gray-600 mb-3 whitespace-pre-line">
                                    {video.description}
                                  </p>
                                )}

                                <div className="aspect-video rounded-lg overflow-hidden shadow">
                                  <video
                                    controls
                                    preload="metadata"
                                    src={url}
                                    className="w-full h-full object-cover"
                                    controlsList="nodownload noplaybackrate"
                                    disablePictureInPicture
                                    onContextMenu={(e) => e.preventDefault()}
                                    playsInline
                                  />
                                </div>
                              </div>
                            );
                          })
                      ) : (
                        <p className="text-gray-500 italic">Este curso aún no tiene videos disponibles.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No hay cursos activos disponibles.</p>
            )
          ) : (
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
  );
}
