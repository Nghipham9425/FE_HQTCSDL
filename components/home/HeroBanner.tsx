"use client"
import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    id: 1,
    image:
      "https://www.nintendo.com/eu/media/images/assets/nintendo_switch_2_games/pokemonpokopia/16x9_NSwitch2_PokemonPokopia_image1280w.png",
    alt: "Pokopia nintendo Switch",
  },
  {
    id: 2,
    image:
      "https://theme.hstatic.net/200000160361/1001347573/14/home_side_banner_2.jpg?v=770",
    alt: "Pokémon TCG - Mega Evolution",
  },
  {
    id: 3,
    image:
      "https://www.nintendo.com/eu/media/images/assets/nintendo_switch_2_games/thelegendofzeldatearsofthekingdomnintendoswitch2edition/2x1_HP_NSwitch2_TLoZTotKN.jpg",
    alt: "Zelda",
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
    // autoplay
    const interval = setInterval(() => emblaApi.scrollNext(), 4000)
    return () => {
      clearInterval(interval)
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  return (
    <div className="relative overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide) => (
          <div key={slide.id} className="relative min-w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt={slide.alt}
              className="h-[300px] w-full object-cover sm:h-[420px] md:h-[480px]"
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors"
        aria-label="Slide trước"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors"
        aria-label="Slide tiếp"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2 rounded-full transition-all ${
              selectedIndex === i ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
            aria-label={`Đến slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
