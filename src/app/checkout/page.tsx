// src/app/checkout/page.tsx

import { createClientForServerComponent } from "@/lib/server";
import Link from "next/link";
import { CreditCard, ArrowLeft, Send } from "lucide-react";

// --- SE IMPORTAN LOS ÍCONOS DE FONT AWESOME ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const PayPalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#0070BA">
        <path d="M7.74 21.34h3.45c.74 0 1.4-.13 1.97-.4.57-.27.94-.68 1.1-1.22.17-.54.1-1.18-.2-1.93-.3-.74-.8-1.3-1.5-1.67-.7-.37-1.5-.56-2.4-.56H8.34l-.6 3.81zm5.3-6.9c.74-.42 1.27-1.04 1.6-1.85.33-.82.4-1.74.2-2.77-.2-1.03-.7-1.88-1.5-2.54-.8-.66-1.8-1-3-1H7.14l-.6 3.8h2.3c.6 0 1.1.08 1.5.25.4.17.7.4.9.7.2.3.3.65.3 1.05 0 .3-.04.57-.14.8-.1.23-.25.42-.45.56-.2.14-.45.21-.75.21H8.94l-.6 3.8h3.15c.9 0 1.7-.16 2.4-.49z"/>
        <path d="M22 5.3v13.4c0 1.2-1 2.2-2.2 2.2H4.2C3 20.9 2 19.9 2 18.7V5.3C2 4.1 3 3.1 4.2 3.1h15.6c1.2 0 2.2 1 2.2 2.2z"/>
    </svg>
);

// Se elimina el componente WhatsAppIcon SVG anterior

export default async function CheckoutPage() {
    const supabase = await createClientForServerComponent();
    const whatsappLink = "https://wa.me/573112624924";

    const { data: course, error } = await supabase
        .from('courses')
        .select('title, price, wompi_payment_link, paypal_info')
        .eq('is_published', true)
        .limit(1)
        .single();

    if (error || !course) {
        return (
             <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-red-400 mb-4">Página de Pago No Disponible</h1>
                <p className="text-gray-300 text-center mb-8">Actualmente no hay un curso disponible para la compra. Por favor, inténtalo más tarde.</p>
                <Link href="/landing" className="flex items-center gap-2 text-orange-400 hover:text-orange-500">
                    <ArrowLeft size={16} /> Volver a la página principal
                </Link>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Finalizar Compra</h1>
                    <p className="text-gray-300 mt-2">Estás a un paso de unirte a <span className="font-bold text-orange-400">Tiger Mind</span>.</p>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300">{course.title}</span>
                        <span className="text-xl font-bold text-white">${course.price} USD</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {course.wompi_payment_link && (
                        <a href={course.wompi_payment_link} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-transform hover:scale-105">
                            <CreditCard size={20} />
                            Pagar con Tarjeta (Wompi)
                        </a>
                    )}

                    {course.paypal_info && (
                        <div className="text-center border border-gray-700 rounded-lg p-4">
                            <h3 className="flex items-center justify-center gap-2 font-semibold text-white mb-3">
                                <PayPalIcon />
                                Opción 2: Pagar con PayPal
                            </h3>
                            <p className="text-gray-300 text-sm">
                                Envía el pago directamente a la siguiente cuenta de PayPal:
                            </p>
                            <p className="mt-2 text-lg font-bold text-orange-400 bg-gray-900 rounded p-2 inline-block">
                                {course.paypal_info}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 bg-blue-900/50 border border-blue-700 rounded-lg p-4 text-center">
                    <h4 className="font-bold text-blue-300 flex items-center justify-center gap-2">
                        <Send size={16} /> ¡Paso Final Importante!
                    </h4>
                    <p className="text-sm text-blue-200 mt-2">
                        Después de realizar el pago, por favor envía el <strong>comprobante a soporte por WhatsApp</strong> para la activación de tu cuenta.
                    </p>
                     <p className="text-xs text-blue-400 mt-2">
                        Si tienes dudas, <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-white">contáctanos por el chat</a>.
                    </p>
                </div>

                {!course.wompi_payment_link && !course.paypal_info && (
                    <p className="text-center text-yellow-400 text-sm mt-6">Los métodos de pago no están configurados actualmente. Por favor, contacta a soporte.</p>
                )}

                <div className="text-center mt-8">
                    <Link href="/landing" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
                        Volver a la página principal
                    </Link>
                </div>
            </div>
             
            <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-orange-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-700 transition-all duration-300 text-3xl"
                aria-label="Contactar por WhatsApp"
            >
                <FontAwesomeIcon icon={faWhatsapp} />
            </a>
        </div>
    );
}