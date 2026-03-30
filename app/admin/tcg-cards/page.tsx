import EntityTable from "@/components/admin/EntityTable"
import Link from "next/link"
import { listTcgCards } from "@/lib/api/admin"

export default async function AdminTcgCardsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const params = await searchParams
  const page = Math.max(Number(params.page) || 1, 1)
  const q = params.q?.trim() || ""
  const data = await listTcgCards(page, 20, q || undefined)

  return (
    <EntityTable
      title="TCG Cards"
      subtitle="CRUD list for TCG card master data"
      rows={data.items}
      total={data.total}
      page={data.page}
      pageSize={data.pageSize}
      basePath="/admin/tcg-cards"
      queryParams={{ q: q || undefined }}
      toolbar={
        <>
          <form
            action="/admin/tcg-cards"
            method="get"
            className="flex items-center gap-2"
          >
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search card id/name"
              className="w-48 rounded-xl border border-slate-300 px-3 py-1.5 text-sm"
            />
            <button
              type="submit"
              className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm font-semibold"
            >
              Search
            </button>
          </form>
          <Link
            href="/admin/tcg-cards/new"
            className="rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            New TCG Card
          </Link>
        </>
      }
      columns={[
        {
          header: "Card ID",
          render: (row) => <span className="font-semibold">{row.cardId}</span>,
        },
        { header: "Name", render: (row) => row.name },
        {
          header: "Set",
          render: (row) =>
            `${row.setId}${row.setName ? ` (${row.setName})` : ""}`,
        },
        { header: "No.", render: (row) => row.cardNumber },
        { header: "Rarity", render: (row) => row.rarity ?? "-" },
        {
          header: "Action",
          render: (row) => (
            <Link
              href={`/admin/tcg-cards/edit/${encodeURIComponent(row.cardId)}`}
              className="text-indigo-600 underline"
            >
              Edit
            </Link>
          ),
        },
      ]}
    />
  )
}
