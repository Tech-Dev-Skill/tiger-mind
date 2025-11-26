'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { signOut } from '@/lib/auth-helpers';
import { Video } from 'lucide-react';

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

type VideoType = {
  id: string;
  title: string;
  video_url: string;
  course_id: string;
  description?: string | null;
};

type LiveClass = {
  id: string;
  title: string;
  description: string;
  zoom_url: string;
  start_date: string;
};

export default function StudentDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);

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

      // Si el usuario está activo → traer cursos, videos y clases en vivo
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
            .in('course_id', courseIds)
            .order('created_at', { ascending: false });

          setVideos(videosData || []);
        }

        // Obtener SOLO la última clase en vivo creada
        const { data: latestClass } = await supabase
          .from('live_classes')
          .select('*')
          .gte('start_date', new Date().toISOString())
          .order('start_date', { ascending: true })
          .limit(1)
          .single();

        if (latestClass) {
          setLiveClass(latestClass);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (!profile) return <div className="p-8 text-center text-red-500">Error al cargar el perfil.</div>;

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

        {/* Live Class Banner - SOLO la última clase */}
        {liveClass && (
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 shadow-lg text-white flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-red-500 text-xs font-bold px-2 py-1 rounded animate-pulse">PRÓXIMA CLASE EN VIVO</span>
                <h3 className="text-xl font-bold">{liveClass.title}</h3>
              </div>
              <p className="text-red-100 mb-2">{liveClass.description}</p>
              <div className="flex items-center space-x-2 text-sm font-medium bg-red-900/30 px-3 py-1 rounded-lg inline-block">
                <span className="text-red-200">Fecha:</span>
                <span>{new Date(liveClass.start_date).toLocaleString()}</span>
              </div>
            </div>
            <a
              href={liveClass.zoom_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 whitespace-nowrap"
            >
              <Video className="w-5 h-5" />
              <span>Unirse a la Clase</span>
            </a>
          </div>
        )}

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

                    {/* Videos del curso - FORMATO LISTA */}
                    <div className="space-y-3">
                      {videos.filter(v => v.course_id === course.id).length > 0 ? (
                        videos
                          .filter(v => v.course_id === course.id)
                          .map(video => (
                            <div key={video.id} className="border-l-4 border-blue-500 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                    {video.title}
                                  </h4>
                                  {video.description && (
                                    <p className="text-gray-600 text-sm mb-3 whitespace-pre-line">
                                      {video.description}
                                    </p>
                                  )}
                                </div>
                                <button
                                  onClick={() => setSelectedVideo(video)}
                                  className="flex-shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                                >
                                  <Video className="w-4 h-4" />
                                  <span>Ver Video</span>
                                </button>
                              </div>
                            </div>
                          ))
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

        {/* Modal de Video - Pantalla completa con protección */}
        {selectedVideo && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div
              className="relative w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón cerrar */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 text-xl font-bold bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                ✕ Cerrar
              </button>

              {/* Título del video */}
              <div className="bg-gray-900 text-white p-4 rounded-t-lg">
                <h3 className="text-xl font-bold">{selectedVideo.title}</h3>
                {selectedVideo.description && (
                  <p className="text-gray-300 text-sm mt-2">{selectedVideo.description}</p>
                )}
              </div>

              {/* Video Player */}
              <div className="bg-black rounded-b-lg overflow-hidden">
                <video
                  controls
                  autoPlay
                  className="w-full aspect-video"
                  controlsList="nodownload noplaybackrate"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  playsInline
                  src={`https://tigermind.fit/${selectedVideo.video_url}`}
                >
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
