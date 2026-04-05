import { API_ROOT } from "@/utils/constant"
import { getAccessToken, refreshAccessToken, clearSession } from "@/lib/api/auth"
import { type Product } from "@/lib/api/products"

type WishlistListResponse = {
  items: Product[]
}

async function wishlistRequest<T>(path: string, init: RequestInit): Promise<T> {
  const makeRequest = (token?: string | null) =>
    fetch(`${API_ROOT}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers ?? {}),
      },
      cache: "no-store",
    })

  const token = getAccessToken()
  let response = await makeRequest(token)

  if (response.status === 401 && typeof window !== "undefined") {
    try {
      const newToken = await refreshAccessToken()
      response = await makeRequest(newToken)
    } catch {
      clearSession()
      throw new Error("Session expired")
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized")
    }

    let message = `Wishlist API failed: ${response.status}`
    try {
      const body = (await response.json()) as { message?: string }
      if (body.message) message = body.message
    } catch {
      // keep fallback
    }
    throw new Error(message)
  }

  if (response.status === 204) return null as T
  return (await response.json()) as T
}

export async function getWishlistItems(): Promise<Product[]> {
  const response = await wishlistRequest<WishlistListResponse>("/wishlist", {
    method: "GET",
  })
  return response.items
}

export async function addWishlistItem(productId: number): Promise<void> {
  await wishlistRequest<null>(`/wishlist/${productId}`, {
    method: "POST",
  })
}

export async function removeWishlistItem(productId: number): Promise<void> {
  await wishlistRequest<null>(`/wishlist/${productId}`, {
    method: "DELETE",
  })
}
