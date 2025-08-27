import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['@supabase/supabase-js'],
  images: {
    domains: ['zassisqhrdzckhiklublj.supabase.co'],
  },
  // Remueve temporalmente 'standalone' para ver si eso resuelve el problema
  // output: 'standalone',
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@supabase/supabase-js': require.resolve('@supabase/supabase-js')
    }
    return config
  },
}

export default nextConfig