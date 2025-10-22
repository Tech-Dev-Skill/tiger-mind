// src/app/(admin)/admin/courses/[id]/videos/[videoId]/edit/page.tsx

import { createClientForServerComponent } from "@/lib/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import EditVideoForm from "./edit-form"; // Importamos el formulario que crearemos a continuación

interface EditVideoPageProps {
  params: {
    id: string; // Este es el courseId
    videoId: string; // Este es el videoId
  };
}

export default async function EditVideoPage({ params }: EditVideoPageProps) {
  const supabase = await createClientForServerComponent();
  
  // Obtenemos los datos del video específico que queremos editar
  const { data: video, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', params.videoId)
    .single();

  if (error || !video) {
    console.error("Video no encontrado:", error);
    // Si no se encuentra el video, volvemos a la lista de contenido
    return redirect(`/admin/courses/${params.id}/content`);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <Link href={`/admin/courses/${params.id}/content`} className="text-sm text-orange-400 hover:text-orange-500">
            ← Volver a la gestión de contenido
          </Link>
          <h1 className="text-3xl font-bold mt-2">Editar Video</h1>
        </header>
        
        {/* Pasamos los datos del video al formulario */}
        <EditVideoForm video={video} courseId={params.id} />
      </div>
    </div>
  );
}