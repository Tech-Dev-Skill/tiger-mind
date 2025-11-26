import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createLiveClass } from '../actions'

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

export default async function NewLiveClassPage() {
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

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-white mb-8">Programar Nueva Clase en Vivo</h1>

                <form action={createLiveClass} className="bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                            Título de la Clase
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Ej: Sesión de Trading en Vivo"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            required
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Describe el contenido de la clase..."
                        />
                    </div>

                    <div>
                        <label htmlFor="zoom_url" className="block text-sm font-medium text-gray-300 mb-2">
                            Enlace de Zoom
                        </label>
                        <input
                            type="url"
                            id="zoom_url"
                            name="zoom_url"
                            required
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="https://zoom.us/j/..."
                        />
                    </div>

                    <div>
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-300 mb-2">
                            Fecha y Hora
                        </label>
                        <input
                            type="datetime-local"
                            id="start_date"
                            name="start_date"
                            required
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            Crear Clase
                        </button>
                        <a
                            href="/admin/live-classes"
                            className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Cancelar
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}
