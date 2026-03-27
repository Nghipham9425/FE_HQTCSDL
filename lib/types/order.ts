export type OrderPlaceItemPayload = {
  productId: number;
  quantity: number;
};

export type OrderPlacePayload = {
  shippingAddress: string;
  phoneNumber: string;
  orderEmail?: string;
  note?: string;
  voucherCode?: string;
  paymentMethodId?: number;
  items: OrderPlaceItemPayload[];
};

export type OrderLineItem = {
  productId: number;
  sku?: string | null;
  productName: string;
  thumbnail?: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type OrderListItem = {
  id: number;
  customerId: number;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  amount: number;
  discountAmount: number;
  finalAmount: number;
  orderStatus: string;
  orderDate: string;
  shippingAddress?: string | null;
  paymentMethodName?: string | null;
  itemCount: number;
};

export type OrderDetail = {
  id: number;
  customerId: number;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  amount: number;
  discountAmount: number;
  finalAmount: number;
  orderStatus: string;
  orderDate: string;
  shippingAddress?: string | null;
  orderEmail?: string | null;
  note?: string | null;
  paymentMethodId?: number | null;
  paymentMethodName?: string | null;
  voucherCode?: string | null;
  items: OrderLineItem[];
};
