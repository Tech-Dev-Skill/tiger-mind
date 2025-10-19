// src/app/(dashboard)/student/page.tsx

import { createClientForServerComponent } from '@/lib/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from '@/lib/auth-helpers';

// --- INICIO DE LA CORRECCIÓN ---

// PASO 1: Definimos los tipos para que TypeScript sepa qué esperar.
type Category = {
  name: string;
} | null; // La categoría puede ser nula

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

// --- FIN DE LA CORRECCIÓN ---


async function getStudentData(userId: string) {
  const supabase = await createClientForServerComponent();

  const [profile, subscriptions, courses] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single(),

    supabase
      .from('subscriptions')
      .select('*, subscription_plans(*)')
      .eq('user_id', userId)
      .single(),

    supabase
      .from('courses')
      .select('*, categories(*)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
  ]);

  return {
    profile: profile.data,
    subscription: subscriptions.data,
    // Le decimos a TypeScript que 'courses.data' es un array de 'Course'
    courses: (courses.data as Course[]) || []
  };
}

export default async function StudentDashboard() {
  const supabase = await createClientForServerComponent();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }
  
  const { profile, subscription, courses } = await getStudentData(user.id);

  if (!profile) {
    console.error("Profile not found for user:", user.id);
    return <div>Error al cargar el perfil. Si el problema persiste, contacta a soporte.</div>;
  }

  const hasActiveSubscription = subscription && subscription.status === 'active' &&
    new Date(subscription.end_date) > new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header (sin cambios) */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ¡Hola, {profile?.full_name || user.email || 'Estudiante'}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Bienvenido a tu panel de estudiante
              </p>
            </div>
            <div className="flex items-center space-x-4">
               {/* ... (contenido del header sin cambios) ... */}
            </div>
          </div>
        </div>

        {/* Quick Actions (sin cambios) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           {/* ... (contenido de quick actions sin cambios) ... */}
        </div>

        {/* My Active Courses */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis Cursos Activos</h2>

          {hasActiveSubscription ? (
            courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Ahora TypeScript sabe que 'course' es de tipo 'Course' */}
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/student/courses/${course.slug}`}
                    className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
                  >
                    {course.thumbnail_url ? (
                      <div className="relative w-full h-40">
                        <Image
                          src={course.thumbnail_url}
                          alt={course.title || 'Thumbnail del curso'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                        {/* Placeholder SVG */}
                      </div>
                    )}

                    <div className="p-4 flex-grow">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {course.short_description || course.description}
                      </p>
                      <div className="mt-auto">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {course.categories?.name || 'General'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No hay cursos disponibles en este momento.</p>
              </div>
            )
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              {/* ... (mensaje de suscripción inactiva) ... */}
            </div>
          )}
        </div>

        {/* Available Courses (se beneficia de la misma corrección) */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* ... (resto del código) ... */}
        </div>
      </div>
    </div>
  )
}