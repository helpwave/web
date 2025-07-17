/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  transpilePackages: ['@helpwave/api-services'],
  output: 'standalone',
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      new URL('https://cdn.helpwave.de/**'),
      new URL('https://helpwave.de/**'),
      new URL('https://source.boringavatars.com/**'),
    ],
  },
}

export default nextConfig
