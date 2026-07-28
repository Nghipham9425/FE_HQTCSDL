import { ShieldCheck, Timer, Wrench } from "lucide-react"
import Breadcrumb from "@/components/ui/Breadcrumb"

export default function WarrantyPolicyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Chính sách", href: "/policy/terms" },
          { label: "Chính sách bảo hành" },
        ]}
        className="mb-6"
      />

      <h1 className="text-3xl font-black text-gray-900">Chính sách bảo hành</h1>
      <p className="mt-2 text-sm text-gray-600">
        Bảo hành áp dụng với sản phẩm có lỗi kỹ thuật do nhà sản xuất trong thời
        hạn công bố.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ShieldCheck className="text-emerald-600" size={20} />
          <h2 className="mt-3 text-base font-bold text-slate-900">
            Phạm vi bảo hành
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Lỗi kỹ thuật phát sinh trong điều kiện sử dụng bình thường.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Timer className="text-indigo-600" size={20} />
          <h2 className="mt-3 text-base font-bold text-slate-900">
            Thời hạn xử lý
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Thông thường từ 3-10 ngày làm việc tùy theo tình trạng sản phẩm.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Wrench className="text-amber-600" size={20} />
          <h2 className="mt-3 text-base font-bold text-slate-900">Phương án</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sửa chữa, đổi mới hoặc hỗ trợ theo chính sách của nhà cung cấp.
          </p>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Trường hợp không bảo hành
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Sản phẩm bị vỡ, nứt, vào nước do tác động ngoại lực.</li>
          <li>Tem bảo hành bị rách, mất hoặc bị sửa đổi.</li>
          <li>Lỗi do sử dụng sai hướng dẫn của nhà sản xuất.</li>
        </ul>
      </section>
    </div>
  )
}
