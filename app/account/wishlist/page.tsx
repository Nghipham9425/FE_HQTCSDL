"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import ProductCard from "@/components/ui/ProductCard"
import { useWishlistStore } from "@/lib/stores/wishlistStore"

export default function AccountWishlistPage() {
  const items = useWishlistStore((s) => s.items)
  const hydrateWishlist = useWishlistStore((s) => s.hydrate)
  const toggleWishlist = useWishlistStore((s) => s.toggleItem)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        await hydrateWishlist()
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Không tải được wishlist"
        setError(message)
        toast.error(message)
      }
    })()
  }, [hydrateWishlist])

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Wishlist</h1>
          <p className="text-sm text-slate-500">Lưu lại sản phẩm yêu thích để mua sau</p>
        </div>
        <Link
          href="/products"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Tìm thêm sản phẩm
        </Link>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          Bạn chưa có sản phẩm yêu thích nào.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {items.map((product) => (
              <button
                key={`remove-${product.id}`}
                onClick={async () => {
                  try {
                    await toggleWishlist(product)
                    toast.success("Đã xóa sản phẩm khỏi wishlist")
                  } catch (err) {
                    const message =
                      err instanceof Error
                        ? err.message
                        : "Không cập nhật được wishlist"
                    setError(message)
                    toast.error(message)
                  }
                }}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Bỏ: {product.name}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
