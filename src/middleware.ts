// src/middleware.ts

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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
    return response
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options) {
        request.cookies.set({ name, value, ...options })
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

  // --- INICIO DE CAMBIOS ---

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rutas públicas que no requieren autenticación
  // (La raíz '/' se maneja por separado para no coincidir con todas las rutas)
  const publicPaths = ['/landing', '/login']
  const isPublic =
    request.nextUrl.pathname === '/' ||
    publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isPublic) {
    return response // Permitir acceso a rutas públicas, pero con la sesión ya refrescada
  }

  // Si no hay usuario y la ruta NO es pública, redirigir a login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Lógica de roles para /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Para las demás rutas protegidas (/dashboard, /student, etc.)
  // ya hemos comprobado que el 'user' existe.
  // Si no se necesita lógica de roles adicional, no se hace nada más.

  // --- FIN DE CAMBIOS ---

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/upload|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}