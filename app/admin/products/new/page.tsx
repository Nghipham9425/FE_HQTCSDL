"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createProduct, listCategories, listTcgCards } from "@/lib/api/admin"
import type {
  AdminCategory,
  AdminProductUpsert,
  AdminTcgCard,
} from "@/lib/types/admin"

const emptyPayload: AdminProductUpsert = {
  sku: "",
  name: "",
  productType: "TCG_CARD",
  price: null,
  originalPrice: null,
  weight: null,
  descriptions: null,
  thumbnail: null,
  image: null,
  stock: 1,
  isActive: true,
  cardId: null,
  categoryIds: [],
}

export default function NewProductPage() {
  const router = useRouter()
  const [payload, setPayload] = useState<AdminProductUpsert>(emptyPayload)
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [cardSearch, setCardSearch] = useState("")
  const [cardOptions, setCardOptions] = useState<AdminTcgCard[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listCategories(1, 100).then((res) => setCategories(res.items))
    listTcgCards(1, 100).then((res) => setCardOptions(res.items))
  }, [])

  function toggleCategory(id: number) {
    setPayload((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((x) => x !== id)
        : [...prev.categoryIds, id],
    }))
  }

  const filteredCardOptions = cardOptions.filter((card) => {
    const keyword = cardSearch.trim().toLowerCase()
    if (!keyword) return true
    return (
      card.cardId.toLowerCase().includes(keyword) ||
      card.name.toLowerCase().includes(keyword)
    )
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await createProduct(payload)
      router.push("/admin/products")
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
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 className="text-xl font-bold">Create Product</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <div className="mb-1 font-medium">SKU</div>
          <input
            required
            value={payload.sku}
            onChange={(e) => setPayload((p) => ({ ...p, sku: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Name</div>
          <input
            required
            value={payload.name}
            onChange={(e) =>
              setPayload((p) => ({ ...p, name: e.target.value }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <div className="mb-1 font-medium">Product Type</div>
          <select
            value={payload.productType}
            onChange={(e) =>
              setPayload((p) => ({
                ...p,
                productType: e.target.value,
                cardId: null,
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="TCG_CARD">TCG_CARD</option>
            <option value="CONSOLE">CONSOLE</option>
            <option value="ACCESSORY">ACCESSORY</option>
            <option value="NORMAL">NORMAL</option>
          </select>
        </label>

        <label className="text-sm">
          <div className="mb-1 font-medium">Price</div>
          <input
            type="number"
            value={payload.price ?? ""}
            onChange={(e) =>
              setPayload((p) => ({
                ...p,
                price: e.target.value ? Number(e.target.value) : null,
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <div className="mb-1 font-medium">Original Price</div>
          <input
            type="number"
            value={payload.originalPrice ?? ""}
            onChange={(e) =>
              setPayload((p) => ({
                ...p,
                originalPrice: e.target.value ? Number(e.target.value) : null,
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <div className="mb-1 font-medium">Stock</div>
          <input
            type="number"
            value={payload.stock}
            onChange={(e) =>
              setPayload((p) => ({ ...p, stock: Number(e.target.value || 0) }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <div className="mb-1 font-medium">Weight</div>
          <input
            type="number"
            step="0.01"
            value={payload.weight ?? ""}
            onChange={(e) =>
              setPayload((p) => ({
                ...p,
                weight: e.target.value ? Number(e.target.value) : null,
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="text-sm md:col-span-2">
          <div className="mb-1 font-medium">Thumbnail URL</div>
          <input
            value={payload.thumbnail ?? ""}
            onChange={(e) =>
              setPayload((p) => ({ ...p, thumbnail: e.target.value || null }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="text-sm md:col-span-2">
          <div className="mb-1 font-medium">Image URL</div>
          <input
            value={payload.image ?? ""}
            onChange={(e) =>
              setPayload((p) => ({ ...p, image: e.target.value || null }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="text-sm md:col-span-2">
          <div className="mb-1 font-medium">Description</div>
          <textarea
            value={payload.descriptions ?? ""}
            onChange={(e) =>
              setPayload((p) => ({
                ...p,
                descriptions: e.target.value || null,
              }))
            }
            className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        {payload.productType === "TCG_CARD" && (
          <div className="md:col-span-2">
            <div className="mb-1 text-sm font-medium">
              Pick card from TCG Cards
            </div>
            <input
              value={cardSearch}
              onChange={(e) => setCardSearch(e.target.value)}
              placeholder="Search card id/name in list"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
            <select
              required
              value={payload.cardId ?? ""}
              onChange={(e) => {
                const selected = cardOptions.find(
                  (card) => card.cardId === e.target.value,
                )
                setPayload((p) => ({
                  ...p,
                  cardId: e.target.value || null,
                  name: selected ? p.name || selected.name : p.name,
                  thumbnail: selected
                    ? p.thumbnail || selected.imageSmall
                    : p.thumbnail,
                  image: selected ? p.image || selected.imageLarge : p.image,
                }))
              }}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">Select card</option>
              {payload.cardId &&
                !cardOptions.some((card) => card.cardId === payload.cardId) && (
                  <option value={payload.cardId}>
                    {payload.cardId} (current)
                  </option>
                )}
              {filteredCardOptions.map((card) => (
                <option key={card.cardId} value={card.cardId}>
                  {card.cardId} - {card.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="md:col-span-2">
          <div className="mb-1 text-sm font-medium">Categories</div>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((c) => c.id !== null)
              .map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id as number)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${payload.categoryIds.includes(category.id as number) ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-300 text-slate-600"}`}
                >
                  {category.name}
                </button>
              ))}
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={payload.isActive}
            onChange={(e) =>
              setPayload((p) => ({ ...p, isActive: e.target.checked }))
            }
          />
          Active
        </label>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Create"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
