'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration_seconds: number;
  order_index: number;
  is_free_preview: boolean;
  course: {
    id: string;
    title: string;
    slug: string;
  };
  module: {
    id: string;
    title: string;
    order_index: number;
  };
}

export default function VideoPlayerPage() {
  const router = useRouter();
  const params = useParams();
  const { slug, videoId } = params;

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  const fetchVideoData = async () => {
    try {
      setLoading(true);

      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);

      // Obtener video con información relacionada
      const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .select(`
          *,
          course:courses(id, title, slug),
          module:course_modules(id, title, order_index)
        `)
        .eq('id', videoId)
        .single();

      if (videoError || !videoData) {
        setError('Video no encontrado');
        return;
      }

      setVideo(videoData as Video);

      // Verificar suscripción activa
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .single();

      const hasSubscription = !!subscription;
      const canAccess = hasSubscription || videoData.is_free_preview;
      setHasAccess(canAccess);

      if (!canAccess) {
        setError('No tienes acceso a este video');
        return;
      }

      // Obtener progreso actual
      const { data: courseProgress } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', videoData.course_id)
        .single();

      if (courseProgress) {
        setIsCompleted(courseProgress.completed_videos?.includes(videoId) || false);
        setProgress(courseProgress.last_watched_video === videoId ? courseProgress.last_watched_position : 0);
      }

    } catch (err) {
      console.error('Error fetching video:', err);
      setError('Error al cargar el video');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoProgress = async (currentTime: number) => {
    if (!userId || !video) return;

    try {
      const { data: existingProgress } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', video.course.id)
        .single();

      if (existingProgress) {
        await supabase
          .from('course_progress')
          .update({
            last_watched_video: video.id,
            last_watched_position: currentTime,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('course_id', video.course.id);
      } else {
        await supabase
          .from('course_progress')
          .insert({
            user_id: userId,
            course_id: video.course.id,
            last_watched_video: video.id,
            last_watched_position: currentTime,
            progress_percentage: 0
          });
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const handleVideoComplete = async () => {
    if (!userId || !video || isCompleted) return;

    try {
      const { data: existingProgress } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', video.course.id)
        .single();

      let completedVideos = existingProgress?.completed_videos || [];
      
      if (!completedVideos.includes(video.id)) {
        completedVideos = [...completedVideos, video.id];
      }

      // Calcular progreso total del curso
      const { data: allVideos } = await supabase
        .from('videos')
        .select('id')
        .eq('course_id', video.course.id);

      const totalVideos = allVideos?.length || 0;
      const progressPercentage = totalVideos > 0 ? Math.round((completedVideos.length / totalVideos) * 100) : 0;

      await supabase
        .from('course_progress')
        .upsert({
          user_id: userId,
          course_id: video.course.id,
          completed_videos: completedVideos,
          progress_percentage: progressPercentage,
          last_watched_video: video.id,
          last_watched_position: video.duration_seconds,
          completed_at: progressPercentage === 100 ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        });

      setIsCompleted(true);
    } catch (err) {
      console.error('Error marking video as complete:', err);
    }
  };

  const getNextVideo = () => {
    if (!video) return null;
    
    // Aquí iría la lógica para obtener el siguiente video
    // Por ahora, redirigir al curso
    return `/student/courses/${video.course.slug}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error || 'Video no encontrado'}</p>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href={`/student/courses/${video.course.slug}`}
                className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block"
              >
                ← Volver al curso
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
              <p className="text-sm text-gray-600">
                Módulo {video.module.order_index + 1}: {video.module.title}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {isCompleted && (
                <div className="flex items-center text-green-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Completado</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {hasAccess ? (
                <div className="aspect-video bg-black">
                  <video
                    className="w-full h-full"
                    controls
                    onTimeUpdate={(e) => handleVideoProgress(Math.floor(e.currentTarget.currentTime))}
                    onEnded={handleVideoComplete}
                    src={video.video_url}
                  >
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Acceso restringido</h3>
                    <p className="mt-1 text-sm text-gray-500">Activa tu suscripción para ver este video</p>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{video.title}</h2>
                {video.description && (
                  <p className="text-gray-600 mb-4">{video.description}</p>
                )}
                
                {/* Barra de progreso */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progreso</span>
                    <span className="text-sm text-gray-600">
                      {Math.floor(progress / 60)}:{String(progress % 60).padStart(2, '0')} / {Math.floor(video.duration_seconds / 60)}:{String(video.duration_seconds % 60).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((progress / video.duration_seconds) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Siguiente video</h3>
              <p className="text-sm text-gray-600 mb-4">
                Continúa con el siguiente video para avanzar en tu curso.
              </p>
              
              <button
                onClick={() => router.push(`/student/courses/${video.course.slug}`)}
                className="w-full px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700"
              >
                Ver lista de videos
              </button>
            </div>

            {/* Recursos */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recursos</h3>
              <p className="text-sm text-gray-600">
                Los recursos adicionales para este video aparecerán aquí.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}