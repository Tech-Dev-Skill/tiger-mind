-- Tabla para clases en vivo
CREATE TABLE IF NOT EXISTS live_classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  zoom_url TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;

-- Admins pueden hacer todo
CREATE POLICY "Admins can do everything on live_classes"
  ON live_classes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Estudiantes pueden ver clases futuras
CREATE POLICY "Students can view upcoming live_classes"
  ON live_classes
  FOR SELECT
  TO authenticated
  USING (start_date >= NOW());
