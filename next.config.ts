import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'in-maa-1.linodeobjects.com',
        port: '',
        pathname: '/dev.objectstore.mybeworld.com/pixel/**',
      },
    ],
    unoptimized: true, // Disable image optimization to avoid timeouts with large files
  },
};

export default nextConfig;
