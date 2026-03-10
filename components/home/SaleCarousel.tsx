"use client";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { type Product } from "@/data/mock/products";

interface SaleCarouselProps {
  products: Product[];
}

export default function SaleCarousel({ products }: SaleCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="mx-auto max-w-screen-xl rounded-2xl border border-red-100 bg-red-50 px-4 py-8 my-6">
      <SectionHeader
        title="Sản phẩm khuyến mãi"
        href="/products?sale=true"
        onPrev={scrollPrev}
        onNext={scrollNext}
        dot
        className="mb-4"
      />

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((product) => (
            <div key={product.id} className="min-w-[220px] flex-shrink-0 sm:min-w-[240px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href="/products?sale=true"
          className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Xem tất cả ↻
        </Link>
      </div>
    </section>
  );
}
