import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Izinkan aset dev (/_next/*) diakses lewat tunnel ngrok, mis. dari HP.
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
    "*.ngrok.app",
  ],
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
