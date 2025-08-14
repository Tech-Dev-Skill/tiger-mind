import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            console.error('Error setting cookies:', error);
          }
        },
      },
    }
  );
}

async function getCourseData(slug: string, userId: string) {
  const supabase = await createServerSupabaseClient();

  // Obtener el curso
  const { data: course } = await supabase
    .from('courses')
    .select('*, categories(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!course) return null;

  // Obtener módulos con videos
  const { data: modules } = await supabase
    .from('course_modules')
    .select('*, videos(*)')
    .eq('course_id', course.id)
    .order('order_index', { ascending: true })
    .order('videos.order_index', { ascending: true });

  // Verificar suscripción activa
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .gte('end_date', new Date().toISOString())
    .single();

  // Obtener progreso del estudiante
  const { data: progress } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', course.id)
    .single();

  return {
    course,
    modules: modules || [],
    hasActiveSubscription: !!subscription,
    progress: progress || { progress_percentage: 0, completed_videos: [] }
  };
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function StudentCoursePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const data = await getCourseData(slug, user.id);

  if (!data) {
    redirect('/student');
  }

  const { course, modules, hasActiveSubscription, progress } = data;

  // Calcular estadísticas
  const totalVideos = modules.reduce((acc, module) => acc + (module.videos?.length || 0), 0);
  const completedVideos = progress.completed_videos?.length || 0;
  const courseProgress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del curso */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/student" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
                ← Volver al dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="mt-2 text-gray-600">{course.description}</p>
              
              <div className="flex items-center space-x-4 mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                  {course.categories?.name}
                </span>
                <span className="text-sm text-gray-500">{course.duration_hours} horas</span>
                <span className="text-sm text-gray-500">{totalVideos} videos</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar sesión
                </button>
              </form>
              {!hasActiveSubscription && (
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-2">Requiere suscripción activa</p>
                  <Link 
                    href="/subscription" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                  >
                    Activar suscripción
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2">
            {/* Barra de progreso */}
            {hasActiveSubscription && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-900">Tu progreso</h3>
                  <span className="text-sm font-medium text-gray-900">{courseProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${courseProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {completedVideos} de {totalVideos} videos completados
                </p>
              </div>
            )}

            {/* Módulos y videos */}
            <div className="space-y-6">
              {modules.map((module, moduleIndex) => (
                <div key={module.id} className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Módulo {moduleIndex + 1}: {module.title}
                    </h3>
                    {module.description && (
                      <p className="mt-1 text-sm text-gray-600">{module.description}</p>
                    )}
                  </div>

                  <div className="divide-y divide-gray-200">
                    {module.videos?.map((video: any, videoIndex: any) => {
                      const isCompleted = progress.completed_videos?.includes(video.id);
                      const canAccess = hasActiveSubscription || video.is_free_preview;

                      return (
                        <div key={video.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {canAccess ? (
                                <Link href={`/student/courses/${course.slug}/videos/${video.id}`} className="flex items-center space-x-3 flex-1">
                                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                    isCompleted ? 'bg-green-100' : 'bg-gray-100'
                                  }`}>
                                    {isCompleted ? (
                                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    ) : (
                                      <span className="text-sm font-medium text-gray-600">
                                        {videoIndex + 1}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900">
                                      {video.title}
                                    </h4>
                                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                                      <span>{Math.floor((video.duration_seconds || 0) / 60)}:{String((video.duration_seconds || 0) % 60).padStart(2, '0')}</span>
                                      {video.is_free_preview && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                          Gratis
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </Link>
                              ) : (
                                <div className="flex items-center space-x-3 flex-1">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-400 line-through">
                                      {video.title}
                                    </h4>
                                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                                      <span>{Math.floor((video.duration_seconds || 0) / 60)}:{String((video.duration_seconds || 0) % 60).padStart(2, '0')}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Información del curso */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información del curso</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Dificultad</h4>
                  <p className="text-sm text-gray-600 capitalize">{course.difficulty_level}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Duración total</h4>
                  <p className="text-sm text-gray-600">{course.duration_hours} horas</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Total de videos</h4>
                  <p className="text-sm text-gray-600">{totalVideos} videos</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Precio</h4>
                  <p className="text-sm text-gray-600">${course.price} USD</p>
                </div>
              </div>
            </div>

            {/* Certificado */}
            {courseProgress === 100 && hasActiveSubscription && (
              <div className="bg-green-50 rounded-lg p-6 mt-6">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-green-900">¡Curso completado!</h4>
                    <p className="text-sm text-green-700">Has terminado este curso</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}