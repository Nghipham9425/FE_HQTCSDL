"use client"
import { useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import ProductCard from "@/components/ui/ProductCard"
import SectionHeader from "@/components/ui/SectionHeader"
import { type Product } from "@/lib/api/products"

interface BestSellersCarouselProps {
  products: Product[]
}

export default function BestSellersCarousel({
  products,
}: BestSellersCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Sản phẩm bán chạy"
        href="/products?bestSeller=true"
        onPrev={scrollPrev}
        onNext={scrollNext}
        className="mb-6"
      />
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-[220px] flex-shrink-0 sm:min-w-[240px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
