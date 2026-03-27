import Link from "next/link";
import { ChevronRight, Mail, MapPin, Phone, Clock3 } from "lucide-react";

const contactItems = [
  {
    label: "Hotline",
    value: "+84 985 419 095",
    href: "tel:0985419095",
    Icon: Phone,
  },
  {
    label: "Email",
    value: "support@cardgamecenter.vn",
    href: "mailto:support@cardgamecenter.vn",
    Icon: Mail,
  },
  {
    label: "Địa chỉ",
    value: "TP. Hồ Chí Minh",
    href: "https://maps.google.com",
    Icon: MapPin,
  },
  {
    label: "Giờ làm việc",
    value: "08:30 - 21:30 mỗi ngày",
    href: "#",
    Icon: Clock3,
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-(--brand-red)">
          Trang chủ
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-gray-800">Liên hệ</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900">Liên hệ CardgameCenter</h1>
      <p className="mt-2 max-w-3xl text-sm text-gray-600">
        Nếu bạn cần tư vấn sản phẩm, kiểm tra đơn hàng hoặc hỗ trợ sau mua, đội ngũ của chúng mình luôn sẵn sàng.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {contactItems.map(({ label, value, href, Icon }) => (
          <a
            key={label}
            href={href}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--brand-red)]/30"
          >
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-navy)]/10 text-[var(--brand-navy)]">
              <Icon size={18} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
            <p className="mt-1 text-base font-bold text-gray-900 group-hover:text-[var(--brand-red)]">{value}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
