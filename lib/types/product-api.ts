export type ProductCategory = "pokemon-tcg" | "console" | "accessory"

export type ProductFilters = {
  category?: ProductCategory
  onSale?: boolean
  inStock?: boolean
  newArrival?: boolean
  bestSeller?: boolean
  search?: string
}

export type ApiProductListItem = {
  id: number
  sku: string
  name: string
  productType: string
  price: number | null
  stock: number
  reservedStock?: number
  availableStock?: number
  isActive: boolean
  thumbnail: string | null
  updatedAt: string
}

export type ApiProductDetail = {
  id: number
  sku: string
  name: string
  productType: string
  price: number | null
  originalPrice: number | null
  descriptions: string | null
  thumbnail: string | null
  image: string | null
  stock: number
  reservedStock?: number
  availableStock?: number
  isActive: boolean
  updatedAt: string
}

export type ApiProductPagedResponse = {
  page: number
  pageSize: number
  total: number
  items: ApiProductListItem[]
}
