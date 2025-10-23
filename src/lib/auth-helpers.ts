// src/lib/auth-helpers.ts
'use server';

import { redirect } from 'next/navigation';
import {
  createClientForServerComponent,
  createClientForServerAction
} from '@/lib/server';

// =============================================
// TIPOS COMPARTIDOS
// =============================================

export interface AuthFormState {
  success?: boolean;
  error?: string;
  message?: string;
}

// =============================================
// FUNCIONES DE AYUDA (SOLO LECTURA)
// =============================================

export async function getUser() {
  const supabase = await createClientForServerComponent();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function getSession() {
  const supabase = await createClientForServerComponent();
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function getUserProfile(userId: string) {
  const supabase = await createClientForServerComponent();
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, country, avatar_url, created_at, updated_at, role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error getting user profile:', error.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Exception in getUserProfile:', error);
    return null;
  }
}

// =============================================
// SERVER ACTIONS (LECTURA Y ESCRITURA)
// =============================================

export async function signOut() {
  const supabase = await createClientForServerAction();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function signInAction(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const supabase = await createClientForServerAction();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'El email y la contraseña son obligatorios.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: 'Credenciales inválidas. Por favor, inténtalo de nuevo.' };
  }

  if (data?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    // ✅ Retornamos un mensaje antes de redirigir (para SSR)
    if (profile?.role === 'admin' || profile?.role === 'super_admin') {
      redirect('/admin');
    } else {
      redirect('/student');
    }

    return { success: true, message: 'Inicio de sesión exitoso. Redirigiendo...' };
  }

  return { success: false, error: 'Ocurrió un error inesperado.' };
}

export async function signUpAction(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const supabase = await createClientForServerAction();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;

  if (!email || !password || !fullName) {
    return { success: false, error: 'Todos los campos son obligatorios.' };
  }

  if (password.length < 6) {
    return { success: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return { success: false, error: `No se pudo crear la cuenta: ${error.message}` };
  }

  return {
    success: true,
    message: '¡Registro exitoso! Revisa tu email para confirmar tu cuenta.'
  };
}
