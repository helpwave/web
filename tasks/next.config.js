/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@helpwave/common'],
  output: 'standalone',
  images: {
    dangerouslyAllowSVG: true,
    domains: ['cdn.helpwave.de', 'helpwave.de'],
  },
}

module.exports = nextConfig
