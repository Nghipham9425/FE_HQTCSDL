"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { deleteVoucher, getVoucherById, updateVoucher } from "@/lib/api/admin";
import type { AdminVoucherUpsert } from "@/lib/types/admin";

function toInputDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function EditVoucherPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [payload, setPayload] = useState<AdminVoucherUpsert | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id)) return;
    getVoucherById(id)
      .then((v) => setPayload({ code: v.code, name: v.name, discountType: v.discountType, discountValue: v.discountValue, minOrderValue: v.minOrderValue, maxDiscount: v.maxDiscount, usageLimit: v.usageLimit, startDate: toInputDate(v.startDate), endDate: toInputDate(v.endDate), isActive: v.isActive }))
      .catch((err) => setError(err instanceof Error ? err.message : "Load failed"));
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!payload) return;
    setLoading(true);
    setError(null);
    try {
      await updateVoucher(id, payload);
      router.push("/admin/vouchers");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!confirm("Delete this voucher?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteVoucher(id);
      router.push("/admin/vouchers");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  if (!payload) return <div className="rounded-2xl border border-slate-200 bg-white p-5">Loading...</div>;

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-bold">Edit Voucher #{id}</h2>
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
      <div className="flex flex-wrap gap-2"><button disabled={loading} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">{loading ? "Saving..." : "Update"}</button><button type="button" onClick={onDelete} className="rounded-xl border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-600">Delete</button><button type="button" onClick={() => router.push("/admin/vouchers")} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button></div>
    </form>
  );
}
