// src/app/(admin)/admin/courses/new/client-form.tsx
'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createCourseAction, FormState } from '../actions';

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

// Ya no necesitamos las props de 'categories'
export default function CourseForm() {
  const router = useRouter();
  const initialState: FormState = { error: null, success: false };
  const [state, formAction] = useFormState(createCourseAction, initialState);

  useEffect(() => {
    if (state.success) {
      alert('¡Curso creado con éxito!');
      router.push('/admin/courses');
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6">
      {/* Información Básica */}
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-bold text-white mb-4">Información del Curso</h2>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">Título del Curso *</label>
          <input type="text" name="title" id="title" required className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"/>
        </div>
        <div>
          <label htmlFor="short_description" className="block text-sm font-medium text-gray-300">Descripción Corta *</label>
          <textarea name="short_description" id="short_description" rows={3} required className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">Descripción Detallada</label>
          <textarea name="description" id="description" rows={6} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-300">Precio (USD) *</label>
          <input type="number" name="price" id="price" min="0" step="0.01" required className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
        </div>
      </div>

      {/* Media y Configuración */}
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-bold text-white mb-4">Media y Configuración</h2>
        <div>
          <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-300">URL de Miniatura</label>
          <input type="url" name="thumbnail_url" id="thumbnail_url" className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
        </div>
        <div>
          <label htmlFor="trailer_url" className="block text-sm font-medium text-gray-300">URL del Video Promocional</label>
          <input type="url" name="trailer_url" id="trailer_url" className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
        </div>
        <div className="flex items-center">
            <input type="checkbox" name="is_published" id="is_published" className="h-4 w-4 text-orange-600 bg-gray-700 border border-gray-600 rounded"/>
            <label htmlFor="is_published" className="ml-2 block text-sm text-gray-300">Publicar curso</label>
        </div>
        <div>
            <label htmlFor="duration_hours" className="block text-sm font-medium text-gray-300">Duración Estimada (horas)</label>
            <input type="number" name="duration_hours" id="duration_hours" min="0" className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"/>
        </div>
      </div>

      {/* Enlaces de Pago */}
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-bold text-white mb-4">Enlaces de Pago</h2>
        <div>
            <label htmlFor="wompi_payment_link" className="block text-sm font-medium text-gray-300">Enlace de Pago (Wompi)</label>
            <input type="url" name="wompi_payment_link" id="wompi_payment_link" className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
        </div>
        <div>
            <label htmlFor="paypal_info" className="block text-sm font-medium text-gray-300">Información de PayPal (Usuario o Email)</label>
            <input type="text" name="paypal_info" id="paypal_info" className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
        </div>
      </div>

      {state?.error && (
        <div className="bg-red-900/50 p-3 rounded-md text-red-300 text-sm">
          <p>{state.error}</p>
        </div>
      )}
      
      <div className="flex justify-end space-x-4">
        <Link href="/admin/courses" className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700">Cancelar</Link>
        <SubmitButton />
      </div>
    </form>
  );
}