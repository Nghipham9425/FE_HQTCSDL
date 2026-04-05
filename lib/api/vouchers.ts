import { API_ROOT } from "@/utils/constant"

export type VoucherPreviewResponse = {
  originalAmount: number
  discountedAmount: number
  discount: number
  voucherCode: string
}

export async function previewVoucher(amount: number, voucherCode: string) {
  const code = voucherCode.trim().toUpperCase()
  if (!code) throw new Error("Vui lòng nhập mã voucher")

  const url = `${API_ROOT}/vouchers/preview?amount=${encodeURIComponent(
    String(amount),
  )}&voucherCode=${encodeURIComponent(code)}`

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    let message = "Không thể áp dụng voucher"
    try {
      const body = (await response.json()) as { message?: string }
      if (body.message) message = body.message
    } catch {
      // keep fallback message
    }
    throw new Error(message)
  }

  return (await response.json()) as VoucherPreviewResponse
}
