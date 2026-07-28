"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Check, SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"

type Availability = "all" | "in-stock" | "low-stock" | "out-of-stock"

interface ProductCatalogFiltersProps {
  category?: string
  sub?: string
  availability?: Availability
  sort: string
}

const categoryOptions = [
  { value: "all", label: "Tất cả sản phẩm" },
  { value: "pokemon-tcg", label: "Pokémon TCG" },
  { value: "console", label: "Máy chơi game" },
  { value: "accessory", label: "Phụ kiện" },
] as const

const availabilityOptions: {
  value: Availability
  label: string
  description: string
}[] = [
  {
    value: "all",
    label: "Tất cả",
    description: "Hiển thị mọi trạng thái",
  },
  {
    value: "in-stock",
    label: "Còn hàng",
    description: "Có thể đặt mua ngay",
  },
  {
    value: "low-stock",
    label: "Sắp hết",
    description: "Còn từ 1 đến 5 sản phẩm",
  },
  {
    value: "out-of-stock",
    label: "Hết hàng",
    description: "Lưu lại để xem sau",
  },
]

const sortOptions = [
  { value: "price-desc", label: "Giá cao đến thấp" },
  { value: "price-asc", label: "Giá thấp đến cao" },
  { value: "newest", label: "Mới cập nhật" },
] as const

function OptionLink({
  href,
  active,
  label,
  description,
  onSelect,
}: {
  href: string
  active: boolean
  label: string
  description?: string
  onSelect?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onSelect}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-11 items-center justify-between gap-3 rounded-xl border px-3 py-2.5 transition",
        active
          ? "border-[var(--brand-navy)] bg-blue-50 text-[var(--brand-navy)]"
          : "border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50",
      )}
    >
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs font-normal text-slate-500">
            {description}
          </span>
        ) : null}
      </span>
      {active ? <Check className="h-4 w-4 shrink-0" /> : null}
    </Link>
  )
}

export default function ProductCatalogFilters({
  category,
  sub,
  availability = "all",
  sort,
}: ProductCatalogFiltersProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeCategory = category || sub || "all"
  const activeFilterCount =
    Number(activeCategory !== "all") + Number(availability !== "all")

  const currentQuery = searchParams.toString()

  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [mobileOpen])

  const hrefBuilder = useMemo(() => {
    return (
      updates: Record<string, string | null>,
      resetCategory = false,
    ) => {
      const params = new URLSearchParams(currentQuery)

      if (resetCategory) {
        params.delete("category")
        params.delete("sub")
      }

      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === "all") params.delete(key)
        else params.set(key, value)
      })

      params.delete("page")
      const query = params.toString()
      return query ? `${pathname}?${query}` : pathname
    }
  }, [currentQuery, pathname])

  const categoryHref = (value: string) =>
    value === "all"
      ? hrefBuilder({ category: null, sub: null }, true)
      : hrefBuilder({ category: value }, true)

  const clearHref = hrefBuilder(
    {
      category: null,
      sub: null,
      availability: null,
    },
    true,
  )

  const filterContent = (onSelect?: () => void) => (
    <div className="space-y-6">
      <section aria-labelledby="category-filter-title">
        <h3
          id="category-filter-title"
          className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400"
        >
          Danh mục
        </h3>
        <div className="space-y-1">
          {categoryOptions.map((option) => (
            <OptionLink
              key={option.value}
              href={categoryHref(option.value)}
              active={activeCategory === option.value}
              label={option.label}
              onSelect={onSelect}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="availability-filter-title">
        <h3
          id="availability-filter-title"
          className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400"
        >
          Tình trạng hàng
        </h3>
        <div className="space-y-1">
          {availabilityOptions.map((option) => (
            <OptionLink
              key={option.value}
              href={hrefBuilder({ availability: option.value })}
              active={availability === option.value}
              label={option.label}
              description={option.description}
              onSelect={onSelect}
            />
          ))}
        </div>
      </section>
    </div>
  )

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex min-h-11 w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-sm"
          aria-haspopup="dialog"
          aria-expanded={mobileOpen}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[var(--brand-red)]" />
            Lọc và sắp xếp
          </span>
          {activeFilterCount > 0 ? (
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--brand-red)] px-1.5 text-xs text-white">
              {activeFilterCount}
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-400">
              Tùy chọn
            </span>
          )}
        </button>
      </div>

      <aside className="hidden self-start rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:block">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <SlidersHorizontal className="h-4 w-4 text-[var(--brand-red)]" />
            Bộ lọc
          </h2>
          {activeFilterCount > 0 ? (
            <Link
              href={clearHref}
              className="text-xs font-semibold text-[var(--brand-red)] hover:underline"
            >
              Xóa lọc
            </Link>
          ) : null}
        </div>
        {filterContent()}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-60 lg:hidden">
          <button
            type="button"
            aria-label="Đóng bộ lọc"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-filter-title"
            className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
              <div>
                <h2
                  id="mobile-filter-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Lọc sản phẩm
                </h2>
                <p className="text-xs text-slate-500">
                  Chọn nhanh theo nhu cầu của bạn
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Đóng"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 px-5 py-5">
              {filterContent(() => setMobileOpen(false))}

              <section aria-labelledby="sort-filter-title">
                <h3
                  id="sort-filter-title"
                  className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400"
                >
                  Sắp xếp
                </h3>
                <div className="space-y-1">
                  {sortOptions.map((option) => (
                    <OptionLink
                      key={option.value}
                      href={hrefBuilder({ sort: option.value })}
                      active={sort === option.value}
                      label={option.label}
                      onSelect={() => setMobileOpen(false)}
                    />
                  ))}
                </div>
              </section>
            </div>

            <div className="sticky bottom-0 flex gap-3 border-t border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
              <Link
                href={clearHref}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-slate-300 text-sm font-bold text-slate-700"
              >
                Xóa bộ lọc
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="min-h-11 flex-[1.35] rounded-xl bg-[var(--brand-navy)] px-4 text-sm font-bold text-white"
              >
                Xem sản phẩm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
