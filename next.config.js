/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable server actions and externalize native modules
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    serverComponentsExternalPackages: ['level', 'classic-level', 'node-gyp-build'],
  },
  // Webpack configuration for LevelDB
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize native modules on server side
      config.externals = config.externals || [];
      config.externals.push({
        'level': 'commonjs level',
        'classic-level': 'commonjs classic-level',
        'node-gyp-build': 'commonjs node-gyp-build',
      });
    } else {
      // Don't bundle level/classic-level on client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
