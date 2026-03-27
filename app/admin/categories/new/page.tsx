"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "@/lib/api/admin";
import type { AdminCategoryUpsert } from "@/lib/types/admin";

export default function NewCategoryPage() {
  const router = useRouter();
  const [payload, setPayload] = useState<AdminCategoryUpsert>({ name: "", description: null, thumbnail: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createCategory(payload);
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-bold">Create Category</h2>
      <label className="block text-sm"><div className="mb-1 font-medium">Name</div><input required value={payload.name} onChange={(e) => setPayload({ ...payload, name: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      <label className="block text-sm"><div className="mb-1 font-medium">Description</div><textarea value={payload.description ?? ""} onChange={(e) => setPayload({ ...payload, description: e.target.value || null })} className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      <label className="block text-sm"><div className="mb-1 font-medium">Thumbnail URL</div><input value={payload.thumbnail ?? ""} onChange={(e) => setPayload({ ...payload, thumbnail: e.target.value || null })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="flex gap-2"><button disabled={loading} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">{loading ? "Saving..." : "Create"}</button><button type="button" onClick={() => router.push("/admin/categories")} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button></div>
    </form>
  );
}
