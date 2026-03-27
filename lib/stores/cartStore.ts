import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Product } from "@/lib/api/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

function normalizeProductId(id: string | number) {
  return String(id);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const productId = normalizeProductId(product.id);
          const existing = state.items.find((i) => normalizeProductId(i.product.id) === productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                normalizeProductId(i.product.id) === productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId) => {
        const normalizedId = normalizeProductId(productId);
        set((state) => ({
          items: state.items.filter((i) => normalizeProductId(i.product.id) !== normalizedId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        const normalizedId = normalizeProductId(productId);
        if (quantity <= 0) {
          get().removeItem(normalizedId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            normalizeProductId(i.product.id) === normalizedId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + (i.product.price ?? 0) * i.quantity, 0),
    }),
    { name: "bmg-cart" }
  )
);
