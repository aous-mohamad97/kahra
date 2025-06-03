/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
let appUrlHostname = 'kahragen.aldrtech.com';
let appUrlPort = ''; // Default for local http://localhost:8000
let appUrlProtocol = 'https';

if (process.env.NEXT_PUBLIC_APP_URL) {
  try {
    const parsedUrl = new URL(process.env.NEXT_PUBLIC_APP_URL);
    appUrlProtocol = parsedUrl.protocol.replace(':', '');
    appUrlHostname = parsedUrl.hostname;
    appUrlPort = parsedUrl.port || ''; // Port might be empty for standard http/https ports
  } catch (error) {
    console.error("Invalid NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL, error);
    // Stick to defaults or handle error appropriately
  }
}

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['kahragen.aldrtech.com', 'images.pexels.com', 'http://localhost:8000'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'http', // or 'https' for production
        hostname: 'localhost', // For local backend
        port: '8000',         // If your backend runs on a port
        pathname: '/storage/**', // Or more specific paths if needed
      },
      {
        protocol: appUrlProtocol,
        hostname: appUrlHostname,
        port: appUrlPort,
        pathname: '/storage/**',
      },
      // Add other domains if you source images from elsewhere
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    scrollRestoration: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: false,
};

module.exports = withBundleAnalyzer(nextConfig);