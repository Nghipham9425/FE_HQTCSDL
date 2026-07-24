import type { Metadata } from "next"
import { Be_Vietnam_Pro, Manrope } from "next/font/google"
import "./globals.css"
import RootFrame from "@/components/layout/RootFrame"
import { Toaster } from "sonner"

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
})

const manrope = Manrope({
  subsets: ["latin", "vietnamese"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CardgameCenter – Game · Card · Store",
  description:
    "Chuyên máy chơi game PlayStation, Nintendo Switch và Trading Card Game chính hãng. Mua hàng toàn quốc, freeship, đổi trả 7 ngày.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body
        className={`${manrope.variable} ${beVietnamPro.variable} bg-(--brand-gray-bg) antialiased`}
      >
        <RootFrame>{children}</RootFrame>
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  )
}
