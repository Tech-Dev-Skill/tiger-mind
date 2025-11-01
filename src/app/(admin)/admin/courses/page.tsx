// src/app/(admin)/admin/courses/page.tsx

import { createClientForServerComponent } from '@/lib/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle, Edit3, BookOpen, LayoutList } from 'lucide-react';

// Tipo 'Course' simplificado para esta página
type Course = {
  id: string;
  title: string;
  slug: string;
  price: number;
  is_published: boolean;
};

export default async function AdminCoursesPage() {
  const supabase = await createClientForServerComponent();

  // Verificación de seguridad
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    redirect('/dashboard');
  }

  // Lógica para limitar la creación a un solo curso
  const { count: courseCount } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true });
  
  // Consulta simplificada (sin categorías ni perfiles)
  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, title, slug, price, is_published')
    .order('created_at', { ascending: false });
    
  if (error) {
    return <div className="p-6 text-white">Error al cargar los cursos: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          
          <h1 className="text-2xl font-bold">Gestionar Curso</h1>
          <a className="text-white hover:text-orange-500" href="/admin">← Volver al Dashboard</a>
          {courseCount === 0 && (
            <Link href="/admin/courses/new" className="flex items-center space-x-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700">
              <PlusCircle className="w-4 h-4" />
              <span>Crear Curso</span>
            </Link>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {courses && courses.length > 0 ? (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Curso</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Precio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {(courses as Course[]).map((course) => (
                        <tr key={course.id} className="hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-white">{course.title}</div>
                                <div className="text-sm text-gray-400">{course.slug}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${course.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${course.is_published ? 'bg-green-600 text-green-100' : 'bg-yellow-600 text-yellow-100'}`}>
                                {course.is_published ? 'Publicado' : 'Borrador'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-4">
                                    {/* --- BOTÓN PARA GESTIONAR CONTENIDO --- */}
                                    <Link href={`/admin/courses/${course.id}/content`} className="text-blue-400 hover:text-blue-500" title="Gestionar Contenido (Módulos y Videos)">
                                        <LayoutList className="w-5 h-5" />
                                    </Link>
                                    {/* --- BOTÓN PARA EDITAR DETALLES --- */}
                                    <Link href={`/admin/courses/${course.id}/edit`} className="text-orange-400 hover:text-orange-500" title="Editar Detalles del Curso">
                                        <Edit3 className="w-5 h-5" />
                                    </Link>
                                    {/* Se ha eliminado el botón de borrar curso */}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No se ha creado el curso</h3>
            <p className="text-gray-400 mb-4">Comienza creando el único curso para la plataforma.</p>
             {courseCount === 0 && (
                <Link href="/admin/courses/new" className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                    <PlusCircle className="w-4 h-4" />
                    <span>Crear el Curso</span>
                </Link>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
