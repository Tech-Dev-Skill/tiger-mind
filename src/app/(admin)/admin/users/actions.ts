'use server';

import { createClientForServerAction } from '@/lib/server';
import { revalidatePath } from 'next/cache';

export interface UserFormState {
  error: string | null;
  success: boolean;
}

/* 🟠 Actualizar rol, activación y expiración */
export async function updateUserAndSubscriptionAction(
  prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const supabase = await createClientForServerAction();

  const userId = formData.get('userId') as string;
  const role = formData.get('role') as string;
  const subscriptionStatus = formData.get('subscriptionStatus') as string;

  if (!userId || !role || !subscriptionStatus) {
    return { error: 'Faltan datos requeridos.', success: false };
  }

  const now = new Date();
  let activationDate: string | null = null;
  let expirationDate: string | null = null;
  let isActive = false;

  if (subscriptionStatus === 'active') {
    activationDate = now.toISOString();
    const expiration = new Date(now);
    expiration.setDate(now.getDate() + 90);
    expirationDate = expiration.toISOString();
    isActive = true;
  } else if (subscriptionStatus === 'pending') {
    activationDate = null;
    expirationDate = null;
    isActive = false;
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      role,
      is_active: isActive,
      activation_date: activationDate,
      expiration_date: expirationDate,
    })
    .eq('id', userId);

  if (profileError) {
    console.error('Profile update error:', profileError);
    return {
      error: 'Error al actualizar el perfil: ' + profileError.message,
      success: false,
    };
  }

  revalidatePath('/admin/users');
  revalidatePath(`/admin/users/${userId}/edit`);

  return { error: null, success: true };
}

/* 🧹 Eliminar usuario (excepto admin o super_admin) */
export async function deleteUserAction(userId: string): Promise<UserFormState> {
  const supabase = await createClientForServerAction();

  // 1️⃣ Obtener el rol del usuario antes de eliminarlo
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (fetchError) {
    return { error: 'No se pudo verificar el rol del usuario.', success: false };
  }

  // 2️⃣ Evitar eliminar a administradores
  if (profile.role === 'admin' || profile.role === 'super_admin') {
    return { error: 'No se puede eliminar un usuario administrador.', success: false };
  }

  // 3️⃣ Eliminar registro de profiles
  const { error: deleteError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (deleteError) {
    console.error('Delete error:', deleteError);
    return { error: 'Error al eliminar el usuario: ' + deleteError.message, success: false };
  }

  // 4️⃣ (Opcional) eliminar también del auth de Supabase
  // ⚠️ Solo si tienes activado el servicio admin
  try {
    const { data: user } = await supabase.auth.admin.getUserById(userId);
    if (user) {
      await supabase.auth.admin.deleteUser(userId);
    }
  } catch (err) {
    console.warn('No se pudo eliminar desde Auth (requiere permisos admin)');
  }

  // 5️⃣ Revalidar lista
  revalidatePath('/admin/users');

  return { error: null, success: true };
}
