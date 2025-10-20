// src/app/(admin)/admin/courses/actions.ts
'use server';

import { createClientForServerAction } from '@/lib/server';
import { revalidatePath } from 'next/cache';

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

export interface FormState {
  error: string | null;
  success: boolean;
}

export async function createCourseAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClientForServerAction();
  const { count } = await supabase.from('courses').select('*', { count: 'exact', head: true });
  if (count !== null && count > 0) {
    return { error: 'Ya existe un curso. No se pueden crear más.', success: false };
  }

  const title = formData.get('title') as string;
  const short_description = formData.get('short_description') as string;
  const priceStr = formData.get('price') as string;
  if (!title || !short_description || !priceStr) {
    return { error: 'Los campos Título, Descripción Corta y Precio son obligatorios.', success: false };
  }
  const price = parseFloat(priceStr);
  if (isNaN(price)) {
    return { error: 'El precio debe ser un número válido.', success: false };
  }

  const description = formData.get('description') as string;
  const thumbnail_url = formData.get('thumbnail_url') as string || null;
  const trailer_url = formData.get('trailer_url') as string || null;
  const is_published = formData.get('is_published') === 'on';
  const duration_hours = parseInt(formData.get('duration_hours') as string, 10) || 0;
  const wompi_payment_link = formData.get('wompi_payment_link') as string || null;
  const paypal_info = formData.get('paypal_info') as string || null;
  const slug = generateSlug(title);

  const { error: insertError } = await supabase.from('courses').insert({
    title, slug, description, short_description, price, thumbnail_url, trailer_url, is_published, duration_hours, wompi_payment_link, paypal_info
  });

  if (insertError) {
    return { error: 'Error de base de datos: ' + insertError.message, success: false };
  }
  revalidatePath('/admin/courses');
  return { error: null, success: true };
}

export async function updateCourseAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClientForServerAction();
  const id = formData.get('id') as string;
  if (!id) {
    return { error: 'ID del curso no encontrado.', success: false };
  }

  const title = formData.get('title') as string;
  const short_description = formData.get('short_description') as string;
  const priceStr = formData.get('price') as string;
  if (!title || !short_description || !priceStr) {
    return { error: 'Los campos Título, Descripción Corta y Precio son obligatorios.', success: false };
  }
  const price = parseFloat(priceStr);
  if (isNaN(price)) {
    return { error: 'El precio debe ser un número válido.', success: false };
  }
  
  const description = formData.get('description') as string;
  const thumbnail_url = formData.get('thumbnail_url') as string || null;
  const trailer_url = formData.get('trailer_url') as string || null;
  const is_published = formData.get('is_published') === 'on';
  const duration_hours = parseInt(formData.get('duration_hours') as string, 10) || 0;
  const wompi_payment_link = formData.get('wompi_payment_link') as string || null;
  const paypal_info = formData.get('paypal_info') as string || null;

  const { error: updateError } = await supabase
    .from('courses')
    .update({
      title, short_description, description, price, thumbnail_url, trailer_url, is_published, duration_hours, wompi_payment_link, paypal_info
    })
    .eq('id', id);

  if (updateError) {
    return { error: 'Error de base de datos: ' + updateError.message, success: false };
  }

  revalidatePath('/admin/courses');
  revalidatePath(`/admin/courses/${id}/edit`);
  return { error: null, success: true };
}

export async function deleteCourseAction(formData: FormData) {
  const supabase = await createClientForServerAction();
  const id = formData.get('id') as string;
  if (!id) { return; }
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) { console.error('Error deleting course:', error); }
  revalidatePath('/admin/courses');
}