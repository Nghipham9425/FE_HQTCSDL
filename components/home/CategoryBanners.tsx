import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    label: "PlayStation 5",
    slug: "ps5",
    image: "https://i.pinimg.com/736x/cb/44/e9/cb44e938bef3d877aa115fdba8968b18.jpg",
    accent: "from-blue-900/70",
  },
  {
    label: "Nintendo Switch",
    slug: "switch",
    image: "https://forumstatic.oneplusmobile.com/opforum-gl/upload/image/front/thread/20250117/5206449932324714301/1775288102080741383/1775288102080741383.png",
    accent: "from-red-700/70",
  },
  {
    label: "Pokémon TCG",
    slug: "pokemon-tcg",
    image: "https://cdn.shopify.com/s/files/1/1601/1757/articles/How_Many_Pokemon_Cards_Are_There_So_Far_Late_2022.jpg?v=1664713281",
    accent: "from-amber-700/70",
  },
  {
    label: "One Piece TCG",
    slug: "one-piece-tcg",
    image: "https://en.onepiece-cardgame.com/renewal/images/top/pickupbnr/bnr_cs25-26.jpg",
    accent: "from-gray-900/70",
  },
];

export default function CategoryBanners() {
  return (
    <section className="mx-auto max-w-screen-xl px-4 py-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="relative h-44 w-full">
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${cat.accent} to-transparent`}
              />
            </div>

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-sm font-bold text-white drop-shadow">{cat.label}</p>
              <p className="mt-0.5 text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                Xem ngay →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

