"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { deleteCategory, getCategoryById, updateCategory } from "@/lib/api/admin";
import type { AdminCategoryUpsert } from "@/lib/types/admin";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [payload, setPayload] = useState<AdminCategoryUpsert | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id)) return;
    getCategoryById(id)
      .then((res) => setPayload({ name: res.name, description: res.description, thumbnail: res.thumbnail }))
      .catch((err) => setError(err instanceof Error ? err.message : "Load failed"));
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!payload) return;
    setLoading(true);
    setError(null);
    try {
      await updateCategory(id, payload);
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!confirm("Delete this category?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteCategory(id);
      router.push("/admin/categories");
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
      <h2 className="text-xl font-bold">Edit Category #{id}</h2>
      <label className="block text-sm"><div className="mb-1 font-medium">Name</div><input required value={payload.name} onChange={(e) => setPayload({ ...payload, name: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      <label className="block text-sm"><div className="mb-1 font-medium">Description</div><textarea value={payload.description ?? ""} onChange={(e) => setPayload({ ...payload, description: e.target.value || null })} className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      <label className="block text-sm"><div className="mb-1 font-medium">Thumbnail URL</div><input value={payload.thumbnail ?? ""} onChange={(e) => setPayload({ ...payload, thumbnail: e.target.value || null })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="flex flex-wrap gap-2"><button disabled={loading} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">{loading ? "Saving..." : "Update"}</button><button type="button" onClick={onDelete} className="rounded-xl border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-600">Delete</button><button type="button" onClick={() => router.push("/admin/categories")} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button></div>
    </form>
  );
}
