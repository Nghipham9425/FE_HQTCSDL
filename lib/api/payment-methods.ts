import { API_ROOT } from "@/utils/constant"

export type PaymentMethodItem = {
  id: number
  methodName: string
  isActive: boolean
  paymentCount: number
}

type PaymentMethodPagedResponse = {
  page: number
  pageSize: number
  total: number
  items: PaymentMethodItem[]
}

export async function listActivePaymentMethods(): Promise<PaymentMethodItem[]> {
  const response = await fetch(
    `${API_ROOT}/payment-methods?isActive=true&page=1&pageSize=50`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  )

  if (!response.ok) {
    let message = `Load payment methods failed: ${response.status}`
    try {
      const body = (await response.json()) as { message?: string }
      if (body.message) message = body.message
    } catch {
      // keep fallback
    }
    throw new Error(message)
  }

  const data = (await response.json()) as PaymentMethodPagedResponse
  return data.items
}
