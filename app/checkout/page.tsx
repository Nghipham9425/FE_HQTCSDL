"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useCartStore } from "@/lib/stores/cartStore";
import { placeOrder } from "@/lib/api/orders";
import { getAccessToken } from "@/lib/api/auth";

function formatPrice(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
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

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCartStore();

  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderEmail, setOrderEmail] = useState("");
  const [note, setNote] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCheckout = items.length > 0;

  const lineItems = useMemo(
    () =>
      items
        .map((item) => ({
          productId: Number(item.product.id),
          quantity: item.quantity,
          name: item.product.name,
          price: item.product.price ?? 0,
        }))
        .filter((item) => Number.isFinite(item.productId) && item.productId > 0 && item.quantity > 0),
    [items]
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!canCheckout) {
      setError("Giỏ hàng đang trống.");
      return;
    }

    if (!shippingAddress.trim()) {
      setError("Vui lòng nhập địa chỉ nhận hàng.");
      return;
    }

    if (!phoneNumber.trim()) {
      setError("Vui lòng nhập số điện thoại nhận hàng.");
      return;
    }

    if (lineItems.length === 0) {
      setError("Không có sản phẩm hợp lệ để đặt hàng.");
      return;
    }

    if (!getAccessToken()) {
      router.push(`/auth/login?next=${encodeURIComponent("/checkout")}`);
      return;
    }

    setLoading(true);

    try {
      const order = await placeOrder({
        shippingAddress: shippingAddress.trim(),
        phoneNumber: phoneNumber.trim(),
        orderEmail: orderEmail.trim() || undefined,
        note: note.trim() || undefined,
        voucherCode: voucherCode.trim() || undefined,
        items: lineItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      clearCart();
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        router.push(`/auth/login?next=${encodeURIComponent("/checkout")}`);
        return;
      }
      setError(err instanceof Error ? err.message : "Đặt hàng thất bại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-(--brand-red)">Trang chủ</Link>
        <ChevronRight size={14} />
        <Link href="/cart" className="hover:text-(--brand-red)">Giỏ hàng</Link>
        <ChevronRight size={14} />
        <span className="font-medium text-gray-800">Thanh toán</span>
      </nav>

      <h1 className="mb-6 text-2xl font-extrabold text-gray-900">Thanh toán</h1>

      {!canCheckout ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-600">Giỏ hàng của bạn đang trống.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex rounded-xl bg-(--brand-red) px-4 py-2 text-sm font-semibold text-white hover:bg-(--brand-red-dark)"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2"
          >
            <h2 className="text-lg font-bold text-gray-900">Thông tin nhận hàng</h2>

            <label className="block text-sm">
              <div className="mb-1 font-medium">Địa chỉ nhận hàng</div>
              <textarea
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="min-h-24 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-(--brand-navy) focus:outline-none focus:ring-2 focus:ring-(--brand-navy)/20"
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              />
            </label>

            <label className="block text-sm">
              <div className="mb-1 font-medium">Số điện thoại nhận hàng</div>
              <input
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-(--brand-navy) focus:outline-none focus:ring-2 focus:ring-(--brand-navy)/20"
                placeholder="Ví dụ: 0901234567"
              />
            </label>

            <label className="block text-sm">
              <div className="mb-1 font-medium">Email nhận hóa đơn (tuỳ chọn)</div>
              <input
                type="email"
                value={orderEmail}
                onChange={(e) => setOrderEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-(--brand-navy) focus:outline-none focus:ring-2 focus:ring-(--brand-navy)/20"
                placeholder="you@example.com"
              />
            </label>

            <label className="block text-sm">
              <div className="mb-1 font-medium">Mã voucher (tuỳ chọn)</div>
              <input
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-(--brand-navy) focus:outline-none focus:ring-2 focus:ring-(--brand-navy)/20"
                placeholder="VD: SALE10"
              />
            </label>

            <label className="block text-sm">
              <div className="mb-1 font-medium">Ghi chú đơn hàng (tuỳ chọn)</div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-20 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-(--brand-navy) focus:outline-none focus:ring-2 focus:ring-(--brand-navy)/20"
                placeholder="Ví dụ: giao giờ hành chính"
              />
            </label>

            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Phương thức thanh toán hiện tại: COD (Thanh toán khi nhận hàng).
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <button
                disabled={loading}
                className="rounded-xl bg-(--brand-red) px-5 py-2.5 text-sm font-semibold text-white hover:bg-(--brand-red-dark) disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Đang đặt hàng..." : "Đặt hàng"}
              </button>

              <Link
                href="/cart"
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Quay lại giỏ hàng
              </Link>
            </div>
          </form>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-extrabold text-gray-800">Tóm tắt đơn</h2>
            <div className="space-y-2 text-sm text-gray-700">
              {lineItems.map((item) => (
                <div key={item.productId} className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
              <hr className="my-3 border-gray-200" />
              <div className="flex justify-between">
                <span>Tạm tính ({totalItems()} SP)</span>
                <span className="font-medium">{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between">
                <span>Vận chuyển</span>
                <span className="font-medium text-green-600">Miễn phí</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-gray-900">
                <span>Tổng cộng</span>
                <span className="text-(--brand-red)">{formatPrice(totalPrice())}</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}