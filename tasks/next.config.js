/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@helpwave/common'],
  output: 'standalone',
  experimental: {
    runtime: 'edge',
  }
}

module.exports = nextConfig
