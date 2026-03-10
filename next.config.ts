import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "www.pngkey.com" },
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "forumstatic.oneplusmobile.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "en.onepiece-cardgame.com" },
      { protocol: "https", hostname: "jawbreakers.cards" },
    ],
  },
};

export default nextConfig;
