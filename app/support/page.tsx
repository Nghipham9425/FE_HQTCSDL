import Link from "next/link";
import { ChevronRight, PackageSearch, ReceiptText, ShieldQuestion, ArrowRight } from "lucide-react";

const supportCards = [
  {
    title: "Hướng dẫn mua hàng",
    description: "Chi tiết các bước từ chọn sản phẩm đến hoàn tất đơn.",
    href: "/support/buying-guide",
    Icon: ReceiptText,
  },
  {
    title: "Tra cứu đơn hàng",
    description: "Theo dõi trạng thái xử lý, giao hàng và lịch sử đơn gần nhất.",
    href: "/tracking",
    Icon: PackageSearch,
  },
  {
    title: "Chính sách & bảo hành",
    description: "Tổng hợp quyền lợi đổi trả, kiểm hàng và chính sách bảo mật.",
    href: "/policy/privacy",
    Icon: ShieldQuestion,
  },
];

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-(--brand-red)">
          Trang chủ
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-gray-800">Hỗ trợ</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900">Trung tâm hỗ trợ khách hàng</h1>
      <p className="mt-2 max-w-3xl text-sm text-gray-600">
        Mọi thông tin quan trọng trước và sau mua hàng được gom tại đây để bạn thao tác nhanh hơn.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {supportCards.map(({ title, description, href, Icon }) => (
          <Link
            key={title}
            href={href}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-red)]/10 text-[var(--brand-red)]">
              <Icon size={18} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand-red)]">
              Mở nhanh
              <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
