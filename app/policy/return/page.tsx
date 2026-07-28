import {
  RefreshCcw,
  PackageSearch,
  CheckCircle2,
} from "lucide-react"
import Breadcrumb from "@/components/ui/Breadcrumb"

export default function ReturnPolicyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Chính sách", href: "/policy/terms" },
          { label: "Chính sách đổi trả" },
        ]}
        className="mb-6"
      />

      <h1 className="text-3xl font-black text-gray-900">Chính sách đổi trả</h1>
      <p className="mt-2 text-sm text-gray-600">
        CardgameCenter hỗ trợ đổi trả minh bạch cho sản phẩm lỗi do nhà bán hoặc
        giao sai thông tin đơn hàng.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <RefreshCcw className="text-indigo-600" size={20} />
          <h2 className="mt-3 text-base font-bold text-slate-900">
            Thời gian yêu cầu
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Gửi yêu cầu đổi trả trong vòng 7 ngày kể từ lúc nhận hàng.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <PackageSearch className="text-amber-600" size={20} />
          <h2 className="mt-3 text-base font-bold text-slate-900">
            Điều kiện áp dụng
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Sản phẩm còn đầy đủ phụ kiện, vỏ hộp và không bị can thiệp bởi người
            dùng.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <CheckCircle2 className="text-emerald-600" size={20} />
          <h2 className="mt-3 text-base font-bold text-slate-900">
            Hình thức xử lý
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Có thể đổi sản phẩm tương đương hoặc hoàn tiền theo kết quả kiểm
            tra.
          </p>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Quy trình nhanh</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>Liên hệ hỗ trợ, cung cấp mã đơn và mô tả tình trạng sản phẩm.</li>
          <li>Gửi hình ảnh/video để xác minh điều kiện đổi trả.</li>
          <li>Nhận hướng dẫn gửi hàng và kết quả xử lý từ bộ phận CSKH.</li>
        </ol>
      </section>
    </div>
  )
}
