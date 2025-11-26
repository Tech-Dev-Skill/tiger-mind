import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Video, Plus, Trash2 } from 'lucide-react'
import { deleteLiveClass } from './actions'

async function createServerSupabaseClient() {
    const cookieStore = await cookies()
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options)
                        })
                    } catch (error) {
                        console.error('Error setting cookies:', error)
                    }
                },
            },
        }
    )
}

export default async function LiveClassesPage() {
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
        redirect('/student')
    }

    const { data: liveClasses } = await supabase
        .from('live_classes')
        .select('*')
        .order('start_date', { ascending: true })

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                                ← Volver al Dashboard
                            </Link>
                            <h1 className="text-2xl font-bold text-white">Clases en Vivo</h1>
                        </div>
                        <Link
                            href="/admin/live-classes/new"
                            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Nueva Clase</span>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    {liveClasses && liveClasses.length > 0 ? (
                        <div className="divide-y divide-gray-700">
                            {liveClasses.map((liveClass) => (
                                <div key={liveClass.id} className="p-6 hover:bg-gray-750 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <Video className="w-5 h-5 text-orange-500" />
                                                <h3 className="text-xl font-semibold text-white">{liveClass.title}</h3>
                                            </div>
                                            <p className="text-gray-400 mb-3">{liveClass.description}</p>
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className="text-gray-500">
                                                    Fecha: <span className="text-white">{new Date(liveClass.start_date).toLocaleString()}</span>
                                                </span>
                                                <a
                                                    href={liveClass.zoom_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-orange-500 hover:text-orange-400"
                                                >
                                                    Ver enlace de Zoom →
                                                </a>
                                            </div>
                                        </div>
                                        <form action={deleteLiveClass.bind(null, liveClass.id)}>
                                            <button
                                                type="submit"
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">No hay clases programadas</h3>
                            <p className="text-gray-500 mb-6">Crea tu primera clase en vivo</p>
                            <Link
                                href="/admin/live-classes/new"
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Nueva Clase</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
