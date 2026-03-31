"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import {
  Bell,
  Boxes,
  CreditCard,
  Gift,
  Package,
  Warehouse,
  LayoutDashboard,
  Menu,
  Moon,
  Shapes,
  UserCircle2,
  Sun,
  Tag,
  X,
  LogOut,
} from "lucide-react"
import { getStoredRole, logout } from "@/lib/api/auth"

type AdminShellProps = {
  children: React.ReactNode
}

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Sản phẩm", icon: Boxes },
  { href: "/admin/inventory", label: "Kho hàng", icon: Warehouse },
  { href: "/admin/orders", label: "Đơn hàng", icon: Package },
  { href: "/admin/categories", label: "Danh mục", icon: Shapes },
  { href: "/admin/tcg-cards", label: "TCG Cards", icon: Tag },
  { href: "/admin/tcg-sets", label: "TCG Sets", icon: Tag },
  { href: "/admin/vouchers", label: "Vouchers", icon: Gift },
  {
    href: "/admin/payment-methods",
    label: "Thanh toán",
    icon: CreditCard,
  },
]

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userName, setUserName] = useState("Admin User")
  const [userEmail, setUserEmail] = useState("admin@example.com")

  useEffect(() => {
    const stored = localStorage.getItem("admin-theme")
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches
    const isDark = stored ? stored === "dark" : prefersDark

    setDark(isDark)
    document.documentElement.classList.toggle("dark", isDark)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem("admin-theme", dark ? "dark" : "light")
  }, [dark])

  useEffect(() => {
    const storedName = localStorage.getItem("auth_user_name")
    const storedEmail = localStorage.getItem("auth_user_email")
    const accessToken = localStorage.getItem("auth_access_token")
    const role = getStoredRole()

    if (!accessToken) {
      window.location.href = "/auth/login"
      return
    }

    if (role?.toUpperCase() !== "ADMIN") {
      window.location.href = "/"
      return
    }

    if (storedName) setUserName(storedName)
    if (storedEmail) setUserEmail(storedEmail)
  }, [])

  const pageTitle = useMemo(() => {
    const found = navItems.find((item) => item.href === pathname)
    return found?.label ?? "Admin"
  }, [pathname])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white p-4 transition-transform dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/admin"
              className="text-2xl font-black tracking-tight text-indigo-600"
            >
              PhuTaiAdmin
            </Link>
            <button onClick={() => setOpen(false)} className="lg:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <div className="flex w-full flex-1 flex-col lg:pl-72">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
            <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  className="rounded-lg border border-slate-200 p-2 dark:border-slate-700 lg:hidden"
                  onClick={() => setOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </button>
                <h1 className="text-lg font-bold">{pageTitle}</h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDark((v) => !v)}
                  className="rounded-xl border border-slate-200 p-2 dark:border-slate-700"
                  aria-label="Toggle theme"
                >
                  {dark ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </button>

                <button
                  className="rounded-xl border border-slate-200 p-2 dark:border-slate-700"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1.5 text-left dark:border-slate-700"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                      <UserCircle2 className="h-5 w-5" />
                    </div>
                    <span className="hidden text-sm font-semibold sm:block">
                      {userName}
                    </span>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                      <div className="mb-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                        <p className="font-bold">{userName}</p>
                        <p className="text-sm text-slate-500">{userEmail}</p>
                      </div>

                      <button
                        onClick={async () => {
                          await logout()
                          window.location.href = "/auth/login"
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-[1400px] flex-1 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>

      {open && (
        <button
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        />
      )}
    </div>
  )
}
