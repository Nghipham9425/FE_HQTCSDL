"use client"

import { usePathname } from "next/navigation"
import Breadcrumb, { type BreadcrumbItem } from "@/components/ui/Breadcrumb"

const accountLabels: Record<string, string> = {
  profile: "Hồ sơ tài khoản",
  orders: "Đơn hàng của tôi",
  addresses: "Sổ địa chỉ",
  wishlist: "Sản phẩm yêu thích",
  "change-password": "Đổi mật khẩu",
}

export default function AccountBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const section = segments[1] ?? "profile"
  const items: BreadcrumbItem[] = [
    { label: "Tài khoản", href: "/account/profile" },
  ]

  if (section === "orders" && segments[2]) {
    items.push({ label: accountLabels.orders, href: "/account/orders" })
    items.push({ label: `Đơn hàng #${segments[2]}` })
  } else {
    items.push({ label: accountLabels[section] ?? "Tài khoản" })
  }

  return <Breadcrumb items={items} />
}
