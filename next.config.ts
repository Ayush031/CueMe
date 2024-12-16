import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output:'export',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com"
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ]
  }
};

export default nextConfig;
