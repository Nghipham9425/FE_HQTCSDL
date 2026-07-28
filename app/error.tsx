"use client"

import { useEffect } from "react"
import EmptyState from "@/components/ui/EmptyState"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex min-h-[68vh] max-w-5xl items-center px-4 py-12">
      <EmptyState
        className="w-full"
        code="500"
        icon="error"
        eyebrow="Có một trục trặc nhỏ"
        title="Trang chưa thể hiển thị lúc này"
        description="Dữ liệu có thể đang tải chưa trọn vẹn hoặc kết nối vừa bị gián đoạn. Hãy thử lại; những thao tác trước đó của bạn vẫn được giữ nguyên khi có thể."
        primaryAction={{
          label: "Thử lại",
          onClick: reset,
          icon: "refresh",
        }}
        secondaryAction={{
          label: "Về trang chủ",
          href: "/",
          icon: "home",
        }}
      />
    </div>
  )
}
