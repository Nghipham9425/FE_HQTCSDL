"use client"

import { useState } from "react"

type SePayGatewayButtonProps = {
  orderId: number
  amount: number
}

type CheckoutInitResponse = {
  checkoutUrl: string
  fields: Record<string, string | number>
}

export default function SePayGatewayButton({
  orderId,
  amount,
}: SePayGatewayButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGoToGateway() {
    setError(null)
    setLoading(true)

    try {
      const response = await fetch("/api/sepay/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ orderId, amount }),
      })

      if (!response.ok) {
        const body = (await response.json()) as { message?: string }
        throw new Error(body.message || "Cannot initialize checkout")
      }

      const data = (await response.json()) as CheckoutInitResponse
      const form = document.createElement("form")
      form.method = "POST"
      form.action = data.checkoutUrl

      Object.entries(data.fields).forEach(([name, value]) => {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = name
        input.value = String(value)
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể mở cổng thanh toán SePay"
      setError(message)
      setLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleGoToGateway}
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Đang chuyển hướng..." : "Thanh toán qua cổng SePay"}
      </button>
      {error ? (
        <p className="mt-2 text-xs text-rose-600">{error}</p>
      ) : (
        <p className="mt-2 text-xs text-slate-500">
          Dùng cổng SePay nếu bạn muốn trải nghiệm checkout đầy đủ (sandbox).
        </p>
      )}
    </div>
  )
}
