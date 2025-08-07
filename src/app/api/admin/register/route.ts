import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, fullName, role = 'admin' } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password y nombre completo son requeridos' },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Crear usuario en auth.users
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json(
        { error: `Error al crear usuario: ${authError.message}` },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'No se pudo crear el usuario' },
        { status: 400 }
      )
    }

    // Crear perfil en public.profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role: role as 'admin' | 'super_admin',
        is_active: true
      })

    if (profileError) {
      // Si falla la creación del perfil, intentar eliminar el usuario auth
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: `Error al crear perfil: ${profileError.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        fullName,
        role
      }
    })

  } catch (error) {
    console.error('Error en registro de admin:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}