'use client'

import { useEffect } from 'react'

export function CookieCleaner() {
  useEffect(() => {
    // Limpiar cookies corruptas que pueden causar errores de parsing
    const cookies = document.cookie.split(';')
    
    cookies.forEach(cookie => {
      const [name] = cookie.trim().split('=')
      
      // Limpiar cookies de Supabase que pueden estar corruptas
      if (name.includes('sb-') || name.includes('supabase')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost;`
      }
    })

    // Limpiar localStorage relacionado con Supabase
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.includes('supabase') || key.includes('sb-')
    )
    keysToRemove.forEach(key => localStorage.removeItem(key))

  }, [])

  return null
}