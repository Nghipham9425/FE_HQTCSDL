"use client"

import { useEffect, useState } from "react"
import { getMe, updateMe, type ProfileUpdatePayload } from "@/lib/api/auth"

export default function AccountProfilePage() {
  const [payload, setPayload] = useState<ProfileUpdatePayload>({
    fullName: "",
    phone: "",
    country: "",
  })
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const me = await getMe()
        if (!mounted) return

        setEmail(me.email)
        setPayload({
          fullName: me.fullName ?? "",
          phone: me.phone ?? "",
          country: me.country ?? "",
        })
      } catch (err) {
        if (!mounted) return
        setError(
          err instanceof Error
            ? err.message
            : "Không tải được thông tin tài khoản.",
        )
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!payload.fullName?.trim()) {
      setError("Họ tên không được để trống.")
      return
    }

    setSaving(true)

    try {
      const updated = await updateMe({
        fullName: payload.fullName.trim(),
        phone: payload.phone?.trim() || null,
        country: payload.country?.trim() || null,
      })

      setEmail(updated.email)
      setPayload({
        fullName: updated.fullName ?? "",
        phone: updated.phone ?? "",
        country: updated.country ?? "",
      })
      setSuccess("Đã cập nhật hồ sơ thành công.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật thất bại.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Hồ sơ tài khoản</h1>
        <p className="mt-2 text-slate-600">
          Cập nhật thông tin cá nhân để đặt hàng nhanh hơn.
        </p>

        {loading ? (
          <div className="mt-6 text-sm text-slate-600">
            Đang tải thông tin...
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="text-sm md:col-span-2">
              <div className="mb-1 font-medium">Email (không sửa được)</div>
              <input
                value={email}
                disabled
                className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-slate-600"
              />
            </label>

            <label className="text-sm">
              <div className="mb-1 font-medium">Họ và tên</div>
              <input
                required
                value={payload.fullName}
                onChange={(e) =>
                  setPayload((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="text-sm">
              <div className="mb-1 font-medium">Số điện thoại</div>
              <input
                value={payload.phone ?? ""}
                onChange={(e) =>
                  setPayload((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="Ví dụ: 0901234567"
              />
            </label>

            <label className="text-sm">
              <div className="mb-1 font-medium">Quốc gia</div>
              <input
                value={payload.country ?? ""}
                onChange={(e) =>
                  setPayload((prev) => ({ ...prev, country: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="Ví dụ: Việt Nam"
              />
            </label>

            {error ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 md:col-span-2">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 md:col-span-2">
                {success}
              </div>
            ) : null}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-(--brand-red) px-4 py-2 text-sm font-semibold text-white hover:bg-(--brand-red-dark) disabled:opacity-60"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
