"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    id: 1,
    image:
      "https://www.nintendo.com/eu/media/images/assets/nintendo_switch_2_games/pokemonpokopia/16x9_NSwitch2_PokemonPokopia_image1280w.png",
    alt: "Pokémon Pokopia trên Nintendo Switch",
    eyebrow: "Thế giới Nintendo",
    title: "Khám phá cuộc phiêu lưu mới",
    description: "Console, game và phụ kiện chính hãng dành cho mọi cuộc chơi.",
    href: "/products?category=console",
  },
  {
    id: 2,
    image:
      "https://theme.hstatic.net/200000160361/1001347573/14/home_side_banner_2.jpg?v=770",
    alt: "Pokémon TCG Mega Evolution",
    eyebrow: "Pokémon TCG",
    title: "Mở pack. Săn thẻ. Xây bộ bài.",
    description:
      "Những set mới và sản phẩm TCG được tuyển chọn cho cộng đồng.",
    href: "/products?category=pokemon-tcg",
  },
  {
    id: 3,
    image:
      "https://www.nintendo.com/eu/media/images/assets/nintendo_switch_2_games/thelegendofzeldatearsofthekingdomnintendoswitch2edition/2x1_HP_NSwitch2_TLoZTotKN.jpg",
    alt: "The Legend of Zelda",
    eyebrow: "Nintendo Switch 2",
    title: "Huyền thoại trở lại sắc nét hơn",
    description: "Nâng cấp trải nghiệm cùng game và thiết bị thế hệ mới.",
    href: "/products?sort=newest",
  },
]

export default function HeroBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    const interval = setInterval(() => emblaApi.scrollNext(), 5000)
    return () => {
      clearInterval(interval)
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  return (
    <section
      className="mx-auto max-w-[1536px] sm:px-4 sm:pt-4 lg:px-6"
      aria-label="Ưu đãi nổi bật"
    >
      <div
        className="relative overflow-hidden bg-slate-950 sm:rounded-[2rem]"
        ref={emblaRef}
      >
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="relative min-w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.alt}
                className="h-[380px] w-full object-cover opacity-75 sm:h-[460px] lg:h-[540px]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/45 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="mx-auto w-full max-w-7xl px-6 sm:px-12 lg:px-16">
                  <div className="max-w-xl">
                    <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--brand-yellow)] sm:text-sm">
                      {slide.eyebrow}
                    </p>
                    <h1 className="mt-3 text-3xl font-extrabold leading-[1.08] text-balance text-white sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h1>
                    <p className="mt-4 max-w-lg text-sm leading-6 text-white/75 sm:text-base">
                      {slide.description}
                    </p>
                    <Link
                      href={slide.href}
                      className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:-translate-y-0.5 hover:bg-[var(--brand-yellow)]"
                    >
                      Khám phá ngay
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollPrev}
          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur transition hover:bg-white hover:text-slate-950 sm:left-6"
          aria-label="Slide trước"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur transition hover:bg-white hover:text-slate-950 sm:right-6"
          aria-label="Slide tiếp"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/25 px-3 py-2 backdrop-blur">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                selectedIndex === index ? "w-7 bg-white" : "w-2 bg-white/45"
              }`}
              aria-label={`Đến slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
