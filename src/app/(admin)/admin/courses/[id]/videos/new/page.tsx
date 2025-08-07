import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import VideoUploadForm from './client-form'

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
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}

export default async function NewVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  
  // Verificar autenticación
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Verificar rol de administrador
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    redirect('/student')
  }

  // Obtener información del curso y módulos
  const { data: course } = await supabase
    .from('courses')
    .select('title')
    .eq('id', id)
    .single()

  const { data: modules } = await supabase
    .from('course_modules')
    .select('id, title, order_index')
    .eq('course_id', id)
    .order('order_index')

  if (!course) {
    redirect('/admin/courses')
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex items-center mb-6">
          <Link
            href={`/admin/courses/${id}/videos`}
            className="mr-4 inline-flex items-center px-3 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            ← Volver
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Subir Nuevo Video</h1>
            <p className="mt-1 text-sm text-gray-300">{course.title}</p>
          </div>
        </div>

        <div className="bg-gray-800 shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <VideoUploadForm courseId={id} modules={modules || []} />
          </div>
        </div>
      </div>
    </div>
  )
}