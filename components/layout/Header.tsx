"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BadgeCheck,
  Cable,
  ChevronRight,
  CircleUser,
  Gamepad2,
  Heart,
  House,
  Info,
  KeyRound,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  MapPin,
  Menu,
  PackageOpen,
  PackageSearch,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UserRound,
  X,
} from "lucide-react"
import { getStoredRole, logout } from "@/lib/api/auth"
import { useCartStore } from "@/lib/stores/cartStore"

type MenuItem = {
  label: string
  href: string
  Icon: React.ElementType
}

const accountMenuItems: MenuItem[] = [
  { label: "Hồ sơ tài khoản", href: "/account/profile", Icon: UserRound },
  { label: "Đơn hàng của tôi", href: "/account/orders", Icon: PackageSearch },
  { label: "Sổ địa chỉ", href: "/account/addresses", Icon: MapPin },
  { label: "Sản phẩm yêu thích", href: "/account/wishlist", Icon: Heart },
  { label: "Đổi mật khẩu", href: "/account/change-password", Icon: KeyRound },
]

const mobileShopItems: MenuItem[] = [
  { label: "Tất cả sản phẩm", href: "/products", Icon: LayoutGrid },
  {
    label: "Máy chơi game",
    href: "/products?category=console",
    Icon: Gamepad2,
  },
  {
    label: "Phụ kiện",
    href: "/products?category=accessory",
    Icon: Cable,
  },
  {
    label: "Pokémon TCG",
    href: "/products?category=pokemon-tcg",
    Icon: BadgeCheck,
  },
]

const mobileServiceItems: MenuItem[] = [
  { label: "Trang chủ", href: "/", Icon: House },
  { label: "Theo dõi đơn hàng", href: "/tracking", Icon: PackageSearch },
  { label: "Trung tâm hỗ trợ", href: "/support", Icon: ShieldCheck },
  { label: "Giới thiệu", href: "/about", Icon: Info },
  { label: "Liên hệ", href: "/contact", Icon: Phone },
]

