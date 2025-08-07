import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// GET - Listar todos los cursos (para el admin)
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Verificar que el usuario sea admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'No tienes permisos de administrador' }, { status: 403 })
    }

    // Obtener todos los cursos con información del instructor
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        *,
        categories (name, slug),
        profiles!instructor_id (full_name, email)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: `Error al obtener cursos: ${error.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json({ courses })

  } catch (error) {
    console.error('Error al listar cursos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo curso
export async function POST(request: Request) {
  try {
    const courseData = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    // Verificar que el usuario sea admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'No tienes permisos de administrador' }, { status: 403 })
    }

    // Validar datos requeridos
    const requiredFields = ['title', 'slug', 'description', 'price', 'category_id']
    const missingFields = requiredFields.filter(field => !courseData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Campos requeridos faltantes: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Verificar que la categoría existe
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('id', courseData.category_id)
      .single()

    if (!category) {
      return NextResponse.json(
        { error: 'La categoría especificada no existe' },
        { status: 400 }
      )
    }

    // Crear el curso
    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        ...courseData,
        instructor_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: `Error al crear curso: ${error.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      course
    })

  } catch (error) {
    console.error('Error al crear curso:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}