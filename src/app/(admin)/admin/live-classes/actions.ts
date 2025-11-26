'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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

export async function createLiveClass(formData: FormData) {
    const supabase = await createServerSupabaseClient()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const zoom_url = formData.get('zoom_url') as string
    const start_date = formData.get('start_date') as string

    const { error } = await supabase
        .from('live_classes')
        .insert({
            title,
            description,
            zoom_url,
            start_date,
        })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/live-classes')
    redirect('/admin/live-classes')
}

export async function deleteLiveClass(id: string) {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
        .from('live_classes')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/live-classes')
}
