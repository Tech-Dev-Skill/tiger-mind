'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration_days: number;
  features: string[];
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);

      // Obtener el plan de suscripción
      const { data: planData } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true })
        .single();

      setPlan(planData);

      // Verificar suscripción actual
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setCurrentSubscription(subscriptionData);

    } catch (err) {
      console.error('Error fetching subscription data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!userId || !plan) return;

    setProcessing(true);

    try {
      // Aquí normalmente integrarías con Wompi o tu pasarela de pago
      // Por ahora, simularemos la activación de la suscripción
      
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + plan.duration_days);

      await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan_id: plan.id,
          status: 'active',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          payment_id: 'simulated_payment_' + Date.now(),
          payment_method: 'simulated',
          auto_renew: true
        });

      alert('¡Suscripción activada exitosamente!');
      router.push('/student');

    } catch (err) {
      console.error('Error creating subscription:', err);
      alert('Error al activar la suscripción');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay planes disponibles</h3>
          <p className="text-gray-600">Por favor, contacta al soporte.</p>
        </div>
      </div>
    );
  }

  const hasActiveSubscription = currentSubscription && 
    currentSubscription.status === 'active' && 
    new Date(currentSubscription.end_date) > new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Membresía Tiger Mind
          </h1>
          <p className="text-xl text-gray-600">
            Activa tu acceso completo a todos los cursos premium
          </p>
        </div>

        {hasActiveSubscription ? (
          <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">¡Ya tienes una suscripción activa!</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Tu suscripción está activa hasta el {new Date(currentSubscription.end_date).toLocaleDateString('es-ES')}.</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => router.push('/student')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-800 bg-green-100 hover:bg-green-200"
                  >
                    Ir al dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-4">
                  ${plan.price}
                  <span className="text-lg font-normal text-gray-500">{plan.currency}</span>
                </div>
                <p className="text-lg text-gray-600 mb-8">
                  por {plan.duration_days} días de acceso completo
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Incluye:</h3>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={handleSubscribe}
                  disabled={processing}
                  className="w-full bg-orange-600 border border-transparent rounded-md py-3 px-6 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Procesando...' : 'Activar suscripción'}
                </button>
                
                <p className="mt-4 text-center text-sm text-gray-600">
                  Al activar, aceptas los términos y condiciones
                </p>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  ¿Tienes preguntas?{' '}
                  <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
                    Contacta soporte
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Preguntas frecuentes
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¿Qué incluye la membresía?
              </h3>
              <p className="text-gray-600">
                Acceso completo a todos los cursos premium, certificados digitales, comunidad exclusiva y soporte prioritario.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¿Puedo cancelar cuando quiera?
              </h3>
              <p className="text-gray-600">
                Sí, puedes cancelar tu suscripción en cualquier momento desde tu panel de estudiante.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¿Qué pasa después de los 90 días?
              </h3>
              <p className="text-gray-600">
                Tu suscripción se renovará automáticamente cada 90 días. Puedes desactivar la renovación automática cuando quieras.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}