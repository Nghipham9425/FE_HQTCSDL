import {
  SearchCheck,
  PackageCheck,
  CircleAlert,
} from "lucide-react"
import Breadcrumb from "@/components/ui/Breadcrumb"

export default function InspectionPolicyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Chính sách", href: "/policy/terms" },
          { label: "Chính sách kiểm hàng" },
        ]}
        className="mb-6"
      />

      <h1 className="text-3xl font-black text-gray-900">
        Chính sách kiểm hàng
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Khách hàng được kiểm tra ngoại quan kiện hàng trước khi nhận để đảm bảo
        đúng đơn đặt.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SearchCheck className="text-indigo-600" size={20} />
          <h2 className="mt-3 text-base font-bold text-slate-900">
            Nội dung kiểm tra
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Kiểm tra tên sản phẩm, số lượng, tem niêm phong và tình trạng vỏ
            hộp.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <PackageCheck className="text-emerald-600" size={20} />
          <h2 className="mt-3 text-base font-bold text-slate-900">
            Trước khi nhận
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Chỉ xác nhận đã nhận sau khi đối chiếu thông tin và tình trạng gói
            hàng.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <CircleAlert className="text-amber-600" size={20} />
          <h2 className="mt-3 text-base font-bold text-slate-900">
            Nếu có vấn đề
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Từ chối nhận và liên hệ ngay hỗ trợ để được hướng dẫn xử lý.
          </p>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Lưu ý quan trọng</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>
            Chính sách kiểm hàng áp dụng tại thời điểm giao nhận với đơn vị vận
            chuyển.
          </li>
          <li>
            Không dùng thử sản phẩm chuyên sâu khi chưa thanh toán/nhận hàng.
          </li>
          <li>
            Quay video mở hộp để tăng độ chính xác khi đối soát sau giao hàng.
          </li>
        </ul>
      </section>
    </div>
  )
}
