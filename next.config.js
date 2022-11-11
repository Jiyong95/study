/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  experimental: {appDir: true},
  reactStrictMode: false, //Next.js v13 설정해야함.
}

module.exports = nextConfig
