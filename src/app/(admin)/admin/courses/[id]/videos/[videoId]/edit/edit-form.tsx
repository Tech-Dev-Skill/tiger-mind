// src/app/(admin)/admin/courses/[id]/videos/[videoId]/edit/edit-form.tsx
'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateVideoAction, VideoFormState } from '../../../../actions'; // Importamos la acción de actualizar

// Definimos el tipo de video que esperamos recibir
type Video = {
  id: string;
  title: string;
  video_url: string;
  description: string | null;
};

interface FormProps {
  video: Video;
  courseId: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50">
      {pending ? 'Actualizando...' : 'Actualizar Video'}
    </button>
  );
}

export default function EditVideoForm({ video, courseId }: FormProps) {
  const router = useRouter();
  const [state, formAction] = useFormState(updateVideoAction, { error: null, success: false });

  useEffect(() => {
    if (state.success) {
      router.push(`/admin/courses/${courseId}/content`);
    }
  }, [state, router, courseId]);

  return (
    <form action={formAction} className="space-y-6 bg-gray-800 rounded-lg p-8">
      {/* Inputs ocultos para pasar los IDs al Server Action */}
      <input type="hidden" name="videoId" defaultValue={video.id} />
      <input type="hidden" name="courseId" defaultValue={courseId} />

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">Título del Video *</label>
        <input 
          type="text" 
          name="title" 
          id="title" 
          required 
          defaultValue={video.title}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        />
      </div>
      
      <div>
        <label htmlFor="video_url" className="block text-sm font-medium text-gray-300">URL del Video (o ruta del archivo) *</label>
        <input 
          type="text" // Lo mantenemos como 'text' para que puedas ver y editar la URL/ruta guardada
          name="video_url" 
          id="video_url" 
          required 
          defaultValue={video.video_url}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        />
        <p className="mt-1 text-xs text-gray-400">Nota: Para cambiar el archivo de video, deberás subir uno nuevo y pegar la nueva ruta aquí.</p>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Descripción (Opcional)</label>
        <textarea 
          name="description" 
          id="description" 
          rows={3} 
          defaultValue={video.description || ''}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        />
      </div>

      {state?.error && (
        <div className="bg-red-900/50 p-3 rounded-md text-red-300 text-sm">
          <p>{state.error}</p>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
        <Link href={`/admin/courses/${courseId}/content`} className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700">
          Cancelar
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}