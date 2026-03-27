"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPaymentMethod } from "@/lib/api/admin";
import type { AdminPaymentMethodUpsert } from "@/lib/types/admin";

export default function NewPaymentMethodPage() {
  const router = useRouter();
  const [payload, setPayload] = useState<AdminPaymentMethodUpsert>({ methodName: "", isActive: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createPaymentMethod(payload);
      router.push("/admin/payment-methods");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-bold">Create Payment Method</h2>
      <label className="block text-sm"><div className="mb-1 font-medium">Method Name</div><input required value={payload.methodName} onChange={(e) => setPayload({ ...payload, methodName: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={payload.isActive} onChange={(e) => setPayload({ ...payload, isActive: e.target.checked })} />Active</label>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="flex gap-2"><button disabled={loading} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">{loading ? "Saving..." : "Create"}</button><button type="button" onClick={() => router.push("/admin/payment-methods")} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button></div>
    </form>
  );
}
