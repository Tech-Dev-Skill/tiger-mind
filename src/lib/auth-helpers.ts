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

// Se define un tipo explícito para el estado de los formularios de autenticación
export interface AuthFormState {
  error?: string | null;
  message?: string | null;
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

// ... (las otras funciones de solo lectura como getSession, getUserProfile se mantienen igual)
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

export async function signInAction(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const supabase = await createClientForServerAction();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'El email y la contraseña son obligatorios.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'Credenciales inválidas. Por favor, inténtalo de nuevo.' };
  }

  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profile?.role === 'admin' || profile?.role === 'super_admin') {
      redirect('/admin');
    } else {
      redirect('/student');
    }
  }
  
  return { error: 'Un error inesperado ocurrió.' };
}

export async function signUpAction(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const supabase = await createClientForServerAction();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;

  if (!email || !password || !fullName) {
    return { error: 'Todos los campos son obligatorios.' };
  }
  
  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres.' };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return { error: 'No se pudo crear la cuenta: ' + error.message };
  }

  return { message: '¡Registro exitoso! Revisa tu email para confirmar tu cuenta.' };
}