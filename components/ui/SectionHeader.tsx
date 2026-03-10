import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  href?: string;
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
  dot?: boolean; // red dot accent like "SẢN PHẨM KHUYẾN MÃI"
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
      <div className="flex items-center gap-2">
        {dot && (
          <span className="inline-block h-3 w-3 rounded-full bg-[var(--brand-red)] ring-2 ring-[var(--brand-red)]/30" />
        )}
        <h2 className="text-xl font-extrabold uppercase tracking-wide text-gray-900">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {href && (
          <Link
            href={href}
            className="text-sm text-[var(--brand-red)] font-medium hover:underline"
          >
            Xem tất cả
          </Link>
        )}
        {(onPrev || onNext) && (
          <div className="flex gap-1">
            <button
              onClick={onPrev}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Trước"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={onNext}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Tiếp"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
