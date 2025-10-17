// src/lib/client.ts

import { createBrowserClient } from '@supabase/ssr'

// Define una función para crear un cliente de Supabase para el NAVEGADOR.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}