import { API_ROOT } from "@/utils/constant"
import { getAccessToken, refreshAccessToken } from "@/lib/api/auth"
import type {
  OrderDetail,
  OrderListItem,
  OrderPlacePayload,
} from "@/lib/types/order"

function getAuthHeaders(): HeadersInit {
  const token = getAccessToken()
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

async function refreshAndRetry<T>(
  executor: (headers: HeadersInit) => Promise<Response>,
): Promise<T> {
  await refreshAccessToken()
  const retry = await executor(getAuthHeaders())

  if (!retry.ok) {
    let message = `Order API failed: ${retry.status}`
    try {
      const body = (await retry.json()) as { message?: string }
      if (body.message) message = body.message
    } catch {
      // keep fallback message
    }
    throw new Error(message)
  }

  return (await retry.json()) as T
}

async function orderRequest<T>(path: string, init: RequestInit): Promise<T> {
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
      cache: "no-store",
    })

  const response = await makeRequest(getAuthHeaders())

  if (response.status === 401 && typeof window !== "undefined") {
    return refreshAndRetry(makeRequest)
  }

  if (!response.ok) {
    let message = `Order API failed: ${response.status}`
    try {
      const body = (await response.json()) as { message?: string }
      if (body.message) message = body.message
    } catch {
      // keep fallback message
    }
    throw new Error(message)
  }

  return (await response.json()) as T
}

export function placeOrder(payload: OrderPlacePayload) {
  return orderRequest<OrderDetail>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getMyOrders() {
  return orderRequest<OrderListItem[]>("/orders/me", {
    method: "GET",
  })
}

export function getMyOrderDetail(id: number) {
  return orderRequest<OrderDetail>(`/orders/me/${id}`, {
    method: "GET",
  })
}
