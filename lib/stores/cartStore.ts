import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type Product } from "@/lib/api/products"

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string | number) => void
  updateQuantity: (productId: string | number, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

function normalizeProductId(id: string | number) {
  return String(id)
}

function normalizeRequestedQuantity(quantity: number) {
  return Math.max(1, Math.floor(quantity || 1))
}

function resolveMaxStock(product: Product) {
  return Math.max(0, Math.floor(product.stock || 0))
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          if (!product.isActive) return state

          const requestedQuantity = normalizeRequestedQuantity(quantity)
          const maxStock = resolveMaxStock(product)
          if (maxStock <= 0) return state

          const productId = normalizeProductId(product.id)
          const existing = state.items.find(
            (i) => normalizeProductId(i.product.id) === productId,
          )

          if (existing) {
            const nextQuantity = Math.min(
              maxStock,
              existing.quantity + requestedQuantity,
            )

            if (nextQuantity === existing.quantity) return state

            return {
              items: state.items.map((i) =>
                normalizeProductId(i.product.id) === productId
                  ? { ...i, product, quantity: nextQuantity }
                  : i,
              ),
            }
          }

          return {
            items: [
              ...state.items,
              { product, quantity: Math.min(maxStock, requestedQuantity) },
            ],
          }
        })
      },

      removeItem: (productId) => {
        const normalizedId = normalizeProductId(productId)
        set((state) => ({
          items: state.items.filter(
            (i) => normalizeProductId(i.product.id) !== normalizedId,
          ),
        }))
      },

      updateQuantity: (productId, quantity) => {
        const normalizedId = normalizeProductId(productId)
        if (quantity <= 0) {
          get().removeItem(normalizedId)
          return
        }

        set((state) => ({
          items: state.items.map((i) => {
            if (normalizeProductId(i.product.id) !== normalizedId) return i

            const maxStock = resolveMaxStock(i.product)
            const requestedQuantity = normalizeRequestedQuantity(quantity)
            const nextQuantity = Math.min(maxStock, requestedQuantity)

            if (nextQuantity <= 0) return i

            return { ...i, quantity: nextQuantity }
          }),
        }))
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, i) => sum + (i.product.price ?? 0) * i.quantity,
          0,
        ),
    }),
    { name: "bmg-cart" },
  ),
)
