/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Security headers
  headers: [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
  ],

  // Environment variables
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },

  // Output configuration for deployment
  output: 'standalone',

  // Images configuration
  images: {
    domains: ['example.com'], // Add your image domains here
    unoptimized: true, // Disable image optimization for Next.js 14+
  },

  // Transpile crypto-js for compatibility
  transpilePackages: ['crypto-js'],
};

module.exports = nextConfig;
