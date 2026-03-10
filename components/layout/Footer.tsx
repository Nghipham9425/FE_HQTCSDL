import Link from "next/link"
import Image from "next/image"
import {
  Facebook,
  Youtube,
  Instagram,
  Twitch,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Smartphone,
  Wallet,
  Banknote,
  Package,
} from "lucide-react"

const supportLinks = [
  { label: "Tìm kiếm sản phẩm", href: "/products" },
  { label: "Kiểm tra đơn hàng", href: "/tracking" },
  { label: "Hướng dẫn mua hàng", href: "/support/buying-guide" },
]

const policyLinks = [
  { label: "Chính sách đổi trả", href: "/policy/return" },
  { label: "Chính sách bảo hành", href: "/policy/warranty" },
  { label: "Chính sách bảo mật", href: "/policy/privacy" },
  { label: "Chính sách vận chuyển", href: "/policy/shipping" },
  { label: "Chính sách kiểm hàng", href: "/policy/inspection" },
  { label: "Chính sách thanh toán", href: "/policy/payment" },
]

const socials = [
  { Icon: Facebook, href: "#", label: "Facebook", bg: "bg-blue-600" },
  { Icon: Youtube, href: "#", label: "YouTube", bg: "bg-red-600" },
  {
    Icon: Instagram,
    href: "#",
    label: "Instagram",
    bg: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
  },
  { Icon: Twitch, href: "#", label: "Twitch", bg: "bg-purple-600" },
]

const payments = [
  { label: "VISA", Icon: CreditCard, bg: "bg-blue-600", text: "text-white" },
  {
    label: "MasterCard",
    Icon: CreditCard,
    bg: "bg-red-500",
    text: "text-white",
  },
  { label: "MoMo", Icon: Smartphone, bg: "bg-pink-600", text: "text-white" },
  { label: "ZaloPay", Icon: Wallet, bg: "bg-sky-500", text: "text-white" },
  { label: "Tiền mặt", Icon: Banknote, bg: "bg-green-600", text: "text-white" },
  { label: "Trả sau", Icon: Package, bg: "bg-orange-500", text: "text-white" },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      {/* ── Main grid ── */}
      <div className="mx-auto grid max-w-screen-xl gap-10 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Col 1 – Brand + contact + socials */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-11 w-11 shrink-0">
              <Image
                src="https://www.pngkey.com/png/full/519-5194869_pikachu-circle-png.png"
                alt="CardgameCenter logo"
                fill
                className="object-contain drop-shadow-sm"
              />
            </div>
            <div className="leading-none">
              <span className="text-xl font-black text-[var(--brand-navy)]">
                Cardgame<span className="text-[var(--brand-red)]">Center</span>
              </span>
              <p className="text-[10px] tracking-widest text-gray-400 uppercase mt-0.5">
                Game · Card · Store
              </p>
            </div>
          </Link>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <MapPin
                size={14}
                className="mt-0.5 shrink-0 text-[var(--brand-red)]"
              />
              <span>TP. Hồ Chí Minh</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="shrink-0 text-[var(--brand-red)]" />
              <a
                href="tel:0985419095"
                className="font-semibold text-[var(--brand-red)] hover:underline"
              >
                +84 985419095
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="shrink-0 text-gray-400" />
              <span>support@cardgamecenter.vn</span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
              Mạng xã hội
            </p>
            <div className="flex gap-2">
              {socials.map(({ Icon, href, label, bg }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm transition-opacity hover:opacity-80 ${bg}`}
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Col 2 – Hỗ trợ khách hàng */}
        <div>
          <h4 className="mb-4 border-b border-gray-100 pb-2 text-sm font-bold text-gray-800">
            Hỗ trợ khách hàng
          </h4>
          <ul className="space-y-2.5">
            {supportLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[var(--brand-red)] transition-colors"
                >
                  <span className="text-[var(--brand-red)]">•</span>{" "}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 – Chính sách */}
        <div>
          <h4 className="mb-4 border-b border-gray-100 pb-2 text-sm font-bold text-gray-800">
            Chính sách
          </h4>
          <ul className="space-y-2.5">
            {policyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[var(--brand-red)] transition-colors"
                >
                  <span className="text-[var(--brand-red)]">•</span>{" "}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 – Newsletter + Payment */}
        <div className="flex flex-col gap-5">
          <div>
            <h4 className="mb-1 text-sm font-bold text-gray-800">
              Đăng ký nhận ưu đãi
            </h4>
            <p className="mb-3 text-xs leading-relaxed text-gray-500">
              Bạn muốn nhận khuyến mãi đặc biệt? Đăng kí tham gia ngay cộng đồng
              hơn 68.000+ người theo dõi!
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email của bạn..."
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[var(--brand-red)] focus:outline-none"
              />
              <button className="rounded-lg bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-red-dark)] transition-colors">
                Đăng ký
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-gray-700">
              Phương thức thanh toán
            </p>
            <div className="flex flex-wrap gap-2">
              {payments.map(({ label, Icon, bg, text }) => (
                <span
                  key={label}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold shadow-sm ${bg} ${text}`}
                >
                  <Icon size={13} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Copyright ── */}
      <div className="border-t border-gray-100 bg-gray-50 py-4">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-2 px-4 text-center text-xs text-gray-400 sm:flex-row">
          <span>© 2026 CardgameCenter. Bản quyền thuộc về CardgameCenter.</span>
          <div className="flex items-center gap-4">
            <Link
              href="/policy/privacy"
              className="hover:text-gray-600 transition-colors"
            >
              Bảo mật
            </Link>
            <Link
              href="/policy/terms"
              className="hover:text-gray-600 transition-colors"
            >
              Điều khoản
            </Link>
            <Link
              href="/sitemap"
              className="hover:text-gray-600 transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
