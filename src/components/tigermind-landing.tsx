'use client'

import Image from 'next/image'
import Link from 'next/link'

// --- ÍCONOS SVG FIELES A LAS MARCAS (MONOCROMÁTICOS) ---
const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 2.163c-3.072 0-3.442.012-4.65.067-2.181.1-3.391 1.309-3.49 3.49-.055 1.208-.067 1.578-.067 4.65s.012 3.442.067 4.65c.1 2.181 1.309 3.391 3.49 3.49 1.208.055 1.578.067 4.65.067s3.442-.012 4.65-.067c2.181-.1 3.391-1.309 3.49-3.49.055-1.208.067-1.578.067-4.65s-.012-3.442-.067-4.65c-.1-2.181-1.309-3.391-3.49-3.49-1.208-.055-1.578-.067-4.65-.067zM12 8.25c-2.404 0-4.35 1.946-4.35 4.35s1.946 4.35 4.35 4.35 4.35-1.946 4.35-4.35S14.404 8.25 12 8.25zm0 2.163c1.207 0 2.188.981 2.188 2.188s-.981 2.188-2.188 2.188-2.188-.981-2.188-2.188.981-2.188 2.188-2.188zm4.59-4.864c-.596 0-1.077.481-1.077 1.077s.481 1.077 1.077 1.077 1.077-.481 1.077-1.077-.481-1.077-1.077-1.077z"/>
    </svg>
);
const TiktokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.86-.95-6.69-2.81-1.77-1.8-2.5-4.14-2.4-6.51.09-2.22 1.04-4.18 2.4-5.65 1.54-1.63 3.6-2.57 5.72-2.61.01 2.17-.01 4.33.01 6.5.61.12 1.21.28 1.79.52.48.19.98.37 1.45.61v-8.4z"/>
  </svg>
);
const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.028C18.343 21.128 22 16.991 22 12z"/>
    </svg>
);
const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
  </svg>
);
const WhatsAppIcon = ({ className = '' }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413 0 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.956-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.357 1.849 6.069l-.299 1.098-1.188 4.359 4.493-1.176z"/>
    </svg>
);


