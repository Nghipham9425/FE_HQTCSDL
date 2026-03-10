"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { type Product } from "@/data/mock/products";

type TabKey = "ps5" | "switch" | "pokemon-tcg" | "one-piece-tcg";

const tabs: { key: TabKey; label: string }[] = [
  { key: "ps5", label: "Playstation 5" },
  { key: "switch", label: "Nintendo Switch" },
  { key: "pokemon-tcg", label: "Trading Card Game" },
  { key: "one-piece-tcg", label: "One Piece TCG" },
];

interface NewArrivalsProps {
  productsByCategory: Record<TabKey, Product[]>;
}

export default function NewArrivals({ productsByCategory }: NewArrivalsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("ps5");
  const products = productsByCategory[activeTab] ?? [];

  return (
    <section className="mx-auto max-w-screen-xl px-4 py-10">
      {/* Header with tabs */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader title="Hàng mới về" />
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? "bg-[var(--brand-navy)] text-white"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex gap-4">
        {/* Promo banner (desktop) */}
        <div className="hidden w-48 shrink-0 overflow-hidden rounded-2xl lg:block">
          <Link href="/products?sort=newest" className="group relative block h-full min-h-[400px]">
            <Image
              src="https://jawbreakers.cards/cdn/shop/files/jawbreakers_pokemon_vertical_banner.jpg?v=1665508277&width=1500"
              alt="Hàng mới về"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-1.5 px-4 text-center">
              <span className="rounded-full bg-yellow-400 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-gray-900">
                Mới nhất
              </span>
              <p className="text-sm font-black uppercase text-white drop-shadow">Xem ngay</p>
            </div>
          </Link>
        </div>

        {/* Product grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
