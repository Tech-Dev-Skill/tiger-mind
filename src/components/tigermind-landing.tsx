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
            <b className="text-white">De cero hábitos a transformar </b><br />
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
                src="/images/1_index.JPG"
                alt="Nixon"
                width={450}
                height={300}
                className="rounded-lg w-full h-auto"
              />
            </div>
            <div className="order-1 md:order-2">
                <h4 className="text-3xl font-bold mb-4 text-center">2020</h4>
                <p className="mb-4 text-justify">
                  En el 2020 era una persona completamente diferente. Tenía el deseo de mejorar físicamente, pero no sabía realmente cómo hacerlo. Entrenaba, sí, pero sin una estructura, sin una meta clara, simplemente porque era lo que “había que hacer” o porque me hacía sentir bien por momentos. Sin embargo, por más que me moviera dentro del gimnasio, mi vida fuera de él estaba completamente desordenada. No tenía hábitos saludables, no llevaba una buena alimentación, y mucho menos un enfoque mental que acompañara ese supuesto objetivo de mejorar.
                  <br /><br />
                  Mi entorno tampoco ayudaba. Estaba rodeado de personas que no compartían una visión de crecimiento ni de superación. Las conversaciones giraban siempre en lo mismo, no había ambición, no había motivación, y mucho menos intención de cambiar. Me encontraba rodeado, pero al mismo tiempo solo en mi proceso. Mis días pasaban sin dirección, vivía sin propósito, sin cuestionarme si estaba realmente construyendo algo para mi futuro. Me levantaba sin energía, sin ganas reales, y sin tener idea de hacia dónde quería ir. Vivía en piloto automático, cumpliendo con lo mínimo, sin exigirme más de lo necesario.
                  <br /><br />
                  Lo más difícil de ese momento era que creía estar bien. Pensaba que con entrenar un par de días ya estaba haciendo lo correcto. Pero la verdad es que me sentía estancado, frustrado, y en el fondo sabía que algo no estaba bien. El cambio físico que tanto buscaba no llegaba, y no entendía por qué. Hoy, mirando hacia atrás, entiendo que no era un tema de ejercicios, sino de mentalidad, de hábitos y de entorno. Estaba completamente desconectado de mí mismo, de mis objetivos y de cualquier tipo de disciplina.
                </p>
              </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
                <h4 className="text-3xl font-bold mb-4 text-center">2025</h4>
                <p className="mb-4 text-justify">
                  Cinco años después, puedo decir con firmeza que soy otra persona. No solo cambié físicamente, sino que transformé mi forma de pensar, de vivir, y de relacionarme conmigo mismo y con el mundo. La base de todo fue construir hábitos sólidos. Entendí que el cambio físico es solo una consecuencia de lo que uno trabaja internamente día a día. Empecé a levantarme con un propósito, a planificar mis días, a cuidar mi alimentación, mi descanso, y sobre todo, mi mente.
                  <br /><br />
                  Dejé atrás los vicios, las distracciones, y me alejé de las personas que no me impulsaban a crecer. Fue un proceso duro, porque muchas veces eso implicó tomar decisiones incómodas, pero necesarias. Aprendí a estar solo, a convivir conmigo mismo, a conocer mis límites y a exigirme más allá de lo que alguna vez creí posible. Ese compromiso conmigo mismo se volvió inquebrantable, y fue ahí donde empecé a ver resultados reales, tanto físicos como mentales.
                  <br /><br />
                  Hoy vivo con una intención clara. Sé quién soy, qué quiero, y hacia dónde voy. Cada día es una nueva oportunidad para superarme, para aprender, y para seguir ayudando a otros a hacer lo mismo. Porque lo que antes era una lucha personal, hoy se transformó en una misión: acompañar a otras personas que, como yo en su momento, están buscando un cambio y no saben por dónde empezar.
                  <br /><br />
                  Soy prueba de que sí se puede. Que no importa cuán perdido te sientas hoy, ni cuántos errores hayas cometido antes. Con disciplina, constancia y un entorno adecuado, cualquier persona puede transformar su vida. Yo no nací con una genética especial, ni con recursos extraordinarios. Solo tomé la decisión de cambiar y no parar hasta lograrlo. Y si yo lo logré, vos también podés hacerlo.
                </p>
              </div>
            <div>
                <Image
                src="/images/2_index.PNG"
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
      
      {/* FAQ Section */}
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

      {/* FAQ Section 2 */}
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
      
      {/* =============================================================== */}
      {/* =================== Testimonials Section (Updated) ============ */}
      {/* =============================================================== */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Lo que dicen <span className="text-orange-500">nuestros miembros</span>
            </h2>
            <p className="text-lg text-gray-300">Historias reales de transformación y disciplina.</p>
          </div>

          {/* Individual Testimonial Blocks */}

          {/* ===== TESTIMONIAL 1 (JHOAN) ===== */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center mb-8 text-red-600 uppercase">- Jhoan -</h3>
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

          {/* ===== TESTIMONIAL 2 (STIVEN) ===== */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center mb-8 text-red-600 uppercase">- Stiven -</h3>
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

          {/* ===== TESTIMONIAL 3 (JUACO MARQUEZ) ===== */}
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

          {/* ===== TESTIMONIAL 4 (CARLOS) ===== */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center mb-8 text-red-600 uppercase">- Carlos -</h3>
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

      {/* Pricing Section */}
      <section id="section-1717153620576" className="py-20 px-4 bg-black text-white">
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
      <footer className="py-8 px-4 bg-gray-900 text-center text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
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
        <p className="mt-6 text-sm">© 2025 Tigermind - Todos los derechos reservados</p>
      </footer>
    </div>
  )
}