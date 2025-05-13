/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  transpilePackages: ['@helpwave/hightide'],
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['cdn.helpwave.de']
  }
}

export default nextConfig
