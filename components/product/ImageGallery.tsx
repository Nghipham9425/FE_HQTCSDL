"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  discountPercent: number;
  inStock: boolean;
  productName: string;
}

export default function ImageGallery({
  images,
  discountPercent,
  inStock,
  productName,
}: ImageGalleryProps) {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="flex gap-3">
      {/* Thumbnails */}
      <div className="hidden flex-col gap-2 sm:flex">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "h-16 w-16 overflow-hidden rounded-lg border-2 transition-all",
              active === i
                ? "border-[var(--brand-red)] shadow-md"
                : "border-gray-200 hover:border-gray-400"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${productName} ${i + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative flex-1 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
        {discountPercent > 0 && (
          <div className="absolute left-3 top-3 z-10 rounded bg-[var(--brand-red)] px-2 py-1 text-sm font-bold text-white">
            -{discountPercent}% OFF
          </div>
        )}
        {!inStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
            <span className="rounded-lg bg-black/70 px-4 py-2 text-sm font-bold text-white">
              Hết hàng
            </span>
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={productName}
          className={cn(
            "h-[380px] w-full object-cover sm:h-[450px]",
            !inStock && "opacity-70"
          )}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
              aria-label="Ảnh tiếp"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
