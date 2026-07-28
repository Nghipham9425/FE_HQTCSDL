import { ShieldCheck, Lock, Eye } from "lucide-react"
import Breadcrumb from "@/components/ui/Breadcrumb"

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Chính sách", href: "/policy/terms" },
          { label: "Chính sách bảo mật" },
        ]}
        className="mb-6"
      />

      <h1 className="text-3xl font-black text-gray-900">Chính sách bảo mật</h1>
      <p className="mt-2 text-sm text-gray-600">
        CardgameCenter cam kết bảo vệ dữ liệu cá nhân và chỉ sử dụng thông tin để xử lý đơn hàng,
        chăm sóc khách hàng và nâng cao trải nghiệm mua sắm.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ShieldCheck className="text-emerald-600" size={20} />
          <h2 className="mt-3 text-base font-bold text-slate-900">Thu thập tối thiểu</h2>
          <p className="mt-2 text-sm text-slate-600">
            Chúng tôi chỉ thu thập các thông tin cần thiết như tên, email, số điện thoại, địa chỉ giao hàng.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Lock className="text-indigo-600" size={20} />
          <h2 className="mt-3 text-base font-bold text-slate-900">Lưu trữ an toàn</h2>
          <p className="mt-2 text-sm text-slate-600">
            Dữ liệu được lưu trên hệ thống có kiểm soát truy cập nội bộ và phân quyền theo vai trò.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Eye className="text-amber-600" size={20} />
          <h2 className="mt-3 text-base font-bold text-slate-900">Minh bạch sử dụng</h2>
          <p className="mt-2 text-sm text-slate-600">
            Chúng tôi không bán dữ liệu cá nhân cho bên thứ ba. Thông tin chỉ dùng cho vận hành dịch vụ.
          </p>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Quyền của khách hàng</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Yêu cầu xem, chỉnh sửa hoặc cập nhật thông tin cá nhân.</li>
          <li>Yêu cầu xóa dữ liệu khi không còn nhu cầu sử dụng dịch vụ.</li>
          <li>Liên hệ hỗ trợ nếu nghi ngờ có truy cập trái phép tài khoản.</li>
        </ul>
      </section>
    </div>
  )
}
