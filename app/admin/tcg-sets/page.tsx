import EntityTable from "@/components/admin/EntityTable"
import { formatDate } from "@/components/admin/format"
import { listTcgSets } from "@/lib/api/admin"
import Link from "next/link"

export default async function AdminTcgSetsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = Math.max(Number(params.page) || 1, 1)
  const data = await listTcgSets(page, 20)

  return (
    <EntityTable
      title="TCG Sets"
      subtitle="CRUD list for TCG set master data"
      rows={data.items}
      total={data.total}
      page={data.page}
      pageSize={data.pageSize}
      basePath="/admin/tcg-sets"
      toolbar={
        <Link
          href="/admin/tcg-sets/new"
          className="rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          New TCG Set
        </Link>
      }
      columns={[
        {
          header: "Set ID",
          render: (row) => <span className="font-semibold">{row.setId}</span>,
        },
        { header: "Name", render: (row) => row.name },
        { header: "Series", render: (row) => row.series ?? "-" },
        { header: "Release", render: (row) => formatDate(row.releaseDate) },
        { header: "Cards", render: (row) => row.cardCount },
        {
          header: "Action",
          render: (row) => (
            <Link
              href={`/admin/tcg-sets/edit/${encodeURIComponent(row.setId)}`}
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
