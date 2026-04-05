"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getOrderById, updateOrderStatus } from "@/lib/api/admin";
import type { AdminOrderDetail } from "@/lib/types/admin";

const statusOptions = ["PENDING", "CONFIRMED", "SHIPPED", "DONE", "CANCELLED"] as const;

function formatPrice(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
}

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = useMemo(() => Number(params.id), [params]);

  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [status, setStatus] = useState<string>("PENDING");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canChooseCancelled = useMemo(() => {
    const current = order?.orderStatus?.toUpperCase();
    return current === "PENDING";
  }, [order?.orderStatus]);

  useEffect(() => {
    if (!Number.isFinite(id) || id <= 0) {
      setError("Invalid order id");
      return;
    }

    setLoading(true);
    setError(null);

    getOrderById(id)
      .then((detail) => {
        setOrder(detail);
        setStatus(detail.orderStatus);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Load failed"))
      .finally(() => setLoading(false));
  }, [id]);

  async function onSaveStatus() {
    if (!order) return;

    setSaving(true);
    setError(null);

    try {
      const updated = await updateOrderStatus(order.id, status);
      setOrder(updated);
      setStatus(updated.orderStatus);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update status failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-5">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
        {error ?? "Order not found"}
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-black text-slate-900">Order #{order.id}</h1>
        <Link
          href="/admin/orders"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back to orders
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs uppercase text-slate-500">Customer</p>
            <p className="text-sm font-semibold text-slate-900">{order.customerName ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Email</p>
            <p className="text-sm text-slate-900">{order.customerEmail ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Phone</p>
            <p className="text-sm text-slate-900">{order.customerPhone ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Order date</p>
            <p className="text-sm text-slate-900">{formatDate(order.orderDate)}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs uppercase text-slate-500">Shipping address</p>
            <p className="text-sm text-slate-900">{order.shippingAddress ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Order email</p>
            <p className="text-sm text-slate-900">{order.orderEmail ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Payment</p>
            <p className="text-sm text-slate-900">{order.paymentMethodName ?? "COD"}</p>
          </div>
        </div>

        {order.note ? (
          <div className="mt-4 border-t border-slate-200 pt-3">
            <p className="text-xs uppercase text-slate-500">Note</p>
            <p className="text-sm text-slate-900">{order.note}</p>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-end gap-2 border-t border-slate-200 pt-3">
          <label className="text-sm">
            <div className="mb-1 font-medium">Order status</div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            >
              {statusOptions.map((opt) => (
                <option
                  key={opt}
                  value={opt}
                  disabled={opt === "CANCELLED" && !canChooseCancelled}
                >
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={onSaveStatus}
            disabled={saving}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Update status"}
          </button>
        </div>

        {error ? (
          <p className="mt-3 text-sm text-rose-700">{error}</p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-12 gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase text-slate-500 md:grid">
          <div className="col-span-5">Product</div>
          <div className="col-span-2 text-right">Unit</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-3 text-right">Line total</div>
        </div>

        {order.items.map((item) => (
          <div key={`${item.productId}-${item.sku ?? ""}`} className="grid grid-cols-1 gap-2 border-b border-slate-100 px-4 py-4 last:border-b-0 md:grid-cols-12 md:items-center">
            <div className="md:col-span-5">
              <p className="text-sm font-semibold text-slate-900">{item.productName}</p>
              <p className="text-xs text-slate-500">SKU: {item.sku ?? "-"}</p>
            </div>
            <div className="md:col-span-2 md:text-right">
              <p className="text-xs text-slate-500 md:hidden">Unit</p>
              <p className="text-sm text-slate-700">{formatPrice(item.unitPrice)}</p>
            </div>
            <div className="md:col-span-2 md:text-center">
              <p className="text-xs text-slate-500 md:hidden">Qty</p>
              <p className="text-sm text-slate-700">{item.quantity}</p>
            </div>
            <div className="md:col-span-3 md:text-right">
              <p className="text-xs text-slate-500 md:hidden">Line total</p>
              <p className="text-sm font-semibold text-slate-900">{formatPrice(item.lineTotal)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="ml-auto w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:w-96">
        <div className="space-y-2 text-sm text-slate-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-{formatPrice(order.discountAmount)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
            <span>Final total</span>
            <span className="text-(--brand-red)">{formatPrice(order.finalAmount)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
