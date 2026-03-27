import Link from "next/link";
import { ChevronRight, CalendarDays, ArrowRight } from "lucide-react";

const posts = [
  {
    title: "5 bộ bài Pokemon TCG dễ chơi cho người mới",
    excerpt: "Gợi ý các deck cân bằng chi phí và khả năng nâng cấp để bạn bắt đầu nhanh.",
    date: "27/03/2026",
  },
  {
    title: "Mẹo bảo quản tay cầm console bền lâu",
    excerpt: "Những thói quen nhỏ giúp phụ kiện của bạn luôn ổn định sau thời gian dài sử dụng.",
    date: "25/03/2026",
  },
  {
    title: "Checklist trước khi đặt hàng online sản phẩm gaming",
    excerpt: "Kiểm tra tồn kho, chính sách đổi trả và thông tin vận chuyển để tránh rủi ro.",
    date: "21/03/2026",
  },
];

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-(--brand-red)">
          Trang chủ
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-gray-800">Tin tức</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900">Tin tức và mẹo mua sắm</h1>
      <p className="mt-2 text-sm text-gray-600">Một vài bài viết nhanh để bạn cập nhật xu hướng và mua hàng hiệu quả hơn.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <article key={post.title} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="inline-flex w-fit items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
              <CalendarDays size={12} />
              {post.date}
            </div>
            <h2 className="mt-3 text-lg font-extrabold leading-snug text-gray-900">{post.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
            <button className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand-red)]">
              Xem chi tiết
              <ArrowRight size={14} />
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
