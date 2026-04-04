import Link from "next/link"
import Image from "next/image"
import type { LucideIcon } from "lucide-react"

type Trend =
  | {
      label: string
      Icon: LucideIcon
      imgSrc?: never
      iconBg: string
      iconColor: string
      href: string
    }
  | {
      label: string
      imgSrc: string
      Icon?: never
      iconBg: string
      iconColor?: never
      href: string
    }

const trends: Trend[] = [
  {
    label: "Console",
    imgSrc:
      "https://cdn.hstatic.net/themes/1000231532/1001458018/14/icon_nav_2.png?v=69",
    iconBg: "bg-blue-50",
    href: "/products?category=console",
  },
  {
    label: "Accessory",
    imgSrc:
      "https://cdn.hstatic.net/themes/1000231532/1001458018/14/icon_nav_1.png?v=69",
    iconBg: "bg-red-50",
    href: "/products?category=accessory",
  },
  {
    label: "Pokemon TCG",
    imgSrc:
      "https://cdn.hstatic.net/themes/1000231532/1001458018/14/icon_nav_9.png?v=69",
    iconBg: "bg-yellow-50",
    href: "/products?category=pokemon-tcg",
  },
]

export default function SearchTrends() {
    return (
      <section className="bg-gray-50 py-10">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
            {/* Label */}
            <div className="flex flex-col items-center gap-3 md:w-36 md:shrink-0 md:items-start">
            <h2 className="text-base font-bold text-gray-800">
              Xu hướng tìm kiếm
            </h2>
            <Link
              href="/products"
              className="rounded-full bg-[var(--brand-navy)] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[var(--brand-navy-dark)] transition-colors"
            >
              XEM NGAY
            </Link>
          </div>

          {/* Icons grid */}
          <div className="grid grid-cols-3 gap-5 sm:grid-cols-3">
            {trends.map(({ label, href, iconBg, ...rest }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 shadow-sm transition-all group-hover:shadow-md group-hover:scale-105 ${iconBg}`}
                >
                  {"imgSrc" in rest && rest.imgSrc ? (
                    <Image
                      src={rest.imgSrc}
                      alt={label}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  ) : "Icon" in rest && rest.Icon ? (
                    <rest.Icon
                      size={28}
                      className={`${"iconColor" in rest ? rest.iconColor : ""} transition-transform`}
                      strokeWidth={1.5}
                    />
                  ) : null}
                </div>
                <span className="text-center text-[11px] font-medium leading-tight text-gray-600 group-hover:text-[var(--brand-red)]">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
