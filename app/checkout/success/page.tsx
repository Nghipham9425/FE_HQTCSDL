import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";

interface CheckoutSuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const params = await searchParams;
  const orderId = params.orderId?.trim();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-(--brand-red)">Trang chủ</Link>
        <ChevronRight size={14} />
        <Link href="/checkout" className="hover:text-(--brand-red)">Thanh toán</Link>
        <ChevronRight size={14} />
        <span className="font-medium text-gray-800">Đặt hàng thành công</span>
      </nav>

      <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 size={34} />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900">Đặt hàng thành công</h1>
        <p className="mt-2 text-sm text-gray-600">
          Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được ghi nhận và đang chờ xử lý.
        </p>

        {orderId ? (
          <p className="mt-4 text-sm text-gray-700">
            Mã đơn hàng của bạn là: <span className="font-extrabold text-(--brand-navy)">#{orderId}</span>
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {orderId ? (
            <Link
              href={`/account/orders/${orderId}`}
              className="rounded-xl bg-(--brand-red) px-5 py-2.5 text-sm font-semibold text-white hover:bg-(--brand-red-dark)"
            >
              Xem chi tiết đơn hàng
            </Link>
          ) : null}

          <Link
            href={orderId ? `/tracking?orderId=${orderId}` : "/tracking"}
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Tra cứu đơn hàng
          </Link>

          <Link
            href="/products"
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </section>
    </div>
  );
}