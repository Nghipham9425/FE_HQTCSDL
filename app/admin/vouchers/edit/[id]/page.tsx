"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { deleteVoucher, getVoucherById, updateVoucher } from "@/lib/api/admin"
import type { AdminVoucherUpsert } from "@/lib/types/admin"

const DISCOUNT_TYPES = [
  { value: "PERCENT", label: "Phần trăm (%)" },
  { value: "FIXED", label: "Số tiền cố định (VND)" },
]

function toInputDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ""
  return d.toISOString().slice(0, 10)
}

function validateVoucher(payload: AdminVoucherUpsert): string | null {
  if (!payload.code.trim()) return "Mã voucher không được để trống"
  if (!/^[A-Za-z0-9_-]+$/.test(payload.code.trim())) 
    return "Mã voucher chỉ được chứa chữ, số, dấu gạch ngang và gạch dưới"
  if (!payload.name.trim()) return "Tên voucher không được để trống"
  if (payload.discountValue <= 0) return "Giá trị giảm phải lớn hơn 0"
  if (payload.discountType === "PERCENT" && payload.discountValue > 100) 
    return "Phần trăm giảm không được vượt quá 100%"
  if (payload.minOrderValue < 0) return "Đơn tối thiểu không được âm"
  if (payload.maxDiscount !== null && payload.maxDiscount < 0) 
    return "Giảm tối đa không được âm"
  if (!payload.startDate) return "Ngày bắt đầu không được để trống"
  if (!payload.endDate) return "Ngày kết thúc không được để trống"
  if (new Date(payload.startDate) > new Date(payload.endDate)) 
    return "Ngày bắt đầu phải trước ngày kết thúc"
  return null
}

export default function EditVoucherPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = Number(params.id)

  const [payload, setPayload] = useState<AdminVoucherUpsert | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!Number.isFinite(id)) return
    getVoucherById(id)
      .then((v) =>
        setPayload({
          code: v.code,
          name: v.name,
          discountType: v.discountType,
          discountValue: v.discountValue,
          minOrderValue: v.minOrderValue,
          maxDiscount: v.maxDiscount,
          usageLimit: v.usageLimit,
          startDate: toInputDate(v.startDate),
          endDate: toInputDate(v.endDate),
          isActive: v.isActive,
        }),
      )
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Load failed"),
      )
  }, [id])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!payload) return
    
    const validationError = validateVoucher(payload)
    if (validationError) {
      setError(validationError)
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      await updateVoucher(id, {
        ...payload,
        code: payload.code.trim().toUpperCase(),
        name: payload.name.trim(),
      })
      router.push("/admin/vouchers")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed")
    } finally {
      setLoading(false)
    }
  }

  async function onDelete() {
    if (!confirm("Bạn có chắc muốn xóa voucher này?")) return
    setLoading(true)
    setError(null)
    try {
      await deleteVoucher(id)
      router.push("/admin/vouchers")
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
        Đang tải...
      </div>
    )

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5"
    >
      <h2 className="text-xl font-bold">Chỉnh sửa Voucher #{id}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <div className="mb-1 font-medium">Mã voucher <span className="text-rose-500">*</span></div>
          <input
            required
            value={payload.code}
            onChange={(e) => setPayload({ ...payload, code: e.target.value.toUpperCase() })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Tên voucher <span className="text-rose-500">*</span></div>
          <input
            required
            value={payload.name}
            onChange={(e) => setPayload({ ...payload, name: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Loại giảm giá</div>
          <select
            required
            value={payload.discountType}
            onChange={(e) =>
              setPayload({ ...payload, discountType: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white"
          >
            {DISCOUNT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">
            Giá trị giảm {payload.discountType === "PERCENT" ? "(%)" : "(VND)"}
          </div>
          <input
            type="number"
            required
            min={1}
            max={payload.discountType === "PERCENT" ? 100 : undefined}
            value={payload.discountValue}
            onChange={(e) =>
              setPayload({
                ...payload,
                discountValue: Number(e.target.value || 0),
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Đơn hàng tối thiểu (VND)</div>
          <input
            type="number"
            min={0}
            placeholder="0 = không giới hạn"
            value={payload.minOrderValue}
            onChange={(e) =>
              setPayload({
                ...payload,
                minOrderValue: Number(e.target.value || 0),
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Giảm tối đa (VND)</div>
          <input
            type="number"
            min={0}
            placeholder="Để trống = không giới hạn"
            value={payload.maxDiscount ?? ""}
            onChange={(e) =>
              setPayload({
                ...payload,
                maxDiscount: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          {payload.discountType === "PERCENT" && (
            <p className="mt-1 text-xs text-slate-500">Áp dụng cho loại giảm theo %</p>
          )}
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Số lần sử dụng tối đa</div>
          <input
            type="number"
            min={1}
            placeholder="Để trống = không giới hạn"
            value={payload.usageLimit ?? ""}
            onChange={(e) =>
              setPayload({
                ...payload,
                usageLimit: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <div></div>
        <label className="text-sm">
          <div className="mb-1 font-medium">Ngày bắt đầu <span className="text-rose-500">*</span></div>
          <input
            type="date"
            required
            value={payload.startDate}
            onChange={(e) =>
              setPayload({ ...payload, startDate: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Ngày kết thúc <span className="text-rose-500">*</span></div>
          <input
            type="date"
            required
            min={payload.startDate}
            value={payload.endDate}
            onChange={(e) =>
              setPayload({ ...payload, endDate: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="inline-flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={payload.isActive}
            onChange={(e) =>
              setPayload({ ...payload, isActive: e.target.checked })
            }
            className="h-4 w-4 rounded border-slate-300"
          />
          Kích hoạt voucher
        </label>
      </div>
      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-600">
          {error}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Đang lưu..." : "Cập nhật"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={loading}
          className="rounded-xl border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
        >
          Xóa voucher
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/vouchers")}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          Hủy
        </button>
      </div>
    </form>
  )
}
