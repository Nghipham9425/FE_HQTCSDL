"use client"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, CheckCircle, Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { type Product } from "@/lib/api/products"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/lib/stores/cartStore"
import { useWishlistStore } from "@/lib/stores/wishlistStore"

interface ProductCardProps {
  product: Product
  className?: string
}

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "đ"
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const hydrateWishlist = useWishlistStore((s) => s.hydrate)
  const toggleWishlist = useWishlistStore((s) => s.toggleItem)
  const wished = useWishlistStore((s) =>
    s.items.some((item) => String(item.id) === String(product.id)),
  )
  const [added, setAdded] = useState(false)
  const [imgSrc, setImgSrc] = useState(
    product.thumbnail ||
      "https://picsum.photos/seed/cardgame-placeholder/400/500",
  )
  const inStock = product.stock > 0
  const price = product.price ?? 0

  useEffect(() => {
    void hydrateWishlist()
  }, [hydrateWishlist])

  if (!inStock) return null

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    addItem(product, 1)
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  async function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    const wasWished = wished
    try {
      await toggleWishlist(product)
      toast.success(
        wasWished
          ? "Đã xóa sản phẩm khỏi wishlist"
          : "Đã thêm sản phẩm vào wishlist",
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : ""
      const isUnauthorized =
        message === "Unauthorized" || message === "Session expired"

      if (isUnauthorized) {
        toast.error("Vui lòng đăng nhập để dùng wishlist")
        const nextPath = `${window.location.pathname}${window.location.search}`
        window.location.href = `/auth/login?next=${encodeURIComponent(nextPath)}`
        return
      }

      toast.error(message || "Không thể cập nhật wishlist")
    }
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className,
      )}
    >
      {/* Image */}
      <div className="relative h-64 w-full overflow-hidden bg-linear-to-b from-slate-50 to-slate-100">
        <div className="absolute left-2 top-2 z-10 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm backdrop-blur">
          {product.sku}
        </div>
        <button
          onClick={handleToggleWishlist}
          className={cn(
            "absolute right-2 top-2 z-10 rounded-full border bg-white/90 p-1.5 backdrop-blur transition",
            wished
              ? "border-rose-300 text-rose-600"
              : "border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-500",
          )}
          aria-label={wished ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
        >
          <Heart className={cn("h-4 w-4", wished && "fill-current")} />
        </button>
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          onError={() =>
            setImgSrc("https://picsum.photos/seed/cardgame-fallback/400/500")
          }
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          {product.productType}
        </p>
        <p className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-slate-800">
          {product.name}
        </p>

        {/* Prices */}
        <div className="mt-auto flex items-center pt-2">
          <span className="text-(--brand-red) text-base font-bold">
            {formatPrice(price)}
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={handleAddToCart}
          className={cn(
            "mt-2 flex items-center justify-between rounded-md border px-3 py-1.5 text-xs font-semibold uppercase transition-all",
            added
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-200 text-gray-700 hover:border-(--brand-red) hover:bg-(--brand-red) hover:text-white",
          )}
        >
          {added ? "Đã thêm!" : "Thêm vào giỏ"}
          {added ? <CheckCircle size={14} /> : <ShoppingBag size={14} />}
        </button>
      </div>
    </Link>
  )
}
