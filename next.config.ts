/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ⚠ Esto evita que el build falle por errores de lint
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;