import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  href?: string
  onPrev?: () => void
  onNext?: () => void
  className?: string
  dot?: boolean
}

export default function SectionHeader({
  title,
  href,
  onPrev,
  onNext,
  className,
  dot = false,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-3">
        {dot && (
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--brand-red)] ring-4 ring-[var(--brand-red)]/10" />
        )}
        <h2 className="text-xl font-extrabold text-slate-950 sm:text-2xl">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {href && (
          <Link
            href={href}
            className="hidden text-sm font-bold text-[var(--brand-navy)] transition hover:text-[var(--brand-red)] sm:block"
          >
            Xem tất cả
          </Link>
        )}
        {(onPrev || onNext) && (
          <div className="flex gap-1.5">
            <button
              onClick={onPrev}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[var(--brand-navy)] hover:bg-[var(--brand-navy)] hover:text-white"
              aria-label="Trước"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={onNext}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[var(--brand-navy)] hover:bg-[var(--brand-navy)] hover:text-white"
              aria-label="Tiếp"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
