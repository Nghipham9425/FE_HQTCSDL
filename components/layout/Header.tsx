"use client"
import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  ShoppingBag,
  CircleUser,
  Menu,
  X,
  Phone,
  BadgeCheck,
  Truck,
  PackageOpen,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"
import { useCartStore } from "@/lib/stores/cartStore"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md">
      {/* ── Main row ── */}
      <div className="mx-auto flex max-w-screen-xl items-center gap-3 px-4 py-3 lg:gap-5">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5 group">
          <div className="relative h-11 w-11 shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="https://www.pngkey.com/png/full/519-5194869_pikachu-circle-png.png"
              alt="CardgameCenter logo"
              fill
              className="object-contain drop-shadow-sm"
            />
          </div>
          <div className="hidden flex-col leading-none sm:flex">
            <span className="text-xl font-black tracking-tight text-[var(--brand-navy)]">
              Cardgame<span className="text-[var(--brand-red)]">Center</span>
            </span>
            <span className="text-[10px] font-medium tracking-widest text-gray-400 uppercase">
              Game &middot; Card &middot; Store
            </span>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm game, thẻ bài, máy chơi game..."
            className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-4 pr-12 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[var(--brand-red)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100 transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand-red)] text-white hover:bg-[var(--brand-red-dark)] transition-colors"
          >
            <Search size={14} strokeWidth={2.5} />
          </button>
        </form>

        {/* Hotline – desktop only */}
        <a
          href="tel::0985419095"
          className="hidden items-center gap-2 xl:flex text-sm"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-[var(--brand-red)]">
            <Phone size={16} />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] text-gray-400 uppercase tracking-wide">
              Hotline
            </div>
            <div className="font-bold text-[var(--brand-navy)]">
              + 84 985.419.095
            </div>
          </div>
        </a>

        {/* Auth */}
        <Link
          href="/auth/login"
          className="hidden items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs hover:border-[var(--brand-navy)] hover:bg-gray-50 transition-colors lg:flex"
        >
          <CircleUser size={18} className="text-gray-500" />
          <div className="leading-tight">
            <div className="text-gray-400">Tài khoản</div>
            <div className="font-semibold text-gray-700">Đăng nhập</div>
          </div>
        </Link>

        {/* Cart */}
        <Link
          href="/cart"
          className="relative flex items-center gap-2 rounded-xl bg-[var(--brand-red)] px-3 py-2 text-white hover:bg-[var(--brand-red-dark)] transition-colors"
        >
          <ShoppingBag size={18} />
          {totalItems() > 0 ? (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-navy)] text-[10px] font-black text-white shadow">
              {totalItems() > 99 ? "99+" : totalItems()}
            </span>
          ) : null}
          <span className="hidden text-xs font-semibold lg:block">
            Giỏ hàng
          </span>
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Trust badges ── */}
      <div className="hidden border-t border-gray-100 bg-gray-50 lg:block">
        <div className="mx-auto flex max-w-screen-xl items-center justify-center gap-6 px-4 py-1.5 text-xs text-gray-500">
          {(
            [
              {
                Icon: BadgeCheck,
                label: "100% chính hãng",
                color: "text-green-500",
              },
              {
                Icon: Truck,
                label: "Freeship toàn quốc",
                color: "text-blue-500",
              },
              {
                Icon: PackageOpen,
                label: "Mở hộp kiểm tra",
                color: "text-orange-500",
              },
              {
                Icon: RefreshCw,
                label: "Đổi trả 7 ngày",
                color: "text-purple-500",
              },
              {
                Icon: ShieldCheck,
                label: "Bảo hành chính hãng",
                color: "text-[var(--brand-red)]",
              },
            ] as { Icon: React.ElementType; label: string; color: string }[]
          ).map(({ Icon, label, color }, i, arr) => (
            <>
              <span key={label} className="flex items-center gap-1.5">
                <Icon size={13} className={color} strokeWidth={2.5} />
                {label}
              </span>
              {i < arr.length - 1 && <span className="h-3 w-px bg-gray-300" />}
            </>
          ))}
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-1 text-sm">
            {[
              { label: "PlayStation 4", href: "/products?category=ps4" },
              { label: "PlayStation 5", href: "/products?category=ps5" },
              { label: "Nintendo Switch", href: "/products?category=switch" },
              { label: "Pokemon TCG", href: "/products?category=pokemon-tcg" },
              {
                label: "One Piece TCG",
                href: "/products?category=one-piece-tcg",
              },
              { label: "Tin Tức", href: "/news" },
              { label: "Liên Hệ", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center rounded-xl px-3 py-2.5 font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--brand-red)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CircleUser size={15} /> Đăng nhập
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[var(--brand-red)] px-3 py-2.5 text-sm font-semibold text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Đăng ký
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
