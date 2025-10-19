// src/app/(admin)/admin/users/[id]/edit/page.tsx

import { createClientForServerComponent } from '@/lib/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import UserEditForm from './edit-form';

interface EditUserPageProps {
  params: { 
    id: string; 
  };
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = params;
  const supabase = await createClientForServerComponent();

  // Verificamos si el administrador está logueado
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }

  // Cargamos los datos del perfil y la suscripción
  const [profileResult, subscriptionResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', id).single(),
    supabase.from('subscriptions').select('*').eq('user_id', id).single(),
  ]);

  const { data: profile, error: profileError } = profileResult;

  // --- INICIO DE LA CORRECCIÓN CLAVE ---
  // Si hay un error (ej: el usuario no existe), DEVOLVEMOS UN COMPONENTE de error.
  // NO usamos redirect() aquí dentro.
  if (profileError) {
    console.error("Error fetching profile to edit:", profileError.message);
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
          <header className="max-w-3xl mx-auto mb-6">
             <Link href="/admin/users" className="hover:text-orange-500 text-sm">
              ← Volver a la Lista de Usuarios
            </Link>
          </header>
          <main className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg">
              <h1 className="text-2xl font-bold text-red-400">Error al Cargar Usuario</h1>
              <p className="text-gray-300 mt-2">No se pudo encontrar el perfil del usuario con el ID proporcionado. Es posible que haya sido eliminado.</p>
              <p className="text-xs text-gray-500 mt-4 font-mono">ID: {id}</p>
          </main>
      </div>
    );
  }
  // --- FIN DE LA CORRECCIÓN CLAVE ---

  const { data: subscription } = subscriptionResult;

  // Si todo va bien, devolvemos el componente principal de la página
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 h-16 flex items-center">
        <div className="max-w-3xl mx-auto px-4 w-full">
            <Link href="/admin/users" className="hover:text-orange-500 text-sm">
              ← Volver a la Lista de Usuarios
            </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Editar Usuario y Suscripción</h1>
        <p className="text-gray-400 mb-6">
          Editando a: <span className="font-mono text-gray-300">{profile.email}</span>
        </p>
        
        <UserEditForm 
          profile={profile} 
          subscription={subscription} 
        />
      </main>
    </div>
  );
}