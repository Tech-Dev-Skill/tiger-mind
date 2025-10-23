// src/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { signInAction, signUpAction } from '@/lib/auth-helpers';
import Link from 'next/link';

interface AuthFormState {
  error?: string;
  message?: string;
}

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formState, setFormState] = useState<AuthFormState>({});

  async function handleSubmit(formData: FormData) {
    const action = isSignUp ? signUpAction : signInAction;
    const result = await action({}, formData);
    setFormState(result);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-[#2b1400] text-white">
      <div className="w-full max-w-sm bg-gray-900/80 p-8 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-md">
        
        {/* LOGO / NOMBRE */}
        <Link
          href="/"
          className="block text-center text-3xl font-extrabold tracking-wide bg-gradient-to-r from-[#ff6a00] via-[#ff8800] to-[#ffa733] text-transparent bg-clip-text hover:opacity-90 transition leading-tight"
        >
          TigerMind
        </Link>

        {/* TÍTULO */}
        <h1 className="text-lg mt-4 mb-2 text-center font-semibold text-[#ff8c1a] drop-shadow-md">
          {isSignUp ? 'Crea tu cuenta' : 'Bienvenido de vuelta'}
        </h1>

        {/* FORMULARIO */}
        <form action={handleSubmit} className="flex flex-col gap-4 mt-4">
          {isSignUp && (
            <input
              type="text"
              name="fullName"
              placeholder="Nombre completo"
              required
              className="p-2 bg-gray-800/70 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a] text-white placeholder-gray-400 transition"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            required
            className="p-2 bg-gray-800/70 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a] text-white placeholder-gray-400 transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            required
            className="p-2 bg-gray-800/70 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a] text-white placeholder-gray-400 transition"
          />

          <button
            type="submit"
            className="mt-3 p-2 bg-gradient-to-r from-[#ff6a00] to-[#ff8800] hover:from-[#ff7a1a] hover:to-[#ff9e33] text-black font-bold rounded-md shadow-lg hover:shadow-[#ff8c1a]/40 transition-all duration-300"
          >
            {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </form>

        {/* MENSAJES */}
        {formState.error && (
          <div className="text-red-400 text-sm mt-3 text-center bg-red-900/40 p-2 rounded-md border border-red-800 shadow-md">
            {formState.error}
          </div>
        )}

        {formState.message && (
          <div className="text-green-400 text-sm mt-3 text-center bg-green-900/40 p-2 rounded-md border border-green-800 shadow-md">
            {formState.message}
          </div>
        )}

        {/* BOTÓN DE CAMBIO */}
        <div className="mt-5 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm font-medium text-[#ff8c1a] hover:text-[#ffad33] transition"
          >
            {isSignUp
              ? '¿Ya tienes una cuenta? Inicia sesión'
              : '¿No tienes una cuenta? Crea una'}
          </button>
        </div>
      </div>
    </div>
  );
}
