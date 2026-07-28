import {
  CreditCard,
  Banknote,
  ShieldEllipsis,
} from "lucide-react"
import Breadcrumb from "@/components/ui/Breadcrumb"

export default function PaymentPolicyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Chính sách", href: "/policy/terms" },
          { label: "Chính sách thanh toán" },
        ]}
        className="mb-6"
      />

      <h1 className="text-3xl font-black text-gray-900">
        Chính sách thanh toán
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Hỗ trợ nhiều hình thức thanh toán linh hoạt và minh bạch cho mỗi đơn
        hàng.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <CreditCard className="text-sky-600" size={20} />
          <h2 className="mt-3 text-base font-bold text-slate-900">
            Thanh toán online
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Hỗ trợ chuyển khoản, cổng thanh toán liên kết và các ví điện tử phù
            hợp.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Banknote className="text-emerald-600" size={20} />
          <h2 className="mt-3 text-base font-bold text-slate-900">
            Thanh toán khi nhận hàng
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            COD có thể áp dụng tùy khu vực, giá trị đơn và loại sản phẩm.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ShieldEllipsis className="text-indigo-600" size={20} />
          <h2 className="mt-3 text-base font-bold text-slate-900">
            Bảo mật giao dịch
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Thông tin giao dịch được bảo vệ, đối soát theo trạng thái đơn hàng
            thực tế.
          </p>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Quy định bổ sung</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>
            Giá trị thu cuối cùng được xác nhận tại trang đặt hàng và email
            thông báo.
          </li>
          <li>
            Đơn thanh toán online có thể cần xác nhận từ hệ thống đối tác trước
            khi đóng gói.
          </li>
          <li>
            Mọi tranh chấp sẽ được xử lý dựa trên lịch sử giao dịch và dữ liệu
            đối soát.
          </li>
        </ul>
      </section>
    </div>
  )
}
