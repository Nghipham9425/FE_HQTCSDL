export type PagedResponse<T> = {
  page: number
  pageSize: number
  total: number
  items: T[]
}

export type AdminProduct = {
  id: number
  sku: string
  name: string
  productType: string
  price: number | null
  stock: number
  isActive: boolean
  thumbnail: string | null
  updatedAt: string
}

export type AdminCategory = {
  id: number | null
  name: string
  thumbnail: string | null
  productCount: number
}

export type AdminCategoryDetail = {
  id: number
  name: string
  description: string | null
  thumbnail: string | null
  productCount: number
}

export type AdminCategoryUpsert = {
  name: string
  description: string | null
  thumbnail: string | null
}

export type AdminVoucher = {
  id: number
  code: string
  name: string
  discountType: string
  discountValue: number
  minOrderValue: number
  maxDiscount: number | null
  usageLimit: number | null
  startDate: string
  endDate: string
  isActive: boolean
}

export type AdminVoucherDetail = AdminVoucher & {
  usedCount: number
}

export type AdminVoucherUpsert = {
  code: string
  name: string
  discountType: string
  discountValue: number
  minOrderValue: number
  maxDiscount: number | null
  usageLimit: number | null
  startDate: string
  endDate: string
  isActive: boolean
}

export type AdminPaymentMethod = {
  id: number
  methodName: string
  isActive: boolean
  paymentCount: number
}

export type AdminPaymentMethodDetail = AdminPaymentMethod

export type AdminPaymentMethodUpsert = {
  methodName: string
  isActive: boolean
}

export type AdminTcgCard = {
  cardId: string
  setId: string
  setName: string | null
  name: string
  cardNumber: string
  rarity: string | null
  imageSmall: string | null
  imageLarge: string | null
}

export type AdminTcgCardDetail = AdminTcgCard & {
  series: string | null
  releaseDate: string | null
}

export type AdminTcgCardUpsert = {
  cardId: string
  setId: string
  name: string
  cardNumber: string
  rarity: string | null
  imageSmall: string | null
  imageLarge: string | null
}

export type AdminTcgSet = {
  setId: string
  name: string
  series: string | null
  releaseDate: string | null
  totalCards: number | null
  logoUrl: string | null
  cardCount: number
}

export type AdminTcgSetDetail = AdminTcgSet

export type AdminTcgSetUpsert = {
  setId: string
  name: string
  series: string | null
  releaseDate: string | null
  totalCards: number | null
  logoUrl: string | null
}

export type AdminDashboardStats = {
  products: number
  categories: number
  vouchers: number
  paymentMethods: number
  tcgCards: number
  tcgSets: number
}

export type AdminOrder = {
  id: number
  customerId: number
  customerName: string | null
  customerEmail: string | null
  customerPhone: string | null
  amount: number
  discountAmount: number
  finalAmount: number
  orderStatus: string
  orderDate: string
  shippingAddress: string | null
  paymentMethodName: string | null
  itemCount: number
}

export type AdminOrderDetailItem = {
  productId: number
  sku: string | null
  productName: string
  thumbnail: string | null
  unitPrice: number
  quantity: number
  lineTotal: number
}

export type AdminOrderDetail = {
  id: number
  customerId: number
  customerName: string | null
  customerEmail: string | null
  customerPhone: string | null
  amount: number
  discountAmount: number
  finalAmount: number
  orderStatus: string
  orderDate: string
  shippingAddress: string | null
  orderEmail: string | null
  note: string | null
  paymentMethodId: number | null
  paymentMethodName: string | null
  voucherCode: string | null
  items: AdminOrderDetailItem[]
}

export type AdminProductDetail = {
  id: number
  sku: string
  name: string
  productType: string
  price: number | null
  originalPrice: number | null
  weight: number | null
  descriptions: string | null
  thumbnail: string | null
  image: string | null
  stock: number
  isActive: boolean
  cardId: string | null
  categoryIds: number[]
  createDate: string
  updatedAt: string
}

export type AdminProductUpsert = {
  sku: string
  name: string
  productType: string
  price: number | null
  originalPrice: number | null
  weight: number | null
  descriptions: string | null
  thumbnail: string | null
  image: string | null
  stock: number
  isActive: boolean
  cardId: string | null
  categoryIds: number[]
}
