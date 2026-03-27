"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTcgSet } from "@/lib/api/admin";
import type { AdminTcgSetUpsert } from "@/lib/types/admin";

export default function NewTcgSetPage() {
  const router = useRouter();
  const [payload, setPayload] = useState<AdminTcgSetUpsert>({ setId: "", name: "", series: null, releaseDate: null, totalCards: null, logoUrl: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createTcgSet(payload);
      router.push("/admin/tcg-sets");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-bold">Create TCG Set</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm"><div className="mb-1 font-medium">Set ID</div><input required value={payload.setId} onChange={(e) => setPayload({ ...payload, setId: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm"><div className="mb-1 font-medium">Name</div><input required value={payload.name} onChange={(e) => setPayload({ ...payload, name: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm"><div className="mb-1 font-medium">Series</div><input value={payload.series ?? ""} onChange={(e) => setPayload({ ...payload, series: e.target.value || null })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm"><div className="mb-1 font-medium">Release Date</div><input type="date" value={payload.releaseDate ?? ""} onChange={(e) => setPayload({ ...payload, releaseDate: e.target.value || null })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm"><div className="mb-1 font-medium">Total Cards</div><input type="number" value={payload.totalCards ?? ""} onChange={(e) => setPayload({ ...payload, totalCards: e.target.value ? Number(e.target.value) : null })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm"><div className="mb-1 font-medium">Logo URL</div><input value={payload.logoUrl ?? ""} onChange={(e) => setPayload({ ...payload, logoUrl: e.target.value || null })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="flex gap-2"><button disabled={loading} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">{loading ? "Saving..." : "Create"}</button><button type="button" onClick={() => router.push("/admin/tcg-sets")} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button></div>
    </form>
  );
}
