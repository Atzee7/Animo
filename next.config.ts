import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.anilist.co" },
      { protocol: "https", hostname: "**.animeparadise.moe" },
      { protocol: "https", hostname: "media.kitsu.app" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "cdn.myanimelist.net" },
    ],
  },
};

export default nextConfig;
