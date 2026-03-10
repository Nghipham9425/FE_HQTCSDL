import { fetchProducts } from "@/lib/api/products";
import { categories } from "@/data/mock/categories";
import { type Product } from "@/data/mock/products";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sale?: string;
    sort?: string;
  }>;
}

function formatCategoryLabel(slug: string) {
  return categories.find((c) => c.slug === slug)?.label ?? slug;
}

function sortProducts(products: Product[], sort: string): Product[] {
  const arr = [...products];
  if (sort === "price-asc") return arr.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") return arr.sort((a, b) => b.price - a.price);
  if (sort === "discount") return arr.sort((a, b) => b.discountPercent - a.discountPercent);
  return arr; // default
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const { category, q, sale, sort = "default" } = params;

  const validCategories = ["ps4", "ps5", "switch", "pokemon-tcg", "one-piece-tcg"] as const;
  type ValidCategory = (typeof validCategories)[number];
  const safeCategory = validCategories.includes(category as ValidCategory)
    ? (category as ValidCategory)
    : undefined;

  let products = await fetchProducts({
    category: safeCategory,
    search: q?.slice(0, 100),
    onSale: sale === "true",
  });

  products = sortProducts(products, sort);

  const pageTitle = q
    ? `Kết quả tìm kiếm: "${q}"`
    : safeCategory
    ? formatCategoryLabel(safeCategory)
    : sale === "true"
    ? "Sản phẩm khuyến mãi"
    : "Tất cả sản phẩm";

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-[var(--brand-red)]">
          Trang chủ
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-gray-800">{pageTitle}</span>
      </nav>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-bold uppercase text-gray-700">Danh mục</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/products"
                  className={`block rounded px-2 py-1.5 text-sm transition-colors hover:bg-gray-50 hover:text-[var(--brand-red)] ${
                    !safeCategory ? "font-semibold text-[var(--brand-red)]" : "text-gray-700"
                  }`}
                >
                  Tất cả sản phẩm
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className={`block rounded px-2 py-1.5 text-sm transition-colors hover:bg-gray-50 hover:text-[var(--brand-red)] ${
                      safeCategory === cat.slug
                        ? "font-semibold text-[var(--brand-red)]"
                        : "text-gray-700"
                    }`}
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-extrabold text-gray-900">{pageTitle}</h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">{products.length} sản phẩm</span>
              <select
                defaultValue={sort}
                onChange={(e) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set("sort", e.target.value);
                  window.location.href = url.toString();
                }}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]"
              >
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="discount">Khuyến mãi nhiều nhất</option>
              </select>
            </div>
          </div>

          {/* Mobile category chips */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide lg:hidden">
            <Link
              href="/products"
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                !safeCategory
                  ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Tất cả
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  safeCategory === cat.slug
                    ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Grid */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-24 text-center text-gray-500">
              <span className="text-5xl">😕</span>
              <p className="text-lg font-semibold">Không tìm thấy sản phẩm</p>
              <Link href="/products" className="text-sm text-[var(--brand-red)] hover:underline">
                Xem tất cả sản phẩm
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
