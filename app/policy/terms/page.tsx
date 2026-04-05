import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-(--brand-red)">
          Trang chủ
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-gray-800">Điều khoản dịch vụ</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900">Điều khoản dịch vụ</h1>
      <p className="mt-2 text-sm text-gray-600">
        Khi sử dụng website CardgameCenter, bạn đồng ý với các điều khoản dưới đây.
      </p>

      <div className="mt-6 space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">1. Tài khoản</h2>
          <p className="mt-2 text-sm text-slate-700">
            Khách hàng chịu trách nhiệm bảo mật thông tin đăng nhập và hoạt động phát sinh từ tài khoản.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">2. Đơn hàng và thanh toán</h2>
          <p className="mt-2 text-sm text-slate-700">
            Đơn hàng được xác nhận theo trạng thái thực tế tồn kho. Giá trị thanh toán áp dụng theo thông tin tại thời điểm đặt hàng.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">3. Đổi trả và hỗ trợ</h2>
          <p className="mt-2 text-sm text-slate-700">
            Các điều kiện đổi trả áp dụng theo chính sách công bố trên website hoặc tư vấn từ bộ phận hỗ trợ.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">4. Thay đổi điều khoản</h2>
          <p className="mt-2 text-sm text-slate-700">
            CardgameCenter có thể cập nhật điều khoản để phù hợp với vận hành và quy định pháp luật hiện hành.
          </p>
        </section>
      </div>
    </div>
  )
}
