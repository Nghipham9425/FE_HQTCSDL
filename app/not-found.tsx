import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="text-8xl font-black text-[var(--brand-red)] opacity-20">404</div>
      <div className="-mt-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Trang không tồn tại</h1>
        <p className="mt-2 text-gray-500">Liên kết bạn truy cập không tồn tại hoặc đã bị xóa.</p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-xl bg-[var(--brand-red)] px-6 py-2.5 text-sm font-bold text-white hover:bg-[var(--brand-red-dark)] transition-colors"
        >
          Về trang chủ
        </Link>
        <Link
          href="/products"
          className="rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Xem sản phẩm
        </Link>
      </div>
    </div>
  );
}
