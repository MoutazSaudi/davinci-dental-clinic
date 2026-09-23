import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'davincidental.ae',
      },
      {
        protocol: 'https',
        hostname: 'davincidental.bg',
      },
    ],
  },
};

export default nextConfig;
