import HeroBanner from "@/components/home/HeroBanner";
import BestSellersCarousel from "@/components/home/BestSellersCarousel";
import SearchTrends from "@/components/home/SearchTrends";
import NewArrivals from "@/components/home/NewArrivals";
import CategoryBanners from "@/components/home/CategoryBanners";
import SaleCarousel from "@/components/home/SaleCarousel";
import BlogSection from "@/components/home/BlogSection";
import {
  fetchBestSellers,
  fetchNewArrivals,
  fetchOnSale,
} from "@/lib/api/products";
import { blogPosts } from "@/data/mock/blogs";

export default async function HomePage() {
  const [bestSellers, onSale, ps5New, switchNew, tcgNew, opNew] =
    await Promise.all([
      fetchBestSellers(8),
      fetchOnSale(8),
      fetchNewArrivals("ps5", 10),
      fetchNewArrivals("switch", 10),
      fetchNewArrivals("pokemon-tcg", 10),
      fetchNewArrivals("one-piece-tcg", 10),
    ]);

  return (
    <div className="pb-10">
      <HeroBanner />
      <CategoryBanners />
      <BestSellersCarousel products={bestSellers} />
      <SearchTrends />
      <NewArrivals
        productsByCategory={{
          ps5: ps5New,
          switch: switchNew,
          "pokemon-tcg": tcgNew,
          "one-piece-tcg": opNew,
        }}
      />
      <div className="mx-auto max-w-screen-xl px-4">
        <SaleCarousel products={onSale} />
      </div>
      <BlogSection posts={blogPosts} />
    </div>
  );
}

