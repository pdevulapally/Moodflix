/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during builds
  },
  images: {
    unoptimized: true, // Disable image optimization for Netlify
  },
  experimental: {
    webpackBuildWorker: true, // Enable Webpack build worker for improved performance
    parallelServerBuildTraces: true, // Enable parallel traces for server builds
    parallelServerCompiles: true, // Enable parallel server compiles
  },
  output: "standalone", // Required for Netlify's serverless functions
};

export default nextConfig;
