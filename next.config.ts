import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';

const CLERK_FAPI = 'https://brave-panda-48.clerk.accounts.dev'; // TODO: replace with your real Clerk FAPI hostname (Clerk Dashboard → Configure → Domains)

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''}  ${CLERK_FAPI} https://challenges.cloudflare.com;
  connect-src 'self' ${CLERK_FAPI};
  img-src 'self' https://img.clerk.com https://i.ytimg.com data:;
  worker-src 'self';
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
