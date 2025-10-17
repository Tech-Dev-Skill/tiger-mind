import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
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

    const formData = await request.formData()
    const fullName = formData.get('full_name') as string
    const phone = formData.get('phone') as string
    const country = formData.get('country') as string

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 })
    }

    // Actualizar el perfil
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone: phone,
        country: country,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) {
      console.error('Error actualizando perfil:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Redirigir de vuelta al perfil con mensaje de éxito
    return NextResponse.redirect(new URL('/profile?success=true', request.url))
  } catch (error) {
    console.error('Error en la API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}