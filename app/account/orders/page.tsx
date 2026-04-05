"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { cancelMyOrder, getMyOrders } from "@/lib/api/orders"
import type { OrderListItem } from "@/lib/types/order"

function formatPrice(value: number) {
  return value.toLocaleString("vi-VN") + "đ"
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString("vi-VN")
}

function statusClass(status: string) {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "bg-amber-100 text-amber-800"
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800"
    case "SHIPPED":
      return "bg-indigo-100 text-indigo-800"
    case "DONE":
      return "bg-green-100 text-green-800"
    case "CANCELLED":
      return "bg-rose-100 text-rose-800"
    default:
      return "bg-slate-100 text-slate-700"
  }
}

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const data = await getMyOrders()
        if (!mounted) return
        setOrders(data)
      } catch (err) {
        if (!mounted) return
        setError(
          err instanceof Error
            ? err.message
            : "Không tải được danh sách đơn hàng.",
        )
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  async function onCancelOrder(orderId: number) {
    const confirmed = window.confirm("Bạn có chắc muốn hủy đơn này không?")
    if (!confirmed) return

    setCancellingId(orderId)
    setError(null)

    try {
      await cancelMyOrder(orderId)
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                orderStatus: "CANCELLED",
              }
            : o,
        ),
      )
      toast.success("Hủy đơn hàng thành công")
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể hủy đơn hàng."
      setError(message)
      toast.error(message)
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Đơn hàng của tôi</h1>
        <Link
          href="/products"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Tiếp tục mua sắm
        </Link>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          Đang tải đơn hàng...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          Bạn chưa có đơn hàng nào.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden grid-cols-12 gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase text-slate-500 md:grid">
            <div className="col-span-2">Mã đơn</div>
            <div className="col-span-2">Ngày đặt</div>
            <div className="col-span-2 text-center">Trạng thái</div>
            <div className="col-span-2 text-center">Số SP</div>
            <div className="col-span-2 text-right">Tổng tiền</div>
            <div className="col-span-2 text-right">Thao tác</div>
          </div>

          {orders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-1 gap-2 border-b border-slate-100 px-4 py-4 last:border-b-0 md:grid-cols-12 md:items-center"
            >
              <div className="md:col-span-2">
                <p className="text-xs text-slate-500 md:hidden">Mã đơn</p>
                <p className="text-sm font-semibold text-slate-900">
                  #{order.id}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs text-slate-500 md:hidden">Ngày đặt</p>
                <p className="text-sm text-slate-700">
                  {formatDate(order.orderDate)}
                </p>
              </div>

              <div className="md:col-span-2 md:text-center">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(order.orderStatus)}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="md:col-span-2 md:text-center">
                <p className="text-xs text-slate-500 md:hidden">Số sản phẩm</p>
                <p className="text-sm text-slate-700">{order.itemCount}</p>
              </div>

              <div className="md:col-span-2 md:text-right">
                <p className="text-xs text-slate-500 md:hidden">Tổng tiền</p>
                <p className="text-sm font-semibold text-(--brand-red)">
                  {formatPrice(order.finalAmount)}
                </p>
              </div>

              <div className="md:col-span-2 md:text-right">
                <div className="flex justify-start gap-2 md:justify-end">
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Xem chi tiết
                  </Link>
                  {order.orderStatus.toUpperCase() === "PENDING" ? (
                    <button
                      type="button"
                      onClick={() => onCancelOrder(order.id)}
                      disabled={cancellingId === order.id}
                      className="inline-flex rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {cancellingId === order.id ? "Đang hủy..." : "Hủy đơn"}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
