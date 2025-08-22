import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Mantén tu configuración existente
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // CORRECCIÓN: Reemplaza experimental.serverComponentsExternalPackages
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // CORRECCIÓN: Reemplaza experimental.turbo con turbopack
  turbopack: true,
  
  // Configuración para imágenes de Supabase
  images: {
    domains: ['zassisqhrdzckhikublj.supabase.co'],
  },
  
  // Mantén esta configuración
  output: 'standalone',
  
  // Configuración adicional para evitar problemas con clientReferenceManifest
  // Esto ayuda a prevenir el error durante la generación de páginas estáticas
  generateBuildId: async () => {
    return 'tiger-mind-build'
  },
  
  // Configuración de webpack optimizada
  webpack: (config) => {
    // Tu configuración existente de alias
    config.resolve.alias = {
      ...config.resolve.alias,
      '@supabase/supabase-js': require.resolve('@supabase/supabase-js')
    }
    
    // Optimización adicional para el build
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
          },
        },
      },
    }
    
    return config
  },
}

export default nextConfig