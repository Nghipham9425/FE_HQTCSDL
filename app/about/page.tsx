import Link from "next/link";
import { ChevronRight, ShieldCheck, Truck, RefreshCw, Headphones } from "lucide-react";

const highlights = [
  {
    title: "Sản phẩm chính hãng",
    description: "Console, phụ kiện và Pokemon TCG được tuyển chọn từ nguồn phân phối rõ ràng.",
    Icon: ShieldCheck,
  },
  {
    title: "Giao hàng nhanh",
    description: "Xử lý đơn hàng trong ngày và giao toàn quốc với cập nhật trạng thái liên tục.",
    Icon: Truck,
  },
  {
    title: "Đổi trả linh hoạt",
    description: "Hỗ trợ đổi trả trong 7 ngày theo chính sách công khai, minh bạch.",
    Icon: RefreshCw,
  },
  {
    title: "Hỗ trợ tận tâm",
    description: "Đội ngũ hỗ trợ 24/7 qua hotline, email và kênh mạng xã hội.",
    Icon: Headphones,
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-(--brand-red)">
          Trang chủ
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-gray-800">Giới thiệu</span>
      </nav>

      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[var(--brand-navy)] to-slate-800 px-6 py-8 text-white md:px-10 md:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">CardgameCenter</p>
          <h1 className="mt-2 text-3xl font-black leading-tight md:text-4xl">Game · Card · Store dành cho cộng đồng đam mê</h1>
          <p className="mt-3 max-w-3xl text-sm text-white/85 md:text-base">
            CardgameCenter được xây dựng để mang trải nghiệm mua sắm rõ ràng, nhanh và đáng tin cho game thủ và người chơi TCG tại Việt Nam.
          </p>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 md:p-8">
          {highlights.map(({ title, description, Icon }) => (
            <article key={title} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-red)]/10 text-[var(--brand-red)]">
                <Icon size={16} />
              </div>
              <h2 className="text-base font-bold text-gray-900">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
