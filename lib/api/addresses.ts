import { API_ROOT } from "@/utils/constant"
import { getAccessToken, refreshAccessToken, clearSession } from "./auth"

export type UserAddress = {
  id: number
  userId: number
  addressName: string | null
  recipientName: string | null
  fullAddress: string
  city: string | null
  district: string | null
  ward: string | null
  postalCode: string | null
  country: string
  phone: string | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export type AddressUpsertPayload = {
  addressName?: string | null
  recipientName?: string | null
  fullAddress: string
  city?: string | null
  district?: string | null
  ward?: string | null
  postalCode?: string | null
  country?: string
  phone?: string | null
  isDefault?: boolean
}

type AddressListResponse = {
  items: UserAddress[]
}

async function addressRequest<T>(
  path: string,
  init: RequestInit
): Promise<T> {
  const makeRequest = (token?: string | null) =>
    fetch(`${API_ROOT}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
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
    let message = `API failed: ${response.status}`
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

export async function getAddresses(): Promise<UserAddress[]> {
  const response = await addressRequest<AddressListResponse>("/addresses", {
    method: "GET",
  })
  return response.items
}

export async function getAddressById(id: number): Promise<UserAddress> {
  return addressRequest<UserAddress>(`/addresses/${id}`, {
    method: "GET",
  })
}

export async function getDefaultAddress(): Promise<UserAddress | null> {
  try {
    return await addressRequest<UserAddress>("/addresses/default", {
      method: "GET",
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      return null
    }
    throw error
  }
}

export async function createAddress(
  payload: AddressUpsertPayload
): Promise<UserAddress> {
  return addressRequest<UserAddress>("/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function updateAddress(
  id: number,
  payload: AddressUpsertPayload
): Promise<UserAddress> {
  return addressRequest<UserAddress>(`/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

export async function deleteAddress(id: number): Promise<void> {
  await addressRequest<null>(`/addresses/${id}`, {
    method: "DELETE",
  })
}

export async function setDefaultAddress(id: number): Promise<void> {
  await addressRequest<{ message: string }>(`/addresses/${id}/set-default`, {
    method: "POST",
  })
}
