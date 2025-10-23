// src/app/(admin)/admin/courses/[id]/edit/page.tsx

import { createClientForServerComponent } from '@/lib/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import EditCourseForm from './edit-form'; // Importamos el nuevo formulario

interface EditCoursePageProps {
  params: {
    id: string;
  };
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;
  const supabase = await createClientForServerComponent();

  // Cargamos los datos del curso y las categorías al mismo tiempo
  const [courseResult, categoriesResult] = await Promise.all([
    supabase.from('courses').select('*').eq('id', id).single(),
    supabase.from('categories').select('id, name').order('name'),
  ]);

  const { data: course, error: courseError } = courseResult;
  const { data: categories, error: categoriesError } = categoriesResult;

  // Si el curso no existe, redirigimos
  if (courseError || !course) {
    console.error('Course not found:', courseError);
    return redirect('/admin/courses');
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/courses" className="hover:text-orange-500">
                ← Volver a Cursos
              </Link>
              <h1 className="text-2xl font-bold">Editar Curso</h1>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EditCourseForm course={course}/>
      </div>
    </div>
  );
}