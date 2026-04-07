"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Zap, Shield, Package, RefreshCw, Truck, HeadphonesIcon, CheckCircle, Heart } from "lucide-react";
import { toast } from "sonner";
import { type ProductDetail } from "@/lib/api/products";
import { useCartStore } from "@/lib/stores/cartStore";
import { useWishlistStore } from "@/lib/stores/wishlistStore";

interface ProductInfoProps {
  product: ProductDetail;
}

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "đ";
}

function resolveCategoryLabel(productType: string) {
  if (productType === "TCG_CARD") return "Pokemon TCG";
  if (productType === "ACCESSORY") return "Phu kien";
  if (productType === "CONSOLE") return "Console";
  return "San pham";
}

const commitments = [
  { icon: Shield, label: "Cam kết 100% chính hãng" },
  { icon: Truck, label: "Miễn phí giao hàng" },
  { icon: HeadphonesIcon, label: "Hỗ trợ 24/7" },
  { icon: Package, label: "Mở hộp kiểm tra nhận hàng" },
  { icon: RefreshCw, label: "Đổi trả trong 7 ngày" },
  { icon: Zap, label: "Hoàn tiền 111% nếu hàng giả" },
];

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const hydrateWishlist = useWishlistStore((s) => s.hydrate);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const wished = useWishlistStore((s) =>
    s.items.some((item) => String(item.id) === String(product.id)),
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const availableStock =
    typeof product.availableStock === "number"
      ? product.availableStock
      : product.stock;
  const inStock = availableStock > 0;
  const price = product.price ?? 0;
  const originalPrice = product.originalPrice ?? price;
  const discountPercent = originalPrice > price && originalPrice > 0
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  function handleAddToCart() {
    if (!inStock) return;

    addItem(
      {
        id: product.id,
        sku: product.sku,
        name: product.name,
        productType: product.productType,
        price: product.price,
          stock: availableStock,
        isActive: product.isActive,
        thumbnail: product.thumbnail,
        updatedAt: product.updatedAt,
      },
      qty,
    );

    toast.success(`Đã thêm ${qty} sản phẩm vào giỏ hàng`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    if (!inStock) return;

    addItem(
      {
        id: product.id,
        sku: product.sku,
        name: product.name,
        productType: product.productType,
        price: product.price,
          stock: availableStock,
        isActive: product.isActive,
        thumbnail: product.thumbnail,
        updatedAt: product.updatedAt,
      },
      qty,
    );

    toast.success("Đã thêm sản phẩm, chuyển đến thanh toán");
    router.push("/checkout");
  }

  async function handleToggleWishlist() {
    const wasWished = wished;
    try {
      await toggleWishlist({
        id: product.id,
        sku: product.sku,
        name: product.name,
        productType: product.productType,
        price: product.price,
        stock: availableStock,
        isActive: product.isActive,
        thumbnail: product.thumbnail,
        updatedAt: product.updatedAt,
      });
      toast.success(
        wasWished
          ? "Đã xóa sản phẩm khỏi wishlist"
          : "Đã thêm sản phẩm vào wishlist",
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      const isUnauthorized =
        message === "Unauthorized" || message === "Session expired";

      if (isUnauthorized) {
        toast.error("Vui lòng đăng nhập để dùng wishlist");
        const nextPath = `${window.location.pathname}${window.location.search}`;
        window.location.href = `/auth/login?next=${encodeURIComponent(nextPath)}`;
        return;
      }

      toast.error(message || "Không thể cập nhật wishlist");
    }
  }

  useEffect(() => {
    void hydrateWishlist();
  }, [hydrateWishlist]);

  return (
    <div className="flex flex-col gap-5">
      {/* Brand + Name */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{product.productType}</p>
        <h1 className="mt-1 text-2xl font-extrabold leading-snug text-gray-900">
          {product.name}
        </h1>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
        <span>
          <span className="font-medium">Mã sản phẩm:</span>{" "}
          <span className="text-(--brand-navy)">{product.sku}</span>
        </span>
        <span>
          <span className="font-medium">Tình trạng:</span>{" "}
          <span className={inStock ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
            {inStock ? "Con hang" : "Het hang"}
          </span>
        </span>
        <span>
          <span className="font-medium">Danh muc:</span>{" "}
          <span className="text-(--brand-navy)">{resolveCategoryLabel(product.productType)}</span>
        </span>
      </div>

      <hr className="border-gray-200" />

      {/* Pricing */}
      <div className="flex items-center gap-4">
        <span className="text-(--brand-red) text-3xl font-extrabold">
          {formatPrice(price)}
        </span>
        {originalPrice > price && (
          <>
            <span className="text-lg text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
            <span className="bg-(--brand-red) rounded px-2 py-0.5 text-sm font-bold text-white">
              -{discountPercent}%
            </span>
          </>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* Quantity */}
      {inStock && (
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
              onClick={() => setQty((q) => Math.min(availableStock, q + 1))}
              className="flex h-9 w-9 items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {inStock ? (
          <>
            <button
              onClick={handleBuyNow}
              className="bg-(--brand-red) hover:bg-(--brand-red-dark) flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-base font-bold text-white transition-colors"
            >
              MUA NGAY
            </button>
            <button
              onClick={handleAddToCart}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 text-base font-bold transition-colors ${
                added
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-(--brand-red) text-(--brand-red) hover:bg-red-50"
              }`}
            >
              {added ? <CheckCircle size={18} /> : <ShoppingBag size={18} />}
              {added ? "ĐÃ THÊM" : "THÊM VÀO GIỎ"}
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

      <button
        onClick={handleToggleWishlist}
        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
          wished
            ? "border-rose-300 bg-rose-50 text-rose-600"
            : "border-gray-300 text-gray-700 hover:border-rose-300 hover:text-rose-600"
        }`}
      >
        <Heart size={16} className={wished ? "fill-current" : ""} />
        {wished ? "Đã có trong wishlist" : "Thêm vào wishlist"}
      </button>

      {/* Commitments */}
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-3">
        {commitments.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-xs text-gray-600">
            <Icon size={14} className="text-(--brand-navy) shrink-0" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
