-- =============================================
-- FIX: POLÍTICAS DE SEGURIDAD CORREGIDAS (RLS)
-- =============================================

-- Perfiles - Políticas ultra-simplificadas sin recursion
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Perfiles visibles publicamente" ON public.profiles;
DROP POLICY IF EXISTS "Usuarios actualizan su perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuarios crean su perfil" ON public.profiles;

-- Políticas simples sin subconsultas
CREATE POLICY "select_profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "update_own_profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "insert_own_profile" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());

-- Cursos - Acceso público a cursos publicados
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cursos visibles para usuarios activos" ON public.courses;
DROP POLICY IF EXISTS "Admins pueden gestionar cursos" ON public.courses;
DROP POLICY IF EXISTS "Cursos publicados visibles" ON public.courses;
DROP POLICY IF EXISTS "Admins gestionan cursos" ON public.courses;

CREATE POLICY "select_courses" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_courses" ON public.courses FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

-- Suscripciones - Acceso propio
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios pueden ver sus propias suscripciones" ON public.subscriptions;
DROP POLICY IF EXISTS "Admins pueden ver todas las suscripciones" ON public.subscriptions;
DROP POLICY IF EXISTS "Suscripciones propias" ON public.subscriptions;
DROP POLICY IF EXISTS "Suscripciones propias insert" ON public.subscriptions;
DROP POLICY IF EXISTS "Suscripciones propias update" ON public.subscriptions;

CREATE POLICY "select_subscriptions" ON public.subscriptions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "insert_subscriptions" ON public.subscriptions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_subscriptions" ON public.subscriptions FOR UPDATE USING (user_id = auth.uid());

-- Progreso - Acceso propio
ALTER TABLE public.course_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios pueden ver su propio progreso" ON public.course_progress;
DROP POLICY IF EXISTS "Progreso propio" ON public.course_progress;

CREATE POLICY "select_progress" ON public.course_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "insert_progress" ON public.course_progress FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_progress" ON public.course_progress FOR UPDATE USING (user_id = auth.uid());

-- Reviews - Acceso público y propio
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reviews visibles públicamente" ON public.reviews;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propias reviews" ON public.reviews;
DROP POLICY IF EXISTS "Reviews publicas aprobadas" ON public.reviews;
DROP POLICY IF EXISTS "Reviews propias" ON public.reviews;

CREATE POLICY "select_reviews" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "insert_reviews" ON public.reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_reviews" ON public.reviews FOR UPDATE USING (user_id = auth.uid());

-- Notificaciones - Acceso propio
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios pueden ver sus propias notificaciones" ON public.notifications;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus notificaciones" ON public.notifications;
DROP POLICY IF EXISTS "Notificaciones propias" ON public.notifications;
DROP POLICY IF EXISTS "Notificaciones propias update" ON public.notifications;

CREATE POLICY "select_notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "update_notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- =============================================
-- TRIGGER PARA CREACIÓN AUTOMÁTICA DE PERFIL
-- =============================================

-- Crear función para nuevo usuario (versión optimizada)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar si ya existe el perfil para evitar duplicados
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
      'student'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();