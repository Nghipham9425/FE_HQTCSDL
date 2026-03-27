"use client";
import { useEffect, useMemo, useState } from "react";
import { Search, Package, Truck, CheckCircle2, Clock, ChevronRight, XCircle } from "lucide-react";
import Link from "next/link";
import { getMyOrderDetail, getMyOrders } from "@/lib/api/orders";
import type { OrderDetail, OrderListItem } from "@/lib/types/order";
import { useRouter, useSearchParams } from "next/navigation";

type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";

interface TrackingOrder {
  id: number;
  status: OrderStatus;
  createdAt: string;
  totalPrice: number;
  items: { name: string; qty: number; lineTotal: number }[];
  shippingAddress?: string | null;
  customerPhone?: string | null;
}

const STATUS_STEPS: { key: OrderStatus; label: string; icon: typeof Package }[] = [
  { key: "pending", label: "Chờ xác nhận", icon: Clock },
  { key: "confirmed", label: "Đã xác nhận", icon: CheckCircle2 },
  { key: "shipping", label: "Đang giao hàng", icon: Truck },
  { key: "delivered", label: "Đã nhận hàng", icon: Package },
  { key: "cancelled", label: "Đã hủy", icon: XCircle },
];

const STATUS_ORDER: OrderStatus[] = ["pending", "confirmed", "shipping", "delivered", "cancelled"];

function mapStatus(status: string): OrderStatus {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "pending";
    case "CONFIRMED":
      return "confirmed";
    case "SHIPPED":
      return "shipping";
    case "DONE":
      return "delivered";
    case "CANCELLED":
      return "cancelled";
    default:
      return "pending";
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
  };
}

function formatPrice(p: number) {
  return p.toLocaleString("vi-VN") + "đ";
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
}

function parseOrderId(raw: string): number | null {
  const digits = raw.replace(/\D+/g, "");
  if (!digits) return null;
  const parsed = Number(digits);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

function isUnauthorizedError(err: unknown) {
  if (!(err instanceof Error)) return false;
  const message = err.message.toLowerCase();
  return (
    message.includes("401") ||
    message.includes("unauthorized") ||
    message.includes("session expired")
  );
}

export default function TrackingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState<TrackingOrder | null | "not-found">(null);
  const [myOrders, setMyOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryOrderId = searchParams.get("orderId");

  async function loadOrderDetailById(id: number) {
    setLoading(true);
    try {
      const detail = await getMyOrderDetail(id);
      setResult(toTrackingOrder(detail));
    } catch (err) {
      if (isUnauthorizedError(err)) {
        router.push(`/auth/login?next=${encodeURIComponent("/tracking")}`);
        return;
      }
      setResult("not-found");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const orders = await getMyOrders();
        if (!mounted) return;
        setMyOrders(orders);
      } catch (err) {
        if (!mounted) return;
        if (isUnauthorizedError(err)) {
          router.push(`/auth/login?next=${encodeURIComponent("/tracking")}`);
          return;
        }
        setError(err instanceof Error ? err.message : "Không tải được đơn hàng");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!queryOrderId) return;
    const parsedId = parseOrderId(queryOrderId);
    if (!parsedId) return;

    setOrderId(String(parsedId));
    loadOrderDetailById(parsedId);
  }, [queryOrderId]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = orderId.trim();
    if (!trimmed) return;

    const parsedId = parseOrderId(trimmed);
    if (!parsedId) {
      setResult("not-found");
      return;
    }

    await loadOrderDetailById(parsedId);
  }

  const activeStepIndex = useMemo(
    () =>
    result && result !== "not-found"
        ? STATUS_ORDER.indexOf(result.status)
        : -1,
    [result]
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-[var(--brand-red)]">Trang chủ</Link>
        <ChevronRight size={14} />
        <span className="font-medium text-gray-800">Tra cứu đơn hàng</span>
      </nav>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Title */}
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-navy)] text-white">
            <Package size={28} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Tra cứu đơn hàng</h1>
          <p className="text-sm text-gray-500">
            Nhập mã đơn (ID số) để theo dõi tình trạng giao hàng của bạn.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Mã đơn hàng, ví dụ: 1025"
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[var(--brand-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]/20"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-[var(--brand-red)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--brand-red-dark)] transition-colors disabled:opacity-60"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Search size={16} />
            )}
            Tra cứu
          </button>
        </form>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}. Vui lòng đăng nhập để tra cứu đơn hàng của bạn.
          </div>
        ) : null}

        {!error && myOrders.length > 0 ? (
          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Đơn hàng gần đây</p>
            <div className="flex flex-wrap gap-2">
              {myOrders.slice(0, 6).map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => {
                    setOrderId(String(order.id));
                    loadOrderDetailById(order.id);
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                >
                  #{order.id}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Results */}
        {result === "not-found" && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
            Không tìm thấy đơn hàng với mã <strong>{orderId.trim()}</strong>. Vui lòng kiểm tra lại!
          </div>
        )}

        {result && result !== "not-found" && (
          <div className="mt-6 space-y-6">
            {/* Order info */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-gray-500">Mã đơn hàng</p>
                  <p className="font-extrabold text-[var(--brand-navy)]">#{result.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ngày đặt</p>
                  <p className="font-semibold text-gray-800">{formatDate(result.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tổng tiền</p>
                  <p className="font-bold text-[var(--brand-red)]">{formatPrice(result.totalPrice)}</p>
                </div>
              </div>

              {result.shippingAddress ? (
                <div className="mt-3 border-t border-gray-200 pt-3 text-sm text-gray-700">
                  <span className="font-semibold">Địa chỉ nhận:</span> {result.shippingAddress}
                </div>
              ) : null}

              {result.customerPhone ? (
                <div className="mt-2 text-sm text-gray-700">
                  <span className="font-semibold">SĐT nhận:</span> {result.customerPhone}
                </div>
              ) : null}

              {/* Items */}
              <div className="mt-3 border-t border-gray-200 pt-3">
                {result.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-700">
                    <span>{item.name} × {item.qty}</span>
                    <span className="font-medium">{formatPrice(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status progress */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-gray-700">Trạng thái đơn hàng</h3>
              <div className="relative">
                {/* Track line */}
                <div className="absolute left-5 top-5 h-[calc(100%-40px)] w-0.5 bg-gray-200" />
                <div
                  className="absolute left-5 top-5 w-0.5 bg-[var(--brand-red)] transition-all duration-500"
                  style={{
                    height: `calc((100% - 40px) * ${activeStepIndex / (STATUS_STEPS.length - 1)})`,
                  }}
                />

                <div className="space-y-6">
                  {STATUS_STEPS.map((step, i) => {
                    const done = i <= activeStepIndex;
                    const active = i === activeStepIndex;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex items-center gap-4">
                        <div
                          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                            active
                              ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white"
                              : done
                              ? "border-[var(--brand-red)] bg-red-50 text-[var(--brand-red)]"
                              : "border-gray-300 bg-white text-gray-400"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              active
                                ? "text-[var(--brand-red)]"
                                : done
                                ? "text-gray-800"
                                : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </p>
                          {active && (
                            <p className="text-xs text-gray-500">Đang xử lý...</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
