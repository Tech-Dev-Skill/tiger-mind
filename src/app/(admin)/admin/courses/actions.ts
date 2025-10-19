// src/app/(admin)/admin/courses/actions.ts
'use server';

import { createClientForServerAction } from '@/lib/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Función para generar un slug a partir de un título
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}

// El estado que usaremos para la comunicación entre servidor y cliente
export interface FormState {
  error: string | null;
  success: boolean;
}

// =============================================
// ACCIÓN PARA CREAR UN NUEVO CURSO
// =============================================
export async function createCourseAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClientForServerAction();

  // Lógica de negocio: Verificar que solo se pueda crear un curso
  const { count } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true });

  if (count !== null && count > 0) {
    return { error: 'Ya existe un curso. No se pueden crear más.', success: false };
  }

  const title = formData.get('title') as string;
  const short_description = formData.get('short_description') as string;
  const priceStr = formData.get('price') as string;
  const category_id = formData.get('category_id') as string;
  
  if (!title || !short_description || !category_id || !priceStr) {
    return { error: 'Los campos con (*) son obligatorios.', success: false };
  }

  const price = parseFloat(priceStr);
  if (isNaN(price)) {
    return { error: 'El precio debe ser un número válido.', success: false };
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: 'No autorizado. Por favor, inicie sesión de nuevo.', success: false };
  }

  const description = formData.get('description') as string;
  const thumbnail_url = formData.get('thumbnail_url') as string || null;
  const trailer_url = formData.get('trailer_url') as string || null;
  const is_published = formData.get('is_published') === 'on';
  const duration_hours = parseInt(formData.get('duration_hours') as string, 10) || 0;
  
  const slug = generateSlug(title);

  const { error: insertError } = await supabase.from('courses').insert({
    title,
    slug,
    description,
    short_description,
    price,
    category_id,
    thumbnail_url,
    trailer_url,
    is_published,
    duration_hours,
    instructor_id: user.id,
  });

  if (insertError) {
    console.error('Error creating course:', insertError);
    return { error: 'Error de base de datos: ' + insertError.message, success: false };
  }

  revalidatePath('/admin/courses');
  return { error: null, success: true };
}


// =============================================
// ACCIÓN PARA ACTUALIZAR UN CURSO EXISTENTE
// =============================================
export async function updateCourseAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClientForServerAction();

  const id = formData.get('id') as string;
  if (!id) {
    return { error: 'ID del curso no encontrado.', success: false };
  }

  const title = formData.get('title') as string;
  const short_description = formData.get('short_description') as string;
  const description = formData.get('description') as string;
  const priceStr = formData.get('price') as string;
  const category_id = formData.get('category_id') as string;
  const thumbnail_url = formData.get('thumbnail_url') as string || null;
  const trailer_url = formData.get('trailer_url') as string || null;
  const is_published = formData.get('is_published') === 'on';
  const duration_hours = parseInt(formData.get('duration_hours') as string, 10) || 0;

  if (!title || !short_description || !category_id || !priceStr) {
    return { error: 'Los campos con (*) son obligatorios.', success: false };
  }

  const price = parseFloat(priceStr);
  if (isNaN(price)) {
    return { error: 'El precio debe ser un número válido.', success: false };
  }

  const { error: updateError } = await supabase
    .from('courses')
    .update({
      title,
      short_description,
      description,
      price,
      category_id,
      thumbnail_url,
      trailer_url,
      is_published,
      duration_hours,
    })
    .eq('id', id);

  if (updateError) {
    console.error('Error updating course:', updateError);
    return { error: 'Error de base de datos: ' + updateError.message, success: false };
  }

  revalidatePath('/admin/courses');
  revalidatePath(`/admin/courses/${id}/edit`);
  
  return { error: null, success: true };
}


// =============================================
// ACCIÓN PARA ELIMINAR UN CURSO EXISTENTE
// =============================================
export async function deleteCourseAction(formData: FormData) {
  const supabase = await createClientForServerAction();

  const id = formData.get('id') as string;
  if (!id) {
    console.error('Delete action called without a course ID.');
    return; // Opcional: devolver un estado de error
  }

  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting course:', error);
    // Opcional: devolver un estado de error para mostrar en la UI
  }

  // Limpiamos el caché para que la lista se actualice automáticamente
  revalidatePath('/admin/courses');
}