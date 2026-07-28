import Link from "next/link"
import { type Product, fetchProductsByFilters } from "@/lib/api/products"
import ProductCatalogFilters from "@/components/product/ProductCatalogFilters"
import ProductCard from "@/components/ui/ProductCard"
import Breadcrumb from "@/components/ui/Breadcrumb"
import EmptyState from "@/components/ui/EmptyState"

type AvailabilityFilter =
  | "all"
  | "in-stock"
  | "low-stock"
  | "out-of-stock"

interface ProductsPageProps {
  searchParams: Promise<{
    sort?: string
    page?: string
    q?: string
    category?: string
    sub?: string
    availability?: AvailabilityFilter
  }>
}

type BackendFilters = {
  categoryName?: string
  productType?: string
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function resolveBackendFilters(
  category?: string,
  sub?: string,
): BackendFilters {
  const normalizedCategory = category ? normalize(category) : ""
  const normalizedSub = sub ? normalize(sub) : ""

  const categoryName =
    normalizedCategory === "pokemon-tcg" ? "Pokemon TCG" : undefined

  let productType: string | undefined
  if (normalizedCategory === "console") productType = "CONSOLE"
  else if (normalizedCategory === "accessory") productType = "ACCESSORY"

  if (!productType) {
    if (normalizedSub === "console") productType = "CONSOLE"
    else if (normalizedSub === "accessory") productType = "ACCESSORY"
  }

  return { categoryName, productType }
}

function resolvePageTitle(category?: string, sub?: string, q?: string) {
  if (q?.trim()) return `Kết quả cho "${q.trim()}"`

  const normalizedCategory = category ? normalize(category) : ""
  const normalizedSub = sub ? normalize(sub) : ""

  if (normalizedCategory === "console") return "Máy chơi game"
  if (normalizedCategory === "accessory") return "Phụ kiện"
  if (normalizedCategory === "pokemon-tcg") return "Pokémon Trading Card Game"
  if (normalizedSub === "console") return "Máy chơi game"
  if (normalizedSub === "accessory") return "Phụ kiện"

  return "Tất cả sản phẩm"
}

function buildProductsUrl(
  sort: string,
  page: number,
  category?: string,
  sub?: string,
  q?: string,
  availability?: AvailabilityFilter,
) {
  const params = new URLSearchParams()
  params.set("sort", sort)
  params.set("page", String(page))
  if (category) params.set("category", category)
  if (sub) params.set("sub", sub)
  if (q) params.set("q", q)
  if (availability && availability !== "all") {
    params.set("availability", availability)
  }
  return `/products?${params.toString()}`
}

function sortProducts(products: Product[], sort: string): Product[] {
  const sorted = [...products]
  if (sort === "newest") {
    return sorted.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  }
  if (sort === "price-asc") {
    return sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
  }
  if (sort === "price-desc" || sort === "default") {
    return sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
  }
  return sorted
}

function filterProductsByAvailability(
  products: Product[],
  availability: AvailabilityFilter,
) {
  if (availability === "in-stock") {
    return products.filter((product) => product.stock > 0)
  }
  if (availability === "low-stock") {
    return products.filter(
      (product) => product.stock > 0 && product.stock <= 5,
    )
  }
  if (availability === "out-of-stock") {
    return products.filter((product) => product.stock <= 0)
  }
  return products
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams
  const {
    sort = "price-desc",
    page = "1",
    category,
    sub,
    q,
    availability = "all",
  } = params
  const { categoryName, productType } = resolveBackendFilters(category, sub)

  const rawProducts = await fetchProductsByFilters({
    q,
    categoryName,
    productType,
  })
  const filteredProducts = filterProductsByAvailability(
    rawProducts,
    availability,
  )
  const sortedProducts = sortProducts(filteredProducts, sort)

  const currentPage = Math.max(Number(page) || 1, 1)
  const pageSize = 24
  const totalPages = Math.max(
    Math.ceil(sortedProducts.length / pageSize),
    1,
  )
  const safePage = Math.min(currentPage, totalPages)
  const start = (safePage - 1) * pageSize
  const products = sortedProducts.slice(start, start + pageSize)

  const pageTitle = resolvePageTitle(category, sub, q)
  const sortHref = (nextSort: string) =>
    buildProductsUrl(nextSort, 1, category, sub, q, availability)
  const pageHref = (nextPage: number) =>
    buildProductsUrl(sort, nextPage, category, sub, q, availability)

  const sortOptions = [
    { value: "price-desc", label: "Giá giảm" },
    { value: "price-asc", label: "Giá tăng" },
    { value: "newest", label: "Mới nhất" },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumb items={[{ label: pageTitle }]} className="mb-6" />

      <header className="mb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-red)]">
          Danh mục mua sắm
        </p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-950 sm:text-3xl">
              {pageTitle}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {filteredProducts.length} sản phẩm phù hợp
              {totalPages > 1
                ? ` · Trang ${safePage} trên ${totalPages}`
                : ""}
            </p>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Sắp xếp
            </span>
            {sortOptions.map((option) => (
              <Link
                key={option.value}
                href={sortHref(option.value)}
                aria-current={sort === option.value ? "page" : undefined}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                  sort === option.value
                    ? "border-[var(--brand-red)] bg-red-50 text-[var(--brand-red)]"
                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-7">
        <ProductCatalogFilters
          category={category}
          sub={sub}
          availability={availability}
          sort={sort}
        />

        <main className="min-w-0">
          {products.length === 0 ? (
            <EmptyState
              compact
              icon="search"
              eyebrow="Không có kết quả phù hợp"
              title={
                q?.trim()
                  ? `Chưa tìm thấy “${q.trim()}”`
                  : "Chưa có sản phẩm theo lựa chọn này"
              }
              description={
                q?.trim()
                  ? "Hãy thử một từ khóa ngắn hơn, kiểm tra lại chính tả hoặc xóa bộ lọc để mở rộng kết quả tìm kiếm."
                  : "Các bộ lọc hiện tại chưa khớp với sản phẩm nào. Bạn có thể đặt lại bộ lọc để xem toàn bộ cửa hàng."
              }
              details={[
                "Kiểm tra chính tả",
                "Thử từ khóa ngắn hơn",
                "Đặt lại bộ lọc",
              ]}
              primaryAction={{
                label: "Xem tất cả sản phẩm",
                href: "/products",
                icon: "shopping",
              }}
              secondaryAction={{
                label: "Nhờ tư vấn",
                href: "/contact",
                icon: "arrow",
              }}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <nav
                aria-label="Phân trang sản phẩm"
                className="mt-8 flex items-center justify-center gap-3"
              >
                <Link
                  href={pageHref(Math.max(safePage - 1, 1))}
                  aria-disabled={safePage === 1}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold ${
                    safePage === 1
                      ? "pointer-events-none border-slate-200 text-slate-400"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Trang trước
                </Link>
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600">
                  {safePage} / {totalPages}
                </span>
                <Link
                  href={pageHref(Math.min(safePage + 1, totalPages))}
                  aria-disabled={safePage === totalPages}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold ${
                    safePage === totalPages
                      ? "pointer-events-none border-slate-200 text-slate-400"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Trang sau
                </Link>
              </nav>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
