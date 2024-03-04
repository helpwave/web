/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@helpwave/common'],
  output: 'standalone',
  images: {
    domains: ['helpwave.de'],
  },
}

module.exports = nextConfig
