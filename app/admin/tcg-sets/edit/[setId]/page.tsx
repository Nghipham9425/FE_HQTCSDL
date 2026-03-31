"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { deleteTcgSet, getTcgSetById, updateTcgSet } from "@/lib/api/admin"
import type { AdminTcgSetUpsert } from "@/lib/types/admin"

export default function EditTcgSetPage() {
  const router = useRouter()
  const params = useParams<{ setId: string }>()
  const setId = decodeURIComponent(params.setId)

  const [payload, setPayload] = useState<AdminTcgSetUpsert | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getTcgSetById(setId)
      .then((res) =>
        setPayload({
          setId: res.setId,
          name: res.name,
          series: res.series,
          releaseDate: res.releaseDate,
          totalCards: res.totalCards,
          logoUrl: res.logoUrl,
        }),
      )
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Load failed"),
      )
  }, [setId])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!payload) return
    setLoading(true)
    setError(null)
    try {
      await updateTcgSet(setId, payload)
      router.push("/admin/tcg-sets")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed")
    } finally {
      setLoading(false)
    }
  }

  async function onDelete() {
    if (!confirm("Delete this set?")) return
    setLoading(true)
    setError(null)
    try {
      await deleteTcgSet(setId)
      router.push("/admin/tcg-sets")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    } finally {
      setLoading(false)
    }
  }

  if (!payload)
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        Loading...
      </div>
    )

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5"
    >
      <h2 className="text-xl font-bold">Edit TCG Set {setId}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <div className="mb-1 font-medium">Set ID</div>
          <input
            required
            value={payload.setId}
            onChange={(e) => setPayload({ ...payload, setId: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Name</div>
          <input
            required
            value={payload.name}
            onChange={(e) => setPayload({ ...payload, name: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Series</div>
          <input
            value={payload.series ?? ""}
            onChange={(e) =>
              setPayload({ ...payload, series: e.target.value || null })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Release Date</div>
          <input
            type="date"
            value={payload.releaseDate ?? ""}
            onChange={(e) =>
              setPayload({ ...payload, releaseDate: e.target.value || null })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Total Cards</div>
          <input
            type="number"
            value={payload.totalCards ?? ""}
            onChange={(e) =>
              setPayload({
                ...payload,
                totalCards: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Logo URL</div>
          <input
            value={payload.logoUrl ?? ""}
            onChange={(e) =>
              setPayload({ ...payload, logoUrl: e.target.value || null })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
        >
          {loading ? "Saving..." : "Update"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-xl border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-600"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/tcg-sets")}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
