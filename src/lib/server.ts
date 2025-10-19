// src/lib/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Cliente ASÍNCRONO para Componentes de Servidor (RSC), Layouts, Pages.
 * Es de SOLO LECTURA.
 */
export async function createClientForServerComponent() {
  const cookieStore = await cookies() // <-- ¡AHORA SÍ con await!

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // Esto fallará en RSC, por eso el try/catch
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Ignorar errores de 'set' en Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // Esto fallará en RSC, por eso el try/catch
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Ignorar errores de 'remove' en Server Components
          }
        },
      },
    }
  )
}

/**
 * Cliente ASÍNCRONO para Server Actions y Route Handlers (API Routes).
 * Es de LECTURA Y ESCRITURA.
 */
export async function createClientForServerAction() {
  const cookieStore = await cookies() // <-- ¡AHORA SÍ con await!

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // En Server Actions, SÍ podemos escribir cookies
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // En Server Actions, SÍ podemos borrar cookies
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}