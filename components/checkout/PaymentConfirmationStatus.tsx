"use client"

import { useEffect, useState } from "react"
import { getMyOrderDetail } from "@/lib/api/orders"

type PaymentConfirmationStatusProps = {
  orderId: number
}

function isConfirmedStatus(status?: string | null) {
  const normalized = (status ?? "").trim().toUpperCase()
  return normalized === "CONFIRMED" || normalized === "SHIPPED" || normalized === "DONE"
}

export default function PaymentConfirmationStatus({ orderId }: PaymentConfirmationStatusProps) {
  const [confirmed, setConfirmed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false
    let intervalId: ReturnType<typeof setInterval> | null = null

    async function checkStatus() {
      try {
        const order = await getMyOrderDetail(orderId)
        if (cancelled) return

        if (isConfirmedStatus(order.orderStatus)) {
          setConfirmed(true)
          setChecking(false)
          if (intervalId) clearInterval(intervalId)
          return
        }

        setChecking(true)
      } catch {
        if (!cancelled) {
          setChecking(false)
        }
      }
    }

    void checkStatus()
    intervalId = setInterval(checkStatus, 5000)

    return () => {
      cancelled = true
      if (intervalId) clearInterval(intervalId)
    }
  }, [orderId])

  if (confirmed) {
    return (
      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
        Thanh toán đã được xác nhận. Đơn hàng của bạn đang được xử lý.
      </div>
    )
  }

  if (checking) {
    return (
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
        Đang chờ xác nhận thanh toán tự động. Trang sẽ tự cập nhật sau khi SePay gửi webhook.
      </div>
    )
  }

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
      Chưa nhận được xác nhận thanh toán. Vui lòng kiểm tra lại nội dung chuyển khoản và thử tải lại trang.
    </div>
  )
}
