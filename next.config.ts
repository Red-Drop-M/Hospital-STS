import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.1.235:5000/:path*'
      }
    ];
  }
};

export default nextConfig;
