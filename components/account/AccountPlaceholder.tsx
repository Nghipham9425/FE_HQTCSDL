import Link from "next/link"

type AccountPlaceholderProps = {
  title: string
  description: string
}

export default function AccountPlaceholder({ title, description }: AccountPlaceholderProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-600">{description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/" className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Về trang chủ
          </Link>
          <Link href="/products" className="rounded-xl bg-(--brand-red) px-3 py-2 text-sm font-semibold text-white hover:bg-(--brand-red-dark)">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </section>
  )
}
