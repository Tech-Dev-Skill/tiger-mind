import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Mantén tu configuración existente
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // CORRECCIÓN: Reemplaza experimental.serverComponentsExternalPackages
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // CORRECCIÓN: Configuración correcta para turbopack
  turbopack: {
    // Habilita turbopack para desarrollo
    dev: true,
    // Opciones adicionales si las necesitas
    rules: {
      // Reglas personalizadas si las necesitas
    }
  },
  
  // Configuración para imágenes de Supabase
  images: {
    domains: ['zassisqhrdzckhikublj.supabase.co'],
  },
  
  // Mantén esta configuración
  output: 'standalone',
  
  // Configuración de webpack
  webpack: (config) => {
    // Tu configuración existente de alias
    config.resolve.alias = {
      ...config.resolve.alias,
      '@supabase/supabase-js': require.resolve('@supabase/supabase-js')
    }
    return config
  },
}

export default nextConfig