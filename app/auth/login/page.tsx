"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { getPostLoginPath, login } from "@/lib/api/auth"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = String(formData.get("email") || "").trim()
    const password = String(formData.get("password") || "")

    setError(null)

    try {
      const result = await login({ email, password })
      window.location.href = getPostLoginPath(result.user.role)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại")
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
              Đăng nhập
            </h1>
            <p className="text-sm text-gray-500">
              Chào mừng bạn quay lại CardgameCenter!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Mật khẩu
                </label>
                <span className="text-xs text-gray-500">Đổi mật khẩu trong Tài khoản</span>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
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

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 accent-[var(--brand-navy)]"
              />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Ghi nhớ đăng nhập
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
                <LogIn size={16} />
              )}
              Đăng nhập
            </button>
            {error && <p className="text-sm text-rose-600">{error}</p>}
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-gray-400">hoặc</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              href="/auth/register"
              className="font-bold text-[var(--brand-red)] hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Bằng cách đăng nhập, bạn đồng ý với{" "}
          <Link
            href="/policy/privacy"
            className="underline hover:text-gray-700"
          >
            Chính sách bảo mật
          </Link>{" "}
          và{" "}
          <Link href="/policy/terms" className="underline hover:text-gray-700">
            Điều khoản dịch vụ
          </Link>{" "}
          của Bánh Mì Games.
        </p>
      </div>
    </div>
  )
}
