import EntityTable from "@/components/admin/EntityTable";
import { boolBadge } from "@/components/admin/format";
import { listPaymentMethods } from "@/lib/api/admin";
import Link from "next/link";

export default async function AdminPaymentMethodsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(Number(params.page) || 1, 1);
  const data = await listPaymentMethods(page, 20);

  return (
    <EntityTable
      title="Payment Methods"
      subtitle="CRUD list for checkout payment configuration"
      rows={data.items}
      total={data.total}
      page={data.page}
      pageSize={data.pageSize}
      basePath="/admin/payment-methods"
      toolbar={
        <Link
          href="/admin/payment-methods/new"
          className="rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          New Method
        </Link>
      }
      columns={[
        { header: "ID", render: (row) => row.id },
        { header: "Method", render: (row) => <span className="font-semibold">{row.methodName}</span> },
        { header: "Payments", render: (row) => row.paymentCount },
        { header: "Status", render: (row) => boolBadge(row.isActive) },
        {
          header: "Action",
          render: (row) => (
            <Link href={`/admin/payment-methods/edit/${row.id}`} className="text-indigo-600 underline">
              Edit
            </Link>
          ),
        },
      ]}
    />
  );
}
