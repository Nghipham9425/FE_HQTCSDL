import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { fetchProductById, fetchRelatedProducts } from "@/lib/api/products"
import ImageGallery from "@/components/product/ImageGallery"
import ProductInfo from "@/components/product/ProductInfo"
import RelatedProducts from "@/components/product/RelatedProducts"

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { slug } = await params
  const productId = Number(slug)
  if (!Number.isFinite(productId)) return { title: "Sản phẩm không tồn tại" }

  let product = null
  try {
    product = await fetchProductById(productId)
  } catch {
    product = null
  }

  if (!product) return { title: "Sản phẩm không tồn tại" }
  return {
    title: `${product.name} – Bánh Mì Games`,
    description: product.descriptions ?? undefined,
  }
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params
  const productId = Number(slug)
  if (!Number.isFinite(productId)) notFound()

  let product = null
  try {
    product = await fetchProductById(productId)
  } catch {
    product = null
  }

  if (!product) notFound()

  const related = await fetchRelatedProducts(product, 6)

  const categoryHref =
    product.productType === "TCG_CARD" ? "pokemon-tcg" : "ps5"

  const categoryLabel =
    product.productType === "TCG_CARD" ? "Pokemon TCG" : "Console"

  return (
    <div className="pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <nav className="mx-auto flex max-w-screen-xl items-center gap-1 px-4 py-3 text-sm text-gray-500">
          <Link href="/" className="hover:text-[var(--brand-red)]">
            Trang chủ
          </Link>
          <ChevronRight size={14} />
          <Link
            href={`/products?category=${categoryHref}`}
            className="hover:text-[var(--brand-red)]"
          >
            {categoryLabel}
          </Link>
          <ChevronRight size={14} />
          <span className="line-clamp-1 font-medium text-gray-800">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-screen-xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <ImageGallery
            image={product.image || product.thumbnail}
            inStock={product.stock > 0}
            productName={product.name}
          />

          {/* Info */}
          <ProductInfo product={product} />
        </div>

        {/* Description */}
        {product.descriptions && (
          <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-bold text-gray-800">
              Mô tả sản phẩm
            </h2>
            <p className="text-sm leading-relaxed text-gray-600">
              {product.descriptions}
            </p>
          </div>
        )}
      </div>

      {/* Related */}
      <RelatedProducts products={related} />
    </div>
  )
}
