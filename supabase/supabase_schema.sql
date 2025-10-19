-- =============================================
-- TIGER MIND - ESQUEMA DE BASE DE DATOS (VERSIÓN FINAL Y SEGURA)
-- Plataforma de Cursos con Membresía 90 días
-- =============================================

-- 1. TABLAS DE AUTENTICACIÓN Y PERFILES
-- ===================================

-- Tabla de perfiles de usuario (extiende auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT CHECK (role IN ('student', 'admin', 'super_admin')) DEFAULT 'student',
    phone TEXT,
    country TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 2. TABLAS DE CURSOS Y CONTENIDO
-- ================================

-- Categorías de cursos
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    order_index INTEGER DEFAULT 0
);

-- Cursos principales
CREATE TABLE public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    duration_hours INTEGER DEFAULT 0,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    thumbnail_url TEXT,
    trailer_url TEXT,
    category_id UUID REFERENCES public.categories(id),
    instructor_id UUID REFERENCES public.profiles(id),
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    total_students INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Módulos dentro de cada curso
CREATE TABLE public.course_modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    is_free_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Videos/lecciones dentro de cada módulo
CREATE TABLE public.videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    order_index INTEGER NOT NULL,
    is_free_preview BOOLEAN DEFAULT false,
    resources JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLAS DE SUSCRIPCIÓN Y PAGOS
-- =================================

-- Planes de suscripción (90 días)
CREATE TABLE public.subscription_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    duration_days INTEGER NOT NULL DEFAULT 90,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Suscripciones activas de usuarios
CREATE TABLE public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    plan_id UUID REFERENCES public.subscription_plans(id),
    status TEXT CHECK (status IN ('active', 'cancelled', 'expired', 'pending')) DEFAULT 'pending',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    payment_id TEXT,
    payment_method TEXT,
    auto_renew BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLAS DE PROGRESO Y CERTIFICADOS
-- ====================================

-- Progreso de estudiantes por curso
CREATE TABLE public.course_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completed_videos UUID[] DEFAULT '{}',
    last_watched_video UUID REFERENCES public.videos(id),
    last_watched_position INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, course_id)
);

-- Certificados emitidos
CREATE TABLE public.certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    certificate_number TEXT UNIQUE NOT NULL,
    issue_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE,
    is_valid BOOLEAN DEFAULT true,
    verification_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLAS DE REVIEWS Y COMUNIDAD
-- =================================

-- Reviews de cursos
CREATE TABLE public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, course_id)
);

-- Comentarios en videos
CREATE TABLE public.video_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.video_comments(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLAS DE NOTIFICACIONES Y CONFIGURACIÓN
-- ===========================================

-- Notificaciones
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configuración de usuario
CREATE TABLE public.user_settings (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    language TEXT DEFAULT 'es',
    timezone TEXT DEFAULT 'UTC',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- ÍNDICES Y OPTIMIZACIONES
-- =============================================

CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_courses_category ON public.courses(category_id);
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_courses_published ON public.courses(is_published);
CREATE INDEX idx_videos_course ON public.videos(course_id);
CREATE INDEX idx_videos_module ON public.videos(module_id);
CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_course_progress_user ON public.course_progress(user_id);
CREATE INDEX idx_course_progress_course ON public.course_progress(course_id);
CREATE INDEX idx_reviews_course ON public.reviews(course_id);
CREATE INDEX idx_reviews_user ON public.reviews(user_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(is_read);

-- =============================================
-- FUNCIONES Y TRIGGERS
-- =============================================

-- Función de ayuda para chequear si el usuario actual es admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función de ayuda para verificar si un usuario tiene suscripción activa
CREATE OR REPLACE FUNCTION public.user_has_active_subscription(user_id_to_check uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE user_id = user_id_to_check
      AND status = 'active'
      AND end_date > now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para crear perfil cuando se registra usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'student');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- DATOS INICIALES
-- =============================================

-- Plan de suscripción por defecto (90 días)
INSERT INTO public.subscription_plans (name, description, price, duration_days, features) VALUES
('Membresía Tiger Mind', 'Acceso completo a todos los cursos premium por 90 días', 100.00, 90, '["Acceso ilimitado a todos los cursos", "Certificados digitales", "Comunidad exclusiva", "Soporte prioritario", "Actualizaciones constantes"]');

-- Categorías iniciales
INSERT INTO public.categories (name, slug, description) VALUES
('Desarrollo Personal', 'desarrollo-personal', 'Cursos para transformar tu mindset y alcanzar el éxito'),
('Marketing Digital', 'marketing-digital', 'Aprende a monetizar tu conocimiento y escalar tu negocio'),
('Mindset Millonario', 'mindset-millonario', 'Transforma tu mentalidad para alcanzar la libertad financiera'),
('Productividad', 'productividad', 'Maximiza tu tiempo y alcanza tus metas más rápido');

-- =============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- =============================================

-- Perfiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Los usuarios pueden ver y actualizar su propio perfil" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Admins pueden ver todos los perfiles" ON public.profiles FOR SELECT USING (public.is_admin());

-- Cursos
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cursos publicados son visibles para todos" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Admins pueden gestionar todos los cursos" ON public.courses FOR ALL USING (public.is_admin());

-- Módulos de Cursos
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins pueden gestionar módulos" ON public.course_modules FOR ALL USING (public.is_admin());
CREATE POLICY "Usuarios con suscripción activa pueden ver módulos" ON public.course_modules FOR SELECT USING (public.user_has_active_subscription(auth.uid()));

-- Videos
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins pueden gestionar videos" ON public.videos FOR ALL USING (public.is_admin());
CREATE POLICY "Usuarios con suscripción pueden ver videos" ON public.videos FOR SELECT USING (public.user_has_active_subscription(auth.uid()) OR is_free_preview = true);

-- *** INICIO DE LA ACTUALIZACIÓN CLAVE ***
-- Suscripciones
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
-- Se eliminan las políticas antiguas para evitar conflictos
DROP POLICY IF EXISTS "Usuarios pueden ver sus propias suscripciones" ON public.subscriptions;
DROP POLICY IF EXISTS "Admins pueden ver todas las suscripciones" ON public.subscriptions;
-- La nueva política para usuarios normales: solo pueden LEER su propia suscripción.
CREATE POLICY "Los usuarios solo pueden ver su propia suscripción" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
-- La nueva política para administradores: tienen CONTROL TOTAL (leer, crear, actualizar, borrar) sobre TODAS las suscripciones.
CREATE POLICY "Los administradores tienen control total sobre las suscripciones" ON public.subscriptions FOR ALL USING (public.is_admin());
-- *** FIN DE LA ACTUALIZACIÓN CLAVE ***

-- Progreso
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios pueden gestionar su propio progreso" ON public.course_progress FOR ALL USING (auth.uid() = user_id);

-- Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews aprobadas son visibles para todos" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Usuarios pueden crear y gestionar sus propias reviews" ON public.reviews FOR ALL USING (auth.uid = user_id);

-- Comentarios en videos
ALTER TABLE public.video_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comentarios aprobados son visibles para todos" ON public.video_comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Usuarios pueden crear y gestionar sus propios comentarios" ON public.video_comments FOR ALL USING (auth.uid = user_id);

-- Notificaciones
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios pueden gestionar sus propias notificaciones" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- Certificados
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios pueden ver sus propios certificados" ON public.certificates FOR SELECT USING (auth.uid() = user_id);

-- Ajustes de Usuario
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios pueden gestionar sus propios ajustes" ON public.user_settings FOR ALL USING (auth.uid() = user_id);