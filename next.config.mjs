/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['placeholder.svg', 'api.qrserver.com', 'viacep.com.br'],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig
