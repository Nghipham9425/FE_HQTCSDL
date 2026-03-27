"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVoucher } from "@/lib/api/admin";
import type { AdminVoucherUpsert } from "@/lib/types/admin";

function toInputDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

export default function NewVoucherPage() {
  const router = useRouter();
  const [payload, setPayload] = useState<AdminVoucherUpsert>({
    code: "",
    name: "",
    discountType: "PERCENT",
    discountValue: 0,
    minOrderValue: 0,
    maxDiscount: null,
    usageLimit: null,
    startDate: toInputDate(new Date()),
    endDate: toInputDate(new Date()),
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createVoucher(payload);
      router.push("/admin/vouchers");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-bold">Create Voucher</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm"><div className="mb-1 font-medium">Code</div><input required value={payload.code} onChange={(e) => setPayload({ ...payload, code: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm"><div className="mb-1 font-medium">Name</div><input required value={payload.name} onChange={(e) => setPayload({ ...payload, name: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm"><div className="mb-1 font-medium">Discount Type</div><input required value={payload.discountType} onChange={(e) => setPayload({ ...payload, discountType: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm"><div className="mb-1 font-medium">Discount Value</div><input type="number" required value={payload.discountValue} onChange={(e) => setPayload({ ...payload, discountValue: Number(e.target.value || 0) })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm"><div className="mb-1 font-medium">Min Order</div><input type="number" value={payload.minOrderValue} onChange={(e) => setPayload({ ...payload, minOrderValue: Number(e.target.value || 0) })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm"><div className="mb-1 font-medium">Max Discount</div><input type="number" value={payload.maxDiscount ?? ""} onChange={(e) => setPayload({ ...payload, maxDiscount: e.target.value ? Number(e.target.value) : null })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm"><div className="mb-1 font-medium">Usage Limit</div><input type="number" value={payload.usageLimit ?? ""} onChange={(e) => setPayload({ ...payload, usageLimit: e.target.value ? Number(e.target.value) : null })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm"><div className="mb-1 font-medium">Start Date</div><input type="date" required value={payload.startDate} onChange={(e) => setPayload({ ...payload, startDate: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm"><div className="mb-1 font-medium">End Date</div><input type="date" required value={payload.endDate} onChange={(e) => setPayload({ ...payload, endDate: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="inline-flex items-center gap-2 text-sm md:col-span-2"><input type="checkbox" checked={payload.isActive} onChange={(e) => setPayload({ ...payload, isActive: e.target.checked })} />Active</label>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="flex gap-2"><button disabled={loading} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">{loading ? "Saving..." : "Create"}</button><button type="button" onClick={() => router.push("/admin/vouchers")} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button></div>
    </form>
  );
}
