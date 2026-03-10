import Link from "next/link";
import { Disc3, Gamepad2, Gamepad, Monitor, Headphones, Sparkles, Layers, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const trends: { label: string; Icon: LucideIcon; iconBg: string; iconColor: string; href: string }[] = [
  { label: "Game PS5",            Icon: Disc3,      iconBg: "bg-blue-50",   iconColor: "text-blue-600",   href: "/products?category=ps5" },
  { label: "Game Nintendo Switch", Icon: Gamepad2,   iconBg: "bg-red-50",    iconColor: "text-red-500",    href: "/products?category=switch" },
  { label: "Tay cầm chơi game",  Icon: Gamepad,    iconBg: "bg-violet-50", iconColor: "text-violet-600", href: "/products?sub=controller" },
  { label: "Máy chơi Game",       Icon: Monitor,    iconBg: "bg-sky-50",    iconColor: "text-sky-600",    href: "/products?sub=console" },
  { label: "Phụ kiện Game",      Icon: Headphones, iconBg: "bg-gray-100",  iconColor: "text-gray-600",   href: "/products?sub=accessory" },
  { label: "Pokemon TCG",         Icon: Sparkles,   iconBg: "bg-yellow-50", iconColor: "text-yellow-500", href: "/products?category=pokemon-tcg" },
  { label: "One Piece TCG",       Icon: Layers,     iconBg: "bg-orange-50", iconColor: "text-orange-500", href: "/products?category=one-piece-tcg" },
  { label: "Sản phẩm Limited",   Icon: Star,       iconBg: "bg-amber-50",  iconColor: "text-amber-500",  href: "/products?sub=limited" },
];

export default function SearchTrends() {
  return (
    <section className="bg-gray-50 py-10">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
          {/* Label */}
          <div className="flex flex-col items-center gap-3 md:w-36 md:shrink-0 md:items-start">
            <h2 className="text-base font-bold text-gray-800">Xu hướng tìm kiếm</h2>
            <Link
              href="/products"
              className="rounded-full bg-[var(--brand-navy)] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[var(--brand-navy-dark)] transition-colors"
            >
              XEM NGAY
            </Link>
          </div>

          {/* Icons grid */}
          <div className="grid grid-cols-4 gap-5 sm:grid-cols-8">
            {trends.map(({ label, Icon, iconBg, iconColor, href }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 shadow-sm transition-all group-hover:shadow-md group-hover:scale-105 ${iconBg}`}>
                  <Icon size={28} className={`${iconColor} transition-transform`} strokeWidth={1.5} />
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
  );
}
