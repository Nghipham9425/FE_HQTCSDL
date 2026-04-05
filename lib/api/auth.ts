import { API_ROOT } from "@/utils/constant"

const ACCESS_TOKEN_KEY = "auth_access_token"
const USER_NAME_KEY = "auth_user_name"
const USER_EMAIL_KEY = "auth_user_email"
const USER_ROLE_KEY = "auth_user_role"

const ROLE_ADMIN = "ADMIN"
const ROLE_ORDER_MANAGER = "ORDER_MANAGER"
const ROLE_INVENTORY_MANAGER = "INVENTORY_MANAGER"

export type AuthUser = {
  id: number
  email: string
  fullName: string
  phone?: string | null
  country?: string | null
  role: string
}

export type AuthTokenResponse = {
  accessToken: string
  accessTokenExpiresAt: string
  user: AuthUser
}

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  email: string
  password: string
  fullName: string
}

export type ProfileUpdatePayload = {
  fullName: string
  phone?: string | null
  country?: string | null
}

export type ChangePasswordPayload = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getStoredRole(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(USER_ROLE_KEY)
}

export function getPostLoginPath(role?: string | null): string {
  const normalized = role?.toUpperCase()
  if (normalized === ROLE_ADMIN) return "/admin"
  if (normalized === ROLE_ORDER_MANAGER) return "/admin/orders"
  if (normalized === ROLE_INVENTORY_MANAGER) return "/admin/inventory"
  return "/"
}

export function persistSession(result: AuthTokenResponse): void {
  if (typeof window === "undefined") return

  localStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken)
  localStorage.setItem(USER_NAME_KEY, result.user.fullName)
  localStorage.setItem(USER_EMAIL_KEY, result.user.email)
  localStorage.setItem(USER_ROLE_KEY, result.user.role)
  localStorage.setItem("auth_logged_in", "true")
}

export function clearSession(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(USER_NAME_KEY)
  localStorage.removeItem(USER_EMAIL_KEY)
  localStorage.removeItem(USER_ROLE_KEY)
  localStorage.removeItem("auth_logged_in")
}

async function authRequest<T>(path: string, init: RequestInit): Promise<T> {
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
    const newToken = await refreshAccessToken()
    response = await makeRequest(newToken)
  }

  if (!response.ok) {
    let message = `Auth API failed: ${response.status}`
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

export async function login(payload: LoginPayload): Promise<AuthTokenResponse> {
  const response = await fetch(`${API_ROOT}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let message = `Login failed: ${response.status}`
    try {
      const body = (await response.json()) as { message?: string }
      if (body.message) message = body.message
    } catch {
      // Keep fallback error message.
    }
    throw new Error(message)
  }

  const result = (await response.json()) as AuthTokenResponse
  persistSession(result)
  return result
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthTokenResponse> {
  const response = await fetch(`${API_ROOT}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let message = `Register failed: ${response.status}`
    try {
      const body = (await response.json()) as { message?: string }
      if (body.message) message = body.message
    } catch {
      // Keep fallback error message.
    }
    throw new Error(message)
  }

  const result = (await response.json()) as AuthTokenResponse
  persistSession(result)
  return result
}

export async function refreshAccessToken(): Promise<string> {
  const response = await fetch(`${API_ROOT}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { Accept: "application/json" },
  })

  if (!response.ok) {
    clearSession()
    throw new Error("Session expired")
  }

  const result = (await response.json()) as AuthTokenResponse
  persistSession(result)
  return result.accessToken
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_ROOT}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
    })
  } finally {
    clearSession()
  }
}

export function getMe(): Promise<AuthUser> {
  return authRequest<AuthUser>("/auth/me", { method: "GET" })
}

export async function updateMe(
  payload: ProfileUpdatePayload,
): Promise<AuthUser> {
  const user = await authRequest<AuthUser>("/auth/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  })

  if (typeof window !== "undefined") {
    localStorage.setItem(USER_NAME_KEY, user.fullName)
    localStorage.setItem(USER_EMAIL_KEY, user.email)
  }

  return user
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await authRequest<null>("/auth/change-password", {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}
