/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  transpilePackages: ['@helpwave/hightide'],
  output: 'standalone',
  images: {
    dangerouslyAllowSVG: true,
    domains: ['cdn.helpwave.de', 'helpwave.de'],
  },
}

export default nextConfig
