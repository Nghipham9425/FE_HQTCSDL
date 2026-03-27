"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, CheckCircle } from "lucide-react";
import { useState } from "react";
import { type Product } from "@/lib/api/products";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/stores/cartStore";

interface ProductCardProps {
  product: Product;
  className?: string;
}

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "đ";
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    product.thumbnail || "https://picsum.photos/seed/cardgame-placeholder/400/500"
  );
  const inStock = product.stock > 0;
  const price = product.price ?? 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      {/* Out of stock overlay */}
      {!inStock && (
        <div className="absolute inset-0 z-10 flex items-start justify-center pt-14">
          <span className="rounded bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
            Hết hàng
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-64 w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="absolute left-2 top-2 z-10 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm backdrop-blur">
          {product.sku}
        </div>
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          onError={() => setImgSrc("https://picsum.photos/seed/cardgame-fallback/400/500")}
          className={cn(
            "object-contain p-2 transition-transform duration-300 group-hover:scale-105",
            !inStock && "opacity-60"
          )}
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{product.productType}</p>
        <p className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-slate-800">
          {product.name}
        </p>

        {/* Prices */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-base font-bold text-[var(--brand-red)]">
            {formatPrice(price)}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
            Kho: {product.stock}
          </span>
        </div>

        {/* CTA */}
        {inStock ? (
          <button
            onClick={handleAddToCart}
            className={cn(
              "mt-2 flex items-center justify-between rounded-md border px-3 py-1.5 text-xs font-semibold uppercase transition-all",
              added
                ? "border-green-500 bg-green-500 text-white"
                : "border-gray-200 text-gray-700 hover:bg-[var(--brand-red)] hover:text-white hover:border-[var(--brand-red)]"
            )}
          >
            {added ? "Đã thêm!" : "Thêm vào giỏ"}
            {added ? <CheckCircle size={14} /> : <ShoppingBag size={14} />}
          </button>
        ) : (
          <button
            disabled
            className="mt-2 flex items-center justify-between rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold uppercase text-gray-400 cursor-not-allowed"
          >
            Hết hàng
            <ShoppingBag size={14} />
          </button>
        )}
      </div>
    </Link>
  );
}
