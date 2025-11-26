'use server';

import { createClientForServerAction } from '@/lib/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ======================================================
// FUNCIÓN AUXILIAR PARA GENERAR SLUGS
// ======================================================
function generateSlug(title: string): string {
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

// ======================================================
// TIPOS DE ESTADO (PARA CURSOS)
// ======================================================
export interface FormState {
  error: string | null;
  success: boolean;
}

// ======================================================
// CREAR CURSO
// ======================================================
export async function createCourseAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClientForServerAction();

  const { count } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true });
  if (count !== null && count > 0) {
    return {
      error: 'Ya existe un curso. No se pueden crear más.',
      success: false,
    };
  }

  const title = formData.get('title') as string;
  const short_description = formData.get('short_description') as string;
  const priceStr = formData.get('price') as string;

  if (!title || !short_description || !priceStr) {
    return {
      error: 'Los campos Título, Descripción Corta y Precio son obligatorios.',
      success: false,
    };
  }

  const price = parseFloat(priceStr);
  if (isNaN(price)) {
    return { error: 'El precio debe ser un número válido.', success: false };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'No autorizado.', success: false };
  }

  const description = formData.get('description') as string;
  const thumbnail_url = (formData.get('thumbnail_url') as string) || null;
  const trailer_url = (formData.get('trailer_url') as string) || null;
  const is_published = formData.get('is_published') === 'on';
  const duration_hours =
    parseInt(formData.get('duration_hours') as string, 10) || 0;
  const wompi_payment_link =
    (formData.get('wompi_payment_link') as string) || null;
  const paypal_info = (formData.get('paypal_info') as string) || null;
  const slug = generateSlug(title);

  // Corregido: Se elimina 'instructor_id' que ya no existe en la BD
  const { error: insertError } = await supabase.from('courses').insert({
    title,
    slug,
    description,
    short_description,
    price,
    thumbnail_url,
    trailer_url,
    is_published,
    duration_hours,
    wompi_payment_link,
    paypal_info,
  });

  if (insertError) {
    return {
      error: 'Error de base de datos: ' + insertError.message,
      success: false,
    };
  }

  revalidatePath('/admin/courses');
  return { error: null, success: true };
}

// ======================================================
// ACTUALIZAR CURSO
// ======================================================
export async function updateCourseAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClientForServerAction();
  const id = formData.get('id') as string;
  if (!id) {
    return { error: 'ID del curso no encontrado.', success: false };
  }

  const title = formData.get('title') as string;
  const short_description = formData.get('short_description') as string;
  const priceStr = formData.get('price') as string;
  if (!title || !short_description || !priceStr) {
    return {
      error: 'Los campos Título, Descripción Corta y Precio son obligatorios.',
      success: false,
    };
  }

  const price = parseFloat(priceStr);
  if (isNaN(price)) {
    return { error: 'El precio debe ser un número válido.', success: false };
  }

  const description = formData.get('description') as string;
  const thumbnail_url = (formData.get('thumbnail_url') as string) || null;
  const trailer_url = (formData.get('trailer_url') as string) || null;
  const is_published = formData.get('is_published') === 'on';
  const duration_hours =
    parseInt(formData.get('duration_hours') as string, 10) || 0;
  const wompi_payment_link =
    (formData.get('wompi_payment_link') as string) || null;
  const paypal_info = (formData.get('paypal_info') as string) || null;

  const { error: updateError } = await supabase
    .from('courses')
    .update({
      title,
      short_description,
      description,
      price,
      thumbnail_url,
      trailer_url,
      is_published,
      duration_hours,
      wompi_payment_link,
      paypal_info,
    })
    .eq('id', id);

  if (updateError) {
    return {
      error: 'Error de base de datos: ' + updateError.message,
      success: false,
    };
  }

  revalidatePath('/admin/courses');
  revalidatePath(`/admin/courses/${id}/edit`);
  return { error: null, success: true };
}

// ======================================================
// ELIMINAR CURSO
// ======================================================
export async function deleteCourseAction(formData: FormData) {
  const supabase = await createClientForServerAction();
  const id = formData.get('id') as string;
  if (!id) return;
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) console.error('Error deleting course:', error);
  revalidatePath('/admin/courses');
}

// ======================================================
// TIPO DE ESTADO (PARA VIDEOS)
// ======================================================
export interface VideoFormState {
  error: string | null;
  success: boolean;
}

