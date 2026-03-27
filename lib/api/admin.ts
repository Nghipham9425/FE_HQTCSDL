import { API_ROOT } from "@/utils/constant";
import { getAccessToken, refreshAccessToken } from "@/lib/api/auth";
import {
  type AdminCategory,
  type AdminCategoryDetail,
  type AdminCategoryUpsert,
  type AdminDashboardStats,
  type AdminPaymentMethod,
  type AdminPaymentMethodDetail,
  type AdminPaymentMethodUpsert,
  type AdminOrder,
  type AdminOrderDetail,
  type AdminProductDetail,
  type AdminProductUpsert,
  type AdminProduct,
  type AdminTcgCard,
  type AdminTcgCardDetail,
  type AdminTcgCardUpsert,
  type AdminTcgSet,
  type AdminTcgSetDetail,
  type AdminTcgSetUpsert,
  type AdminVoucher,
  type AdminVoucherDetail,
  type AdminVoucherUpsert,
  type PagedResponse,
} from "@/lib/types/admin";

type QueryValue = string | number | boolean | undefined | null;

type QueryParams = Record<string, QueryValue>;

function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function refreshAndRetry<T>(executor: (headers: HeadersInit) => Promise<Response>): Promise<T> {
  await refreshAccessToken();
  const retry = await executor(getAuthHeaders());

  if (!retry.ok) {
    let message = `Admin API failed: ${retry.status}`;
    try {
      const body = (await retry.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // ignore parse errors and keep fallback message
    }
    throw new Error(message);
  }

  if (retry.status === 204) return null as T;
  return (await retry.json()) as T;
}

async function adminGet<T>(path: string, params?: QueryParams): Promise<T> {
  const url = new URL(`${API_ROOT}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const makeRequest = (extraHeaders: HeadersInit) =>
    fetch(url.toString(), {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...extraHeaders,
      },
      cache: "no-store",
    });

  const response = await makeRequest(getAuthHeaders());

  if (response.status === 401 && typeof window !== "undefined") {
    return refreshAndRetry(makeRequest);
  }

  if (!response.ok) {
    throw new Error(`Admin API failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

async function adminRequest<T>(path: string, init: RequestInit): Promise<T> {
  const makeRequest = (extraHeaders: HeadersInit) =>
    fetch(`${API_ROOT}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...extraHeaders,
        ...(init.headers ?? {}),
      },
    });

  const response = await makeRequest(getAuthHeaders());

  if (response.status === 401 && typeof window !== "undefined") {
    return refreshAndRetry(makeRequest);
  }

  if (!response.ok) {
    let message = `Admin API failed: ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // ignore parse errors and keep fallback message
    }
    throw new Error(message);
  }

  if (response.status === 204) return null as T;
  return (await response.json()) as T;
}

export function listProducts(page = 1, pageSize = 20, q?: string) {
  return adminGet<PagedResponse<AdminProduct>>("/products", { page, pageSize, q });
}

export function listCategories(page = 1, pageSize = 20) {
  return adminGet<PagedResponse<AdminCategory>>("/categories", { page, pageSize });
}

export function listVouchers(page = 1, pageSize = 20) {
  return adminGet<PagedResponse<AdminVoucher>>("/vouchers", { page, pageSize });
}

export function listPaymentMethods(page = 1, pageSize = 20) {
  return adminGet<PagedResponse<AdminPaymentMethod>>("/payment-methods", { page, pageSize });
}

export function listTcgCards(page = 1, pageSize = 20, q?: string) {
  return adminGet<PagedResponse<AdminTcgCard>>("/tcg-cards", { page, pageSize, q });
}

export function listTcgSets(page = 1, pageSize = 20, q?: string) {
  return adminGet<PagedResponse<AdminTcgSet>>("/tcg-sets", { page, pageSize, q });
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [products, categories, vouchers, paymentMethods, tcgCards, tcgSets] = await Promise.all([
    listProducts(1, 1),
    listCategories(1, 1),
    listVouchers(1, 1),
    listPaymentMethods(1, 1),
    listTcgCards(1, 1),
    listTcgSets(1, 1),
  ]);

  return {
    products: products.total,
    categories: categories.total,
    vouchers: vouchers.total,
    paymentMethods: paymentMethods.total,
    tcgCards: tcgCards.total,
    tcgSets: tcgSets.total,
  };
}

export function createProduct(payload: AdminProductUpsert) {
  return adminRequest<AdminProductDetail>("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getProductById(id: number) {
  return adminGet<AdminProductDetail>(`/products/${id}`);
}

export function updateProduct(id: number, payload: AdminProductUpsert) {
  return adminRequest<AdminProductDetail>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id: number) {
  return adminRequest<null>(`/products/${id}`, {
    method: "DELETE",
  });
}

export function createCategory(payload: AdminCategoryUpsert) {
  return adminRequest<AdminCategoryDetail>("/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCategoryById(id: number) {
  return adminGet<AdminCategoryDetail>(`/categories/${id}`);
}

export function updateCategory(id: number, payload: AdminCategoryUpsert) {
  return adminRequest<AdminCategoryDetail>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteCategory(id: number) {
  return adminRequest<null>(`/categories/${id}`, {
    method: "DELETE",
  });
}

export function createVoucher(payload: AdminVoucherUpsert) {
  return adminRequest<AdminVoucherDetail>("/vouchers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getVoucherById(id: number) {
  return adminGet<AdminVoucherDetail>(`/vouchers/${id}`);
}

export function updateVoucher(id: number, payload: AdminVoucherUpsert) {
  return adminRequest<AdminVoucherDetail>(`/vouchers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteVoucher(id: number) {
  return adminRequest<null>(`/vouchers/${id}`, {
    method: "DELETE",
  });
}

export function createPaymentMethod(payload: AdminPaymentMethodUpsert) {
  return adminRequest<AdminPaymentMethodDetail>("/payment-methods", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPaymentMethodById(id: number) {
  return adminGet<AdminPaymentMethodDetail>(`/payment-methods/${id}`);
}

export function updatePaymentMethod(id: number, payload: AdminPaymentMethodUpsert) {
  return adminRequest<AdminPaymentMethodDetail>(`/payment-methods/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deletePaymentMethod(id: number) {
  return adminRequest<null>(`/payment-methods/${id}`, {
    method: "DELETE",
  });
}

export function createTcgCard(payload: AdminTcgCardUpsert) {
  return adminRequest<AdminTcgCardDetail>("/tcg-cards", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getTcgCardById(cardId: string) {
  return adminGet<AdminTcgCardDetail>(`/tcg-cards/${encodeURIComponent(cardId)}`);
}

export function updateTcgCard(cardId: string, payload: AdminTcgCardUpsert) {
  return adminRequest<AdminTcgCardDetail>(`/tcg-cards/${encodeURIComponent(cardId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteTcgCard(cardId: string) {
  return adminRequest<null>(`/tcg-cards/${encodeURIComponent(cardId)}`, {
    method: "DELETE",
  });
}

export function createTcgSet(payload: AdminTcgSetUpsert) {
  return adminRequest<AdminTcgSetDetail>("/tcg-sets", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getTcgSetById(setId: string) {
  return adminGet<AdminTcgSetDetail>(`/tcg-sets/${encodeURIComponent(setId)}`);
}

export function updateTcgSet(setId: string, payload: AdminTcgSetUpsert) {
  return adminRequest<AdminTcgSetDetail>(`/tcg-sets/${encodeURIComponent(setId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteTcgSet(setId: string) {
  return adminRequest<null>(`/tcg-sets/${encodeURIComponent(setId)}`, {
    method: "DELETE",
  });
}

export function listOrders(page = 1, pageSize = 20, q?: string, status?: string) {
  return adminGet<PagedResponse<AdminOrder>>("/orders/admin", { page, pageSize, q, status });
}

export function getOrderById(id: number) {
  return adminGet<AdminOrderDetail>(`/orders/admin/${id}`);
}

export function updateOrderStatus(id: number, status: string) {
  return adminRequest<AdminOrderDetail>(`/orders/admin/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}
