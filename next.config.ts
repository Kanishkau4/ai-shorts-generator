import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@remotion/renderer", "@remotion/bundler"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yfipbiftjskfrterovpc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
