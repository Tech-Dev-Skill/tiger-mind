import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['@supabase/supabase-js'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zassisqhrdzckhiklublj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
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
      },
    ],
  },

  outputFileTracingRoot: path.join(__dirname),

  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],

    // 👇 Aumenta el límite de tamaño del cuerpo para Server Actions
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },

  async headers() {
    return [
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
