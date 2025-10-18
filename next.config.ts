import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['@supabase/supabase-js'],
  images: {
    domains: ['zassisqhrdzckhiklublj.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.youtube.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    // Configuraciones para mejorar el manejo de archivos grandes
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  // Configurar límites para uploads
  api: {
    bodyParser: {
      sizeLimit: '500mb', // Aumentar límite de tamaño
    },
    responseLimit: false,
  },
}

export default nextConfig
