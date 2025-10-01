/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['videos.openai.com'], // adiciona aqui os domínios externos
  },
};

export default nextConfig;