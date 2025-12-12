'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { signOut } from '@/lib/auth-helpers';
import { Video, Clock, Star, Users, BookOpen, PlayCircle } from 'lucide-react';

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
  duration_hours: number | null;
  difficulty_level: string | null;
  rating: number | null;
  total_students: number | null;
  categories?: Category;
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
  order_index?: number; // Added order_index to type
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
            .order('order_index', { ascending: true }); // Changed from created_at desc to order_index asc

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

  const getDifficultyLabel = (level: string | null) => {
    switch (level) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return level || 'General';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );

  if (!profile) return <div className="p-8 text-center text-red-500">Error al cargar el perfil.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ¡Hola, {profile.full_name || profile.email?.split('@')[0] || 'Estudiante'}! 👋
            </h1>
            <p className="text-gray-600 mt-2">Bienvenido a tu panel de aprendizaje.</p>
          </div>
          <button
            onClick={async () => {
              await signOut();
              window.location.href = '/login';
            }}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-red-600 px-5 py-2.5 rounded-xl transition-all font-medium shadow-sm"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Live Class Banner - SOLO la última clase */}
        {liveClass && (
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-1 shadow-lg mb-10 transform hover:scale-[1.01] transition-all">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-sm">
                    EN VIVO
                  </span>
                  <div className="flex items-center text-orange-100 text-sm font-medium">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{new Date(liveClass.start_date).toLocaleString()}</span>
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{liveClass.title}</h3>
                <p className="text-orange-100 text-lg leading-relaxed max-w-2xl">{liveClass.description}</p>
              </div>
              <a
                href={liveClass.zoom_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors flex items-center gap-3 shadow-lg whitespace-nowrap group"
              >
                <Video className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Unirse a la Clase</span>
              </a>
            </div>
          </div>
        )}

        {/* Clase gratuita */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <PlayCircle className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Clase Gratuita de Bienvenida</h2>
          </div>
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-900/5">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/QkR1_hVlBcQ?autoplay=0&rel=0&modestbranding=1"
              title="Clase gratuita"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* Mis cursos activos */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-orange-600" />
            Mis Cursos Activos
          </h2>

          {profile.is_active ? (
            courses.length > 0 ? (
              <div className="space-y-12">
                {courses.map((course) => {
                  const courseVideos = videos.filter((v) => v.course_id === course.id);

                  return (
                    <div key={course.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md">
                      {/* Course Header Info */}
                      <div className="md:flex border-b border-gray-100">

                        {/* Details */}
                        <div className="p-6 md:p-8 md:w-3/5 lg:w-2/3 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-4 mb-4">
                              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                                {course.title}
                              </h3>
                            </div>

                            <p className="text-gray-600 mb-6 text-lg leading-relaxed line-clamp-3">
                              {course.short_description || course.description}
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6">
                              <div className="flex items-center text-gray-500">
                                <Clock className="w-5 h-5 mr-2 text-gray-400" />
                                <div>
                                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Duración</p>
                                  <p className="font-semibold text-gray-900">{course.duration_hours || 0} horas</p>
                                </div>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <Video className="w-5 h-5 mr-2 text-gray-400" />
                                <div>
                                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Videos</p>
                                  <p className="font-semibold text-gray-900">{courseVideos.length} lecciones</p>
                                </div>
                              </div>
                              {course.total_students !== null && course.total_students > 0 && (
                                <div className="flex items-center text-gray-500">
                                  <Users className="w-5 h-5 mr-2 text-gray-400" />
                                  <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Estudiantes</p>
                                    <p className="font-semibold text-gray-900">{course.total_students}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Botón de Curso Completo eliminado según requerimiento */}
                        </div>
                      </div>

                      {/* Quick Access Videos */}
                      {courseVideos.length > 0 && (
                        <div className="bg-gray-50/50 p-6 border-t border-gray-100">
                          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                            <PlayCircle className="w-4 h-4 mr-2 text-orange-600" />
                            Contenido del Curso
                          </h4>
                          <div className="space-y-8">
                            {courseVideos.map((video) => (
                              <div
                                key={video.id}
                                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="p-4 sm:p-6 border-b border-gray-100">
                                  <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <Video className="w-5 h-5 text-orange-600" />
                                    {video.title}
                                  </h4>
                                  {video.description && (
                                    <p className="text-gray-600 leading-relaxed">
                                      {video.description}
                                    </p>
                                  )}
                                </div>
                                <div className="bg-black w-full">
                                  <video
                                    controls
                                    className="w-full aspect-video"
                                    controlsList="nodownload noplaybackrate"
                                    disablePictureInPicture
                                    onContextMenu={(e) => e.preventDefault()}
                                    playsInline
                                    preload="metadata"
                                    src={`https://tigermind.fit/${video.video_url}`}
                                  >
                                    Tu navegador no soporta el elemento de video.
                                  </video>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No hay cursos disponibles en este momento.</p>
              </div>
            )
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-orange-800 mb-2">Suscripción Inactiva</h3>
              <p className="text-orange-700 mb-6">Activa tu suscripción para acceder a todos los cursos y contenidos exclusivos.</p>
              <Link
                href="/checkout"
                className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-sm"
              >
                Activar Suscripción Ahora
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}