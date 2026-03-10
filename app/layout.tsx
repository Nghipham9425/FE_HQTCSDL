import type { Metadata } from "next"
import { Be_Vietnam_Pro } from "next/font/google"
import "./globals.css"
import AnnouncementBar from "@/components/layout/AnnouncementBar"
import Header from "@/components/layout/Header"
import NavMenu from "@/components/layout/NavMenu"
import Footer from "@/components/layout/Footer"

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
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
        className={`${beVietnamPro.variable} antialiased bg-[var(--brand-gray-bg)]`}
      >
        <AnnouncementBar />
        <Header />
        <NavMenu />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
