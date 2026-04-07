"use client"

import ProductCard from "@/components/ui/ProductCard"
import { useWishlistStore } from "@/lib/stores/wishlistStore"
import { useEffect } from "react"

export default function WishlistPreview() {
  const items = useWishlistStore((s) => s.items)
  const hydrateWishlist = useWishlistStore((s) => s.hydrate)

  useEffect(() => {
    void hydrateWishlist()
  }, [hydrateWishlist])

  if (items.length === 0) return null

  return (
    <section className="mx-auto mt-8 max-w-7xl px-4">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Sản phẩm yêu thích
          </h2>
          <p className="text-sm text-slate-500">
            Danh sách bạn đã bấm tim trên trang chủ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
