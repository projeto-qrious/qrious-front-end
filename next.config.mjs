/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Define o padrão para o domínio do placeholder
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**", // Permite qualquer caminho
      },
    ],
  },
};

export default nextConfig;
