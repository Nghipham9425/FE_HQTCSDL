"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getMyOrderDetail } from "@/lib/api/orders";
import type { OrderDetail } from "@/lib/types/order";

function formatPrice(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
}

export default function AccountOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = useMemo(() => Number(params?.id), [params]);

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!Number.isFinite(orderId) || orderId <= 0) {
        setError("Mã đơn hàng không hợp lệ.");
        setLoading(false);
        return;
      }

      try {
        const data = await getMyOrderDetail(orderId);
        if (!mounted) return;
        setOrder(data);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Không tải được chi tiết đơn hàng.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [orderId]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Chi tiết đơn hàng</h1>
        <Link
          href="/account/orders"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Quay lại danh sách đơn
        </Link>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">Đang tải chi tiết đơn...</div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">{error}</div>
      ) : !order ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">Không tìm thấy đơn hàng.</div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <p className="text-xs uppercase text-slate-500">Mã đơn</p>
                <p className="text-sm font-semibold text-slate-900">#{order.id}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Trạng thái</p>
                <p className="text-sm font-semibold text-slate-900">{order.orderStatus}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Ngày đặt</p>
                <p className="text-sm text-slate-900">{formatDate(order.orderDate)}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-slate-500">Địa chỉ nhận hàng</p>
                <p className="text-sm text-slate-900">{order.shippingAddress || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Số điện thoại nhận hàng</p>
                <p className="text-sm text-slate-900">{order.customerPhone || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Email đơn hàng</p>
                <p className="text-sm text-slate-900">{order.orderEmail || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Thanh toán</p>
                <p className="text-sm text-slate-900">{order.paymentMethodName || "COD"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Voucher</p>
                <p className="text-sm text-slate-900">{order.voucherCode || "Không có"}</p>
              </div>
            </div>

            {order.note ? (
              <div className="mt-4">
                <p className="text-xs uppercase text-slate-500">Ghi chú</p>
                <p className="text-sm text-slate-900">{order.note}</p>
              </div>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden grid-cols-12 gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase text-slate-500 md:grid">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-right">Đơn giá</div>
              <div className="col-span-2 text-center">SL</div>
              <div className="col-span-2 text-right">Thành tiền</div>
            </div>

            {order.items.map((item) => (
              <div key={`${item.productId}-${item.sku ?? ""}`} className="grid grid-cols-1 gap-2 border-b border-slate-100 px-4 py-4 last:border-b-0 md:grid-cols-12 md:items-center">
                <div className="md:col-span-6">
                  <p className="text-sm font-semibold text-slate-900">{item.productName}</p>
                  <p className="text-xs text-slate-500">SKU: {item.sku || "-"}</p>
                </div>
                <div className="md:col-span-2 md:text-right">
                  <p className="text-xs text-slate-500 md:hidden">Đơn giá</p>
                  <p className="text-sm text-slate-700">{formatPrice(item.unitPrice)}</p>
                </div>
                <div className="md:col-span-2 md:text-center">
                  <p className="text-xs text-slate-500 md:hidden">Số lượng</p>
                  <p className="text-sm text-slate-700">{item.quantity}</p>
                </div>
                <div className="md:col-span-2 md:text-right">
                  <p className="text-xs text-slate-500 md:hidden">Thành tiền</p>
                  <p className="text-sm font-semibold text-slate-900">{formatPrice(item.lineTotal)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="ml-auto w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:w-96">
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{formatPrice(order.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Giảm giá</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
                <span>Tổng thanh toán</span>
                <span className="text-(--brand-red)">{formatPrice(order.finalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
