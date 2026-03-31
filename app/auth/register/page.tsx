"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import { getPostLoginPath, register } from "@/lib/api/auth"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    const fullName = String(formData.get("fullname") || "").trim()
    const email = String(formData.get("email") || "").trim()
    const password = String(formData.get("password") || "")
    const confirmPassword = String(formData.get("confirmPassword") || "")

    setError(null)

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      setLoading(false)
      return
    }

    try {
      const result = await register({ fullName, email, password })
      window.location.href = getPostLoginPath(result.user.role)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {/* Logo */}
          <div className="mb-6 flex flex-col items-center gap-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative h-12 w-12">
                <Image
                  src="https://www.pngkey.com/png/full/519-5194869_pikachu-circle-png.png"
                  alt="CardgameCenter"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-black text-[var(--brand-navy)]">
                Cardgame<span className="text-[var(--brand-red)]">Center</span>
              </span>
            </Link>
            <h1 className="mt-2 text-2xl font-extrabold text-gray-900">
              Đăng ký
            </h1>
            <p className="text-sm text-gray-500">
              Tạo tài khoản để mua sắm dễ dàng hơn!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full name */}
            <div>
              <label
                htmlFor="fullname"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Họ và tên
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                required
                autoComplete="name"
                placeholder="Nguyễn Văn A"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[var(--brand-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]/20"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="example@gmail.com"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[var(--brand-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]/20"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Số điện thoại
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="0336 590 429"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[var(--brand-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  minLength={8}
                  placeholder="Ít nhất 8 ký tự"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[var(--brand-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  aria-label="Hiện/ẩn mật khẩu"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Xác nhận mật khẩu
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[var(--brand-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]/20"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[var(--brand-navy)]"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 leading-snug"
              >
                Tôi đồng ý với{" "}
                <Link
                  href="/policy/terms"
                  className="text-[var(--brand-red)] hover:underline font-semibold"
                >
                  Điều khoản dịch vụ
                </Link>{" "}
                và{" "}
                <Link
                  href="/policy/privacy"
                  className="text-[var(--brand-red)] hover:underline font-semibold"
                >
                  Chính sách bảo mật
                </Link>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-[var(--brand-red)] py-3 text-sm font-bold text-white hover:bg-[var(--brand-red-dark)] transition-colors disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <UserPlus size={16} />
              )}
              Đăng ký tài khoản
            </button>
            {error && <p className="text-sm text-rose-600">{error}</p>}
          </form>

          {/* Login link */}
          <p className="mt-5 text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              href="/auth/login"
              className="font-bold text-[var(--brand-red)] hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
