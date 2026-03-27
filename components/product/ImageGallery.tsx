"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  image?: string | null;
  inStock: boolean;
  productName: string;
}

export default function ImageGallery({
  image,
  inStock,
  productName,
}: ImageGalleryProps) {
  const images = [image || "https://picsum.photos/seed/cardgame-placeholder/900/1200"];
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
      {/* Thumbnails */}
      <div className="hidden flex-col gap-2 sm:flex">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "h-20 w-16 overflow-hidden rounded-lg border-2 transition-all",
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
      <div className="relative flex-1 overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-b from-slate-50 to-slate-100">
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
            "h-[420px] w-full object-contain p-4 sm:h-[560px]",
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
