import Link from "next/link"
import {
  BadgeCheck,
  Headphones,
  RefreshCcw,
  Truck,
  type LucideIcon,
} from "lucide-react"

interface ShoppingBenefit {
  title: string
  description: string
  href: string
  Icon: LucideIcon
}

const benefits: ShoppingBenefit[] = [
  {
    title: "Sản phẩm chính hãng",
    description: "Nguồn gốc rõ ràng, thông tin minh bạch",
    href: "/policy/inspection",
    Icon: BadgeCheck,
  },
  {
    title: "Giao hàng toàn quốc",
    description: "Đóng gói cẩn thận, theo dõi dễ dàng",
    href: "/policy/shipping",
    Icon: Truck,
  },
  {
    title: "Đổi trả trong 7 ngày",
    description: "Chính sách rõ ràng và thuận tiện",
    href: "/policy/return",
    Icon: RefreshCcw,
  },
  {
    title: "Hỗ trợ nhanh chóng",
    description: "Luôn sẵn sàng khi bạn cần tư vấn",
    href: "/contact",
    Icon: Headphones,
  },
]

export default function SearchTrends() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-5 text-center sm:px-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--brand-red)]">
            Cam kết dịch vụ
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-slate-950 sm:text-2xl">
            Mua sắm an tâm tại CardgameCenter
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ title, description, href, Icon }, index) => (
            <Link
              key={title}
              href={href}
              className={`group flex items-center gap-4 px-5 py-6 transition-colors hover:bg-slate-50 sm:px-6 ${
                index > 0 ? "border-t border-slate-100 lg:border-l lg:border-t-0" : ""
              } ${index === 2 ? "sm:border-l-0 lg:border-l" : ""}`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--brand-navy)]/8 text-[var(--brand-navy)] transition-colors group-hover:bg-[var(--brand-navy)] group-hover:text-white">
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
