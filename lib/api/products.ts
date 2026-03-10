/**
 * API service layer – uses mock data now, swap with fetch() when Oracle/APEX is ready.
 * Replace the body of each function with:
 *   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?...`);
 *   return res.json();
 */

import {
  products,
  getProducts,
  getProductBySlug,
  type Product,
} from "@/data/mock/products";

export type { Product };

export async function fetchProducts(filters?: Parameters<typeof getProducts>[0]) {
  // TODO: replace with fetch() when backend is ready
  return getProducts(filters);
}

export async function fetchProductBySlug(slug: string) {
  return getProductBySlug(slug) ?? null;
}

export async function fetchBestSellers(limit = 6) {
  return getProducts({ bestSeller: true }).slice(0, limit);
}

export async function fetchNewArrivals(category?: Product["category"], limit = 10) {
  return getProducts({ newArrival: true, ...(category ? { category } : {}) }).slice(0, limit);
}

export async function fetchOnSale(limit = 6) {
  return getProducts({ onSale: true }).slice(0, limit);
}

export async function fetchRelatedProducts(product: Product, limit = 6) {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}
