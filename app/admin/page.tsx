import Link from "next/link"
import { getAdminDashboardStats, getRevenueStats, getInventoryStats } from "@/lib/api/admin"
import { Boxes, CreditCard, Gift, Shapes, Tag, Package, TrendingUp, ShoppingCart, AlertTriangle } from "lucide-react"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value)
}

export default async function AdminDashboardPage() {
  const [stats, revenueStats, inventoryStats] = await Promise.all([
    getAdminDashboardStats(),
    getRevenueStats().catch(() => null),
    getInventoryStats(10, true).catch(() => null),
  ])

  const cards = [
    {
      label: "Sản phẩm",
      value: stats.products,
      href: "/admin/products",
      icon: Boxes,
    },
    {
      label: "Danh mục",
      value: stats.categories,
      href: "/admin/categories",
      icon: Shapes,
    },
    {
      label: "Kho hàng",
      value: inventoryStats?.items.length ?? 0,
      href: "/admin/inventory",
      icon: Package,
      highlight: (inventoryStats?.items.length ?? 0) > 0,
      subLabel: "sản phẩm sắp hết",
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
      label: "PT Thanh toán",
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

      {/* Revenue Stats */}
      {revenueStats && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Thống kê doanh thu (30 ngày gần nhất)
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
              <p className="text-sm text-green-700 dark:text-green-300">Tổng doanh thu</p>
              <p className="mt-1 text-2xl font-bold text-green-800 dark:text-green-200">
                {formatCurrency(revenueStats.totalRevenue)}
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-sm text-blue-700 dark:text-blue-300">Tổng đơn hàng</p>
              <p className="mt-1 text-2xl font-bold text-blue-800 dark:text-blue-200">
                {revenueStats.totalOrders.toLocaleString("vi-VN")}
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-4 dark:bg-purple-900/20">
              <p className="text-sm text-purple-700 dark:text-purple-300">Tổng SP bán ra</p>
              <p className="mt-1 text-2xl font-bold text-purple-800 dark:text-purple-200">
                {revenueStats.totalItems.toLocaleString("vi-VN")}
              </p>
            </div>
            <div className="rounded-xl bg-orange-50 p-4 dark:bg-orange-900/20">
              <p className="text-sm text-orange-700 dark:text-orange-300">TB/đơn hàng</p>
              <p className="mt-1 text-2xl font-bold text-orange-800 dark:text-orange-200">
                {formatCurrency(revenueStats.avgOrderValue)}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Low Stock Warning */}
      {inventoryStats && inventoryStats.items.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-amber-800 dark:text-amber-200">
            <AlertTriangle className="h-5 w-5" />
            Cảnh báo: {inventoryStats.items.length} sản phẩm sắp hết hàng
          </h3>
          <div className="max-h-40 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-amber-700 dark:text-amber-300">
                  <th className="pb-2">SKU</th>
                  <th className="pb-2">Tên sản phẩm</th>
                  <th className="pb-2 text-right">Còn lại</th>
                </tr>
              </thead>
              <tbody className="text-amber-900 dark:text-amber-100">
                {inventoryStats.items.slice(0, 5).map((item) => (
                  <tr key={item.productId} className="border-t border-amber-200 dark:border-amber-700">
                    <td className="py-2 font-mono text-xs">{item.sku}</td>
                    <td className="py-2">{item.productName}</td>
                    <td className="py-2 text-right font-bold">{item.availableQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link
            href="/admin/inventory"
            className="mt-3 inline-block text-sm font-semibold text-amber-700 hover:text-amber-900 dark:text-amber-300"
          >
            Xem tất cả kho hàng →
          </Link>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className={`group rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                card.highlight
                  ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20"
                  : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              }`}
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
                card.highlight
                  ? "bg-amber-200 text-amber-700 dark:bg-amber-700 dark:text-amber-200"
                  : "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                {card.label}
              </p>
              <p className="mt-1 text-3xl font-black tracking-tight">
                {card.value.toLocaleString("vi-VN")}
              </p>
              {card.subLabel && (
                <p className="text-xs text-amber-600 dark:text-amber-400">{card.subLabel}</p>
              )}
              <p className="mt-2 text-xs font-semibold text-indigo-600 group-hover:text-indigo-500 dark:text-indigo-300">
                Quản lý →
              </p>
            </Link>
          )
        })}
      </section>
    </div>
  )
}
