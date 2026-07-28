"use client"

import Image from "next/image"
import Link from "next/link"
import {
  CheckCircle,
  Heart,
  PackageX,
  ShoppingBag,
  TriangleAlert,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { notify } from "@/lib/notifications"
import { type Product } from "@/lib/api/products"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/lib/stores/cartStore"
import { useWishlistStore } from "@/lib/stores/wishlistStore"

interface ProductCardProps {
  product: Product
  className?: string
}

const LOW_STOCK_THRESHOLD = 5
const FALLBACK_IMAGE =
  "https://picsum.photos/seed/cardgame-fallback/400/500"

function formatPrice(price: number) {
  return `${price.toLocaleString("vi-VN")}₫`
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const hydrateWishlist = useWishlistStore((state) => state.hydrate)
  const toggleWishlist = useWishlistStore((state) => state.toggleItem)
  const wished = useWishlistStore((state) =>
    state.items.some((item) => String(item.id) === String(product.id)),
  )
  const [added, setAdded] = useState(false)
  const [imgSrc, setImgSrc] = useState(
    product.thumbnail ||
      "https://picsum.photos/seed/cardgame-placeholder/400/500",
  )

  const availableStock = Math.max(0, Math.floor(product.stock || 0))
  const inStock = availableStock > 0
  const isLowStock =
    availableStock > 0 && availableStock <= LOW_STOCK_THRESHOLD
  const price = product.price ?? 0

  useEffect(() => {
    void hydrateWishlist()
  }, [hydrateWishlist])

  function handleAddToCart() {
    if (!inStock) return

    addItem(product, 1)
    notify.cartAdded(product.name)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1500)
  }

  async function handleToggleWishlist() {
    const wasWished = wished

    try {
      await toggleWishlist(product)
      toast.success(
        wasWished
          ? "Đã xóa sản phẩm khỏi danh sách yêu thích"
          : "Đã thêm sản phẩm vào danh sách yêu thích",
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : ""
      const isUnauthorized =
        message === "Unauthorized" || message === "Session expired"

      if (isUnauthorized) {
        toast.error("Vui lòng đăng nhập để dùng danh sách yêu thích")
        const nextPath = `${window.location.pathname}${window.location.search}`
        window.location.href = `/auth/login?next=${encodeURIComponent(nextPath)}`
        return
      }

      toast.error(message || "Không thể cập nhật danh sách yêu thích")
    }
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        !inStock && "hover:translate-y-0 hover:shadow-md",
        className,
      )}
    >
      <div className="relative">
        <Link
          href={`/products/${product.id}`}
          aria-label={`Xem chi tiết ${product.name}`}
          className="block"
        >
          <div className="relative h-64 w-full overflow-hidden bg-linear-to-b from-slate-50 to-slate-100">
            {product.sku ? (
              <span className="absolute left-2 top-2 z-10 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm backdrop-blur">
                {product.sku}
              </span>
            ) : null}

            <Image
              src={imgSrc}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgSrc(FALLBACK_IMAGE)}
              className={cn(
                "object-contain p-2 transition duration-300 group-hover:scale-105",
                !inStock && "grayscale group-hover:scale-100",
              )}
            />

            {!inStock ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/58 backdrop-blur-[1px]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                  <PackageX className="h-4 w-4" />
                  Hết hàng
                </span>
              </div>
            ) : null}
          </div>
        </Link>

        <button
          type="button"
          onClick={handleToggleWishlist}
          className={cn(
            "absolute right-2 top-2 z-20 rounded-full border bg-white/90 p-2 backdrop-blur transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2",
            wished
              ? "border-rose-300 text-rose-600"
              : "border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-500",
          )}
          aria-label={
            wished
              ? "Bỏ khỏi danh sách yêu thích"
              : "Thêm vào danh sách yêu thích"
          }
          aria-pressed={wished}
        >
          <Heart className={cn("h-4 w-4", wished && "fill-current")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {product.productType}
        </p>
        <Link
          href={`/products/${product.id}`}
          className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-slate-800 transition hover:text-[var(--brand-red)]"
        >
          {product.name}
        </Link>

        <div className="mt-auto pt-2">
          <p className="text-base font-bold text-[var(--brand-red)]">
            {formatPrice(price)}
          </p>
          {isLowStock ? (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-amber-700">
              <TriangleAlert className="h-3.5 w-3.5" />
              Chỉ còn {availableStock} sản phẩm
            </p>
          ) : !inStock ? (
            <p className="mt-1 text-[11px] font-medium text-slate-500">
              Bạn vẫn có thể lưu sản phẩm để xem lại sau.
            </p>
          ) : (
            <p className="mt-1 text-[11px] font-medium text-emerald-700">
              Sẵn sàng giao hàng
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock}
          className={cn(
            "mt-2 flex min-h-9 items-center justify-between rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]/40",
            !inStock
              ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
              : added
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-slate-200 text-slate-700 hover:border-[var(--brand-red)] hover:bg-[var(--brand-red)] hover:text-white",
          )}
        >
          {inStock ? (added ? "Đã thêm!" : "Thêm vào giỏ") : "Tạm hết hàng"}
          {inStock ? (
            added ? (
              <CheckCircle size={14} />
            ) : (
              <ShoppingBag size={14} />
            )
          ) : (
            <PackageX size={14} />
          )}
        </button>
      </div>
    </article>
  )
}
