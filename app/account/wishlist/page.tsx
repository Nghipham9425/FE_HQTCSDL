"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import ProductCard from "@/components/ui/ProductCard"
import EmptyState from "@/components/ui/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { useWishlistStore } from "@/lib/stores/wishlistStore"

export default function AccountWishlistPage() {
  const items = useWishlistStore((s) => s.items)
  const hydrateWishlist = useWishlistStore((s) => s.hydrate)
  const toggleWishlist = useWishlistStore((s) => s.toggleItem)
  const hydrated = useWishlistStore((s) => s.hydrated)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(!hydrated)
  const visibleItems = items.filter((item) => item.stock > 0)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        await hydrateWishlist()
      } catch (err) {
        if (!mounted) return
        const message =
          err instanceof Error ? err.message : "Không tải được wishlist"
        setError(message)
        toast.error(message)
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [hydrateWishlist])

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Wishlist</h1>
          <p className="text-sm text-slate-500">Lưu lại sản phẩm yêu thích để mua sau</p>
        </div>
        {!loading && visibleItems.length > 0 ? (
          <Link
            href="/products"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Tìm thêm sản phẩm
          </Link>
        ) : null}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3"
            >
              <Skeleton className="aspect-[4/5] w-full rounded-xl" />
              <Skeleton className="mt-4 h-4 w-4/5" />
              <Skeleton className="mt-2 h-4 w-2/5" />
            </div>
          ))}
        </div>
      ) : error ? (
        <EmptyState
          compact
          icon="error"
          eyebrow="Không thể tải dữ liệu"
          title="Wishlist đang tạm gián đoạn"
          description={error}
          primaryAction={{
            label: "Thử tải lại",
            onClick: () => window.location.reload(),
            icon: "refresh",
          }}
          secondaryAction={{
            label: "Tiếp tục mua sắm",
            href: "/products",
            icon: "shopping",
          }}
        />
      ) : visibleItems.length === 0 ? (
        <EmptyState
          icon="wishlist"
          eyebrow="Wishlist của bạn"
          title={
            items.length > 0
              ? "Những món bạn lưu đang tạm hết hàng"
              : "Lưu lại món đồ khiến bạn thích ngay từ cái nhìn đầu tiên"
          }
          description={
            items.length > 0
              ? "Các sản phẩm này chưa thể đặt mua lúc này. Bạn có thể khám phá thêm những lựa chọn đang có sẵn trong cửa hàng."
              : "Nhấn biểu tượng trái tim trên sản phẩm để gom các lựa chọn yêu thích vào một nơi và quay lại bất cứ lúc nào."
          }
          details={[
            "Lưu nhanh bằng biểu tượng tim",
            "Dễ dàng thêm vào giỏ hàng",
          ]}
          primaryAction={{
            label: "Khám phá sản phẩm",
            href: "/products",
            icon: "shopping",
          }}
          secondaryAction={{
            label: "Về trang chủ",
            href: "/",
            icon: "home",
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visibleItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {visibleItems.map((product) => (
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
