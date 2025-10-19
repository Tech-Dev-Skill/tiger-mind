// src/app/(admin)/admin/courses/[id]/edit/edit-form.tsx
'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateCourseAction, FormState } from '../../actions'; // Importamos la nueva acción

// Definimos los tipos para los datos que recibimos
type Course = {
  id: string;
  title: string;
  short_description: string | null;
  // ... (añade aquí todas las propiedades del curso que necesites)
  category_id: string | null;
};

type Category = {
  id: string;
  name: string;
};

interface EditFormProps {
  course: Course;
  categories: Category[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50">
      {pending ? 'Guardando...' : 'Guardar Cambios'}
    </button>
  );
}

export default function EditCourseForm({ course, categories }: EditFormProps) {
  const router = useRouter();
  const initialState: FormState = { error: null, success: false };
  const [state, formAction] = useFormState(updateCourseAction, initialState);

  useEffect(() => {
    if (state.success) {
      alert('¡Curso actualizado con éxito!');
      router.push('/admin/courses');
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6 bg-gray-800 rounded-lg p-8">
      {/* Input oculto para pasar el ID del curso al Server Action */}
      <input type="hidden" name="id" defaultValue={course.id} />

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">Título del Curso *</label>
          <input 
            type="text" 
            name="title" 
            id="title" 
            required 
            defaultValue={course.title}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" 
          />
        </div>
        <div>
          <label htmlFor="short_description" className="block text-sm font-medium text-gray-300">Descripción Corta *</label>
          <textarea 
            name="short_description" 
            id="short_description" 
            rows={3} 
            required
            defaultValue={course.short_description || ''}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" 
          />
        </div>
        <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-300">Categoría *</label>
            <select name="category_id" id="category_id" required defaultValue={course.category_id || ''} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
        </div>
        {/* ... (Añade aquí el resto de los campos del formulario con su 'defaultValue') ... */}
      </div>

      {state?.error && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <p className="text-red-200">{state.error}</p>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
        <Link href="/admin/courses" className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700">
          Cancelar
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}