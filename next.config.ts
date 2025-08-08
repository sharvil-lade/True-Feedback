import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint warnings during Vercel builds
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Skip TypeScript errors during build
  },
};

export default nextConfig;
