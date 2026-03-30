import Link from "next/link"
import { getAdminDashboardStats } from "@/lib/api/admin"
import { Boxes, CreditCard, Gift, Shapes, Tag } from "lucide-react"

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats()

  const cards = [
    {
      label: "Products",
      value: stats.products,
      href: "/admin/products",
      icon: Boxes,
    },
    {
      label: "Categories",
      value: stats.categories,
      href: "/admin/categories",
      icon: Shapes,
    },
    {
      label: "TCG Cards",
      value: stats.tcgCards,
      href: "/admin/tcg-cards",
      icon: Tag,
    },
    {
      label: "TCG Sets",
      value: stats.tcgSets,
      href: "/admin/tcg-sets",
      icon: Tag,
    },
    {
      label: "Vouchers",
      value: stats.vouchers,
      href: "/admin/vouchers",
      icon: Gift,
    },
    {
      label: "Payment Methods",
      value: stats.paymentMethods,
      href: "/admin/payment-methods",
      icon: CreditCard,
    },
  ]

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white shadow-lg dark:border-indigo-800/60">
        <h2 className="text-2xl font-black">HQTCSDL Admin Dashboard</h2>
        <p className="mt-2 text-sm text-indigo-100">
          Quản lý dữ liệu cửa hàng theo mô hình CRUD, đồng bộ trực tiếp với .NET
          API.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                {card.label}
              </p>
              <p className="mt-1 text-3xl font-black tracking-tight">
                {card.value.toLocaleString("vi-VN")}
              </p>
              <p className="mt-2 text-xs font-semibold text-indigo-600 group-hover:text-indigo-500 dark:text-indigo-300">
                Open management page
              </p>
            </Link>
          )
        })}
      </section>
    </div>
  )
}
