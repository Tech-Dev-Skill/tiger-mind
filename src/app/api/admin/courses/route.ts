import { createServerSupabaseClient, checkAdminAccess } from '@/lib/api-helpers'
import { NextResponse } from 'next/server'

// GET - Listar todos los cursos (para el admin)
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    // Verificar que el usuario sea admin
    const adminCheck = await checkAdminAccess(supabase)
    if (adminCheck.error) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
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
    const supabase = await createServerSupabaseClient()

    // Verificar que el usuario sea admin
    const adminCheck = await checkAdminAccess(supabase)
    if (adminCheck.error) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
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
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.long_description || courseData.description,
        short_description: courseData.description,
        price: courseData.price,
        category_id: courseData.category_id,
        thumbnail_url: courseData.thumbnail_url,
        trailer_url: courseData.video_url,
        duration_hours: courseData.duration_hours || 0,
        is_published: courseData.is_published || false,
        instructor_id: adminCheck.user.id,
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