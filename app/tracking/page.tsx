"use client"

import Link from "next/link"
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react"
import Breadcrumb from "@/components/ui/Breadcrumb"
import { getMyOrderDetail, getMyOrders } from "@/lib/api/orders"
import type { OrderDetail, OrderListItem } from "@/lib/types/order"

type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled"

type TimelineStep = {
  key: OrderStatus
  label: string
  description: string
  icon: typeof Package
}

interface TrackingOrder {
  id: number
  status: OrderStatus
  createdAt: string
  totalPrice: number
  items: { name: string; qty: number; lineTotal: number }[]
  shippingAddress?: string | null
  customerPhone?: string | null
}

const FULFILLMENT_STEPS: TimelineStep[] = [
  {
    key: "pending",
    label: "Đã tiếp nhận",
    description: "Đơn hàng đã được ghi nhận và đang chờ cửa hàng xác nhận.",
    icon: Clock3,
  },
  {
    key: "confirmed",
    label: "Đã xác nhận",
    description: "Sản phẩm đang được kiểm tra và chuẩn bị để bàn giao.",
    icon: CheckCircle2,
  },
  {
    key: "shipping",
    label: "Đang giao hàng",
    description: "Đơn hàng đã rời cửa hàng và đang trên đường đến bạn.",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Giao thành công",
    description: "Đơn hàng đã được giao đến người nhận.",
    icon: PackageCheck,
  },
]

const CANCELLED_STEPS: TimelineStep[] = [
  FULFILLMENT_STEPS[0],
  {
    key: "cancelled",
    label: "Đơn hàng đã hủy",
    description: "Quy trình giao hàng đã dừng và đơn hàng không còn hiệu lực.",
    icon: XCircle,
  },
]

const STATUS_ORDER: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipping",
  "delivered",
]

const STATUS_META: Record<
  OrderStatus,
  { label: string; message: string; className: string }
