import EntityTable from "@/components/admin/EntityTable";
import Link from "next/link";
import { listCategories } from "@/lib/api/admin";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(Number(params.page) || 1, 1);
  const data = await listCategories(page, 20);

  return (
    <EntityTable
      title="Categories"
      subtitle="CRUD list for categories"
      rows={data.items}
      total={data.total}
      page={data.page}
      pageSize={data.pageSize}
      basePath="/admin/categories"
      toolbar={
        <Link
          href="/admin/categories/new"
          className="rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          New Category
        </Link>
      }
      columns={[
        { header: "ID", render: (row) => row.id ?? "-" },
        { header: "Category Name", render: (row) => <span className="font-semibold">{row.name}</span> },
        { header: "Product Count", render: (row) => row.productCount },
        {
          header: "Thumbnail",
          render: (row) =>
            row.thumbnail ? (
              <a href={row.thumbnail} target="_blank" className="text-indigo-600 underline" rel="noreferrer">
                View
              </a>
            ) : (
              "-"
            ),
        },
        {
          header: "Action",
          render: (row) =>
            row.id ? (
              <Link href={`/admin/categories/edit/${row.id}`} className="text-indigo-600 underline">
                Edit
              </Link>
            ) : (
              "-"
            ),
        },
      ]}
    />
  );
}
