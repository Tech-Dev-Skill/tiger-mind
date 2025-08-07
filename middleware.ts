import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rutas de autenticación
  const authRoutes = ['/login', '/register', '/forgot-password']
  
  // Si está en una ruta de autenticación y está autenticado, redirigir a /student
  if (authRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL('/student', request.url))
    }
  }

  // Rutas protegidas
  const protectedRoutes = ['/dashboard', '/student', '/subscription', '/courses', '/profile']
  
  // Si está en una ruta protegida y no está autenticado, redirigir a /login
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}