import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const spotlights = [
  {
    eyebrow: "Dành cho nhà sưu tầm",
    title: "Bắt đầu hành trình Pokémon TCG",
    description: "Từ booster pack đầu tiên đến bộ bài mang dấu ấn riêng.",
    href: "/products?category=pokemon-tcg",
    image:
      "https://cdn.shopify.com/s/files/1/1601/1757/articles/How_Many_Pokemon_Cards_Are_There_So_Far_Late_2022.jpg?v=1664713281",
    color: "text-[var(--brand-yellow)]",
  },
  {
    eyebrow: "Dành cho game thủ",
    title: "Nâng cấp góc chơi theo cách của bạn",
    description: "Console và phụ kiện cho trải nghiệm trọn vẹn hơn mỗi ngày.",
    href: "/products?category=console",
    image:
      "https://www.nintendo.com/eu/media/images/assets/nintendo_switch_2_games/thelegendofzeldatearsofthekingdomnintendoswitch2edition/2x1_HP_NSwitch2_TLoZTotKN.jpg",
    color: "text-cyan-300",
  },
]

export default function DiscoverySpotlight() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--brand-red)]">
            Chơi theo cách của bạn
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
            Tìm cảm hứng mới
          </h2>
        </div>
        <Link
          href="/products"
          className="hidden text-sm font-bold text-[var(--brand-navy)] transition hover:text-[var(--brand-red)] sm:block"
        >
          Khám phá cửa hàng →
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {spotlights.map((spotlight) => (
          <Link
            key={spotlight.title}
            href={spotlight.href}
            className="group relative min-h-72 overflow-hidden rounded-[2rem] bg-slate-950 sm:min-h-80"
          >
            <Image
              src={spotlight.image}
              alt=""
              fill
              className="object-cover opacity-65 transition duration-700 group-hover:scale-105 group-hover:opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/65 to-transparent" />
            <div className="absolute inset-0 flex max-w-md flex-col justify-end p-6 sm:p-8">
              <p
                className={`text-xs font-extrabold uppercase tracking-[0.2em] ${spotlight.color}`}
              >
                {spotlight.eyebrow}
              </p>
              <h3 className="mt-2 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                {spotlight.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                {spotlight.description}
              </p>
              <div className="mt-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-950 transition group-hover:rotate-12 group-hover:bg-[var(--brand-yellow)]">
                <ArrowUpRight size={18} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