// ======================================================
// CREAR VIDEO
// ======================================================
export async function createVideoAction(
  prevState: VideoFormState,
  formData: FormData
): Promise<VideoFormState> {
  const supabase = await createClientForServerAction();

  const title = formData.get('title') as string | null;
  const description = (formData.get('description') as string) || '';
  const file = formData.get('video') as File | null;
  const courseId = formData.get('courseId') as string | null;

  if (!title || !file || !courseId) {
    return {
      error: 'El título, el archivo de video y el courseId son obligatorios.',
      success: false,
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_DOMAIN ||
    'http://localhost:3000';

  const uploadEndpoint = `${baseUrl.replace(/\/$/, '')}/api/upload/local-video`;

  interface UploadResponse {
    url?: string;
    video_url?: string;
    video?: { video_url?: string };
    error?: string;
  }

  let videoUrl = '';

  try {
    const fd = new FormData();
    fd.append('video', file);
    fd.append('courseId', courseId);
    fd.append('title', title);
    fd.append('description', description);

    const uploadResponse = await fetch(uploadEndpoint, {
      method: 'POST',
      body: fd,
    });

    let parsed: UploadResponse;
    try {
      parsed = (await uploadResponse.json()) as UploadResponse;
    } catch {
      const raw = await uploadResponse.text();
      parsed = { error: `Respuesta no JSON: ${raw}` };
    }

    if (!uploadResponse.ok) {
      return {
        error:
          parsed?.error ||
          `Error al subir el video. Código: ${uploadResponse.status}`,
        success: false,
      };
    }

    videoUrl =
      parsed.url || parsed.video_url || parsed.video?.video_url || '';

    if (!videoUrl) {
      return {
        error: 'La API de subida no devolvió una URL válida del video.',
        success: false,
      };
    }
  } catch (err) {
    if (err instanceof Error) {
      return {
        error: `Error al subir el video localmente: ${err.message}`,
        success: false,
      };
    }
    return {
      error: 'Error desconocido al subir el video localmente.',
      success: false,
    };
  }

  const { data: lastVideo, error: orderError } = await supabase
    .from('videos')
    .select('order_index')
    .eq('course_id', courseId)
    .order('order_index', { ascending: false })
    .limit(1)
    .single();

  if (orderError && orderError.code !== 'PGRST116') {
    return { error: 'Error al calcular el orden del video.', success: false };
  }

  const newOrderIndex = lastVideo ? lastVideo.order_index + 1 : 1;

  const { error: insertError } = await supabase.from('videos').insert({
    title,
    description,
    video_url: videoUrl,
    course_id: courseId,
    order_index: newOrderIndex,
  });

  if (insertError) {
    return {
      error: 'Error guardando el registro en la base de datos.',
      success: false,
    };
  }

  revalidatePath(`/admin/courses/${courseId}/content`);
  return { error: null, success: true };
}


// ======================================================
// NUEVA ACCIÓN PARA ACTUALIZAR UN VIDEO
// ======================================================
export async function updateVideoAction(
  prevState: VideoFormState,
  formData: FormData
): Promise<VideoFormState> {
  const supabase = await createClientForServerAction();
  
  const title = formData.get('title') as string;
  const video_url = formData.get('video_url') as string;
  const description = formData.get('description') as string | null;
  const videoId = formData.get('videoId') as string;
  const courseId = formData.get('courseId') as string;

  if (!title || !video_url || !videoId || !courseId) {
    return { error: 'Faltan datos (título, URL o ID).', success: false };
  }

  const { error } = await supabase
    .from('videos')
    .update({
      title: title,
      video_url: video_url,
      description: description,
    })
    .eq('id', videoId);

  if (error) {
    console.error('Error updating video:', error);
    return { error: 'Error de base de datos al actualizar el video.', success: false };
  }

  revalidatePath(`/admin/courses/${courseId}/content`);
  return { error: null, success: true };
}

// ======================================================
// NUEVA ACCIÓN PARA ELIMINAR UN VIDEO
// ======================================================
export async function deleteVideoAction(formData: FormData) {
  const supabase = await createClientForServerAction();

  const videoId = formData.get('videoId') as string;
  const courseId = formData.get('courseId') as string;

  if (!videoId || !courseId) {
    console.error('Error: Faltan IDs para eliminar el video.');
    return;
  }

  // Aquí también deberías añadir la lógica para eliminar el archivo del VPS
  // ... (código para llamar a tu API de borrado del VPS) ...

  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', videoId);

  if (error) {
    console.error('Error deleting video:', error);
  }

  revalidatePath(`/admin/courses/${courseId}/content`);
}