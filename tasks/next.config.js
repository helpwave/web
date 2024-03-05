/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@helpwave/common'],
  output: 'standalone',
  images: {
    dangerouslyAllowSVG: true,
    domains: ['helpwave.de', 'source.boringavatars.com'],
  },
}

module.exports = nextConfig
