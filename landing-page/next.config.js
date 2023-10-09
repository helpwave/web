/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@helpwave/common'],
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['cdn.helpwave.de']
  }
}

module.exports = nextConfig
