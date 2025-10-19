// src/app/(admin)/admin/users/[id]/edit/edit-form.tsx
'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateUserAndSubscriptionAction, UserFormState } from '../../actions';

type Profile = { 
  id: string; 
  role: string; 
};
type Subscription = { 
  status: string; 
  end_date: string; 
} | null;

interface FormProps {
  profile: Profile;
  subscription: Subscription;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed">
      {pending ? 'Guardando...' : 'Guardar Cambios'}
    </button>
  );
}

export default function UserEditForm({ profile, subscription }: FormProps) {
  const router = useRouter();
  const initialState: UserFormState = { error: null, success: false };
  const [state, formAction] = useFormState(updateUserAndSubscriptionAction, initialState);

  useEffect(() => {
    if (state.success) {
      alert('¡Usuario y suscripción actualizados con éxito!');
      router.push('/admin/users');
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6 bg-gray-800 rounded-lg p-8">
      {/* Pasamos el ID del usuario de forma oculta al Server Action */}
      <input type="hidden" name="userId" value={profile.id} />
      
      {/* Campo para editar el Rol */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-300">Rol del Usuario</label>
        <select name="role" id="role" defaultValue={profile.role} required className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-orange-500 focus:border-orange-500">
          <option value="student">Estudiante</option>
          <option value="admin">Administrador</option>
          <option value="super_admin">Super Administrador</option>
        </select>
      </div>

      {/* Sección para la Suscripción */}
      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-lg font-bold text-white mb-4">Gestión de Suscripción</h3>
        <div>
            <label htmlFor="subscriptionStatus" className="block text-sm font-medium text-gray-300">Estado de la Suscripción</label>
            <select name="subscriptionStatus" id="subscriptionStatus" defaultValue={subscription?.status || 'pending'} required className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-orange-500 focus:border-orange-500">
                <option value="pending">Pendiente</option>
                <option value="active">Activa (Inicia/Renueva por 90 días)</option>
                <option value="cancelled">Cancelada</option>
                <option value="expired">Expirada</option>
            </select>
            <p className="mt-2 text-xs text-gray-400">
              Seleccionar &apos;Activa&apos; iniciará un nuevo periodo de 90 días desde hoy.
            </p>
        </div>
      </div>

      {/* Muestra de Errores */}
      {state?.error && (
        <div className="bg-red-900/50 p-3 rounded-md text-red-300 text-sm">
          <p>{state.error}</p>
        </div>
      )}

      {/* Botones de Acción */}
      <div className="flex justify-end space-x-4 pt-4 mt-6 border-t border-gray-700">
        <Link href="/admin/users" className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors">
          Cancelar
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}