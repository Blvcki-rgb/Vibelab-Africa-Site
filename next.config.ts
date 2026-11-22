import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Images téléversées depuis l'admin (Vercel Blob)
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  cacheComponents: true,
  experimental: {
    // Téléversement d'images depuis l'admin (limite Vercel : 4,5 Mo par requête)
    serverActions: { bodySizeLimit: "4mb" },
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
