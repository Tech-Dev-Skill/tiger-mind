'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function TigermindLanding() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 right-0 z-50 p-4">
        <Link 
          href="/login" 
          className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full text-sm uppercase tracking-wide transition-colors duration-300"
        >
          Login Alumnos
        </Link>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <b className="text-white">De cero hábitos a transformar  </b><br />
            <span className="text-orange-500">mi vida con el fitness</span>
          </h1>
          
          <div className="max-w-4xl mx-auto mb-8">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <iframe 
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/QkR1_hVlBcQ"
                title="Tigermind Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <Link 
            href="/courses" 
            className="inline-block px-12 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full text-xl uppercase tracking-wide transition-colors duration-300"
          >
            QUIERO APRENDER MÁS
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-gray-100 text-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-red-600 font-bold text-2xl uppercase mb-4">“Mi historia: de la calle al gym, del desorden a la disciplina.”</h2>
            <p className="text-xl font-bold max-w-4xl mx-auto leading-relaxed text-justify">
              Soy Nixon Silva, tengo 24 años. Comencé a entrenar desde los 15 en parques, 
              haciendo calistenia. A los 21, decidí entrar al gimnasio y fue ahí donde todo cambió.
              Pasé de ser un joven sin hábitos, sin rumbo, a un hombre disciplinado, con mentalidad 
              fuerte y dueño de su propio negocio. Hoy, gracias al fitness, transformé mi cuerpo, mi entorno y mi mente.
            <br />
            </p>
            <p className="text-red-600 font-bold uppercase mb-4" style={{ fontSize: '1.25rem' }}>
              Y ahora quiero ayudarte a ti a lograr lo mismo. Si yo lo logré, tú también puedes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="order-2 md:order-1 flex justify-end">
              <Image
                src="/images/1_index.JPG"
                alt="Nixon"
                width={450} // La mitad de 600
                height={300} // La mitad de 400
                className="rounded-lg mx-auto"
              />
            </div>
            <div className="order-1 md:order-2">
              <h4 className="text-3xl font-bold mb-4">2020</h4>
              <p className="mb-4 text-justify">soy Nixon Silva, y no siempre fui el que ves hoy.
                  Antes era un chico sin hábitos, rodeado de malas relaciones, malos consejos y sin una dirección clara. No tenía energía, motivación ni confianza en mí mismo.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h4 className="text-3xl font-bold mb-4">2025</h4>
              <p className="mb-4 text-justify">Soy la mejor versión de mí mismo: físicamente fuerte, mentalmente enfocado, con hábitos saludables y rodeado de personas que suman.
                Ahora quiero ayudarte a ti a lograr lo mismo. Porque si yo pude cambiar, tú también puedes.</p>
            </div>
            <div>
               <Image
                src="/images/2_index.PNG"
                alt="Nixon"
                width={450} // La mitad de 600
                height={300} // La mitad de 400
                className="rounded-lg mx-auto"
              />
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="#section-1717153620576" 
              className="inline-block px-12 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full text-xl uppercase tracking-wide transition-colors duration-300"
            >
              QUIERO CAMBIAR MI VIDA
            </Link>
          </div>
        </div>
      </section>


 {/* For Me Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Image 
                src="/images/3_index.png" 
                alt="Nixon" 
                width={500} 
                height={500} 
                className="rounded-lg w-full h-auto"
              />
            </div>
            <div>
              <h1 className="text-red-600 font-bold text-4xl uppercase mb-4">¿Qué vas a aprender conmigo?</h1>
                <h2 className="text-4xl md:text-2xl font-bold mb-8 leading-tight text-justify">
                  Conmigo no solo vas a aprender a entrenar tu cuerpo… vas a entrenar tu mente.

                  Vas a aprender a construir hábitos que te transformen, a rodearte de un entorno que te impulse, y a mantener una disciplina que no depende de la motivación.

                  Lo que hoy te parece difícil, mañana será parte de tu estilo de vida.

                  Yo ya lo viví, y ahora te voy a enseñar el camino.

                  Prepárate para convertirte en tu mejor versión.
                </h2>
            </div>
          </div>
        </div>
      </section>
    
 {/* For Me Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Image 
                src="/images/4_index.png" 
                alt="Nixon" 
                width={500} 
                height={500} 
                className="rounded-lg w-full h-auto"
              />
            </div>
            <div>
               <h1 className="text-red-600 font-bold text-2xl uppercase mb-4">¿Esto es solo para gente que ya entrena?</h1>
                  <h4 className="text-xl md:text-1xl max-w-4xl mx-auto leading-relaxed text-justify"> No, para nada.
                    Mi programa es para todos los niveles. Si estás comenzando, yo te guío desde cero. Si ya entrenas, 
                    te ayudo a llevar tu físico y mentalidad a otro nivel. Lo importante es que tengas ganas de mejorar 
                    y estés listo para comprometerte contigo. </h4>
                <h1 className="text-red-600 font-bold text-2xl uppercase mb-4">¿Esto solo se trata de entrenar? ¿O hay más detrás?</h1>
                  <h4 className="text-xl md:text-1xl max-w-4xl mx-auto leading-relaxed text-justify"> Esto va mucho más allá del físico.
                    Conmigo vas a trabajar tu mente, tus hábitos, tu entorno y tu disciplina. 
                    Porque cuando tu mentalidad cambia, tu vida entera cambia. Yo soy prueba de eso.
                    No busco solo que te veas bien… sino que te sientas imparable.
                  </h4>
                <h1 className="text-red-600 font-bold text-2xl uppercase mb-4">¿Cuánto tiempo voy a tardar en ver resultados?</h1>
                  <h4 className="text-xl md:text-1xl max-w-3xl mx-auto leading-relaxed text-justify"> 
                  Todo depende de ti.
                  De tu nivel actual, tu constancia y tu compromiso. Pero si haces lo que te enseño, 
                  los primeros cambios los puedes notar en pocas semanas. Físicamente y mentalmente.
                  Yo no vendo magia. Vendo un camino real. Y si tú lo recorres, el cambio llega.
                  </h4>
            </div>
          </div>
        </div>
      </section>
      {/* For Me Section 2 */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Image 
                src="/images/5_index.png" 
                alt="Nixon" 
                width={500} 
                height={500} 
                className="rounded-lg w-full h-auto"
              />
            </div>
            <div>
               <h1 className="text-red-600 font-bold text-2xl uppercase mb-4"> ¿Tendré seguimiento o me dejas solo después de comprar?</h1>
                <h4 className="text-xl md:text-1xl max-w-4xl mx-auto leading-relaxed text-justify"> 
                  Te acompaño en todo el proceso.
                  Esto no es un curso que compras y ya. Estoy contigo en cada etapa: resolviendo dudas,
                  motivándote, y ajustando tu plan si es necesario. Soy tu coach, no solo tu vendedor.
                </h4>
              <h1 className="text-red-600 font-bold text-2xl uppercase mb-4"> ¿Puedo escribirte directamente si tengo dudas?</h1>
                <h4 className="text-xl md:text-1xl max-w-4xl mx-auto leading-relaxed text-justify"> 
                  Claro que sí.
                  Cuando entres al programa vas a tener contacto directo conmigo. 
                  Yo estoy para ayudarte a avanzar, no para dejarte en visto. 💬
                </h4>
              <h1 className="text-red-600 font-bold text-2xl uppercase mb-4"> ¿Qué necesito para empezar?</h1>
                <h4 className="text-xl md:text-1xl max-w-4xl mx-auto leading-relaxed text-justify"> 
                  Ganas de cambiar tu vida.
                  No necesitas tener experiencia, ni un cuerpo perfecto. Solo necesitas tomar la decisión de empezar. 
                  Todo lo demás lo construimos juntos.
                </h4><br/>
              
              <Link 
                href="#section-1717153620576" 
                className="inline-block px-12 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full text-xl uppercase tracking-wide transition-colors duration-300"
              >
                QUIERO UNIRME A TUS SALAS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-red-600 font-bold text-2xl uppercase mb-4">Nuestra Comunidad</h2>
            <h1 className="text-4xl md:text-5xl font-bold mb-8">BENEFICIOS COMO MIEMBRO</h1>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Educación Online</h3>
              <p className="text-gray-300">Formacion Online</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Mentorias</h3>
              <p className="text-gray-300">Vas a poder participar en sesiones grupales de coaching</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold mb-2">COMUNIDAD</h3>
              <p className="text-gray-300">Podras entrar en un entorno donde todos vayan al mismo objetivo</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">En 3 meses tendrás 3 meses de resultados o 3 meses de excusas</h3>
            <p className="text-xl text-gray-300 mb-8">ESTE ES MI ENTORNO</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Image 
              src="/images/6_index.png" 
              alt="Community" 
              width={800} 
              height={450} 
              className="rounded-lg w-full h-auto mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="section-1717153620576" className="py-20 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold">Únete a mis SALAS</h1>
          </div>

          <div className="max-w-md mx-auto bg-gray-900 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-orange-500">COMUNIDAD🚀</h3>
            <h2 className="text-4xl font-bold mb-6">$300 USD / 3 Meses</h2>
            
            <div className="text-left mb-8 space-y-3">
              <p>• Aprende a MATERIALIZAR todos tus deseos a través de cambiar tu persona.</p>
              <p>• Aprende mi MÉTODO de MANIFESTACIÓN para que cree la vida de tus SUEÑOS</p>
              <p>• Aprende sobre hábitos, mindset, libros, podcast, planteamiento efectivo de metas</p>
              <p>• Elimina tus MIEDOS y tus VICIOS🚫</p>
              <p>• Crea esa persona que admiras y respetas en todas las AREAS</p>
              <p>• Aprende sobre MARKETING, VENTAS, EDICIÓN DE VIDEOS, MARKETING DE AFILIADOS</p>
              <p>• Acceso a la comunidad de discord para que cambies tu entorno (+1500 personas)</p>
              <p>• 1 mentoria semanal con MATI los domingos</p>
              <p className="text-orange-500 font-bold">BONUS: ESCAPA EL SISTEMA CON MARKETING DE AFILIADOS (Valorado en 500 USD)🔥</p>
            </div>

            <a 
              href="https://pay.hotmart.com/F99678281P?checkoutMode=10" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block w-full px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full text-lg uppercase tracking-wide transition-colors duration-300"
            >
              UNIRME A LA COMUNIDAD
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-center">
        <p className="text-gray-400">© 2025 Tigermind - Todos los derechos reservados</p>
      </footer>
    </div>
  )
}