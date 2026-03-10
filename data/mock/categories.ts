export interface Category {
  slug: string;
  label: string;
  description: string;
  color: string; // Tailwind bg color class
  navSubItems?: { label: string; href: string }[];
}

export const categories: Category[] = [
  {
    slug: "ps4",
    label: "PlayStation 4",
    description: "Đĩa game, tay cầm và phụ kiện PS4",
    color: "bg-blue-700",
    navSubItems: [
      { label: "Đĩa game PS4", href: "/products?category=ps4" },
      { label: "Tay cầm PS4", href: "/products?category=ps4&sub=controller" },
      { label: "Phụ kiện PS4", href: "/products?category=ps4&sub=accessory" },
    ],
  },
  {
    slug: "ps5",
    label: "PlayStation 5",
    description: "Đĩa game, máy chơi game và phụ kiện PS5",
    color: "bg-slate-800",
    navSubItems: [
      { label: "Đĩa game PS5", href: "/products?category=ps5" },
      { label: "Máy PS5", href: "/products?category=ps5&sub=console" },
      { label: "Tay cầm DualSense", href: "/products?category=ps5&sub=controller" },
      { label: "Phụ kiện PS5", href: "/products?category=ps5&sub=accessory" },
    ],
  },
  {
    slug: "switch",
    label: "Nintendo Switch",
    description: "Băng game và phụ kiện Nintendo Switch",
    color: "bg-red-600",
    navSubItems: [
      { label: "Băng game Switch", href: "/products?category=switch" },
      { label: "Máy Nintendo Switch 2", href: "/products?category=switch&sub=console" },
      { label: "Phụ kiện Switch", href: "/products?category=switch&sub=accessory" },
    ],
  },
  {
    slug: "pokemon-tcg",
    label: "Pokemon TCG",
    description: "Bài, hộp và phụ kiện Pokemon Trading Card Game",
    color: "bg-yellow-500",
    navSubItems: [
      { label: "Booster Box", href: "/products?category=pokemon-tcg&sub=box" },
      { label: "Booster Pack", href: "/products?category=pokemon-tcg&sub=pack" },
      { label: "Elite Trainer Box", href: "/products?category=pokemon-tcg&sub=etb" },
      { label: "Single Card", href: "/products?category=pokemon-tcg&sub=single" },
    ],
  },
  {
    slug: "one-piece-tcg",
    label: "One Piece TCG",
    description: "Bài và hộp One Piece Card Game chính hãng",
    color: "bg-rose-700",
    navSubItems: [
      { label: "Booster Box", href: "/products?category=one-piece-tcg&sub=box" },
      { label: "Booster Pack", href: "/products?category=one-piece-tcg&sub=pack" },
      { label: "Single Card", href: "/products?category=one-piece-tcg&sub=single" },
    ],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
