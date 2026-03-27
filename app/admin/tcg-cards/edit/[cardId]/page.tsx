"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { deleteTcgCard, getTcgCardById, listTcgSets, updateTcgCard } from "@/lib/api/admin";
import type { AdminTcgCardUpsert, AdminTcgSet } from "@/lib/types/admin";

export default function EditTcgCardPage() {
  const router = useRouter();
  const params = useParams<{ cardId: string }>();
  const cardId = decodeURIComponent(params.cardId);

  const [payload, setPayload] = useState<AdminTcgCardUpsert | null>(null);
  const [setOptions, setSetOptions] = useState<AdminTcgSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTcgCardById(cardId)
      .then((res) => setPayload({ cardId: res.cardId, setId: res.setId, name: res.name, cardNumber: res.cardNumber, rarity: res.rarity, imageSmall: res.imageSmall, imageLarge: res.imageLarge }))
      .catch((err) => setError(err instanceof Error ? err.message : "Load failed"));

    listTcgSets(1, 100).then((res) => setSetOptions(res.items));
  }, [cardId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!payload) return;
    setLoading(true);
    setError(null);
    try {
      await updateTcgCard(cardId, payload);
      router.push("/admin/tcg-cards");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!confirm("Delete this card?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteTcgCard(cardId);
      router.push("/admin/tcg-cards");
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
      <h2 className="text-xl font-bold">Edit TCG Card {cardId}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm"><div className="mb-1 font-medium">Card ID</div><input required value={payload.cardId} onChange={(e) => setPayload({ ...payload, cardId: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm"><div className="mb-1 font-medium">Set ID</div><select required value={payload.setId} onChange={(e) => setPayload({ ...payload, setId: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2"><option value="">Select set</option>{payload.setId && !setOptions.some((set) => set.setId === payload.setId) && <option value={payload.setId}>{payload.setId} (current)</option>}{setOptions.map((set) => (<option key={set.setId} value={set.setId}>{set.setId} - {set.name}</option>))}</select></label>
        <label className="text-sm"><div className="mb-1 font-medium">Name</div><input required value={payload.name} onChange={(e) => setPayload({ ...payload, name: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm"><div className="mb-1 font-medium">Card Number</div><input required value={payload.cardNumber} onChange={(e) => setPayload({ ...payload, cardNumber: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm"><div className="mb-1 font-medium">Rarity</div><input value={payload.rarity ?? ""} onChange={(e) => setPayload({ ...payload, rarity: e.target.value || null })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm"><div className="mb-1 font-medium">Image Small URL</div><input value={payload.imageSmall ?? ""} onChange={(e) => setPayload({ ...payload, imageSmall: e.target.value || null })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm md:col-span-2"><div className="mb-1 font-medium">Image Large URL</div><input value={payload.imageLarge ?? ""} onChange={(e) => setPayload({ ...payload, imageLarge: e.target.value || null })} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="flex flex-wrap gap-2"><button disabled={loading} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">{loading ? "Saving..." : "Update"}</button><button type="button" onClick={onDelete} className="rounded-xl border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-600">Delete</button><button type="button" onClick={() => router.push("/admin/tcg-cards")} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button></div>
    </form>
  );
}
