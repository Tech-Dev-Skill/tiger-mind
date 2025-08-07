import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

// Configurar límites de tamaño
export const config = {
  api: {
    bodyParser: false,
  },
}

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
      return NextResponse.json({ error: 'No tienes permisos para subir videos' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('video') as File
    const courseId = formData.get('courseId') as string
    const moduleId = formData.get('moduleId') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const orderIndex = parseInt(formData.get('orderIndex') as string)
    const isFreePreview = formData.get('isFreePreview') === 'true'

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    // Validar tipo de archivo
    const allowedTypes = ['video/mp4', 'video/mkv', 'video/avi', 'video/webm', 'video/mov']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 })
    }

    // Limitar tamaño (100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'El archivo excede el tamaño máximo de 100MB' }, { status: 400 })
    }

    // Crear directorio si no existe
    const uploadDir = join(process.cwd(), 'public', 'videos', courseId)
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // El directorio ya existe, continuar
    }

    // Generar nombre único
    const fileExtension = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const filePath = join(uploadDir, fileName)

    // Guardar archivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // URL pública del video
    const videoUrl = `/videos/${courseId}/${fileName}`

    // Crear registro en la base de datos
    const { data: video, error } = await supabase
      .from('videos')
      .insert({
        course_id: courseId,
        module_id: moduleId,
        title,
        description,
        video_url: videoUrl,
        order_index: orderIndex,
        is_free_preview: isFreePreview,
        duration_seconds: 0, // Se actualizará después
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      // Si falla la inserción, eliminar el archivo
      const { unlink } = require('fs/promises')
      await unlink(filePath).catch(() => {})
      
      return NextResponse.json({ error: `Error al guardar en la base de datos: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      video: {
        ...video,
        video_url: videoUrl
      }
    })

  } catch (error) {
    console.error('Error al subir video:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}