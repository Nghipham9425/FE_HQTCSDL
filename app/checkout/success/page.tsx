import Link from "next/link";
import { AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import PaymentConfirmationStatus from "@/components/checkout/PaymentConfirmationStatus";
import SePayFinalizeHandler from "@/components/checkout/SePayFinalizeHandler";

interface CheckoutSuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
    payment?: string;
    amount?: string;
    status?: string;
  }>;
}

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const params = await searchParams;
  const orderId = params.orderId?.trim();
  const payment = params.payment?.trim().toUpperCase();
  const callbackStatus = params.status?.trim().toLowerCase();
  const amount = Number(params.amount ?? "0");
  const isCancelled = callbackStatus === "cancel";
  const isError = callbackStatus === "error";
  const isPaymentIssue = isCancelled || isError;
  const pageTitle = isPaymentIssue ? "Trạng thái thanh toán" : "Đặt hàng thành công";
  const heading = isCancelled
    ? "Bạn đã hủy thanh toán"
    : isError
      ? "Thanh toán chưa thành công"
      : "Đặt hàng thành công";
  const subHeading = isCancelled
    ? "Bạn có thể thanh toán lại bất cứ lúc nào từ trang này."
    : isError
      ? "Đã có lỗi trong quá trình thanh toán. Vui lòng thử lại."
      : "Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được ghi nhận và đang chờ xử lý.";

  const isSePay = payment === "SEPAY" && Number.isFinite(amount) && amount > 0 && !!orderId;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-(--brand-red)">Trang chủ</Link>
        <ChevronRight size={14} />
        <Link href="/checkout" className="hover:text-(--brand-red)">Thanh toán</Link>
        <ChevronRight size={14} />
        <span className="font-medium text-gray-800">{pageTitle}</span>
      </nav>

      <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div
          className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
            isPaymentIssue ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"
          }`}
        >
          {isPaymentIssue ? <AlertTriangle size={34} /> : <CheckCircle2 size={34} />}
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900">{heading}</h1>
        <p className="mt-2 text-sm text-gray-600">{subHeading}</p>

        {isPaymentIssue ? (
          <div className="mx-auto mt-4 max-w-xl rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            {isCancelled
              ? "Giao dịch đã bị hủy ở cổng SePay. Bạn có thể tạo lại đơn khi cần."
              : "SePay trả về trạng thái lỗi. Vui lòng tạo lại thanh toán."}
          </div>
        ) : null}

        {orderId ? (
          <p className="mt-4 text-sm text-gray-700">
            Mã đơn hàng của bạn là: <span className="font-extrabold text-(--brand-navy)">#{orderId}</span>
          </p>
        ) : null}

        {orderId ? (
          <SePayFinalizeHandler
            orderId={Number(orderId)}
            payment={payment ?? ""}
            status={callbackStatus}
          />
        ) : null}

        {isSePay ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
            <p className="text-sm font-bold text-slate-900">Thanh toán SePay</p>
            <p className="mt-1 text-xs text-slate-600">
              Thanh toán được xử lý qua cổng SePay. Hệ thống sẽ tự động cập nhật trạng thái
              đơn hàng khi nhận webhook xác nhận.
            </p>

            {!isPaymentIssue && orderId ? (
              <PaymentConfirmationStatus orderId={Number(orderId)} />
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {isPaymentIssue ? (
            <Link
              href="/checkout"
              className="rounded-xl bg-(--brand-red) px-5 py-2.5 text-sm font-semibold text-white hover:bg-(--brand-red-dark)"
            >
              Tạo lại thanh toán
            </Link>
          ) : null}

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