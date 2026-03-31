"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createVoucher } from "@/lib/api/admin"
import type { AdminVoucherUpsert } from "@/lib/types/admin"

const DISCOUNT_TYPES = [
  { value: "PERCENT", label: "Phần trăm (%)" },
  { value: "FIXED", label: "Số tiền cố định (VND)" },
]

function toInputDate(value: Date) {
  return value.toISOString().slice(0, 10)
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

export default function NewVoucherPage() {
  const router = useRouter()
  const [payload, setPayload] = useState<AdminVoucherUpsert>({
    code: "",
    name: "",
    discountType: "PERCENT",
    discountValue: 10,
    minOrderValue: 0,
    maxDiscount: null,
    usageLimit: null,
    startDate: toInputDate(new Date()),
    endDate: toInputDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
    isActive: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const validationError = validateVoucher(payload)
    if (validationError) {
      setError(validationError)
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      await createVoucher({
        ...payload,
        code: payload.code.trim().toUpperCase(),
        name: payload.name.trim(),
      })
      router.push("/admin/vouchers")
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
      <h2 className="text-xl font-bold">Tạo Voucher mới</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <div className="mb-1 font-medium">Mã voucher <span className="text-rose-500">*</span></div>
          <input
            required
            placeholder="VD: SALE50, SUMMER2024"
            value={payload.code}
            onChange={(e) => setPayload({ ...payload, code: e.target.value.toUpperCase() })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Tên voucher <span className="text-rose-500">*</span></div>
          <input
            required
            placeholder="VD: Giảm 50% đơn hàng"
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
      <div className="flex gap-2">
        <button
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Đang lưu..." : "Tạo voucher"}
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
