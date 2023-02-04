/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    transpilePackages: ['@helpwave/common'],
  }
}

module.exports = nextConfig
