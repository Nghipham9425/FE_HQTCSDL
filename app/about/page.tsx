import Link from "next/link"
import {
  ArrowRight,
  ChevronRight,
  Gamepad2,
  Headphones,
  Layers3,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
} from "lucide-react"

const promises = [
  {
    number: "01",
    title: "Chọn kỹ trước khi bán",
    description:
      "Console, phụ kiện và Pokémon TCG đều được kiểm tra nguồn gốc, tình trạng và thông tin trước khi lên kệ.",
    Icon: ShieldCheck,
  },
  {
    number: "02",
    title: "Giao nhanh, báo rõ",
    description:
      "Đơn hàng được xử lý nhanh, đóng gói cẩn thận và cập nhật trạng thái xuyên suốt hành trình.",
    Icon: Truck,
  },
  {
    number: "03",
    title: "Đồng hành sau mua",
    description:
      "Chính sách đổi trả minh bạch cùng đội ngũ hỗ trợ sẵn sàng khi bạn cần tư vấn hoặc xử lý vấn đề.",
    Icon: RefreshCw,
  },
]

const stats = [
  { value: "500+", label: "Sản phẩm chọn lọc" },
  { value: "7 ngày", label: "Hỗ trợ đổi trả" },
  { value: "24/7", label: "Tiếp nhận hỗ trợ" },
  { value: "Toàn quốc", label: "Phạm vi giao hàng" },
]

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#f7f8fb]">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm text-slate-500"
        >
          <Link
            href="/"
            className="transition-colors hover:text-[var(--brand-red)]"
          >
            Trang chủ
          </Link>
          <ChevronRight aria-hidden="true" size={14} />
          <span className="font-semibold text-slate-900">Về chúng tôi</span>
        </nav>
      </div>

      <section className="relative mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-[var(--brand-navy-dark)] px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full border-[48px] border-white/[0.04]" />
          <div className="absolute -bottom-36 right-[18%] h-72 w-72 rotate-12 rounded-[4rem] bg-[var(--brand-red)]/20 blur-sm" />
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[var(--brand-red)] via-[var(--brand-yellow)] to-cyan-400" />

          <div className="relative grid items-end gap-12 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/85 backdrop-blur">
                <Sparkles size={14} />
                Câu chuyện CardgameCenter
              </div>
              <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.08] text-balance sm:text-5xl lg:text-6xl">
                Nơi mỗi cuộc chơi
                <span className="block text-[var(--brand-yellow)]">
                  bắt đầu đúng chất.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-blue-100/85 sm:text-lg">
                Chúng tôi xây dựng một cửa hàng dành cho người thật sự yêu game
                và TCG — nơi sản phẩm dễ chọn, thông tin rõ ràng và trải nghiệm
                mua sắm luôn đáng tin.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-red)] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--brand-red-dark)]"
                >
                  Khám phá sản phẩm
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Trò chuyện với chúng tôi
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="translate-y-5 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <Gamepad2 className="text-[var(--brand-yellow)]" size={30} />
                <p className="mt-8 text-sm font-semibold text-blue-100">
                  Console & phụ kiện
                </p>
                <p className="mt-1 text-2xl font-extrabold">Chơi hết mình</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white p-5 text-[var(--brand-navy-dark)] shadow-2xl">
                <Layers3 className="text-[var(--brand-red)]" size={30} />
                <p className="mt-8 text-sm font-semibold text-slate-500">
                  Trading Card Game
                </p>
                <p className="mt-1 text-2xl font-extrabold">Sưu tầm chất</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--brand-red)]">
              Vì sao chúng tôi bắt đầu
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
              Từ người chơi,
              <br />
              dành cho người chơi.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-slate-600">
            <p>
              CardgameCenter bắt đầu từ một điều rất đơn giản: tìm được món đồ
              mình thích không nên là một trải nghiệm mơ hồ. Người mua cần biết
              rõ sản phẩm đến từ đâu, phù hợp với nhu cầu nào và sẽ được hỗ trợ
              ra sao sau khi thanh toán.
            </p>
            <p>
              Vì thế, chúng tôi không chỉ xây một gian hàng. Chúng tôi tạo một
              điểm đến nơi game thủ mới có thể tự tin bắt đầu, còn người chơi
              lâu năm vẫn tìm thấy những sản phẩm đáng để bổ sung vào bộ sưu tập.
            </p>
            <div className="flex items-center gap-3 border-l-4 border-[var(--brand-yellow)] bg-white px-5 py-4 font-semibold text-slate-900 shadow-sm">
              <Users className="shrink-0 text-[var(--brand-navy)]" size={22} />
              Cộng đồng là trung tâm của mọi trải nghiệm chúng tôi tạo ra.
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-slate-200 px-4 sm:px-6 lg:grid-cols-4 lg:divide-y-0 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-8 text-center sm:py-10">
              <p className="text-2xl font-extrabold text-[var(--brand-navy)] sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--brand-red)]">
            Cam kết của chúng tôi
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">
            Không chỉ bán một sản phẩm.
          </h2>
        </div>

        <div className="grid gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 lg:grid-cols-3">
          {promises.map(({ number, title, description, Icon }) => (
            <article
              key={number}
              className="group relative bg-white p-7 transition-colors hover:bg-slate-50 sm:p-9"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-extrabold tracking-[0.2em] text-slate-400">
                  {number}
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-navy)]/8 text-[var(--brand-navy)] transition group-hover:bg-[var(--brand-navy)] group-hover:text-white">
                  <Icon size={21} />
                </div>
              </div>
              <h3 className="mt-12 text-xl font-extrabold text-slate-950">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="flex flex-col gap-7 rounded-[2rem] bg-[var(--brand-red)] px-7 py-9 text-white sm:px-10 md:flex-row md:items-center md:justify-between lg:px-12">
          <div className="flex items-start gap-4">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex">
              <Headphones size={24} />
            </div>
            <div>
              <p className="text-2xl font-extrabold">Chưa biết chọn món nào?</p>
              <p className="mt-1 text-sm text-red-50 sm:text-base">
                Kể chúng tôi nghe nhu cầu của bạn, đội ngũ sẽ hỗ trợ chọn đúng.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-[var(--brand-red)] transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Nhận tư vấn
            <PackageCheck size={17} />
          </Link>
        </div>
      </section>
    </main>
  )
}