> = {
  pending: {
    label: "Chờ xác nhận",
    message: "Cửa hàng đang kiểm tra thông tin và tồn kho của đơn hàng.",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
  confirmed: {
    label: "Đã xác nhận",
    message: "Đơn hàng đang được đóng gói để sẵn sàng giao đi.",
    className: "border-blue-200 bg-blue-50 text-blue-800",
  },
  shipping: {
    label: "Đang giao hàng",
    message: "Đơn hàng đang trên đường đến địa chỉ nhận hàng.",
    className: "border-indigo-200 bg-indigo-50 text-indigo-800",
  },
  delivered: {
    label: "Giao thành công",
    message: "Đơn hàng đã hoàn tất. Cảm ơn bạn đã mua sắm!",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  cancelled: {
    label: "Đã hủy",
    message: "Đơn hàng đã được hủy và sẽ không tiếp tục giao.",
    className: "border-rose-200 bg-rose-50 text-rose-800",
  },
}

function mapStatus(status: string): OrderStatus {
  switch (status.trim().toUpperCase()) {
    case "CONFIRMED":
      return "confirmed"
    case "SHIPPED":
    case "SHIPPING":
    case "DELIVERING":
      return "shipping"
    case "DONE":
    case "COMPLETED":
    case "DELIVERED":
      return "delivered"
    case "CANCELLED":
    case "CANCELED":
      return "cancelled"
    default:
      return "pending"
  }
}

function toTrackingOrder(detail: OrderDetail): TrackingOrder {
  return {
    id: detail.id,
    status: mapStatus(detail.orderStatus),
    createdAt: detail.orderDate,
    totalPrice: detail.finalAmount,
    shippingAddress: detail.shippingAddress,
    customerPhone: detail.customerPhone,
    items: detail.items.map((item) => ({
      name: item.productName,
      qty: item.quantity,
      lineTotal: item.lineTotal,
    })),
  }
}

function formatPrice(value: number) {
  return `${value.toLocaleString("vi-VN")}₫`
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

function parseOrderId(raw: string): number | null {
  const normalized = raw.trim().replace(/^#/, "")
  if (!/^\d+$/.test(normalized)) return null

  const parsed = Number(normalized)
  if (!Number.isSafeInteger(parsed) || parsed <= 0) return null
  return parsed
}

function isUnauthorizedError(error: unknown) {
  if (!(error instanceof Error)) return false
  const message = error.message.toLowerCase()
  return (
    message.includes("401") ||
    message.includes("unauthorized") ||
    message.includes("session expired")
  )
}

function OrderTimeline({ order }: { order: TrackingOrder }) {
  const cancelled = order.status === "cancelled"
  const steps = cancelled ? CANCELLED_STEPS : FULFILLMENT_STEPS
  const activeIndex = cancelled ? 1 : STATUS_ORDER.indexOf(order.status)

  return (
    <section
      aria-labelledby="order-timeline-title"
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-red)]">
            Tiến trình giao hàng
          </p>
          <h2
            id="order-timeline-title"
            className="mt-1 text-xl font-bold text-slate-950"
          >
            Trạng thái đơn hàng
          </h2>
        </div>
        <span
          className={`rounded-full border px-3 py-1.5 text-xs font-bold ${STATUS_META[order.status].className}`}
        >
          {STATUS_META[order.status].label}
        </span>
      </div>

      <div className="mb-6 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        {STATUS_META[order.status].message}
      </div>

      <ol>
        {steps.map((step, index) => {
          const isComplete = index < activeIndex
          const isCurrent = index === activeIndex
          const isWaiting = index > activeIndex
          const Icon = step.icon
          const accentClass = cancelled
            ? "border-rose-500 bg-rose-500 text-white"
            : "border-[var(--brand-navy)] bg-[var(--brand-navy)] text-white"
          const completedLineClass = cancelled
            ? "bg-rose-400"
            : "bg-emerald-500"

          return (
            <li key={step.key} className="flex gap-4">
              <div className="flex w-11 shrink-0 flex-col items-center">
                <div
                  className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 transition ${
                    isCurrent
                      ? accentClass
                      : isComplete
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                {index < steps.length - 1 ? (
                  <div
                    className={`min-h-16 w-0.5 flex-1 ${
                      index < activeIndex
                        ? completedLineClass
                        : "bg-slate-200"
                    }`}
                  />
                ) : null}
              </div>

              <div className="min-w-0 pb-7 pt-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={`text-sm font-bold ${
                      isWaiting ? "text-slate-400" : "text-slate-900"
                    }`}
                  >
                    {step.label}
                  </h3>
                  {isCurrent ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        cancelled
                          ? "bg-rose-100 text-rose-700"
                          : "bg-blue-100 text-[var(--brand-navy)]"
                      }`}
                    >
                      Hiện tại
                    </span>
                  ) : null}
                </div>
                <p
                  className={`mt-1 max-w-xl text-sm leading-6 ${
                    isWaiting ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {step.description}
                </p>
                {index === 0 ? (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Đặt lúc {formatDate(order.createdAt)}
                  </p>
                ) : null}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function TrackingPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryOrderId = searchParams.get("orderId")

  const [orderId, setOrderId] = useState("")
  const [result, setResult] = useState<TrackingOrder | null | "not-found">(
    null,
  )
  const [myOrders, setMyOrders] = useState<OrderListItem[]>([])
  const [loadingOrder, setLoadingOrder] = useState(false)
  const [loadingRecent, setLoadingRecent] = useState(true)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [recentError, setRecentError] = useState<string | null>(null)

  const redirectToLogin = useCallback(() => {
    const nextPath = queryOrderId
      ? `/tracking?orderId=${encodeURIComponent(queryOrderId)}`
      : "/tracking"
    router.push(`/auth/login?next=${encodeURIComponent(nextPath)}`)
  }, [queryOrderId, router])

  const loadOrderDetailById = useCallback(
    async (id: number) => {
      setLoadingOrder(true)
      setValidationError(null)
      try {
        const detail = await getMyOrderDetail(id)
        setResult(toTrackingOrder(detail))
      } catch (error) {
        if (isUnauthorizedError(error)) {
          redirectToLogin()
          return
        }
        setResult("not-found")
      } finally {
        setLoadingOrder(false)
      }
    },
    [redirectToLogin],
  )

  useEffect(() => {
    let active = true

    async function loadRecentOrders() {
      try {
        const orders = await getMyOrders()
        if (!active) return
        setMyOrders(
          [...orders].sort(
            (a, b) =>
              new Date(b.orderDate).getTime() -
              new Date(a.orderDate).getTime(),
          ),
        )
      } catch (error) {
        if (!active) return
        if (isUnauthorizedError(error)) {
          redirectToLogin()
          return
        }
        setRecentError("Không thể tải danh sách đơn hàng gần đây.")
      } finally {
        if (active) setLoadingRecent(false)
      }
    }

    void loadRecentOrders()
    return () => {
      active = false
    }
  }, [redirectToLogin])

  useEffect(() => {
    if (!queryOrderId) return

    const parsedId = parseOrderId(queryOrderId)
    setOrderId(queryOrderId)
    if (!parsedId) {
      setValidationError("Mã đơn hàng không hợp lệ.")
      setResult(null)
      return
    }

    void loadOrderDetailById(parsedId)
  }, [loadOrderDetailById, queryOrderId])

  function openOrder(id: number) {
    const idString = String(id)
    setOrderId(idString)
    setValidationError(null)

    if (queryOrderId === idString) {
      void loadOrderDetailById(id)
      return
    }

    router.replace(`/tracking?orderId=${id}`, { scroll: false })
  }

  function handleSearch(event: React.FormEvent) {
    event.preventDefault()
    const parsedId = parseOrderId(orderId)

    if (!parsedId) {
      setValidationError(
        "Vui lòng nhập mã đơn hợp lệ, ví dụ: 1025 hoặc #1025.",
      )
      setResult(null)
      return
    }

    openOrder(parsedId)
  }

  const currentStatus = useMemo(
    () =>
      result && result !== "not-found"
        ? STATUS_META[result.status]
        : null,
    [result],
  )

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <Breadcrumb
        items={[{ label: "Theo dõi đơn hàng" }]}
        className="mb-6"
      />

      <section className="relative overflow-hidden rounded-3xl bg-[var(--brand-navy)] px-5 py-8 text-white sm:px-8 sm:py-10 lg:px-10">
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-white/8" />
        <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-[var(--brand-red)]/25" />
        <div className="relative max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
            Chủ động theo dõi
          </p>
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Đơn hàng của bạn đang ở đâu?
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
            Nhập mã đơn để xem rõ từng chặng từ lúc tiếp nhận đến khi giao
            hàng thành công.
          </p>
        </div>
      </section>

      <form
        onSubmit={handleSearch}
        className="relative mx-3 -mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:mx-6 sm:-mt-5 sm:flex-row sm:p-5 lg:mx-10"
      >
        <label className="min-w-0 flex-1">
          <span className="sr-only">Mã đơn hàng</span>
          <span className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-300 px-4 transition focus-within:border-[var(--brand-navy)] focus-within:ring-2 focus-within:ring-blue-100">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="Nhập mã đơn, ví dụ #1025"
              inputMode="numeric"
              className="min-w-0 flex-1 bg-transparent py-3 text-sm font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
            />
          </span>
        </label>
        <button
          type="submit"
          disabled={loadingOrder}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--brand-red)] px-6 text-sm font-bold text-white transition hover:bg-[var(--brand-red-dark)] disabled:cursor-wait disabled:opacity-70"
        >
          {loadingOrder ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          {loadingOrder ? "Đang tra cứu" : "Tra cứu đơn"}
        </button>
      </form>

      {validationError ? (
        <p
          role="alert"
          className="mx-3 mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 sm:mx-6 lg:mx-10"
        >
          {validationError}
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          {loadingOrder ? (
            <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
              <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-52 animate-pulse rounded-2xl bg-slate-100" />
            </div>
          ) : result === "not-found" ? (
            <div className="rounded-3xl border border-rose-200 bg-white px-6 py-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <Package className="h-7 w-7" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">
                Không tìm thấy đơn hàng
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Không có đơn hàng nào khớp với mã{" "}
                <strong className="text-slate-800">
                  #{parseOrderId(orderId) ?? orderId.trim()}
                </strong>
                . Hãy kiểm tra lại mã trong email xác nhận.
              </p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Mã đơn hàng
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold text-[var(--brand-navy)]">
                      #{result.id}
                    </h2>
                  </div>
                  {currentStatus ? (
                    <span
                      className={`rounded-full border px-3 py-1.5 text-xs font-bold ${currentStatus.className}`}
                    >
                      {currentStatus.label}
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-3.5">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Ngày đặt
                    </p>
                    <p className="mt-1.5 text-sm font-bold text-slate-800">
                      {formatDate(result.createdAt)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3.5">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Sản phẩm
                    </p>
                    <p className="mt-1.5 text-sm font-bold text-slate-800">
                      {result.items.reduce((sum, item) => sum + item.qty, 0)}{" "}
                      sản phẩm
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3.5">
                    <p className="text-xs font-semibold text-slate-500">
                      Tổng thanh toán
                    </p>
                    <p className="mt-1.5 text-sm font-extrabold text-[var(--brand-red)]">
                      {formatPrice(result.totalPrice)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
                  <p className="flex items-start gap-2 text-sm leading-6 text-slate-600">
                    <MapPin className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                    <span>
                      <strong className="block text-slate-800">
                        Địa chỉ nhận hàng
                      </strong>
                      {result.shippingAddress || "Chưa có thông tin"}
                    </span>
                  </p>
                  <p className="flex items-start gap-2 text-sm leading-6 text-slate-600">
                    <Phone className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                    <span>
                      <strong className="block text-slate-800">
                        Số điện thoại
                      </strong>
                      {result.customerPhone || "Chưa có thông tin"}
                    </span>
                  </p>
                </div>
              </section>

              <OrderTimeline order={result} />

              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                  <h2 className="font-bold text-slate-900">
                    Sản phẩm trong đơn
                  </h2>
                  <Link
                    href={`/account/orders/${result.id}`}
                    className="text-xs font-bold text-[var(--brand-red)] hover:underline"
                  >
                    Xem chi tiết
                  </Link>
                </div>
                <div className="divide-y divide-slate-100">
                  {result.items.map((item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Số lượng: {item.qty}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-slate-800">
                        {formatPrice(item.lineTotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[var(--brand-navy)]">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Theo dõi rõ từng chặng
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Timeline giúp bạn biết đơn đang chờ xác nhận, được chuẩn
                    bị, đang giao hay đã hoàn tất.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {FULFILLMENT_STEPS.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div
                      key={step.key}
                      className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[var(--brand-navy)] shadow-sm">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="text-sm font-semibold text-slate-700">
                        {index + 1}. {step.label}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>

        <aside className="self-start rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Tài khoản của bạn
              </p>
              <h2 className="mt-1 font-bold text-slate-900">
                Đơn hàng gần đây
              </h2>
            </div>
            <Package className="h-5 w-5 text-[var(--brand-red)]" />
          </div>

          {loadingRecent ? (
            <div className="space-y-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          ) : recentError ? (
            <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
              {recentError}
            </p>
          ) : myOrders.length > 0 ? (
            <div className="space-y-2">
              {myOrders.slice(0, 6).map((order) => {
                const status = STATUS_META[mapStatus(order.orderStatus)]
                const isSelected =
                  result !== "not-found" &&
                  result?.id === order.id

                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => openOrder(order.id)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      isSelected
                        ? "border-[var(--brand-navy)] bg-blue-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <strong className="text-sm text-slate-900">
                        #{order.id}
                      </strong>
                      <span className="text-xs font-bold text-[var(--brand-red)]">
                        {formatPrice(order.finalAmount)}
                      </span>
                    </span>
                    <span className="mt-1.5 flex items-center justify-between gap-2 text-xs">
                      <span className="text-slate-500">
                        {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                      </span>
                      <span className="font-semibold text-slate-600">
                        {status.label}
                      </span>
                    </span>
                  </button>
                )
              })}
              <Link
                href="/account/orders"
                className="mt-3 flex min-h-11 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
              >
                Xem tất cả đơn hàng
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <ShoppingBag className="mx-auto h-6 w-6 text-slate-400" />
              <p className="mt-2 text-sm font-semibold text-slate-700">
                Chưa có đơn hàng
              </p>
              <Link
                href="/products"
                className="mt-1 inline-block text-xs font-bold text-[var(--brand-red)] hover:underline"
              >
                Bắt đầu mua sắm
              </Link>
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-5 w-44 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 h-80 animate-pulse rounded-3xl bg-slate-100" />
        </main>
      }
    >
      <TrackingPageContent />
    </Suspense>
  )
}
