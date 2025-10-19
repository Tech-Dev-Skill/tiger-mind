// src/app/(admin)/admin/courses/new/client-form.tsx
'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createCourseAction, FormState } from '../actions'; // Se importa la acción y el tipo de estado

interface Category {
  id: string;
  name: string;
}

interface CourseFormProps {
  categories: Category[];
}

// Componente para el botón de envío
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Creando...' : 'Crear Curso'}
    </button>
  );
}

export default function CourseForm({ categories }: CourseFormProps) {
  const router = useRouter();
  
  // Definimos el estado inicial
  const initialState: FormState = { error: null, success: false };
  
  const [state, formAction] = useFormState(createCourseAction, initialState);

  // Este useEffect se ejecutará cuando el estado cambie
  useEffect(() => {
    // Si la acción fue exitosa, redirigimos
    if (state.success) {
      router.push('/admin/courses');
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6">
      {/* Información Básica */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-4">Información Básica</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">Título del Curso *</label>
            <input type="text" name="title" id="title" required className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
          </div>
          <div>
            <label htmlFor="short_description" className="block text-sm font-medium text-gray-300">Descripción Corta *</label>
            <textarea name="short_description" id="short_description" rows={3} required className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Descripción Detallada</label>
            <textarea name="description" id="description" rows={6} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
          </div>
        </div>
      </div>

      {/* Precio y Categoría */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-4">Precio y Categoría</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300">Precio (USD) *</label>
            <input type="number" name="price" id="price" min="0" step="0.01" required className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
          </div>
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-300">Categoría *</label>
            <select name="category_id" id="category_id" required className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-4">Imágenes y Videos</h2>
        <div className="space-y-4">
            <div>
                <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-300">URL de Miniatura</label>
                <input type="url" name="thumbnail_url" id="thumbnail_url" className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
            </div>
            <div>
                <label htmlFor="trailer_url" className="block text-sm font-medium text-gray-300">URL del Video Promocional</label>
                <input type="url" name="trailer_url" id="trailer_url" className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
            </div>
        </div>
      </div>

       {/* Settings */}
       <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">Configuración</h2>
            <div className="space-y-4">
                <div className="flex items-center">
                    <input type="checkbox" name="is_published" id="is_published" className="h-4 w-4 text-orange-600 bg-gray-700 border-gray-600 rounded"/>
                    <label htmlFor="is_published" className="ml-2 block text-sm text-gray-300">Publicar inmediatamente</label>
                </div>
                <div>
                    <label htmlFor="duration_hours" className="block text-sm font-medium text-gray-300">Duración Estimada (horas)</label>
                    <input type="number" name="duration_hours" id="duration_hours" min="0" className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"/>
                </div>
            </div>
       </div>

      {state?.error && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <p className="text-red-200">{state.error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end space-x-4">
        <Link href="/admin/courses" className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700">
          Cancelar
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}