/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ⚠ Esto evita que el build falle por errores de lint
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  webpack: (config: any) => {

    config.resolve.alias = {
      ...config.resolve.alias,
      '@supabase/supabase-js': require.resolve('@supabase/supabase-js')
    }
    return config
  }
};

module.exports = nextConfig;