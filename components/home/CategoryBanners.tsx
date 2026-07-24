import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    label: "Console",
    slug: "console",
    image:
      "https://i.pinimg.com/736x/cb/44/e9/cb44e938bef3d877aa115fdba8968b18.jpg",
    accent: "from-blue-950/85",
  },
  {
    label: "Phụ kiện",
    slug: "accessory",
    image:
      "https://forumstatic.oneplusmobile.com/opforum-gl/upload/image/front/thread/20250117/5206449932324714301/1775288102080741383/1775288102080741383.png",
    accent: "from-red-950/85",
  },
  {
    label: "Pokémon TCG",
    slug: "pokemon-tcg",
    image:
      "https://cdn.shopify.com/s/files/1/1601/1757/articles/How_Many_Pokemon_Cards_Are_There_So_Far_Late_2022.jpg?v=1664713281",
    accent: "from-amber-950/85",
  },
]

export default function CategoryBanners() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--brand-red)]">
            Chọn thế giới của bạn
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
            Danh mục nổi bật
          </h2>
        </div>
        <Link
          href="/products"
          className="hidden text-sm font-bold text-[var(--brand-navy)] transition hover:text-[var(--brand-red)] sm:block"
        >
          Xem tất cả →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
            className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-44 w-full sm:h-52">
              <Image
                src={category.image}
                alt={category.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${category.accent} via-black/10 to-transparent`}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-xl font-extrabold text-white drop-shadow">
                {category.label}
              </p>
              <p className="mt-1 text-xs font-bold text-white/75 transition group-hover:text-white">
                Khám phá ngay →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
