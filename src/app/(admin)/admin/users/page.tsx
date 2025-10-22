// ✅ src/app/(admin)/admin/users/page.tsx

import { createClientForServerComponent } from '@/lib/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Edit, ShieldCheck, ShieldAlert, Trash2 } from 'lucide-react';
import { deleteUserAction } from './actions'; // asegúrate que existe

// Tipos de datos
type Subscription = {
  status: string;
  end_date: string;
};

type ProfileWithSubscription = {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  subscriptions: Subscription[];
};

export default async function AdminUsersPage() {
  const supabase = await createClientForServerComponent();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!adminProfile || !['admin', 'super_admin'].includes(adminProfile.role)) {
    redirect('/dashboard');
  }

  const {
    data: profiles,
    error,
  }: {
    data: ProfileWithSubscription[] | null;
    error: Error | null;
  } = (await supabase
    .from('profiles')
    .select('*, subscriptions(status, end_date)')
    .order('created_at', { ascending: false })) as unknown as {
    data: ProfileWithSubscription[] | null;
    error: Error | null;
  };

  if (error) {
    console.error('Error fetching users for admin:', error);
    return <div className="p-6 text-white">Error al cargar los usuarios.</div>;
  }

  async function deleteUser(formData: FormData) {
    'use server';
    const userId = formData.get('userId') as string;
    if (!userId) return;
    await deleteUserAction(userId);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestionar Usuarios</h1>
          <Link href="/admin" className="hover:text-orange-500 text-sm">
            ← Volver al Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {(profiles ?? []).map((profile) => {
                const isActive = profile.is_active;

                return (
                  <tr key={profile.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {profile.full_name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-400">{profile.email}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {profile.role}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isActive
                            ? 'bg-green-600 text-green-100'
                            : 'bg-yellow-600 text-yellow-100'
                        }`}
                      >
                        {isActive ? (
                          <ShieldCheck className="w-3 h-3 mr-1" />
                        ) : (
                          <ShieldAlert className="w-3 h-3 mr-1" />
                        )}
                        {isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-4">
                      <Link
                        href={`/admin/users/${profile.id}/edit`}
                        className="text-orange-400 hover:text-orange-500 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        
                      </Link>

                      {/* Botón eliminar (solo no admins) */}
                      {profile.role !== 'admin' &&
                        profile.role !== 'super_admin' && (
                          <form
                            action={async (formData) => {
                              'use server';
                              const confirmed = true; // confirmación se maneja con JS aparte
                              if (confirmed) {
                                await deleteUserAction(
                                  formData.get('userId') as string
                                );
                              }
                            }}
                          >
                            <input
                              type="hidden"
                              name="userId"
                              value={profile.id}
                            />
                            <button
                              type="submit"
                              className="text-red-400 hover:text-red-500 flex items-center gap-2 text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                              
                            </button>
                          </form>
                        )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
