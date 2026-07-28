import Image from "next/image"
import Link from "next/link"
import {
  Banknote,
  Clock3,
  CreditCard,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircleMore,
  Phone,
  Smartphone,
  WalletCards,
  Youtube,
} from "lucide-react"

const supportLinks = [
  { label: "Tất cả sản phẩm", href: "/products" },
  { label: "Theo dõi đơn hàng", href: "/tracking" },
  { label: "Hướng dẫn mua hàng", href: "/support/buying-guide" },
  { label: "Trung tâm hỗ trợ", href: "/support" },
  { label: "Liên hệ cửa hàng", href: "/contact" },
]

const policyLinks = [
  { label: "Đổi trả", href: "/policy/return" },
  { label: "Bảo hành", href: "/policy/warranty" },
  { label: "Vận chuyển", href: "/policy/shipping" },
  { label: "Kiểm hàng", href: "/policy/inspection" },
  { label: "Thanh toán", href: "/policy/payment" },
  { label: "Bảo mật", href: "/policy/privacy" },
  { label: "Điều khoản", href: "/policy/terms" },
]

const socials = [
  {
    Icon: Facebook,
    href: "https://www.facebook.com/",
    label: "Facebook",
  },
  {
    Icon: Instagram,
    href: "https://www.instagram.com/",
    label: "Instagram",
  },
  {
    Icon: Youtube,
    href: "https://www.youtube.com/",
    label: "YouTube",
  },
]

const payments = [
  { label: "Visa", Icon: CreditCard },
  { label: "Mastercard", Icon: WalletCards },
  { label: "MoMo", Icon: Smartphone },
  { label: "ZaloPay", Icon: Smartphone },
  { label: "Chuyển khoản", Icon: Banknote },
  { label: "COD", Icon: Banknote },
]

export default function Footer() {
  return (
    <footer className="mt-12 bg-[#071426] text-slate-300">
      <div className="border-b border-white/10 bg-[var(--brand-navy)]">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
              <MessageCircleMore size={20} />
            </span>
            <span>
              <span className="block text-sm font-bold text-white">
                Cần tư vấn chọn máy hoặc thẻ bài?
              </span>
              <span className="block text-xs text-blue-100">
                Đội ngũ CardgameCenter hỗ trợ từ 08:30 đến 21:30 mỗi ngày.
              </span>
            </span>
          </div>
          <div className="flex gap-2">
            <a
              href="tel:0985419095"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[var(--brand-navy)] transition-transform hover:-translate-y-0.5"
            >
              <Phone size={16} />
              0985 419 095
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/25 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              Gửi yêu cầu
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-screen-xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.9fr_1.05fr]">
        <div>
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <span className="relative h-12 w-12 shrink-0 rounded-full bg-white">
              <Image
                src="https://www.pngkey.com/png/full/519-5194869_pikachu-circle-png.png"
                alt=""
                fill
                sizes="48px"
                className="object-contain p-0.5"
              />
            </span>
            <span className="leading-none">
              <span className="text-xl font-black text-white">
                Cardgame<span className="text-red-400">Center</span>
              </span>
              <span className="mt-1.5 block text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500">
                Game · Card · Store
              </span>
            </span>
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            Điểm đến dành cho người yêu console, phụ kiện gaming và Pokémon
            Trading Card Game chính hãng.
          </p>

          <address className="mt-5 space-y-3 text-sm not-italic">
            <a
              href="https://maps.google.com/"
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2.5 transition-colors hover:text-white"
            >
              <MapPin
                size={16}
                className="mt-0.5 shrink-0 text-red-400"
              />
              TP. Hồ Chí Minh, Việt Nam
            </a>
            <a
              href="mailto:support@cardgamecenter.vn"
              className="flex items-center gap-2.5 transition-colors hover:text-white"
            >
              <Mail size={16} className="shrink-0 text-red-400" />
              support@cardgamecenter.vn
            </a>
            <span className="flex items-center gap-2.5">
              <Clock3 size={16} className="shrink-0 text-red-400" />
              08:30 - 21:30, Thứ 2 - Chủ nhật
            </span>
          </address>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-white">
            Hỗ trợ khách hàng
          </h2>
          <ul className="mt-5 space-y-3">
            {supportLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex text-sm transition-colors hover:text-red-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-white">
            Chính sách mua hàng
          </h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-1">
            {policyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex text-sm transition-colors hover:text-red-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-white">
            Kết nối với chúng mình
          </h2>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            Theo dõi để cập nhật sản phẩm mới, lịch mở bán và các giải đấu cộng
            đồng.
          </p>

          <div className="mt-4 flex gap-2.5">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`CardgameCenter trên ${label}`}
                title={label}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:-translate-y-0.5 hover:border-red-400/50 hover:bg-red-400/10 hover:text-white"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>

          <div className="mt-7">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Thanh toán an toàn
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {payments.map(({ label, Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300"
                >
                  <Icon size={13} className="text-slate-500" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <span>© 2026 CardgameCenter. Bản quyền thuộc về CardgameCenter.</span>
          <span>Thiết kế cho cộng đồng game & thẻ bài Việt Nam.</span>
        </div>
      </div>
    </footer>
  )
}
