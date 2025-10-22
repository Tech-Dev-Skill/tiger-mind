// src/app/(admin)/admin/courses/[id]/content/page.tsx

import { createClientForServerComponent } from "@/lib/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle, Edit3, Trash2, Video } from "lucide-react";
// Importamos la acción de eliminar video
import { deleteVideoAction } from '../../actions';

interface ContentPageProps {
    params: {
        id: string;
    };
}

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
    
    const sortedVideos = (course.videos && Array.isArray(course.videos))
        ? [...course.videos].sort((a, b) => a.order_index - b.order_index)
        : [];

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
                    <Link 
                        href={`/admin/courses/${course.id}/videos/new`}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
                    >
                        <PlusCircle size={16} />
                        Añadir Video
                    </Link>
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
                                    {/* --- INICIO DE LA ACTUALIZACIÓN --- */}
                                    <div className="flex items-center gap-4">
                                        {/* El botón de editar ahora es un Link */}
                                        <Link 
                                            href={`/admin/courses/${course.id}/videos/${video.id}/edit`} 
                                            className="text-yellow-400 hover:text-yellow-500" 
                                            title="Editar Video"
                                        >
                                            <Edit3 size={16} />
                                        </Link>
                                        
                                        {/* El botón de eliminar ahora es un formulario */}
                                        <form action={deleteVideoAction}>
                                            <input type="hidden" name="videoId" value={video.id} />
                                            <input type="hidden" name="courseId" value={course.id} />
                                            <button type="submit" className="text-red-400 hover:text-red-500" title="Eliminar Video">
                                                <Trash2 size={16} />
                                            </button>
                                        </form>
                                    </div>
                                    {/* --- FIN DE LA ACTUALIZACIÓN --- */}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No hay videos en este curso.</p>
                                <p className="text-sm text-gray-600 mt-2">Usa el botón &apos;Añadir Video&apos; para empezar.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}