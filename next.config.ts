import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'kotabunny.co.za' }],
        destination: 'https://www.kotabunny.co.za/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
