import HeroBanner from "@/components/home/HeroBanner"
import BestSellersCarousel from "@/components/home/BestSellersCarousel"
import SearchTrends from "@/components/home/SearchTrends"
import NewArrivals from "@/components/home/NewArrivals"
import CategoryBanners from "@/components/home/CategoryBanners"
import SaleCarousel from "@/components/home/SaleCarousel"
import WishlistPreview from "@/components/home/WishlistPreview"
import {
  fetchBestSellers,
  fetchNewArrivals,
  fetchOnSale,
} from "@/lib/api/products"

export default async function HomePage() {
  const [bestSellers, onSale, consoleNew, accessoryNew, tcgNew] =
    await Promise.all([
      fetchBestSellers(8),
      fetchOnSale(8),
      fetchNewArrivals("console", 10),
      fetchNewArrivals("accessory", 10),
      fetchNewArrivals("pokemon-tcg", 10),
    ])

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
      <WishlistPreview />
      <div className="mx-auto max-w-screen-xl px-4">
        <SaleCarousel products={onSale} />
      </div>
    </div>
  )
}
