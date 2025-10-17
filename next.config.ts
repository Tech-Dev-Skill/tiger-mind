import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['@supabase/supabase-js'],
  images: {
    domains: ['zassisqhrdzckhiklublj.supabase.co'],
  },
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    // Deja solo lo necesario
  }
}

export default nextConfig
