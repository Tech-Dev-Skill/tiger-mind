// src/app/(admin)/admin/courses/new/page.tsx

import { createClientForServerComponent } from '@/lib/server'; // Se importa el cliente correcto
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CourseForm from './client-form';

export default async function NewCoursePage() {
  const supabase = await createClientForServerComponent();

  // 1. Verificación de seguridad (sesión y rol)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    redirect('/dashboard');
  }

  // 2. Lógica para impedir crear un nuevo curso si ya existe uno
  const { count } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true });

  if (count !== null && count > 0) {
    redirect('/admin/courses');
  }

  // 3. Ya no se cargan las categorías

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/courses" className="hover:text-orange-500">
                ← Volver a Cursos
              </Link>
              <h1 className="text-2xl font-bold">Nuevo Curso</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Se llama al formulario sin pasarle la prop 'categories' */}
        <CourseForm />
      </main>
    </div>
  );
}