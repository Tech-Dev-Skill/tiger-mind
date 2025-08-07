'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Profile {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  created_at: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Auth error:', authError)
        router.push('/login')
        return
      }

      if (!user) {
        console.error('No user found')
        router.push('/login')
        return
      }

      console.log('Loading profile for user:', user.id)
      console.log('User email:', user.email)
      console.log('User metadata:', user.user_metadata)

      // Primero intentar obtener el perfil
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone, country, avatar_url, created_at, updated_at')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error loading profile:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        
        // Si no existe el perfil, intentar crearlo vía API
        if (error.code === 'PGRST116' || error.message?.includes('No rows found')) {
          console.log('Profile not found, attempting to create...')
          
          try {
            // Primero intentar crear el perfil vía API
            const response = await fetch('/api/auth/setup-profile', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            })

            if (response.ok) {
              // Recargar el perfil después de crearlo
              const { data: newData, error: newError } = await supabase
                .from('profiles')
                .select('id, email, full_name, phone, country, avatar_url, created_at, updated_at')
                .eq('id', user.id)
                .single()

              if (newError) throw newError
              
              setProfile(newData)
              setFullName(newData.full_name || '')
            } else {
              // Si la API falla, intentar crear directamente
              console.log('API failed, trying direct creation...')
              const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                  id: user.id,
                  email: user.email,
                  full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Estudiante',
                  role: 'student'
                })
                .select()
                .single()

              if (createError) {
                console.error('Error creating profile:', createError)
                throw createError
              }
              
              setProfile(newProfile)
              setFullName(newProfile.full_name || '')
            }
          } catch (createError: any) {
            console.error('Error in profile creation:', createError)
            setError(`Error al crear perfil: ${createError.message || 'Error desconocido'}`)
          }
        } else {
          setError(`Error al cargar perfil: ${error.message || JSON.stringify(error)}`)
        }
      } else {
        console.log('Profile loaded successfully:', data)
        setProfile(data)
        setFullName(data.full_name || '')
      }
    } catch (error: any) {
      console.error('General error in loadProfile:', error)
      setError(`Error general: ${error.message || JSON.stringify(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no encontrado')

      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)

      if (error) throw error

      setSuccess('Perfil actualizado exitosamente')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Tiger Mind</h1>
              <p className="text-gray-300">Mi Perfil</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/student"
                className="text-gray-300 hover:text-white"
              >
                Volver al Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Mi Perfil</h2>
              
              {error && (
                <div className="bg-red-600 text-white p-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-600 text-white p-3 rounded mb-4">
                  {success}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Fecha de registro
                  </label>
                  <input
                    type="text"
                    value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : ''}
                    disabled
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Actualizar perfil'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}