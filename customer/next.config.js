/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  transpilePackages: ['@helpwave/hightide'],
  output: 'export',
  images: {
    dangerouslyAllowSVG: true,
    domains: ['cdn.helpwave.de', 'customer.helpwave.de', 'helpwave.de'],
    unoptimized: true,
  },
}

export default nextConfig
