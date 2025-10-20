// src/app/(admin)/admin/courses/[id]/edit/edit-form.tsx
'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateCourseAction, FormState } from '../../actions';

// Tipo 'Course' completo para que coincida con todos los campos del formulario
type Course = {
  id: string;
  title: string;
  short_description: string | null;
  description: string | null;
  price: number;
  thumbnail_url: string | null;
  trailer_url: string | null;
  is_published: boolean;
  duration_hours: number | null;
  wompi_payment_link: string | null;
  paypal_info: string | null;
};

// Se elimina el tipo 'Category'

interface EditFormProps {
  course: Course;
  // Ya no se necesitan las categorías
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50">
      {pending ? 'Guardando...' : 'Guardar Cambios'}
    </button>
  );
}

// Se elimina 'categories' de las props
export default function EditCourseForm({ course }: EditFormProps) {
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
      <input type="hidden" name="id" defaultValue={course.id} />

      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Información del Curso</h2>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">Título del Curso *</label>
          <input type="text" name="title" id="title" required defaultValue={course.title} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"/>
        </div>
        <div>
          <label htmlFor="short_description" className="block text-sm font-medium text-gray-300">Descripción Corta *</label>
          <textarea name="short_description" id="short_description" rows={3} required defaultValue={course.short_description || ''} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">Descripción Detallada</label>
          <textarea name="description" id="description" rows={6} defaultValue={course.description || ''} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-300">Precio (USD) *</label>
          <input type="number" name="price" id="price" min="0" step="0.01" required defaultValue={course.price} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Media y Configuración</h2>
        <div>
          <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-300">URL de Miniatura</label>
          <input type="url" name="thumbnail_url" id="thumbnail_url" defaultValue={course.thumbnail_url || ''} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
        </div>
        <div>
          <label htmlFor="trailer_url" className="block text-sm font-medium text-gray-300">URL del Video Promocional</label>
          <input type="url" name="trailer_url" id="trailer_url" defaultValue={course.trailer_url || ''} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
        </div>
        <div className="flex items-center">
            <input type="checkbox" name="is_published" id="is_published" defaultChecked={course.is_published} className="h-4 w-4 text-orange-600 bg-gray-700 border border-gray-600 rounded"/>
            <label htmlFor="is_published" className="ml-2 block text-sm text-gray-300">Publicar curso</label>
        </div>
        <div>
            <label htmlFor="duration_hours" className="block text-sm font-medium text-gray-300">Duración Estimada (horas)</label>
            <input type="number" name="duration_hours" id="duration_hours" min="0" defaultValue={course.duration_hours || 0} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"/>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Enlaces de Pago</h2>
        <div>
            <label htmlFor="wompi_payment_link" className="block text-sm font-medium text-gray-300">Enlace de Pago (Wompi)</label>
            <input type="url" name="wompi_payment_link" id="wompi_payment_link" defaultValue={course.wompi_payment_link || ''} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
        </div>
        <div>
            <label htmlFor="paypal_info" className="block text-sm font-medium text-gray-300">Información de PayPal (Usuario o Email)</label>
            <input type="text" name="paypal_info" id="paypal_info" defaultValue={course.paypal_info || ''} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
        </div>
      </div>
      
      {state?.error && <div className="bg-red-900/50 p-3 rounded-md text-red-300 text-sm"><p>{state.error}</p></div>}
      
      <div className="flex justify-end space-x-4">
        <Link href="/admin/courses" className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700">Cancelar</Link>
        <SubmitButton />
      </div>
    </form>
  );
}