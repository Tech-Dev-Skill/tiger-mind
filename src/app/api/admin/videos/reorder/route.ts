import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

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
                setAll(cookiesToSet: any[]) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options)
                    })
                },
            },
        }
    )
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient()

        // Verificar autenticación
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Verificar rol de administrador
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
            return NextResponse.json({ error: 'No tienes permisos para reordenar videos' }, { status: 403 })
        }

        // Obtener el array de videos con sus nuevos índices
        const { videos } = await request.json()

        if (!Array.isArray(videos) || videos.length === 0) {
            return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
        }

        // Validar estructura de datos
        for (const video of videos) {
            if (!video.id || typeof video.order_index !== 'number') {
                return NextResponse.json({ error: 'Estructura de datos inválida' }, { status: 400 })
            }
        }

        // Actualizar cada video con su nuevo order_index
        const updatePromises = videos.map(video =>
            supabase
                .from('videos')
                .update({ order_index: video.order_index })
                .eq('id', video.id)
        )

        const results = await Promise.all(updatePromises)

        // Verificar si hubo errores
        const errors = results.filter(result => result.error)
        if (errors.length > 0) {
            console.error('Errors updating videos:', errors)
            return NextResponse.json({
                error: 'Error al actualizar algunos videos',
                details: errors.map(e => e.error?.message)
            }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: 'Videos reordenados correctamente',
            updated: videos.length
        })

    } catch (error) {
        console.error('Error al reordenar videos:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
