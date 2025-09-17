// src/middleware.ts (CORREGIDO)

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Creamos la respuesta al principio. La modificaremos si es necesario.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Skip Supabase initialization in development if env vars are missing
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing - skipping auth middleware')
    return response // Devuelve la respuesta inicial
  }

  // 2. Creamos el cliente de Supabase con el MANEJADOR DE COOKIES CORRECTO.
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options) {
        // Si se necesita establecer una cookie, primero la actualizamos en la petición...
        request.cookies.set({ name, value, ...options })
        // ...y luego creamos una NUEVA respuesta para poder establecer la cookie en la respuesta final.
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        response.cookies.set({ name, value, ...options })
      },
      remove(name: string, options) {
        request.cookies.set({ name, value: '', ...options })
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        response.cookies.set({ name, value: '', ...options })
      },
    },
  })

  // 3. El resto de tu lógica para proteger rutas permanece IGUAL.
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
        return NextResponse.redirect(new URL('/dashboard', request.url)) // Corregido a /dashboard
      }
    }

    if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/new')) {
      console.log(`Accessing /new route - User: ${user?.id || 'none'}`)
    }
  } catch (error) {
    console.error('Supabase middleware error:', error)
  }

  // 4. Devolvemos la respuesta final (que puede haber sido actualizada al manejar cookies).
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}