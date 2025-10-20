// src/app/(admin)/admin/courses/[id]/content/page.tsx

import { createClientForServerComponent } from "@/lib/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle, Edit3, Trash2, Video } from "lucide-react";

interface ContentPageProps {
    params: {
        id: string;
    };
}

// --- INICIO DE LA CORRECCIÓN DE TIPOS ---
type Video = {
    id: string;
    title: string;
    order_index: number;
};

type CourseWithContent = {
    id: string;
    title: string;
    videos: Video[] | null;
};
// --- FIN DE LA CORRECCIÓN DE TIPOS ---

export default async function CourseContentPage({ params }: ContentPageProps) {
    const supabase = await createClientForServerComponent();
    const courseId = params.id;

    const { data, error } = await supabase
        .from('courses')
        .select(`
            id,
            title,
            videos (
                id,
                title,
                order_index
            )
        `)
        .eq('id', courseId)
        .single();

    if (error || !data) {
        console.error("Error fetching course content:", error);
        return redirect('/admin/courses');
    }

    const course = data as CourseWithContent;

    // --- CORRECCIÓN CLAVE ---
    // Se usa optional chaining (?.) para ordenar solo si 'videos' existe.
    // Si no existe, se usa un array vacío como fallback.
    const sortedVideos = course.videos?.sort((a, b) => a.order_index - b.order_index) || [];

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div>
                        <Link href="/admin/courses" className="text-sm hover:text-orange-500">
                            ← Volver a Cursos
                        </Link>
                        <h1 className="text-2xl font-bold">{course.title}</h1>
                        <p className="text-xs text-gray-400">Gestión de Videos</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700">
                        <PlusCircle size={16} />
                        Añadir Video
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Lista de Videos</h2>
                    <div className="space-y-3">
                        {sortedVideos.length > 0 ? (
                            sortedVideos.map((video) => (
                                <div key={video.id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-md">
                                    <div className="flex items-center gap-3">
                                        <Video className="text-gray-400" size={18}/>
                                        <p>{video.title}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button className="text-yellow-400 hover:text-yellow-500" title="Editar Video">
                                            <Edit3 size={16} />
                                        </button>
                                        <button className="text-red-400 hover:text-red-500" title="Eliminar Video">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No hay videos en este curso.</p>
                                {/* --- CORRECCIÓN DE ESLINT --- */}
                                <p className="text-sm text-gray-600 mt-2">Usa el botón &apos;Añadir Video&apos; para empezar.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}