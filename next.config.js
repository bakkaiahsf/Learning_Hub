/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration for stability
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: [],
    unoptimized: true, // For better compatibility across platforms
  },
  
  // Network and development settings
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
  
  // Webpack configuration for Windows compatibility
  webpack: (config, { dev, isServer }) => {
    // Fix for Windows file watching
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      }
    }
    
    // Fix potential module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    
    return config
  },
}

module.exports = nextConfig