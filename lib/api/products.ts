import axios from "axios";
import { API_ROOT } from "@/utils/constant";
import {
  type ApiProductDetail,
  type ApiProductListItem,
  type ApiProductPagedResponse,
  type ProductCategory,
} from "@/lib/types/product-api";

export type Product = ApiProductListItem;
export type ProductDetail = ApiProductDetail;

const apiClient = axios.create({
  baseURL: API_ROOT,
  timeout: 10000,
  withCredentials: true,
});

type QueryValue = string | number | boolean | undefined;
type QueryParams = Record<string, QueryValue>;

export type ProductQueryFilters = {
  q?: string;
  productType?: string;
  isActive?: boolean;
  categoryId?: number;
  categoryName?: string;
};

async function apiGet<T>(path: string, params?: QueryParams): Promise<T> {
  const { data } = await apiClient.get<T>(path, { params });
  return data;
}

async function fetchAllProductsFromApi(filters?: ProductQueryFilters) {
  try {
    const requestedPageSize = 600;
    const effectiveFilters: ProductQueryFilters = {
      isActive: filters?.isActive ?? true,
      ...filters,
    };

    const firstPage = await apiGet<ApiProductPagedResponse>("/products", {
      page: 1,
      pageSize: requestedPageSize,
      ...effectiveFilters,
    });

    const effectivePageSize = Math.max(firstPage.pageSize, 1);
    const totalPages = Math.max(Math.ceil(firstPage.total / effectivePageSize), 1);
    if (totalPages === 1) return firstPage.items;

    const items = [...firstPage.items];

    for (let page = 2; page <= totalPages; page += 1) {
      const nextPage = await apiGet<ApiProductPagedResponse>("/products", {
        page,
        pageSize: requestedPageSize,
        ...effectiveFilters,
      });
      items.push(...nextPage.items);
    }

    const uniqueById = new Map<number, ApiProductListItem>();
    for (const item of items) {
      if (!uniqueById.has(item.id)) uniqueById.set(item.id, item);
    }

    return Array.from(uniqueById.values());
  } catch {
    return [];
  }
}

export async function fetchProducts() {
  return fetchAllProductsFromApi();
}

export async function fetchProductsByFilters(filters?: ProductQueryFilters) {
  return fetchAllProductsFromApi(filters);
}

export async function fetchRecentProducts(limit = 10) {
  try {
    const data = await apiGet<ApiProductPagedResponse>("/products", {
      page: 1,
      pageSize: limit,
      isActive: true,
    });

    return data.items;
  } catch {
    return [];
  }
}

export async function fetchProductById(id: number) {
  try {
    const product = await apiGet<ApiProductDetail>(`/products/${id}`);
    return product.isActive ? product : null;
  } catch {
    return null;
  }
}

export async function fetchBestSellers(limit = 6) {
  const products = await fetchAllProductsFromApi();
  return [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, limit);
}

export async function fetchNewArrivals(_category?: ProductCategory, limit = 10) {
  const category = _category?.toLowerCase();

  if (category === "pokemon-tcg") {
    return fetchProductsByFilters({ categoryName: "Pokemon TCG" }).then((items) =>
      [...items]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, limit),
    );
  }

  if (category === "console") {
    return fetchProductsByFilters({ productType: "CONSOLE" }).then((items) =>
      [...items]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, limit),
    );
  }

  if (category === "accessory") {
    return fetchProductsByFilters({ productType: "ACCESSORY" }).then((items) =>
      [...items]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, limit),
    );
  }

  return fetchRecentProducts(limit);
}

export async function fetchOnSale(limit = 6) {
  const products = await fetchAllProductsFromApi();
  return [...products]
    .sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    .slice(0, limit);
}

export async function fetchRelatedProducts(product: Product, limit = 6) {
  const products = await fetchAllProductsFromApi();
  return products
    .filter((p) => p.productType === product.productType && p.id !== product.id)
    .slice(0, limit);
}
