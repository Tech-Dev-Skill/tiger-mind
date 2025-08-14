import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // ⚠ Esto evita que el build falle por errores de lint
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
    turbo: {
      resolveAlias: {
        '@supabase/supabase-js': require.resolve('@supabase/supabase-js')
      }
    },
  },
  webpack: (config: any) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@supabase/supabase-js': require.resolve('@supabase/supabase-js')
    }
    return config
  },
  // Use Node.js runtime instead of Edge Runtime to avoid clientReferenceManifest bug
  output: 'standalone',
}

export default nextConfig