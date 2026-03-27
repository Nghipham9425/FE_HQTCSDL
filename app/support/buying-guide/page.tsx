import Link from "next/link";
import { ChevronRight, CircleCheckBig } from "lucide-react";

const steps = [
  "Tìm sản phẩm phù hợp ở trang Products hoặc thanh tìm kiếm.",
  "Xem chi tiết tồn kho, chọn số lượng rồi bấm Mua ngay hoặc Thêm vào giỏ.",
  "Tại trang Checkout, nhập địa chỉ nhận hàng và số điện thoại liên hệ.",
  "Xác nhận thông tin đơn, hệ thống sẽ tạo đơn COD và chuyển sang trang thành công.",
  "Theo dõi trạng thái tại trang Tracking hoặc mục Đơn hàng trong tài khoản.",
];

export default function BuyingGuidePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-(--brand-red)">
          Trang chủ
        </Link>
        <ChevronRight size={14} />
        <Link href="/support" className="hover:text-(--brand-red)">
          Hỗ trợ
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-gray-800">Hướng dẫn mua hàng</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900">Hướng dẫn mua hàng nhanh</h1>
      <p className="mt-2 text-sm text-gray-600">Quy trình 5 bước để hoàn tất đơn hàng chỉ trong vài phút.</p>

      <ol className="mt-6 space-y-3">
        {steps.map((step, index) => (
          <li key={step} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-navy)] text-xs font-bold text-white">
              {index + 1}
            </span>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <CircleCheckBig size={16} className="mt-0.5 text-emerald-600" />
              <span>{step}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
