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
  const [bestSellers, onSale, consoleNew, accessoryNew, tcgNew] =
    await Promise.all([
      fetchBestSellers(8),
      fetchOnSale(8),
      fetchNewArrivals("console", 10),
      fetchNewArrivals("accessory", 10),
      fetchNewArrivals("pokemon-tcg", 10),
    ]);

  return (
    <div className="pb-10">
      <HeroBanner />
      <CategoryBanners />
      <BestSellersCarousel products={bestSellers} />
      <SearchTrends />
      <NewArrivals
        productsByCategory={{
          console: consoleNew,
          accessory: accessoryNew,
          "pokemon-tcg": tcgNew,
        }}
      />
      <div className="mx-auto max-w-screen-xl px-4">
        <SaleCarousel products={onSale} />
      </div>
      <BlogSection posts={blogPosts} />
    </div>
  );
}

