import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(
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
}

export async function getUser() {
  const supabase = await createServerSupabaseClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export async function signOut() {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  const supabase = await createServerSupabaseClient()

  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    throw new Error('No autorizado')
  }
  return user
}

export async function getUserProfile(userId: string) {
  const supabase = await createServerSupabaseClient()

  try {
    console.log('Getting profile for user:', userId)
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, country, avatar_url, created_at, updated_at, role')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error getting user profile:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      
      // Si el perfil no existe, intentar crearlo
      if (error.code === 'PGRST116' || error.message?.includes('No rows found')) {
        console.log('Profile not found, attempting to create...')
        
        const { data: userData } = await supabase.auth.getUser()
        if (userData.user) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userData.user.id,
              email: userData.user.email,
              full_name: userData.user.user_metadata?.full_name || userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || 'Estudiante',
              role: 'student'
            })
            .select('id, email, full_name, phone, country, avatar_url, created_at, updated_at, role')
            .single()

          if (createError) {
            console.error('Error creating profile:', createError)
            return null
          }
          
          console.log('Profile created successfully:', newProfile)
          return newProfile
        }
      }
      
      return null
    }

    console.log('Profile found:', data)
    return data
  } catch (error) {
    console.error('Exception in getUserProfile:', error)
    return null
  }
}