const trustBadges = [
  { Icon: BadgeCheck, label: "100% chính hãng", color: "text-emerald-500" },
  { Icon: Truck, label: "Giao hàng toàn quốc", color: "text-sky-500" },
  { Icon: PackageOpen, label: "Mở hộp kiểm tra", color: "text-amber-500" },
  { Icon: RefreshCw, label: "Đổi trả 7 ngày", color: "text-violet-500" },
  {
    Icon: ShieldCheck,
    label: "Bảo hành chính hãng",
    color: "text-[var(--brand-red)]",
  },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("Tài khoản")
  const [userRole, setUserRole] = useState<string | null>(null)
  const totalItems = useCartStore((state) => state.totalItems)
  const cartCount = totalItems()

  useEffect(() => {
    const syncSession = window.requestAnimationFrame(() => {
      const loggedIn = localStorage.getItem("auth_logged_in") === "true"
      const name = localStorage.getItem("auth_user_name")
      const role = getStoredRole()

      setIsLoggedIn(loggedIn)
      setUserRole(role)
      if (name) setUserName(name)
    })

    return () => window.cancelAnimationFrame(syncSession)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false)
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", closeOnEscape)
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    if (!accountMenuOpen) return

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setAccountMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick)
    return () => document.removeEventListener("mousedown", closeOnOutsideClick)
  }, [accountMenuOpen])

  const isAdmin = userRole?.toUpperCase() === "ADMIN"

  async function handleLogout() {
    await logout()
    setIsLoggedIn(false)
    setUserRole(null)
    setAccountMenuOpen(false)
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = searchQuery.trim()
    if (!query) return

    router.push(`/products?q=${encodeURIComponent(query)}`)
    setMobileMenuOpen(false)
  }

  function isActive(href: string) {
    const hrefPath = href.split("?")[0]
    return hrefPath === "/" ? pathname === "/" : pathname.startsWith(hrefPath)
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center gap-2.5 px-4 py-2.5 sm:flex-nowrap sm:gap-3 sm:py-3 lg:gap-5">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]/30"
            aria-label="CardgameCenter - Trang chủ"
          >
            <div className="relative h-10 w-10 shrink-0 transition-transform group-hover:scale-105 sm:h-11 sm:w-11">
              <Image
                src="https://www.pngkey.com/png/full/519-5194869_pikachu-circle-png.png"
                alt=""
                fill
                sizes="44px"
                className="object-contain drop-shadow-sm"
              />
            </div>
            <div className="hidden flex-col leading-none sm:flex">
              <span className="text-xl font-black tracking-tight text-[var(--brand-navy)]">
                Cardgame<span className="text-[var(--brand-red)]">Center</span>
              </span>
              <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Game · Card · Store
              </span>
            </div>
          </Link>

          <form
            onSubmit={handleSearch}
            role="search"
            className="relative order-3 w-full basis-full sm:order-none sm:w-auto sm:flex-1 sm:basis-auto"
          >
            <label htmlFor="site-search" className="sr-only">
              Tìm kiếm sản phẩm
            </label>
            <input
              id="site-search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Tìm game, thẻ bài, máy chơi game..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-12 text-sm text-slate-700 transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[var(--brand-red)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
            />
            <button
              type="submit"
              aria-label="Tìm kiếm"
              className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-[var(--brand-red)] text-white transition-colors hover:bg-[var(--brand-red-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              <Search size={14} strokeWidth={2.5} />
            </button>
          </form>

          <a
            href="tel:0985419095"
            className="hidden items-center gap-2 rounded-xl px-1 py-1 text-sm transition-colors hover:bg-red-50 xl:flex"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-[var(--brand-red)]">
              <Phone size={16} />
            </span>
            <span className="leading-tight">
              <span className="block text-[10px] uppercase tracking-wide text-slate-400">
                Hotline
              </span>
              <span className="block font-bold text-[var(--brand-navy)]">
                0985 419 095
              </span>
            </span>
          </a>

          {isLoggedIn ? (
            <div ref={accountMenuRef} className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setAccountMenuOpen((open) => !open)}
                aria-expanded={accountMenuOpen}
                aria-haspopup="menu"
                className="flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs transition-colors hover:border-[var(--brand-navy)] hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-navy)]/20"
              >
                <CircleUser size={18} className="text-slate-500" />
                <span className="max-w-32 text-left leading-tight">
                  <span className="block text-slate-400">Xin chào</span>
                  <span className="block truncate font-semibold text-slate-700">
                    {userName}
                  </span>
                </span>
              </button>

              {accountMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10"
                >
                  {isAdmin && (
                  <Link
                      href="/admin"
                      role="menuitem"
                      onClick={() => setAccountMenuOpen(false)}
                      className="mb-1 flex items-center gap-2 rounded-xl bg-[var(--brand-navy)] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-navy-dark)]"
                    >
                      <LayoutDashboard size={16} />
                      Trang quản trị
                    </Link>
                  )}
                  {accountMenuItems.map(({ href, label, Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      role="menuitem"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-[var(--brand-red)]"
                    >
                      <Icon size={16} className="text-slate-400" />
                      {label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-2.5 border-t border-slate-100 px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="hidden min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs transition-colors hover:border-[var(--brand-navy)] hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-navy)]/20 lg:flex"
            >
              <CircleUser size={18} className="text-slate-500" />
              <span className="leading-tight">
                <span className="block text-slate-400">Tài khoản</span>
                <span className="block font-semibold text-slate-700">
                  Đăng nhập
                </span>
              </span>
            </Link>
          )}

          <Link
            href="/cart"
            aria-label={`Giỏ hàng${cartCount > 0 ? `, ${cartCount} sản phẩm` : ""}`}
            className="relative flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[var(--brand-red)] px-3 text-white transition-colors hover:bg-[var(--brand-red-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-navy)] px-1 text-[10px] font-black text-white shadow">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
            <span className="hidden text-xs font-semibold lg:block">
              Giỏ hàng
            </span>
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-navy)]/20 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Mở menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="hidden border-t border-slate-100 bg-slate-50/80 lg:block">
          <div className="mx-auto flex max-w-screen-xl items-center justify-center gap-5 px-4 py-1.5 text-xs text-slate-500 xl:gap-7">
            {trustBadges.map(({ Icon, label, color }, index) => (
              <React.Fragment key={label}>
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <Icon
                    aria-hidden="true"
                    size={13}
                    className={color}
                    strokeWidth={2.5}
                  />
                  {label}
                </span>
                {index < trustBadges.length - 1 && (
                  <span className="h-3 w-px bg-slate-300" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu điều hướng"
          className="fixed inset-0 z-[70] lg:hidden"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Đóng menu"
          />

          <aside className="animate-in slide-in-from-right absolute inset-y-0 right-0 flex w-[min(90vw,24rem)] flex-col bg-white shadow-2xl duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="relative h-9 w-9">
                  <Image
                    src="https://www.pngkey.com/png/full/519-5194869_pikachu-circle-png.png"
                    alt=""
                    fill
                    sizes="36px"
                    className="object-contain"
                  />
                </div>
                <span className="font-black tracking-tight text-[var(--brand-navy)]">
                  Cardgame<span className="text-[var(--brand-red)]">Center</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                aria-label="Đóng menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="scrollbar-hide flex-1 overflow-y-auto px-5 py-5">
              {isLoggedIn ? (
                <div className="mb-6 rounded-2xl bg-[var(--brand-navy)] p-4 text-white">
                  <p className="text-xs text-white/65">Đang đăng nhập</p>
                  <p className="mt-0.5 truncate font-bold">{userName}</p>
                  <Link
                    href="/account/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/85 hover:text-white"
                  >
                    Quản lý tài khoản
                    <ChevronRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="mb-6 grid grid-cols-2 gap-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700"
                  >
                    <CircleUser size={16} />
                    Đăng nhập
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-[var(--brand-red)] px-3 py-2.5 text-sm font-semibold text-white"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Mua sắm
              </p>
              <nav
                aria-label="Danh mục sản phẩm"
                className="grid grid-cols-2 gap-2"
              >
                {mobileShopItems.map(({ label, href, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="group rounded-2xl border border-slate-200 p-3 transition-colors hover:border-[var(--brand-red)]/30 hover:bg-red-50/40"
                  >
                    <Icon
                      size={18}
                      className="mb-3 text-[var(--brand-navy)] transition-colors group-hover:text-[var(--brand-red)]"
                    />
                    <span className="block text-sm font-semibold text-slate-800">
                      {label}
                    </span>
                  </Link>
                ))}
              </nav>

              <p className="mb-2 mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Thông tin & dịch vụ
              </p>
              <nav aria-label="Thông tin và dịch vụ" className="space-y-1">
                {mobileServiceItems.map(({ label, href, Icon }) => {
                  const active = isActive(href)
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-red-50 text-[var(--brand-red)]"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Icon size={17} className="text-slate-400" />
                      {label}
                    </Link>
                  )
                })}
              </nav>

              {isLoggedIn && (
                <>
                  <p className="mb-2 mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Tài khoản
                  </p>
                  <div className="space-y-1">
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        <LayoutDashboard size={17} className="text-slate-400" />
                        Trang quản trị
                      </Link>
                    )}
                    {accountMenuItems.map(({ label, href, Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        <Icon size={17} className="text-slate-400" />
                        {label}
                      </Link>
                    ))}
                    <button
                      type="button"
                      onClick={async () => {
                        await handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>

            <a
              href="tel:0985419095"
              className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-4"
            >
              <span>
                <span className="block text-xs text-slate-500">
                  Cần tư vấn nhanh?
                </span>
                <span className="block font-bold text-[var(--brand-navy)]">
                  0985 419 095
                </span>
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-red)] text-white">
                <Phone size={17} />
              </span>
            </a>
          </aside>
        </div>
      )}
    </>
  )
}
