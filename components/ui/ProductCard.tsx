"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, CheckCircle } from "lucide-react";
import { useState } from "react";
import { type Product } from "@/data/mock/products";
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

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      {/* Discount badge */}
      {product.discountPercent > 0 && (
        <span className="absolute left-2 top-2 z-10 rounded bg-[var(--brand-red)] px-1.5 py-0.5 text-[11px] font-bold text-white">
          -{product.discountPercent}%
        </span>
      )}

      {/* Out of stock overlay */}
      {!product.inStock && (
        <div className="absolute inset-0 z-10 flex items-start justify-center pt-14">
          <span className="rounded bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
            Hết hàng
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className={cn(
            "object-cover transition-transform duration-300 group-hover:scale-105",
            !product.inStock && "opacity-60"
          )}
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          {product.brand}
        </p>
        <p className="line-clamp-2 text-sm font-medium leading-snug text-gray-800">
          {product.name}
        </p>

        {/* Prices */}
        <div className="mt-auto flex items-center gap-2 pt-2">
          <span className="text-base font-bold text-[var(--brand-red)]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* CTA */}
        {product.inStock ? (
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
