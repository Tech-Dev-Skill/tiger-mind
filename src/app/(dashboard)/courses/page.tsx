// src/app/(dashboard)/courses/page.tsx

import { createClientForServerComponent } from '@/lib/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type Category = {
  name: string;
};

type Course = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  thumbnail_url: string | null;
  price: number;
  categories: Category[];
};

export default async function CoursesPage() {
  const supabase = await createClientForServerComponent();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // 🔹 Obtener el perfil del usuario
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_active')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error obteniendo perfil:', profileError);
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Error al cargar la información del perfil.
      </div>
    );
  }

  // 🔸 Si el usuario no tiene suscripción activa
  if (!profile?.is_active) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold mb-4">Suscripción Inactiva</h1>
        <p className="text-gray-300 mb-6 text-center max-w-md">
          Tu cuenta no tiene una suscripción activa. Suscríbete para acceder a todos los cursos de Tiger Mind.
        </p>
        <Link
          href="/suscripcion"
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Suscribirse
        </Link>
      </div>
    );
  }

  // 🔹 Si el usuario está activo, cargar todos los cursos publicados
  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, slug, title, short_description, description, thumbnail_url, price, categories(name)')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching courses:', error);
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Error al cargar los cursos. Inténtalo de nuevo más tarde.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold">Tiger Mind</h1>
              <p className="text-gray-300">Mis Cursos</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/student" className="text-gray-300 hover:text-white">
                Volver al Panel
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Cursos Disponibles</h2>
            <p className="text-gray-300">
              Accede a todos los cursos de tu membresía Tiger Mind
            </p>
          </div>

          {!courses || courses.length === 0 ? (
            <div className="text-center">
              <div className="bg-gray-800 p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">
                  No hay cursos disponibles aún
                </h3>
                <p className="text-gray-300 mb-4">
                  Pronto agregaremos contenido exclusivo para ti
                </p>
                <Link
                  href="/student"
                  className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
                >
                  Volver al Panel
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(courses as Course[]).map((course) => (
                <Link
                  href={`/student/courses/${course.slug}`}
                  key={course.id}
                  className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
                >
                  <div className="relative w-full h-48">
                    {course.thumbnail_url ? (
                      <Image
                        src={course.thumbnail_url}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400">Sin Imagen</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {course.short_description || course.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-500 font-bold">
                        ${course.price}
                      </span>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                        {course.categories?.[0]?.name || 'General'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
