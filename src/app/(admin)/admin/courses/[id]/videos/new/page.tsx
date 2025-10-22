'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { createVideoAction } from '../../../actions';

export default function NewVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: courseId } = React.use(params); // 👈 aquí se "desenvuelve" la promesa


  const [state, formAction] = React.useActionState(createVideoAction, { error: null, success: false });

  React.useEffect(() => {
    if (state.success) router.push(`/admin/courses/${courseId}/content`);
  }, [state.success, router, courseId]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Agregar nuevo video</h1>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="courseId" value={courseId} />

        <div>
          <label className="block mb-1 text-sm font-medium">Título del video</label>
          <input
            type="text"
            name="title"
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Descripción</label>
          <textarea
            name="description"
            required
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
            className="w-full"
          />
        </div>

        {state.error && <p className="text-red-500">{state.error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Guardar video
        </button>
      </form>
    </div>
  );
}
