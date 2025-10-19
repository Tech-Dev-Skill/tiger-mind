// src/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { signInAction, signUpAction } from '@/lib/auth-helpers'; // Se importan las nuevas acciones

// Componente para el botón, para mostrar el estado de "pending"
function AuthButton({ isSignUp }: { isSignUp: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
    >
      {pending ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      ) : (
        isSignUp ? 'Crear cuenta' : 'Iniciar sesión'
      )}
    </button>
  );
}

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  // useFormState para manejar los errores y mensajes de las Server Actions
  const [signInState, signInFormAction] = useFormState(signInAction, { error: null });
  const [signUpState, signUpFormAction] = useFormState(signUpAction, { message: null, error: null });

  const formState = isSignUp ? signUpState : signInState;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-orange-900">
      <div className="max-w-md w-full space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            <Link href="/" className="text-gray-300 hover:text-white">Tiger Mind</Link>
          </h1>
          <h2 className="text-2xl font-bold text-orange-500">
            {isSignUp ? 'Crea tu cuenta' : 'Bienvenido de vuelta'}
          </h2>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm py-8 px-6 shadow-2xl rounded-2xl border border-gray-800">
          <form className="space-y-6" action={isSignUp ? signUpFormAction : signInFormAction}>
            {isSignUp && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">Nombre completo</label>
                <input id="fullName" name="fullName" type="text" required
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  placeholder="Tu nombre completo"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
              <input id="email" name="email" type="email" required
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">Contraseña</label>
              <input id="password" name="password" type="password" required
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                placeholder="••••••••"
              />
            </div>

            {formState?.error && (
              <div className="text-red-400 text-sm text-center bg-red-900/50 p-2 rounded-md">
                {formState.error}
              </div>
            )}
            
            {signUpState?.message && (
              <div className="text-green-400 text-sm text-center bg-green-900/50 p-2 rounded-md">
                {signUpState.message}
              </div>
            )}

            <div>
              <AuthButton isSignUp={isSignUp} />
            </div>
          </form>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-300 hover:text-white"
            >
              {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}