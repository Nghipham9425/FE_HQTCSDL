"use client";

import { useMemo, useState } from "react";
import {
  createProduct,
  deleteProduct,
  listProducts,
  listTcgCards,
} from "@/lib/api/admin";
import type {
  AdminCategory,
  AdminProduct,
  AdminProductUpsert,
  AdminTcgCard,
  PagedResponse,
} from "@/lib/types/admin";
import { boolBadge, formatCurrency, formatDate } from "@/components/admin/format";

type AdminProductsCrudProps = {
  initialPage: number;
  initialData: PagedResponse<AdminProduct>;
  categories: AdminCategory[];
};

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
};

export default function AdminProductsCrud({
  initialPage,
  initialData,
  categories,
}: AdminProductsCrudProps) {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [payload, setPayload] = useState<AdminProductUpsert>(emptyPayload);
  const [cardQuery, setCardQuery] = useState("");
  const [cardOptions, setCardOptions] = useState<AdminTcgCard[]>([]);
  const [cardLoading, setCardLoading] = useState(false);

  const totalPages = useMemo(() => Math.max(Math.ceil(data.total / data.pageSize), 1), [data.total, data.pageSize]);

  async function loadPage(targetPage: number) {
    setLoading(true);
    setError(null);
    try {
      const next = await listProducts(targetPage, data.pageSize);
      setData(next);
      setPage(next.page);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  async function searchCards(q: string) {
    setCardQuery(q);
    if (!q.trim()) {
      setCardOptions([]);
      return;
    }

    setCardLoading(true);
    try {
      const res = await listTcgCards(1, 20, q.trim());
      setCardOptions(res.items);
    } finally {
      setCardLoading(false);
    }
  }

  async function submitCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createProduct(payload);
      setPayload(emptyPayload);
      setCardQuery("");
      setCardOptions([]);
      setOpenCreate(false);
      await loadPage(1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Xóa sản phẩm này?")) return;

    setLoading(true);
    setError(null);
    try {
      await deleteProduct(id);
      await loadPage(page);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  function toggleCategory(id: number) {
    setPayload((prev) => {
      const exists = prev.categoryIds.includes(id);
      return {
        ...prev,
        categoryIds: exists
          ? prev.categoryIds.filter((x) => x !== id)
          : [...prev.categoryIds, id],
      };
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Products CRUD</h2>
          <p className="text-sm text-slate-500">Tạo và xóa sản phẩm trực tiếp từ admin.</p>
        </div>
        <button
          onClick={() => setOpenCreate((v) => !v)}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          {openCreate ? "Đóng form" : "Thêm sản phẩm"}
        </button>
      </div>

      {openCreate && (
        <form
          onSubmit={submitCreate}
          className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              <div className="mb-1 font-medium">SKU</div>
              <input
                value={payload.sku}
                onChange={(e) => setPayload((p) => ({ ...p, sku: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                required
              />
            </label>

            <label className="text-sm">
              <div className="mb-1 font-medium">Tên sản phẩm</div>
              <input
                value={payload.name}
                onChange={(e) => setPayload((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                required
              />
            </label>

            <label className="text-sm">
              <div className="mb-1 font-medium">Loại sản phẩm</div>
              <select
                value={payload.productType}
                onChange={(e) => setPayload((p) => ({ ...p, productType: e.target.value, cardId: null }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="TCG_CARD">TCG_CARD</option>
                <option value="CONSOLE">CONSOLE</option>
                <option value="ACCESSORY">ACCESSORY</option>
                <option value="NORMAL">NORMAL</option>
              </select>
            </label>

            <label className="text-sm">
              <div className="mb-1 font-medium">Giá</div>
              <input
                type="number"
                value={payload.price ?? ""}
                onChange={(e) => setPayload((p) => ({ ...p, price: e.target.value ? Number(e.target.value) : null }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="text-sm">
              <div className="mb-1 font-medium">Giá gốc</div>
              <input
                type="number"
                value={payload.originalPrice ?? ""}
                onChange={(e) => setPayload((p) => ({ ...p, originalPrice: e.target.value ? Number(e.target.value) : null }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="text-sm">
              <div className="mb-1 font-medium">Stock</div>
              <input
                type="number"
                value={payload.stock}
                onChange={(e) => setPayload((p) => ({ ...p, stock: Number(e.target.value || 0) }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="text-sm md:col-span-2">
              <div className="mb-1 font-medium">Thumbnail URL</div>
              <input
                value={payload.thumbnail ?? ""}
                onChange={(e) => setPayload((p) => ({ ...p, thumbnail: e.target.value || null }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            {payload.productType === "TCG_CARD" && (
              <div className="md:col-span-2">
                <div className="mb-1 text-sm font-medium">Chọn card từ TCG Cards</div>
                <input
                  value={cardQuery}
                  onChange={(e) => searchCards(e.target.value)}
                  placeholder="Tìm theo card id / tên"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <div className="mt-2 max-h-44 overflow-auto rounded-lg border border-slate-200">
                  {cardLoading ? (
                    <p className="p-2 text-sm text-slate-500">Đang tìm card...</p>
                  ) : cardOptions.length === 0 ? (
                    <p className="p-2 text-sm text-slate-500">Nhập từ khóa để tìm card.</p>
                  ) : (
                    <ul className="divide-y divide-slate-200 text-sm">
                      {cardOptions.map((card) => (
                        <li key={card.cardId}>
                          <button
                            type="button"
                            onClick={() =>
                              setPayload((p) => ({
                                ...p,
                                cardId: card.cardId,
                                name: p.name || card.name,
                                thumbnail: p.thumbnail || card.imageSmall,
                                image: p.image || card.imageLarge,
                              }))
                            }
                            className="w-full px-3 py-2 text-left hover:bg-slate-50"
                          >
                            <span className="font-semibold">{card.cardId}</span> - {card.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {payload.cardId && (
                  <p className="mt-1 text-xs font-medium text-indigo-600">Đã chọn: {payload.cardId}</p>
                )}
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
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        payload.categoryIds.includes(category.id as number)
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-slate-300 text-slate-600"
                      }`}
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
                onChange={(e) => setPayload((p) => ({ ...p, isActive: e.target.checked }))}
              />
              Active
            </label>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              disabled={loading}
              type="submit"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              {loading ? "Đang lưu..." : "Lưu sản phẩm"}
            </button>
            {error && <p className="text-sm text-rose-600">{error}</p>}
          </div>
        </form>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold">Products</h2>
            <p className="text-sm text-slate-500">Danh sách sản phẩm hiện tại.</p>
          </div>
          <div className="rounded-xl bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
            Total: {data.total}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">SKU</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="px-4 py-3">{row.id}</td>
                  <td className="px-4 py-3 font-semibold">{row.sku}</td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3">{row.productType}</td>
                  <td className="px-4 py-3">{formatCurrency(row.price)}</td>
                  <td className="px-4 py-3">{row.stock}</td>
                  <td className="px-4 py-3">{boolBadge(row.isActive)}</td>
                  <td className="px-4 py-3">{formatDate(row.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="rounded-lg border border-rose-300 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 p-4 text-sm dark:border-slate-800">
          <span className="text-slate-500">Page {page} / {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadPage(Math.max(page - 1, 1))}
              disabled={loading || page <= 1}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              onClick={() => loadPage(Math.min(page + 1, totalPages))}
              disabled={loading || page >= totalPages}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
