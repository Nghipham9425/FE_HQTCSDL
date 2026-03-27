"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { deletePaymentMethod, getPaymentMethodById, updatePaymentMethod } from "@/lib/api/admin";
import type { AdminPaymentMethodUpsert } from "@/lib/types/admin";

export default function EditPaymentMethodPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [payload, setPayload] = useState<AdminPaymentMethodUpsert | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id)) return;
    getPaymentMethodById(id)
      .then((res) => setPayload({ methodName: res.methodName, isActive: res.isActive }))
      .catch((err) => setError(err instanceof Error ? err.message : "Load failed"));
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!payload) return;
    setLoading(true);
    setError(null);
    try {
      await updatePaymentMethod(id, payload);
      router.push("/admin/payment-methods");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!confirm("Delete this payment method?")) return;
    setLoading(true);
    setError(null);
    try {
      await deletePaymentMethod(id);
      router.push("/admin/payment-methods");
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
      <h2 className="text-xl font-bold">Edit Payment Method #{id}</h2>
      <label className="block text-sm"><div className="mb-1 font-medium">Method Name</div><input required value={payload.methodName} onChange={(e) => setPayload({ ...payload, methodName: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={payload.isActive} onChange={(e) => setPayload({ ...payload, isActive: e.target.checked })} />Active</label>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="flex flex-wrap gap-2"><button disabled={loading} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">{loading ? "Saving..." : "Update"}</button><button type="button" onClick={onDelete} className="rounded-xl border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-600">Delete</button><button type="button" onClick={() => router.push("/admin/payment-methods")} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button></div>
    </form>
  );
}
