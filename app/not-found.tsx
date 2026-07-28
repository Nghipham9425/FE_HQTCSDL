import EmptyState from "@/components/ui/EmptyState"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[68vh] max-w-5xl items-center px-4 py-12">
      <EmptyState
        className="w-full"
        code="404"
        icon="not-found"
        eyebrow="Có vẻ bạn đã đi lạc"
        title="Trang này không còn ở đây"
        description="Đường dẫn có thể đã được thay đổi, hết hạn hoặc chưa từng tồn tại. Bạn có thể quay về trang chủ hoặc tiếp tục khám phá cửa hàng."
        primaryAction={{
          label: "Về trang chủ",
          href: "/",
          icon: "home",
        }}
        secondaryAction={{
          label: "Xem sản phẩm",
          href: "/products",
          icon: "shopping",
        }}
      />
    </div>
  )
}
