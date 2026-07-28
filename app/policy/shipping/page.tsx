import { Truck, Clock3, MapPinned } from "lucide-react"
import Breadcrumb from "@/components/ui/Breadcrumb"

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Chính sách", href: "/policy/terms" },
          { label: "Chính sách vận chuyển" },
        ]}
        className="mb-6"
      />

      <h1 className="text-3xl font-black text-gray-900">
        Chính sách vận chuyển
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Đơn hàng được giao trên toàn quốc qua đối tác vận chuyển liên kết với
        CardgameCenter.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Truck className="text-sky-600" size={20} />
          <h2 className="mt-3 text-base font-bold text-slate-900">
            Phạm vi giao hàng
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Hỗ trợ giao hàng nội thành và liên tỉnh trên toàn quốc.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Clock3 className="text-indigo-600" size={20} />
          <h2 className="mt-3 text-base font-bold text-slate-900">
            Thời gian giao dự kiến
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Nội thành 1-2 ngày, liên tỉnh 2-5 ngày làm việc tùy khu vực.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <MapPinned className="text-emerald-600" size={20} />
          <h2 className="mt-3 text-base font-bold text-slate-900">
            Theo dõi vận đơn
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Bạn có thể kiểm tra trạng thái đơn tại trang Theo dõi đơn hàng.
          </p>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Lưu ý</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Phí giao hàng được hiển thị rõ tại bước thanh toán.</li>
          <li>
            Thời gian có thể thay đổi trong dịp lễ, tết hoặc thời tiết xấu.
          </li>
          <li>Vui lòng giữ liên lạc để shipper giao hàng thành công.</li>
        </ul>
      </section>
    </div>
  )
}
