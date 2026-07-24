/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["@react-three/fiber", "@react-three/drei", "gsap", "framer-motion"],
  },
  // Image optimization
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Compression and bundling
  compress: true,
  // Production source maps disabled for smaller bundle
  productionBrowserSourceMaps: false,
  // Trailing slash consistency
  trailingSlash: false,
};

export default nextConfig;
