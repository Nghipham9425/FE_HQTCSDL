"use client"

import AnnouncementBar from "@/components/layout/AnnouncementBar"
import Header from "@/components/layout/Header"
import NavMenu from "@/components/layout/NavMenu"
import Footer from "@/components/layout/Footer"
import BackToTop from "@/components/ui/BackToTop"
import { usePathname } from "next/navigation"

type RootFrameProps = {
  children: React.ReactNode
}

export default function RootFrame({ children }: RootFrameProps) {
  const pathname = usePathname()

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <NavMenu />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </>
  )
}
