import { create } from "zustand"
import { type Product } from "@/lib/api/products"
import { addWishlistItem, getWishlistItems, removeWishlistItem } from "@/lib/api/wishlist"

interface WishlistState {
  items: Product[]
  hydrated: boolean
  hydrate: () => Promise<void>
  toggleItem: (product: Product) => Promise<void>
  removeItem: (productId: string | number) => void
  clearWishlist: () => void
}

function normalizeProductId(id: string | number) {
  return String(id)
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  items: [],
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return

    // Mark hydrated early to prevent multiple parallel fetches from many mounted cards.
    set({ hydrated: true })

    try {
      const items = await getWishlistItems()
      set({ items })
    } catch {
      set({ items: [] })
    }
  },

  toggleItem: async (product) => {
    const productId = normalizeProductId(product.id)
    const exists = get().items.some(
      (item) => normalizeProductId(item.id) === productId,
    )

    if (exists) {
      await removeWishlistItem(Number(product.id))
      set((state) => ({
        items: state.items.filter(
          (item) => normalizeProductId(item.id) !== productId,
        ),
      }))
      return
    }

    await addWishlistItem(Number(product.id))
    set((state) => ({ items: [product, ...state.items] }))
  },

  removeItem: (productId) => {
    const normalizedId = normalizeProductId(productId)

    set((state) => ({
      items: state.items.filter(
        (item) => normalizeProductId(item.id) !== normalizedId,
      ),
    }))
  },

  clearWishlist: () => set({ items: [] }),
}))
