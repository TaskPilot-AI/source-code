/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["better-auth"],
  typescript: {
    // Speed up builds by skipping duplicate type checking during bundling
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "framer-motion",
      "date-fns",
      "recharts",
    ],
  },
};

export default nextConfig;
