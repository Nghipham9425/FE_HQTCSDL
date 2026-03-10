"use client";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Zap, Shield, Package, RefreshCw, Truck, HeadphonesIcon } from "lucide-react";
import { type Product } from "@/data/mock/products";

interface ProductInfoProps {
  product: Product;
}

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "đ";
}

const categoryLabel: Record<Product["category"], string> = {
  ps4: "PlayStation 4",
  ps5: "PlayStation 5",
  switch: "Nintendo Switch",
  "pokemon-tcg": "Pokemon TCG",
  "one-piece-tcg": "One Piece TCG",
};

const commitments = [
  { icon: Shield, label: "Cam kết 100% chính hãng" },
  { icon: Truck, label: "Miễn phí giao hàng" },
  { icon: HeadphonesIcon, label: "Hỗ trợ 24/7" },
  { icon: Package, label: "Mở hộp kiểm tra nhận hàng" },
  { icon: RefreshCw, label: "Đổi trả trong 7 ngày" },
  { icon: Zap, label: "Hoàn tiền 111% nếu hàng giả" },
];

export default function ProductInfo({ product }: ProductInfoProps) {
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-col gap-5">
      {/* Brand + Name */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {product.brand}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold leading-snug text-gray-900">
          {product.name}
        </h1>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
        <span>
          <span className="font-medium">Mã sản phẩm:</span>{" "}
          <span className="text-[var(--brand-navy)]">{product.sku}</span>
        </span>
        <span>
          <span className="font-medium">Tình trạng:</span>{" "}
          <span className={product.inStock ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
            {product.inStock ? "Còn hàng" : "Hết hàng"}
          </span>
        </span>
        <span>
          <span className="font-medium">Thương hiệu:</span>{" "}
          <span className="text-[var(--brand-navy)] font-semibold">{product.brand}</span>
        </span>
        <span>
          <span className="font-medium">Danh mục:</span>{" "}
          <span className="text-[var(--brand-navy)]">{categoryLabel[product.category]}</span>
        </span>
      </div>

      <hr className="border-gray-200" />

      {/* Pricing */}
      <div className="flex items-center gap-4">
        <span className="text-3xl font-extrabold text-[var(--brand-red)]">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice > product.price && (
          <>
            <span className="text-lg text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="rounded bg-[var(--brand-red)] px-2 py-0.5 text-sm font-bold text-white">
              -{product.discountPercent}%
            </span>
          </>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* Quantity */}
      {product.inStock && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Số lượng:</span>
          <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-9 w-9 items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center text-sm font-semibold">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="flex h-9 w-9 items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {product.inStock ? (
          <>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--brand-red)] py-3 text-base font-bold text-white hover:bg-[var(--brand-red-dark)] transition-colors">
              MUA NGAY
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[var(--brand-red)] py-3 text-base font-bold text-[var(--brand-red)] hover:bg-red-50 transition-colors">
              <ShoppingBag size={18} />
              THÊM VÀO GIỎ
            </button>
          </>
        ) : (
          <button
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-300 py-3 text-base font-bold text-gray-500 cursor-not-allowed"
          >
            HẾT HÀNG
          </button>
        )}
      </div>

      {/* Commitments */}
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-3">
        {commitments.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-xs text-gray-600">
            <Icon size={14} className="shrink-0 text-[var(--brand-navy)]" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
