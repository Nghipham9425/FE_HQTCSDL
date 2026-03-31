import { fetchProductsByFilters } from "@/lib/api/products"
import { type Product } from "@/lib/api/products"
import ProductCard from "@/components/ui/ProductCard"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface ProductsPageProps {
  searchParams: Promise<{
    sort?: string
    page?: string
    q?: string
    category?: string
    sub?: string
  }>
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function containsAny(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword))
}

type BackendFilters = {
  categoryName?: string
  productType?: string
}

function resolveBackendFilters(
  category?: string,
  sub?: string,
): BackendFilters {
  const normalizedCategory = category ? normalize(category) : ""
  const normalizedSub = sub ? normalize(sub) : ""

  const categoryName: string | undefined =
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
  if (q && q.trim()) return `Kết quả cho "${q.trim()}"`

  const normalizedCategory = category ? normalize(category) : ""
  const normalizedSub = sub ? normalize(sub) : ""

  if (normalizedCategory === "console") return "Console"
  if (normalizedCategory === "accessory") return "Accessory"
  if (normalizedCategory === "pokemon-tcg") return "Pokemon Trading Card Game"
  if (normalizedSub === "console") return "Console"
  if (normalizedSub === "accessory") return "Accessory"

  return "Tất cả sản phẩm"
}

function buildProductsUrl(
  sort: string,
  page: number,
  category?: string,
  sub?: string,
  q?: string,
) {
  const params = new URLSearchParams()
  params.set("sort", sort)
  params.set("page", String(page))
  if (category) params.set("category", category)
  if (sub) params.set("sub", sub)
  if (q) params.set("q", q)
  return `/products?${params.toString()}`
}

function sortProducts(products: Product[], sort: string): Product[] {
  const arr = [...products]
  if (sort === "newest") {
    return arr.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  }
  if (sort === "price-asc")
    return arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
  if (sort === "price-desc" || sort === "default")
    return arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
  return arr
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams
  const { sort = "price-desc", page = "1", category, sub, q } = params
  const { categoryName, productType } = resolveBackendFilters(category, sub)

  const rawProducts = await fetchProductsByFilters({
    q,
    categoryName,
    productType,
  })

  const filteredProducts = rawProducts

  let products = sortProducts(filteredProducts, sort)

  const currentPage = Math.max(Number(page) || 1, 1)
  const pageSize = 24
  const totalPages = Math.max(Math.ceil(products.length / pageSize), 1)
  const safePage = Math.min(currentPage, totalPages)
  const start = (safePage - 1) * pageSize
  const end = start + pageSize
  products = products.slice(start, end)

  const pageTitle = resolvePageTitle(category, sub, q)

  const sortHref = (nextSort: string) =>
    buildProductsUrl(nextSort, 1, category, sub, q)
  const pageHref = (nextPage: number) =>
    buildProductsUrl(sort, nextPage, category, sub, q)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-(--brand-red)">
          Trang chủ
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-gray-800">{pageTitle}</span>
      </nav>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-extrabold text-gray-900">
              {pageTitle}
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">
                Trang {safePage}/{totalPages} - {filteredProducts.length} sản
                phẩm
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={sortHref("default")}
                  className={`rounded-lg border px-3 py-1.5 ${
                    sort === "default"
                      ? "border-(--brand-red) text-(--brand-red)"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  Mặc định
                </Link>
                <Link
                  href={sortHref("price-asc")}
                  className={`rounded-lg border px-3 py-1.5 ${
                    sort === "price-asc"
                      ? "border-(--brand-red) text-(--brand-red)"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  Giá tăng
                </Link>
                <Link
                  href={sortHref("price-desc")}
                  className={`rounded-lg border px-3 py-1.5 ${
                    sort === "price-desc"
                      ? "border-(--brand-red) text-(--brand-red)"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  Giá giảm
                </Link>
              </div>
            </div>
          </div>

          {/* Grid */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-24 text-center text-gray-500">
              <span className="text-5xl">😕</span>
              <p className="text-lg font-semibold">Không tìm thấy sản phẩm</p>
              <Link
                href="/products"
                className="text-sm text-(--brand-red) hover:underline"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                <Link
                  href={pageHref(Math.max(safePage - 1, 1))}
                  className={`rounded-lg border px-4 py-2 text-sm ${
                    safePage === 1
                      ? "pointer-events-none border-gray-200 text-gray-400"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Trang trước
                </Link>
                <span className="text-sm text-gray-600">
                  {safePage} / {totalPages}
                </span>
                <Link
                  href={pageHref(Math.min(safePage + 1, totalPages))}
                  className={`rounded-lg border px-4 py-2 text-sm ${
                    safePage === totalPages
                      ? "pointer-events-none border-gray-200 text-gray-400"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Trang sau
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
