import Link from "next/link"
import { ChevronRight, House } from "lucide-react"
import { cn } from "@/lib/utils"

export type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Đường dẫn trang"
      className={cn("min-w-0 text-sm text-slate-500", className)}
    >
      <ol className="flex min-w-0 items-center gap-1.5">
        <li className="shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md py-1 transition-colors hover:text-[var(--brand-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]/30"
          >
            <House aria-hidden="true" size={14} />
            <span className="hidden sm:inline">Trang chủ</span>
            <span className="sr-only sm:hidden">Trang chủ</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isCurrent = index === items.length - 1

          return (
            <li
              key={`${item.href ?? "current"}-${item.label}`}
              className="flex min-w-0 items-center gap-1.5"
            >
              <ChevronRight
                aria-hidden="true"
                className="shrink-0 text-slate-300"
                size={14}
              />
              {item.href && !isCurrent ? (
                <Link
                  href={item.href}
                  className="truncate rounded-md py-1 transition-colors hover:text-[var(--brand-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]/30"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? "page" : undefined}
                  className="truncate py-1 font-semibold text-slate-800"
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
