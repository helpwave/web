/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@helpwave/common']
}

module.exports = nextConfig
