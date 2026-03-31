"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  deleteProduct,
  getProductById,
  listCategories,
  listTcgCards,
  updateProduct,
} from "@/lib/api/admin"
import type {
  AdminCategory,
  AdminProductUpsert,
  AdminTcgCard,
} from "@/lib/types/admin"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = Number(params.id)

  const [payload, setPayload] = useState<AdminProductUpsert | null>(null)
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [cardSearch, setCardSearch] = useState("")
  const [cardOptions, setCardOptions] = useState<AdminTcgCard[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!Number.isFinite(id)) return

    Promise.all([getProductById(id), listCategories(1, 100)])
      .then(([product, categoriesRes]) => {
        setPayload({
          sku: product.sku,
          name: product.name,
          productType: product.productType,
          price: product.price,
          originalPrice: product.originalPrice,
          weight: product.weight,
          descriptions: product.descriptions,
          thumbnail: product.thumbnail,
          image: product.image,
          stock: product.stock,
          isActive: product.isActive,
          cardId: product.cardId,
          categoryIds: product.categoryIds,
        })
        setCategories(categoriesRes.items)
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Load failed"))

    listTcgCards(1, 100).then((res) => setCardOptions(res.items))
  }, [id])

  function toggleCategory(cid: number) {
    if (!payload) return
    setPayload({
      ...payload,
      categoryIds: payload.categoryIds.includes(cid)
        ? payload.categoryIds.filter((x) => x !== cid)
        : [...payload.categoryIds, cid],
    })
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
    if (!payload) return
    setLoading(true)
    setError(null)
    try {
      await updateProduct(id, payload)
      router.push("/admin/products")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed")
    } finally {
      setLoading(false)
    }
  }

  async function onDelete() {
    if (!confirm("Delete this product?")) return
    setLoading(true)
    setError(null)
    try {
      await deleteProduct(id)
      router.push("/admin/products")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    } finally {
      setLoading(false)
    }
  }

  if (!payload) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        Loading...
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 className="text-xl font-bold">Edit Product #{id}</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <div className="mb-1 font-medium">SKU</div>
          <input
            required
            value={payload.sku}
            onChange={(e) => setPayload({ ...payload, sku: e.target.value })}
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
          <div className="mb-1 font-medium">Product Type</div>
          <select
            value={payload.productType}
            onChange={(e) =>
              setPayload({
                ...payload,
                productType: e.target.value,
                cardId: null,
              })
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
              setPayload({
                ...payload,
                price: e.target.value ? Number(e.target.value) : null,
              })
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
              setPayload({
                ...payload,
                originalPrice: e.target.value ? Number(e.target.value) : null,
              })
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
              setPayload({ ...payload, stock: Number(e.target.value || 0) })
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
              setPayload({
                ...payload,
                weight: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm md:col-span-2">
          <div className="mb-1 font-medium">Thumbnail URL</div>
          <input
            value={payload.thumbnail ?? ""}
            onChange={(e) =>
              setPayload({ ...payload, thumbnail: e.target.value || null })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm md:col-span-2">
          <div className="mb-1 font-medium">Image URL</div>
          <input
            value={payload.image ?? ""}
            onChange={(e) =>
              setPayload({ ...payload, image: e.target.value || null })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm md:col-span-2">
          <div className="mb-1 font-medium">Description</div>
          <textarea
            value={payload.descriptions ?? ""}
            onChange={(e) =>
              setPayload({ ...payload, descriptions: e.target.value || null })
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
                setPayload({
                  ...payload,
                  cardId: e.target.value || null,
                  name: selected ? payload.name || selected.name : payload.name,
                  thumbnail: selected
                    ? payload.thumbnail || selected.imageSmall
                    : payload.thumbnail,
                  image: selected
                    ? payload.image || selected.imageLarge
                    : payload.image,
                })
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
              setPayload({ ...payload, isActive: e.target.checked })
            }
          />
          Active
        </label>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Update"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={loading}
          className="rounded-xl border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-60"
        >
          Delete
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
