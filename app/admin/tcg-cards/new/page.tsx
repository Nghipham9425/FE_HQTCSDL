"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createTcgCard, listTcgSets } from "@/lib/api/admin"
import type { AdminTcgCardUpsert, AdminTcgSet } from "@/lib/types/admin"

export default function NewTcgCardPage() {
  const router = useRouter()
  const [payload, setPayload] = useState<AdminTcgCardUpsert>({
    cardId: "",
    setId: "",
    name: "",
    cardNumber: "",
    rarity: null,
    imageSmall: null,
    imageLarge: null,
  })
  const [setOptions, setSetOptions] = useState<AdminTcgSet[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listTcgSets(1, 100).then((res) => setSetOptions(res.items))
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await createTcgCard(payload)
      router.push("/admin/tcg-cards")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5"
    >
      <h2 className="text-xl font-bold">Create TCG Card</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <div className="mb-1 font-medium">Card ID</div>
          <input
            required
            value={payload.cardId}
            onChange={(e) => setPayload({ ...payload, cardId: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Set ID</div>
          <select
            required
            value={payload.setId}
            onChange={(e) => setPayload({ ...payload, setId: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">Select set</option>
            {setOptions.map((set) => (
              <option key={set.setId} value={set.setId}>
                {set.setId} - {set.name}
              </option>
            ))}
          </select>
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
          <div className="mb-1 font-medium">Card Number</div>
          <input
            required
            value={payload.cardNumber}
            onChange={(e) =>
              setPayload({ ...payload, cardNumber: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Rarity</div>
          <input
            value={payload.rarity ?? ""}
            onChange={(e) =>
              setPayload({ ...payload, rarity: e.target.value || null })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Image Small URL</div>
          <input
            value={payload.imageSmall ?? ""}
            onChange={(e) =>
              setPayload({ ...payload, imageSmall: e.target.value || null })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm md:col-span-2">
          <div className="mb-1 font-medium">Image Large URL</div>
          <input
            value={payload.imageLarge ?? ""}
            onChange={(e) =>
              setPayload({ ...payload, imageLarge: e.target.value || null })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="flex gap-2">
        <button
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
        >
          {loading ? "Saving..." : "Create"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/tcg-cards")}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
