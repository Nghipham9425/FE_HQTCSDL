"use client"

import { useEffect, useState } from "react"
import { cancelMyOrder } from "@/lib/api/orders"

type SePayFinalizeHandlerProps = {
  orderId: number
  payment: string
  status?: string
}

export default function SePayFinalizeHandler({
  orderId,
  payment,
  status,
}: SePayFinalizeHandlerProps) {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("sepay_pending_order")
    }
  }, [orderId])

  useEffect(() => {
    async function autoCancel() {
      if (payment !== "SEPAY") return
      if (status !== "cancel") return

      try {
        await cancelMyOrder(orderId)
        setMessage("Đơn hàng đã được hủy do bạn hủy thanh toán trên cổng SePay.")
      } catch {
        setMessage(null)
      }
    }

    void autoCancel()
  }, [orderId, payment, status])

  if (!message) return null

  return (
    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
      {message}
    </div>
  )
}
