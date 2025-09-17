# Tiger Mind 🐯

Una plataforma de cursos online premium diseñada para personas con ambición feroz. Desarrolla tu mentalidad de tigre y domina las habilidades más demandadas del mercado.

## Stack Tecnológico

- **Next.js 15** con App Router
- **TypeScript** para desarrollo seguro
- **Tailwind CSS** con diseño tiger-themed
- **Supabase** para autenticación y base de datos
- **Lucide React** para iconos modernos

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.local.example .env.local
   ```

4. Completa las variables en `.env.local` con tus credenciales de Supabase.

## Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Copia el URL del proyecto y la clave anónima
3. Agrega estas credenciales a tu archivo `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
   ```

## Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/          # Rutas de autenticación
│   │   └── login/
│   ├── (dashboard)/     # Dashboard de estudiantes
│   │   └── dashboard/
│   ├── (admin)/         # Panel de administración
│   │   └── admin/
│   ├── globals.css      # Estilos globales
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Landing page
├── components/
│   ├── layout/          # Componentes de layout
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── pricing.tsx
│   │   ├── footer.tsx
│   │   └── header.tsx
│   └── ui/             # Componentes UI reutilizables
└── lib/
    ├── supabase.ts      # Cliente Supabase
    ├── utils.ts         # Funciones utilitarias
    └── middleware.ts    # Middleware de autenticación
```

## Diseño y Temas

El diseño está inspirado en la mentalidad del tigre:
- **Colores principales**: Naranja tigre (#f17407), dorado (#f59e0b), negro
- **Tipografía**: Inter para texto, Oswald para títulos
- **Animaciones**: Transiciones suaves y efectos hover inspirados en el movimiento felino

## Rutas Disponibles

- `/` - Landing page
- `/login` - Inicio de sesión
- `/dashboard` - Dashboard de estudiante (protegido)
- `/admin` - Panel de administración (protegido)

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Producción

Para construir para producción:

```bash
npm run build
npm start
```

## Exportar sitio estático

Para generar el sitio como archivos estáticos listos para desplegar (por ejemplo, en Vercel o cualquier hosting estático):

```bash
npm run export
```

Esto crea una carpeta `out/` con todos los archivos estáticos generados por Next.js. Puedes desplegar el contenido de la carpeta `out/` en cualquier servicio de hosting estático.

## Licencia

Este proyecto está bajo la licencia MIT.
