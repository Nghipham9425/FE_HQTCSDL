"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PackageSearch } from "lucide-react"

const navItems = [
  { label: "TRANG CHỦ", href: "/" },
  { label: "CONSOLE", href: "/products?category=console" },
  { label: "PHỤ KIỆN", href: "/products?category=accessory" },
  { label: "POKÉMON TCG", href: "/products?category=pokemon-tcg" },
  { label: "HỖ TRỢ", href: "/support" },
  { label: "GIỚI THIỆU", href: "/about" },
  { label: "LIÊN HỆ", href: "/contact" },
]

export default function NavMenu() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href.includes("?")) return false
    return href === "/" ? pathname === "/" : pathname.startsWith(href)
  }

  return (
    <nav
      aria-label="Điều hướng chính"
      className="hidden border-b border-slate-200 bg-white shadow-sm lg:block"
    >
      <div className="mx-auto flex max-w-screen-xl items-center justify-center px-4">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative px-3.5 py-3 text-[12px] font-bold tracking-[0.04em] transition-colors after:absolute after:inset-x-3.5 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-[var(--brand-red)] after:transition-transform hover:text-[var(--brand-red)] hover:after:scale-x-100 ${
                active
                  ? "text-[var(--brand-red)] after:scale-x-100"
                  : "text-slate-700"
              }`}
            >
              {item.label}
            </Link>
          )
        })}

        <span className="mx-2 h-4 w-px bg-slate-200" />
        <Link
          href="/tracking"
          aria-current={pathname.startsWith("/tracking") ? "page" : undefined}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-bold tracking-[0.04em] transition-colors ${
            pathname.startsWith("/tracking")
              ? "bg-[var(--brand-navy)] text-white"
              : "bg-blue-50 text-[var(--brand-navy)] hover:bg-blue-100"
          }`}
        >
          <PackageSearch size={14} />
          THEO DÕI ĐƠN
        </Link>
      </div>
    </nav>
  )
}
