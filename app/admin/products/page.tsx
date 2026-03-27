import Link from "next/link";
import EntityTable from "@/components/admin/EntityTable";
import { boolBadge, formatCurrency, formatDate } from "@/components/admin/format";
import { listProducts } from "@/lib/api/admin";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(Number(params.page) || 1, 1);
  const q = params.q?.trim() || "";
  const data = await listProducts(page, 20, q || undefined);

  return (
    <EntityTable
      title="Products"
      subtitle="Manage catalog products"
      rows={data.items}
      total={data.total}
      page={data.page}
      pageSize={data.pageSize}
      basePath="/admin/products"
      queryParams={{ q: q || undefined }}
      toolbar={
        <>
          <form action="/admin/products" method="get" className="flex items-center gap-2">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search sku/name"
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
            href="/admin/products/new"
            className="rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            New Product
          </Link>
        </>
      }
      columns={[
        { header: "ID", render: (row) => row.id },
        { header: "SKU", render: (row) => <span className="font-semibold">{row.sku}</span> },
        { header: "Name", render: (row) => row.name },
        { header: "Type", render: (row) => row.productType },
        { header: "Price", render: (row) => formatCurrency(row.price) },
        { header: "Stock", render: (row) => row.stock },
        { header: "Status", render: (row) => boolBadge(row.isActive) },
        { header: "Updated", render: (row) => formatDate(row.updatedAt) },
        {
          header: "Action",
          render: (row) => (
            <Link href={`/admin/products/edit/${row.id}`} className="text-indigo-600 underline">
              Edit
            </Link>
          ),
        },
      ]}
    />
  );
}
