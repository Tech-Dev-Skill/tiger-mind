import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Skip Supabase initialization in development if env vars are missing
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing - skipping auth middleware')
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    })

    // Refresh session if expired
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protect admin routes - check role
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!user) {
        console.log(`No user found for admin route ${request.nextUrl.pathname} - redirecting to login`)
        return NextResponse.redirect(new URL('/login', request.url))
      }
      
      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
        console.log(`User ${user.id} with role ${profile?.role} redirected to student dashboard from ${request.nextUrl.pathname}`)
        return NextResponse.redirect(new URL('/student', request.url))
      }
      
      console.log(`User ${user.id} with role ${profile?.role} granted access to ${request.nextUrl.pathname}`)
    }

    // Protect student routes
    if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
      console.log(`No user found for dashboard route ${request.nextUrl.pathname} - redirecting to login`)
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Debug logging for new video route
    if (request.nextUrl.pathname.startsWith('/new')) {
      console.log(`Accessing /new route - User: ${user?.id || 'none'}`)
    }
  } catch (error) {
    console.error('Supabase middleware error:', error)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}