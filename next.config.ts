import type { NextConfig } from "next"

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
      { protocol: "https", hostname: "cdn.hstatic.net" },
      { protocol: "https", hostname: "images.pokemontcg.io" },
      { protocol: "https", hostname: "images.scrydex.com" },
      { protocol: "https", hostname: "s.pacn.ws" },
      { protocol: "https", hostname: "product.hstatic.net" },
      { protocol: "https", hostname: "shoptaycam.com" },
    ],
  },
}

export default nextConfig
