"use client";
import { useState } from "react";
import { Search, Package, Truck, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered";

interface FakeOrder {
  id: string;
  status: OrderStatus;
  createdAt: string;
  customerName: string;
  totalPrice: number;
  items: { name: string; qty: number; price: number }[];
  estimatedDelivery: string;
}

const STATUS_STEPS: { key: OrderStatus; label: string; icon: typeof Package }[] = [
  { key: "pending", label: "Chờ xác nhận", icon: Clock },
  { key: "confirmed", label: "Đã xác nhận", icon: CheckCircle2 },
  { key: "shipping", label: "Đang giao hàng", icon: Truck },
  { key: "delivered", label: "Đã nhận hàng", icon: Package },
];

const STATUS_ORDER: OrderStatus[] = ["pending", "confirmed", "shipping", "delivered"];

// Mock orders for demo
const MOCK_ORDERS: Record<string, FakeOrder> = {
  "BMG-001234": {
    id: "BMG-001234",
    status: "shipping",
    createdAt: "10/03/2026",
    customerName: "Nguyễn Văn A",
    totalPrice: 1850000,
    items: [{ name: "Đĩa game PS5 Ghost of Yotei", qty: 1, price: 1850000 }],
    estimatedDelivery: "11/03/2026",
  },
  "BMG-005678": {
    id: "BMG-005678",
    status: "delivered",
    createdAt: "05/03/2026",
    customerName: "Trần Thị B",
    totalPrice: 750000,
    items: [{ name: "Pokémon TCG: Mega Evolution Booster Box", qty: 1, price: 750000 }],
    estimatedDelivery: "07/03/2026",
  },
};

function formatPrice(p: number) {
  return p.toLocaleString("vi-VN") + "đ";
}

export default function TrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState<FakeOrder | null | "not-found">(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = orderId.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const order = MOCK_ORDERS[trimmed] ?? "not-found";
    setResult(order);
    setLoading(false);
  }

  const activeStepIndex =
    result && result !== "not-found"
      ? STATUS_ORDER.indexOf(result.status)
      : -1;

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
            Nhập mã đơn hàng để theo dõi tình trạng giao hàng của bạn.<br />
            <span className="text-xs text-gray-400">(Demo: thử BMG-001234 hoặc BMG-005678)</span>
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Mã đơn hàng, ví dụ: BMG-001234"
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

        {/* Results */}
        {result === "not-found" && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
            Không tìm thấy đơn hàng với mã <strong>{orderId.trim().toUpperCase()}</strong>. Vui lòng kiểm tra lại!
          </div>
        )}

        {result && result !== "not-found" && (
          <div className="mt-6 space-y-6">
            {/* Order info */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-gray-500">Mã đơn hàng</p>
                  <p className="font-extrabold text-[var(--brand-navy)]">{result.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ngày đặt</p>
                  <p className="font-semibold text-gray-800">{result.createdAt}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Dự kiến giao</p>
                  <p className="font-semibold text-gray-800">{result.estimatedDelivery}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tổng tiền</p>
                  <p className="font-bold text-[var(--brand-red)]">{formatPrice(result.totalPrice)}</p>
                </div>
              </div>

              {/* Items */}
              <div className="mt-3 border-t border-gray-200 pt-3">
                {result.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-700">
                    <span>{item.name} × {item.qty}</span>
                    <span className="font-medium">{formatPrice(item.price)}</span>
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
