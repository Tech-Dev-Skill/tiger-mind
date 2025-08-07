import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import { join } from 'path'

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      return NextResponse.json({ error: 'No tienes permisos para eliminar videos' }, { status: 403 })
    }

    // Obtener información del video
    const { data: video } = await supabase
      .from('videos')
      .select('video_url, course_id')
      .eq('id', params.id)
      .single()

    if (!video) {
      return NextResponse.json({ error: 'Video no encontrado' }, { status: 404 })
    }

    // Eliminar archivo físico si existe
    if (video.video_url) {
      try {
        const filePath = join(process.cwd(), 'public', video.video_url)
        await unlink(filePath)
      } catch (error) {
        console.error('Error al eliminar archivo:', error)
        // Continuar incluso si no se puede eliminar el archivo
      }
    }

    // Eliminar registro de la base de datos
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: `Error al eliminar de la base de datos: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Video eliminado correctamente' })

  } catch (error) {
    console.error('Error al eliminar video:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// También permitir POST para compatibilidad con formularios HTML
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return DELETE(request, { params })
}