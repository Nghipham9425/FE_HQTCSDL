const DEFAULT_PRODUCT_IMAGE = "/product-placeholder.svg"

const ALLOWED_REMOTE_IMAGE_HOSTS = new Set([
  "picsum.photos",
  "placehold.co",
  "www.pngkey.com",
  "i.pinimg.com",
  "forumstatic.oneplusmobile.com",
  "cdn.shopify.com",
  "www.nintendo.com",
  "en.onepiece-cardgame.com",
  "jawbreakers.cards",
  "cdn.hstatic.net",
  "images.pokemontcg.io",
  "images.scrydex.com",
  "s.pacn.ws",
  "product.hstatic.net",
  "shoptaycam.com",
])

export function resolveProductImage(
  source?: string | null,
  fallback = DEFAULT_PRODUCT_IMAGE,
) {
  const value = source?.trim()
  if (!value) return fallback

  if (value.startsWith("/") && !value.startsWith("//")) {
    return value
  }

  try {
    const url = new URL(value)
    if (
      url.protocol === "https:" &&
      ALLOWED_REMOTE_IMAGE_HOSTS.has(url.hostname.toLowerCase())
    ) {
      return value
    }
  } catch {
    // Invalid URLs use the local placeholder below.
  }

  return fallback
}

export { DEFAULT_PRODUCT_IMAGE }
