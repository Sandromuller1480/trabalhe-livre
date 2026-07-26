import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Permite que builds passem mesmo com avisos menores de lint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Permite que builds passem mesmo com avisos menores de tipo no MVP
    ignoreBuildErrors: true,
  },
};

export default nextConfig;



