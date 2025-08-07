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
            <b className="text-white">Asi fue como con 20 años pude</b><br />
            <span className="text-orange-500">TRANSFORMAR MI VIDA</span>
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
            <h2 className="text-red-600 font-bold text-2xl uppercase mb-4">QUIEN ES MATIAS CARDOZO...</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Como fui literalmente de un pueblo de Argentina a un LAMBORGHINI
            </h3>
            <p className="text-xl font-bold max-w-4xl mx-auto leading-relaxed">
              Como pase de perder todo el propósito, tener malos habitos, perseguir el dinero, no tener confianza, 
              creer que era un fracasado a generar cientos de miles de dolares de beneficio al año, tener un cuerpo 
              increible y convertirme en ese hombre que admiro y respeto
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="order-2 md:order-1">
              <Image 
                src="/images/1_index.JPG" 
                alt="Matias 2023" 
                width={600} 
                height={400} 
                className="rounded-lg w-full h-auto"
              />
            </div>
            <div className="order-1 md:order-2">
              <h4 className="text-3xl font-bold mb-4">2023</h4>
              <p className="mb-4">Despues de haber fracasado en ese sueño que tuve siempre desde chico y haberme perdido el proposito conoci a mi actual mentor Llados.</p>
              <p className="mb-4">Empece a cambiar mis acciones, pensamientos por mas que no tenia ni un solo dolar en mi cuenta.</p>
              <p className="mb-4">Vivia con mis padres. Ellos ganaban 600 dolares al mes entre los 2. No me faltaba nada pero tampoco me sobraba.</p>
              <p>No tenia el fisico que siempre quise tener</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h4 className="text-3xl font-bold mb-4">2025</h4>
              <p className="mb-4">Creo ese hombre que admiro y que respeto.</p>
              <p className="mb-4">Me compro mi Lamborghini</p>
              <p className="mb-4">Viajo a mas de 7 paises en primera clase</p>
              <p className="mb-4">Me convierto en un referente en LATAM de Desarrollo Personal y Coaching</p>
              <p className="mb-4">Cumplo mi sueño de vivir de mi Marca Personal, de tener un negocio, de ser proveedor de mi familia, pero lo que mas importa de todo esto es en la persona en que me converti en este lapso de tiempo.</p>
              <p>Porque ya no me valido con todo eso que logre sino con QUIEN SOY Y hoy en dia me hace feliz ayudar a las personas a entender como funciona la mente para lograr aquello que desean.</p>
            </div>
            <div>
              <Image 
                src="/images/2_Index.PNG" 
                alt="Matias 2025" 
                width={600} 
                height={400} 
                className="rounded-lg w-full h-auto"
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

      {/* Learn Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-red-600 font-bold text-2xl uppercase mb-4">¿Qué vas a aprender conmigo?</h2>
          <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            Vas a entender como funciona el ÉXITO y como PODÉS crear la realidad de tus sueños sin importar en que punto te encuentres
          </h1>
          
          <div className="max-w-5xl mx-auto mb-8">
            <Image 
              src="/images/La quiero en la nuestra de resultados.PNG" 
              alt="Success" 
              width={800} 
              height={450} 
              className="rounded-lg w-full h-auto mx-auto"
            />
          </div>

          <h4 className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            ¿Por que no todas las personas que empiezan la universidad se reciben? <br/>
            ¿Por que no todas las personas que van al gimnasio estan en forma?<br/>
            ¿Por que no todas las personas que quieren crear un negocio lo tienen?<br/><br/>
            Estan enfocados en TENER, no en SER
          </h4>
        </div>
      </section>

      {/* For Me Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Image 
                src="/images/IMG_7157.HEIC" 
                alt="Is this for me?" 
                width={500} 
                height={500} 
                className="rounded-lg w-full h-auto"
              />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-8">¿Esto es para mi?</h1>
              <p className="text-lg mb-4">Si sos una persona la cual esta estancada hace tiempo y no puede ver resultados, si</p>
              <p className="text-lg mb-4">Si estas empezando a emprender y te encontras perdido en tu camino, si</p>
              <p className="text-lg mb-4">Si ya intentaste decenas de veces modelos de negocios sin ver resultados, si</p>
              <p className="text-lg mb-8">Si Queres aprender de una persona que TIENE los RESULTADOS, si</p>
              
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
            <h3 className="text-3xl font-bold mb-4">YO NO VENDO NADA, YO CREO RELACIONES</h3>
            <p className="text-xl text-gray-300 mb-8">ESTE ES MI ENTORNO</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Image 
              src="/images/IMG_7021.HEIC" 
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
            <h2 className="text-5xl font-bold mb-6">$100 USD/mes</h2>
            
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
        <p className="text-gray-400">© 2024 Tigermind - Todos los derechos reservados</p>
      </footer>
    </div>
  )
}