export default function TigermindLanding() {
  const whatsappLink = "https://wa.me/573112624924";

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
            <b className="text-white">De cero hábitos a transformar </b><br />
            <span className="text-orange-500">mi vida con el fitness</span>
          </h1>
          
          <div className="max-w-4xl mx-auto mb-8">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <iframe 
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/QkR1_hVlBcQ"
                title="Tigermind Video 1"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto mb-8">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <iframe 
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/kPMeIPux01U"
                title="Tigermind Video 2"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <Link 
            href="#section-1717153620576" 
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
            <div className="order-2 md:order-1">
              <Image
                src="/images/1_index.jpg"
                alt="Nixon"
                width={450}
                height={300}
                className="rounded-lg w-full h-auto"
              />
            </div>
            <div className="order-1 md:order-2">
                <h4 className="text-3xl font-bold mb-4 text-center">2020</h4>
                    <p className="text-xl max-w-4xl mx-auto leading-relaxed text-justify">
                        En 2020, buscaba mejorar mi físico pero no sabía cómo. Entrenaba sin estructura ni metas, solo por inercia, mientras mi vida fuera del gimnasio estaba desordenada: carecía de hábitos saludables, buena alimentación y un enfoque mental claro.
                        <br /><br />
                        Mi entorno tampoco me motivaba. Me sentía solo en mi proceso, viviendo los días sin dirección y en piloto automático. Me levantaba sin energía ni propósito, simplemente cumpliendo con lo mínimo y sin exigirme un cambio real.
                        <br /><br />
                        Aunque creía estar bien, en el fondo me sentía estancado y frustrado por la falta de resultados. Comprendí que el problema no era el ejercicio, sino mi mentalidad, mis hábitos y mi entorno. Estaba desconectado de mis objetivos y de la disciplina para lograrlos.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
                <h4 className="text-3xl font-bold mb-4 text-center">2025</h4>
                  <p className="text-xl max-w-4xl mx-auto leading-relaxed text-justify">
                      Cinco años después, soy una persona transformada, no solo en lo físico, sino en mi mentalidad. La clave fue construir hábitos sólidos, entendiendo que el cambio externo es un reflejo del trabajo interno. Empecé a vivir con propósito, cuidando mi alimentación, mi descanso y, sobre todo, mi mente.
                      <br /><br />
                      Para lograrlo, tuve que tomar decisiones difíciles, como dejar atrás distracciones y alejarme de personas que no me impulsaban a crecer. En ese proceso aprendí a estar conmigo mismo, a conocer mis límites y a exigirme más allá de lo que creía posible, forjando un compromiso inquebrantable.
                      <br /><br />
                      Hoy, esa lucha personal se convirtió en mi misión: guiar a otros que buscan un cambio. Soy la prueba de que no importa cuán perdido te sientas; con disciplina y constancia, cualquiera puede transformar su vida. No tuve ventajas especiales, solo tomé la decisión de cambiar, y si yo pude, tú también puedes.
                  </p>
              </div>
            <div>
                <Image
                src="/images/2_index.png"
                alt="Nixon"
                width={450}
                height={300}
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
                  <br/><br/>
                  Vas a aprender a construir hábitos que te transformen, a rodearte de un entorno que te impulse, y a mantener una disciplina que no depende de la motivación.
                  <br/><br/>
                  Lo que hoy te parece difícil, mañana será parte de tu estilo de vida.
                  <br/><br/>
                  Yo ya lo viví, y ahora te voy a enseñar el camino.
                  <br/><br/>
                  Prepárate para convertirte en tu mejor versión.
                </h2>
            </div>
          </div>
        </div>
      </section>
      
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
                QUIERO UNIRME A TU COMUNIDAD
              </Link>
            </div>
          </div>
        </div>
      </section>

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
      
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Lo que dicen <span className="text-orange-500">nuestros miembros</span>
            </h2>
            <p className="text-lg text-gray-300">Historias reales de transformación y disciplina.</p>
          </div>

          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center mb-8 text-red-600 uppercase">- Jhoan Bautista -</h3>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-6">
              <div className="w-full sm:w-1/2 lg:w-1/3 text-center">
                <h4 className="text-xl font-bold mb-2">ANTES</h4>
                <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                  <Image src="/images/testimonio_1_1.jpeg" alt="Testimonio Jhoan Antes" layout="fill" objectFit="cover" />
                </div>
              </div>
              <div className="w-full sm:w-1/2 lg:w-1/3 text-center">
                <h4 className="text-xl font-bold mb-2">AHORA</h4>
                <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                  <Image src="/images/testimonio_1_2.jpeg" alt="Testimonio Jhoan Ahora" layout="fill" objectFit="cover" />
                </div>
              </div>
            </div>
            <p className="text-lg text-justify italic max-w-3xl mx-auto text-gray-200">
              "Ey bro, ¡cómo pasa el tiempo! Me acuerdo cuando a inicios del 2020 yo te iba a acompañar a hacer ejercicio, y veía la disciplina que usted tenía... Para eso se necesita una disciplina y una constancia que son duras, pero no imposibles."
              <br/><br/>
              "De usted aprendí que el que persevera alcanza... Bro, mire cómo hemos avanzado... vos sos una persona que transmite energía y positivismo. Como dice la frase: <b>NO ESTAMOS DONDE QUEREMOS ESTAR, PERO TAMPOCO ESTAMOS DONDE COMENZAMOS.</b>"
            </p>
          </div>

          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center mb-8 text-red-600 uppercase">- Stiven Calderon -</h3>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-6">
              <div className="w-full sm:w-1/2 lg:w-1/3 text-center">
                <h4 className="text-xl font-bold mb-2">ANTES</h4>
                <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                  <Image src="/images/testimonio_2_1.jpeg" alt="Testimonio Stiven Antes" layout="fill" objectFit="cover" />
                </div>
              </div>
              <div className="w-full sm:w-1/2 lg:w-1/3 text-center">
                <h4 className="text-xl font-bold mb-2">AHORA</h4>
                <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                  <Image src="/images/testimonio_2_2.jpeg" alt="Testimonio Stiven Ahora" layout="fill" objectFit="cover" />
                </div>
              </div>
            </div>
            <p className="text-lg text-justify italic max-w-3xl mx-auto text-gray-200">
              "Hola Nixon, quería darte las gracias por ayudarme a cambiar no solo el físico, sino también la mentalidad y mis hábitos. Todo esto se ha visto reflejado en mi cambio físico..."
              <br/><br/>
              "Gracias a ti, estoy construyendo mi mejor versión y sigo 'dándole' con todo. 🙏💪"
            </p>
          </div>

          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center mb-8 text-red-600 uppercase">- Juaco Marquez -</h3>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-6">
              <div className="w-full sm:w-1/2 lg:w-1/3 text-center">
                <h4 className="text-xl font-bold mb-2">ANTES</h4>
                <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                  <Image src="/images/testimonio_3_1.jpeg" alt="Testimonio Juaco Marquez Antes" layout="fill" objectFit="cover" />
                </div>
              </div>
              <div className="w-full sm:w-1/2 lg:w-1/3 text-center">
                <h4 className="text-xl font-bold mb-2">AHORA</h4>
                <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                  <Image src="/images/testimonio_3_2.jpeg" alt="Testimonio Juaco Marquez Ahora" layout="fill" objectFit="cover" />
                </div>
              </div>
            </div>
            <p className="text-lg text-justify italic max-w-3xl mx-auto text-gray-200">
              "Lo mejor que pude haber hecho fue haber iniciado las mentorías contigo, bro. Me diste la mentalidad para respetar mi cuerpo y convertirlo en algo de valor, como lo es mi mente y todo mi ser."
              <br/><br/>
              "Los resultados hablan por sí solos. Esto ya es un estilo de vida TIGER MIND. 🧠🐅"
            </p>
          </div>

          <div className="mb-0">
            <h3 className="text-3xl font-bold text-center mb-8 text-red-600 uppercase">- Carlos Gómez -</h3>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-6">
              <div className="w-full sm:w-1/2 lg:w-1/3 text-center">
                <h4 className="text-xl font-bold mb-2">ANTES</h4>
                <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                  <Image src="/images/testimonio_4_1.jpeg" alt="Testimonio Carlos Antes" layout="fill" objectFit="cover" />
                </div>
              </div>
              <div className="w-full sm:w-1/2 lg:w-1/3 text-center">
                <h4 className="text-xl font-bold mb-2">AHORA</h4>
                <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                  <Image src="/images/testimonio_4_2.jpeg" alt="Testimonio Carlos Ahora" layout="fill" objectFit="cover" />
                </div>
              </div>
            </div>
            <p className="text-lg text-justify italic max-w-3xl mx-auto text-gray-200">
              "Brooo miraa, los cambios son tremendos, gracias a usted y su modelo Tigermind. Ha sido la mejor inversión. Seguimos en el proceso, la mentalidad cambió. Ahora todo tiene un propósito."
              <br/><br/>
              "¡Cuerpo sano! ¡Vida sana! El templo siempre será nuestro cuerpo, los resultados hablan solos. Muchas gracias! ¡Vamos por MÁS 💪🚀"
            </p>
          </div>

        </div>
      </section>

      <section id="section-1717153620576" className="pb-20 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold">Únete a mis SALAS</h1>
          </div>

          <div className="max-w-md mx-auto bg-gray-900 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-orange-500">COMUNIDAD🚀</h3>
            <h2 className="text-4xl font-bold mb-6">$299 USD / 3 Meses</h2>
            
            <div className="text-left mb-8 space-y-3">
                <p className="text-center font-bold">HAZTE UN GANADOR.</p>
                <p className="text-center font-bold">SÉ ESA PERSONA QUE ADMIRAS Y RESPETAS</p>
                <p>✅ Rutinas Fitness de ALTO VALOR.</p>
                <p>✅ Mentoría en Vivo semanal con NIXON</p>
                <p>✅ Gana la Autoconfianza que necesitas</p>
                <p>✅ Mejora tu Autoconcepto para emprender</p>
                <p>✅ Elimina todos tus miedos</p>
                <p>✅ Elimina tus vicios y malos hábitos</p>
                <p>✅ Elimina el Síndrome del impostor</p>
                <p>✅ Elimina la procrastinación</p>
                <p>✅ Mejora tu Disciplina</p>
                <p>✅ Te guío con mi ejemplo TODOS LOS DÍAS.</p>
                <p>✅ Cambia tu Entorno por uno de ganadores🥇</p>
                <p>✅ Aprende los Hábitos / Mindset para ganar</p>
                <p>✅ Aprende a alimentarte</p>
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
      <footer className="py-12 px-4 bg-gray-900 text-center text-gray-400">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex justify-center items-center gap-6 mt-8">
            <a href="https://www.instagram.com/nixonsil15?igsh=ZmQ2NThwN2Q1dm45&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 transform hover:scale-110">
              <InstagramIcon />
            </a>
            <a href="https://www.tiktok.com/@nixonsil?_t=ZS-90CebTvaAv1&_r=1" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 transform hover:scale-110">
              <TiktokIcon />
            </a>
            <a href="https://www.facebook.com/share/1E4p4Vf1Lh/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 transform hover:scale-110">
              <FacebookIcon />
            </a>
            <a href="https://youtube.com/@nixonsil1501?si=OD0ksRNmVM61cS9z" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 transform hover:scale-110">
              <YoutubeIcon />
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 transform hover:scale-110">
              <WhatsAppIcon />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-8">
            <a href="/pdf/condiciones_del_servicio.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
              Condiciones del Servicio
            </a>
            <a href="/pdf/Politica_de_Cookies.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
              Política de Cookies
            </a>
            <a href="/pdf/Politicas_de_privacidad.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
              Políticas de Privacidad
            </a>
          </div>
          <p className="mt-6 text-sm">© {new Date().getFullYear()} Tigermind - Todos los derechos reservados</p>
        </div>
      </footer>
      
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-orange-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-700 transition-all duration-300"
        aria-label="Contactar por WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8" />
      </a>

    </div>
  )
}