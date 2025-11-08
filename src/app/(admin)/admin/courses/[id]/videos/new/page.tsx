'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { createVideoAction } from '../../../actions';

export default function NewVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: courseId } = React.use(params); // 👈 desenvuelve la promesa

  const [isUploading, setIsUploading] = React.useState(false);
  const [state, formAction] = React.useActionState(createVideoAction, { error: null, success: false });

  React.useEffect(() => {
    if (state.success) router.push(`/admin/courses/${courseId}/content`);
    if (state.error) setIsUploading(false); // si hubo error, volvemos a habilitar
  }, [state.success, state.error, router, courseId]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Agregar nuevo video</h1>

      <form action={formAction} onSubmit={() => setIsUploading(true)} className="space-y-4">
        <input type="hidden" name="courseId" value={courseId} />

        <div>
          <label className="block mb-1 text-sm font-medium">Título del video</label>
          <input
            type="text"
            name="title"
            required
            disabled={isUploading}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Descripción</label>
          <textarea
            name="description"
            required
            disabled={isUploading}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Archivo de video</label>
          <input
            type="file"
            name="video"
            accept="video/*"
            required
            disabled={isUploading}
            className="w-full"
          />
        </div>

        {state.error && <p className="text-red-500">{state.error}</p>}

        <button
          type="submit"
          disabled={isUploading}
          aria-busy={isUploading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isUploading && (
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          )}
          {isUploading ? 'Subiendo…' : 'Guardar video'}
        </button>
      </form>
    </div>
  );
}
