import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';

const CLERK_FAPI = isDev
  ? 'https://brave-panda-48.clerk.accounts.dev'
  : 'https://clerk.mikejamesrust.com';

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''}  ${CLERK_FAPI} https://challenges.cloudflare.com;
  connect-src 'self' ${CLERK_FAPI};
  img-src 'self' https://img.clerk.com https://i.ytimg.com https://www.youtube.com/iframe_api' data:;
  worker-src 'self' blob:;
  style-src 'self' 'unsafe-inline';
  frame-src 'self' https://challenges.cloudflare.com;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
