import EntityTable from "@/components/admin/EntityTable"
import {
  boolBadge,
  formatCurrency,
  formatDate,
} from "@/components/admin/format"
import { listVouchers } from "@/lib/api/admin"
import Link from "next/link"

export default async function AdminVouchersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = Math.max(Number(params.page) || 1, 1)
  const data = await listVouchers(page, 20)

  return (
    <EntityTable
      title="Vouchers"
      subtitle="CRUD list for voucher and promo rules"
      rows={data.items}
      total={data.total}
      page={data.page}
      pageSize={data.pageSize}
      basePath="/admin/vouchers"
      toolbar={
        <Link
          href="/admin/vouchers/new"
          className="rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          New Voucher
        </Link>
      }
      columns={[
        { header: "ID", render: (row) => row.id },
        {
          header: "Code",
          render: (row) => <span className="font-semibold">{row.code}</span>,
        },
        { header: "Name", render: (row) => row.name },
        {
          header: "Discount",
          render: (row) =>
            row.discountType === "PERCENT"
              ? `${row.discountValue}%`
              : formatCurrency(row.discountValue),
        },
        { header: "Start", render: (row) => formatDate(row.startDate) },
        { header: "End", render: (row) => formatDate(row.endDate) },
        { header: "Status", render: (row) => boolBadge(row.isActive) },
        {
          header: "Action",
          render: (row) => (
            <Link
              href={`/admin/vouchers/edit/${row.id}`}
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
