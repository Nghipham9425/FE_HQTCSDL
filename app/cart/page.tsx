"use client";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/stores/cartStore";

function formatPrice(p: number) {
  return p.toLocaleString("vi-VN") + "đ";
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-6 px-4 py-24 text-center">
        <ShoppingBag size={72} className="text-gray-300" />
        <h1 className="text-2xl font-extrabold text-gray-800">Giỏ hàng trống</h1>
        <p className="text-gray-500">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
        <Link
          href="/products"
          className="rounded-xl bg-[var(--brand-red)] px-8 py-3 font-bold text-white hover:bg-[var(--brand-red-dark)] transition-colors"
        >
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-[var(--brand-red)]">Trang chủ</Link>
        <ChevronRight size={14} />
        <span className="font-medium text-gray-800">Giỏ hàng</span>
      </nav>

      <h1 className="mb-6 text-2xl font-extrabold text-gray-900">
        Giỏ hàng ({totalItems()} sản phẩm)
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items list */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Header row */}
            <div className="hidden grid-cols-12 gap-4 border-b border-gray-100 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase text-gray-500 md:grid">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-center">Thành tiền</div>
            </div>

            {items.map((item) => (
              <div
                key={item.product.id}
                className="grid grid-cols-12 gap-4 border-b border-gray-100 px-4 py-4 last:border-b-0 items-center"
              >
                {/* Product */}
                <div className="col-span-12 flex items-center gap-3 md:col-span-6">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-sm font-semibold text-gray-800 hover:text-[var(--brand-red)] line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <span className="text-xs text-gray-400">{item.product.brand}</span>
                    {/* Mobile price */}
                    <span className="font-bold text-[var(--brand-red)] md:hidden">
                      {formatPrice(item.product.price)}
                    </span>
                  </div>
                </div>

                {/* Unit price */}
                <div className="col-span-2 hidden text-center text-sm text-gray-700 md:block">
                  {formatPrice(item.product.price)}
                </div>

                {/* Quantity */}
                <div className="col-span-5 flex items-center justify-start gap-1 md:col-span-2 md:justify-center">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="col-span-5 hidden text-center text-sm font-bold text-[var(--brand-red)] md:col-span-2 md:block">
                  {formatPrice(item.product.price * item.quantity)}
                </div>

                {/* Subtotal mobile */}
                <div className="col-span-2 flex items-center justify-end md:hidden">
                  <span className="text-sm font-bold text-[var(--brand-red)]">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>

                {/* Remove */}
                <div className="col-span-12 flex justify-end md:col-span-12 lg:col-span-12">
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom actions */}
          <div className="mt-4 flex items-center justify-between">
            <Link
              href="/products"
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[var(--brand-red)] transition-colors"
            >
              <ArrowLeft size={16} />
              Tiếp tục mua sắm
            </Link>
            <button
              onClick={clearCart}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Xóa tất cả
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-extrabold text-gray-800">Tóm tắt đơn hàng</h2>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Tạm tính ({totalItems()} sản phẩm)</span>
                <span className="font-medium">{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-green-600">Miễn phí</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-base font-extrabold text-gray-900">
                <span>Tổng cộng</span>
                <span className="text-[var(--brand-red)]">{formatPrice(totalPrice())}</span>
              </div>
            </div>

            {/* Promo code */}
            <div className="mt-4 flex overflow-hidden rounded-lg border border-gray-300">
              <input
                type="text"
                placeholder="Mã giảm giá"
                className="flex-1 px-3 py-2 text-sm text-gray-700 focus:outline-none"
              />
              <button className="bg-[var(--brand-navy)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--brand-navy-dark)] transition-colors">
                Áp dụng
              </button>
            </div>

            <Link
              href="/checkout"
              className="mt-4 flex w-full items-center justify-center rounded-xl bg-[var(--brand-red)] py-3.5 text-sm font-bold text-white hover:bg-[var(--brand-red-dark)] transition-colors"
            >
              Tiến hành thanh toán
            </Link>

            {/* Trust */}
            <div className="mt-4 space-y-1.5 text-xs text-gray-500">
              <p>✅ Cam kết 100% sản phẩm chính hãng</p>
              <p>🚚 Miễn phí vận chuyển toàn quốc</p>
              <p>🔄 Đổi trả trong vòng 7 ngày</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
