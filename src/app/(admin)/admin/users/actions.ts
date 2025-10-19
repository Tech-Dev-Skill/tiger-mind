// src/app/(admin)/admin/users/actions.ts
'use server';

import { createClientForServerAction } from '@/lib/server';
import { revalidatePath } from 'next/cache';

export interface UserFormState {
  error: string | null;
  success: boolean;
}

export async function updateUserAndSubscriptionAction(prevState: UserFormState, formData: FormData): Promise<UserFormState> {
  const supabase = await createClientForServerAction();

  // 1. Extraer datos del formulario
  const userId = formData.get('userId') as string;
  const role = formData.get('role') as string;
  const subscriptionStatus = formData.get('subscriptionStatus') as string;

  if (!userId || !role || !subscriptionStatus) {
    return { error: 'Faltan datos requeridos.', success: false };
  }

  // 2. Actualizar el perfil del usuario (su rol)
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (profileError) {
    return { error: 'Error al actualizar el perfil: ' + profileError.message, success: false };
  }

  // --- LÓGICA AUTOMÁTICA DE 90 DÍAS ---

  let subscriptionEndDate: string | null = null;
  const startDate = new Date(); // La fecha de inicio es siempre hoy

  // Si el admin activa la suscripción, calculamos la fecha de finalización
  if (subscriptionStatus === 'active') {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 90); // Se añaden 90 días
    subscriptionEndDate = endDate.toISOString();
  }
  
  // Si el admin la desactiva (pone otro estado), la fecha de fin será nula
  // (o puedes ponerle 'startDate' si prefieres que termine inmediatamente)

  // ------------------------------------

  // 3. Crear o actualizar la suscripción con la fecha calculada
  const { error: subscriptionError } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      // ¡IMPORTANTE! Reemplaza esto con el ID real de tu plan de 90 días
      plan_id: 'cb82c162-85e3-4050-a02e-c40ac5227181', 
      status: subscriptionStatus,
      start_date: startDate.toISOString(),
      end_date: subscriptionEndDate, // Usamos la fecha automática
    }, { onConflict: 'user_id' }); 

  if (subscriptionError) {
    // Este es el error de RLS que estabas viendo. Si ya arreglaste las políticas, no debería aparecer.
    console.error('Subscription upsert error:', subscriptionError);
    return { error: 'Error al actualizar la suscripción: ' + subscriptionError.message, success: false };
  }

  // 4. Limpiar caché y devolver éxito
  revalidatePath('/admin/users');
  revalidatePath(`/admin/users/${userId}/edit`);
  
  return { error: null, success: true };
}