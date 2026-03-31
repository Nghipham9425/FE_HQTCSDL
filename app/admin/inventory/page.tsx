"use client"

import { useEffect, useState } from "react"
import { listInventory, adjustInventory, type AdminInventory } from "@/lib/api/admin"
import { Package, Search, Plus, Minus, AlertTriangle, RefreshCw } from "lucide-react"

export default function InventoryPage() {
  const [items, setItems] = useState<AdminInventory[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [adjusting, setAdjusting] = useState<number | null>(null)
  const [adjustValue, setAdjustValue] = useState<Record<number, number>>({})
  const pageSize = 20

  async function loadData() {
    setLoading(true)
    try {
      const res = await listInventory(page, pageSize, search || undefined)
      setItems(res.items)
      setTotal(res.total)
    } catch (err) {
      console.error("Failed to load inventory:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [page, search])

  async function handleAdjust(productId: number, adjustment: number) {
    if (adjustment === 0) return
    
    setAdjusting(productId)
    try {
      await adjustInventory(productId, adjustment)
      setAdjustValue((prev) => ({ ...prev, [productId]: 0 }))
      await loadData()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Điều chỉnh thất bại")
    } finally {
      setAdjusting(null)
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Package className="h-6 w-6" />
          Quản lý Kho hàng
        </h1>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm theo tên hoặc SKU sản phẩm..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">SKU</th>
              <th className="px-4 py-3 text-left font-semibold">Sản phẩm</th>
              <th className="px-4 py-3 text-right font-semibold">Tổng kho</th>
              <th className="px-4 py-3 text-right font-semibold">Đã đặt</th>
              <th className="px-4 py-3 text-right font-semibold">Khả dụng</th>
              <th className="px-4 py-3 text-center font-semibold">Điều chỉnh</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Đang tải...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isLowStock = item.availableQuantity <= 10
                return (
                  <tr
                    key={item.id}
                    className={`border-t ${isLowStock ? "bg-amber-50" : ""}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs">{item.productSku}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isLowStock && (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                        <span className="max-w-[200px] truncate">{item.productName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {item.quantity.toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500">
                      {item.reservedQuantity.toLocaleString("vi-VN")}
                    </td>
                    <td className={`px-4 py-3 text-right font-bold ${
                      isLowStock ? "text-amber-600" : "text-green-600"
                    }`}>
                      {item.availableQuantity.toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleAdjust(item.productId, -1)}
                          disabled={adjusting === item.productId || item.quantity <= 0}
                          className="rounded-lg border border-rose-300 p-1.5 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                          title="Giảm 1"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          value={adjustValue[item.productId] ?? 0}
                          onChange={(e) =>
                            setAdjustValue((prev) => ({
                              ...prev,
                              [item.productId]: parseInt(e.target.value) || 0,
                            }))
                          }
                          className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-center text-sm"
                          placeholder="0"
                        />
                        <button
                          onClick={() => handleAdjust(item.productId, 1)}
                          disabled={adjusting === item.productId}
                          className="rounded-lg border border-green-300 p-1.5 text-green-600 hover:bg-green-50 disabled:opacity-50"
                          title="Tăng 1"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleAdjust(item.productId, adjustValue[item.productId] ?? 0)
                          }
                          disabled={
                            adjusting === item.productId ||
                            !adjustValue[item.productId]
                          }
                          className="rounded-lg bg-indigo-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {adjusting === item.productId ? "..." : "Áp dụng"}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị {(page - 1) * pageSize + 1} -{" "}
            {Math.min(page * pageSize, total)} / {total} sản phẩm
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50 disabled:opacity-50"
            >
              Trước
            </button>
            <span className="flex items-center px-3 text-sm">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3 text-amber-500" />
          Sản phẩm có dưới 10 đơn vị khả dụng
        </span>
        <span>• Đã đặt = số lượng đang trong đơn hàng chưa hoàn thành</span>
      </div>
    </div>
  )
}
