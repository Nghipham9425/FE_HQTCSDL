"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { changePassword, clearSession } from "@/lib/api/auth"

export default function AccountChangePasswordPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      const message = "Vui lòng nhập đầy đủ thông tin mật khẩu."
      setError(message)
      toast.error(message)
      return
    }

    if (newPassword.length < 8) {
      const message = "Mật khẩu mới phải có ít nhất 8 ký tự."
      setError(message)
      toast.error(message)
      return
    }

    if (newPassword !== confirmPassword) {
      const message = "Xác nhận mật khẩu chưa khớp."
      setError(message)
      toast.error(message)
      return
    }

    setLoading(true)
    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      })

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      clearSession()
      toast.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.")
      router.replace("/auth/login")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể đổi mật khẩu."
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Đổi mật khẩu</h1>
        <p className="mt-2 text-slate-600">
          Mật khẩu mới cần tối thiểu 8 ký tự. Sau khi đổi thành công, bạn sẽ cần đăng nhập lại.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm md:col-span-2">
            <div className="mb-1 font-medium">Mật khẩu hiện tại</div>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Nhập mật khẩu hiện tại"
            />
          </label>

          <label className="text-sm">
            <div className="mb-1 font-medium">Mật khẩu mới</div>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Ít nhất 8 ký tự"
            />
          </label>

          <label className="text-sm">
            <div className="mb-1 font-medium">Xác nhận mật khẩu mới</div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Nhập lại mật khẩu mới"
            />
          </label>

          {error ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 md:col-span-2">
              {error}
            </div>
          ) : null}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-(--brand-red) px-4 py-2 text-sm font-semibold text-white hover:bg-(--brand-red-dark) disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
