"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { AdminDashboardStats } from "@/lib/types/admin"
import type { InventoryStatsResponse, RevenueStats } from "@/lib/api/admin"

type AdminDashboardChartsProps = {
  stats: AdminDashboardStats
  revenueStats: RevenueStats | null
  inventoryStats: InventoryStatsResponse | null
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}

function toSafeNumber(value: unknown): number {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

export default function AdminDashboardCharts({
  stats,
  revenueStats,
  inventoryStats,
}: AdminDashboardChartsProps) {
  const catalogData = [
    { name: "Sản phẩm", value: stats.products },
    { name: "Danh mục", value: stats.categories },
    { name: "TCG Cards", value: stats.tcgCards },
    { name: "TCG Sets", value: stats.tcgSets },
    { name: "Voucher", value: stats.vouchers },
    { name: "PT thanh toán", value: stats.paymentMethods },
  ]

  const revenueData = revenueStats
    ? [
        { label: "Doanh thu", value: revenueStats.totalRevenue },
        { label: "Đơn hàng", value: revenueStats.totalOrders },
        { label: "Sản phẩm", value: revenueStats.totalItems },
        { label: "TB/đơn", value: revenueStats.avgOrderValue },
      ]
    : []

  const stockData = [
    {
      name: "Sắp hết hàng",
      value: inventoryStats?.items.length ?? 0,
      color: "#f97316",
    },
    {
      name: "Ổn định",
      value: Math.max((stats.products ?? 0) - (inventoryStats?.items.length ?? 0), 0),
      color: "#22c55e",
    },
  ]

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold">Phân bố danh mục dữ liệu</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={catalogData} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => toSafeNumber(value).toLocaleString("vi-VN")} />
              <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold">Tình trạng tồn kho</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stockData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {stockData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => toSafeNumber(value).toLocaleString("vi-VN")} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </article>

      {revenueStats && (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <h3 className="mb-4 text-base font-bold">Tổng quan doanh thu</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value) => value.toLocaleString("vi-VN")} />
                <Tooltip
                  formatter={(value, _name, item) => {
                    const numericValue = toSafeNumber(value)
                    const label = item?.payload?.label as string | undefined
                    if (label === "Doanh thu" || label === "TB/đơn") {
                      return formatCurrency(numericValue)
                    }
                    return numericValue.toLocaleString("vi-VN")
                  }}
                />
                <Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      )}
    </section>
  )
}
