'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, Edit3, Trash2, Video } from 'lucide-react'
import { createClient } from '@/lib/client'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface VideoType {
    id: string
    title: string
    description: string | null
    order_index: number
}

interface CourseWithContent {
    id: string
    title: string
    videos: VideoType[] | null
}

// Componente para cada video arrastrable
function SortableVideoItem({
    video,
    courseId,
    onDelete
}: {
    video: VideoType
    courseId: string
    onDelete: (id: string) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: video.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex justify-between items-center p-3 bg-gray-700/50 rounded-md hover:bg-gray-700 transition-colors"
        >
            <div className="flex items-center gap-3 flex-1">
                {/* Drag Handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-orange-400 transition-colors"
                    title="Arrastra para reordenar"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                </button>

                {/* Video Info */}
                <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-3">
                        <Video className="text-gray-400" size={18} />
                        <p className="font-semibold text-white">{video.title}</p>
                    </div>

                    {video.description && (
                        <p className="text-gray-400 text-sm ml-7">
                            {video.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
                <Link
                    href={`/admin/courses/${courseId}/videos/${video.id}/edit`}
                    className="text-yellow-400 hover:text-yellow-500"
                    title="Editar Video"
                >
                    <Edit3 size={16} />
                </Link>

                <button
                    onClick={() => onDelete(video.id)}
                    className="text-red-400 hover:text-red-500"
                    title="Eliminar Video"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    )
}

export default function CourseContentPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = createClient()
    const router = useRouter()
    const [courseId, setCourseId] = useState<string>('')
    const [course, setCourse] = useState<CourseWithContent | null>(null)
    const [videos, setVideos] = useState<VideoType[]>([])
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // Configurar sensores para drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        const loadData = async () => {
            try {
                const { id } = await params
                setCourseId(id)

                // Verificar autenticación
                const { data: { user }, error: authError } = await supabase.auth.getUser()

                if (authError || !user) {
                    console.error('Auth error:', authError)
                    router.push('/login')
                    return
                }

                // Verificar rol de administrador
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                if (profileError || !profile || !['admin', 'super_admin'].includes(profile.role)) {
                    console.error('Profile error:', profileError)
                    router.push('/student')
                    return
                }

                // Obtener curso con videos
                const { data, error } = await supabase
                    .from('courses')
                    .select(`
            id,
            title,
            videos (
              id,
              title,
              description,
              order_index
            )
          `)
                    .eq('id', id)
                    .single()

                if (error || !data) {
                    console.error('Error fetching course content:', error)
                    router.push('/admin/courses')
                    return
                }

                const courseData = data as CourseWithContent
                setCourse(courseData)

                // Ordenar videos por order_index
                const sortedVideos = (courseData.videos && Array.isArray(courseData.videos))
                    ? [...courseData.videos].sort((a, b) => a.order_index - b.order_index)
                    : []

                setVideos(sortedVideos)

            } catch (error) {
                console.error('Error loading data:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [params, router])

    const handleDelete = async (videoId: string) => {
        if (!confirm('¿Estás seguro de eliminar este video? Esta acción no se puede deshacer.')) {
            return
        }

        const { error } = await supabase
            .from('videos')
            .delete()
            .eq('id', videoId)

        if (error) {
            alert('Error al eliminar el video')
        } else {
            setVideos(videos.filter(video => video.id !== videoId))
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (!over || active.id === over.id) {
            return
        }

        const oldIndex = videos.findIndex(v => v.id === active.id)
        const newIndex = videos.findIndex(v => v.id === over.id)

        // Actualizar el orden localmente (optimistic update)
        const newVideos = arrayMove(videos, oldIndex, newIndex)

        // Actualizar los order_index
        const updatedVideos = newVideos.map((video, index) => ({
            ...video,
            order_index: index
        }))

        setVideos(updatedVideos)
        setIsSaving(true)

        try {
            // Enviar actualización al servidor
            const response = await fetch('/api/admin/videos/reorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    videos: updatedVideos.map(v => ({
                        id: v.id,
                        order_index: v.order_index
                    }))
                }),
            })

            if (!response.ok) {
                throw new Error('Error al reordenar videos')
            }

            const result = await response.json()
            console.log('Videos reordenados:', result)

        } catch (error) {
            console.error('Error al guardar el nuevo orden:', error)
            alert('Error al guardar el nuevo orden. Por favor, recarga la página.')
            // Revertir cambios en caso de error
            setVideos(videos)
        } finally {
            setIsSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Cargando...</div>
            </div>
        )
    }

    if (!course) {
        return null
    }

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
                        {isSaving && (
                            <p className="text-xs text-orange-400 flex items-center gap-2 mt-1">
                                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Guardando orden...
                            </p>
                        )}
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

                    {videos.length > 0 && (
                        <div className="mb-4 p-3 bg-gray-700/30 rounded-md">
                            <p className="text-sm text-gray-300">
                                💡 <strong>Tip:</strong> Arrastra los videos para cambiar su orden
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        {videos.length > 0 ? (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={videos.map(v => v.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {videos.map((video) => (
                                        <SortableVideoItem
                                            key={video.id}
                                            video={video}
                                            courseId={course.id}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No hay videos en este curso.</p>
                                <p className="text-sm text-gray-600 mt-2">
                                    Usa el botón &apos;Añadir Video&apos; para empezar.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
