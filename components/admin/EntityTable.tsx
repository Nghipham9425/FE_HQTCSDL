import Link from "next/link";

type Column<T> = {
  header: string;
  render: (row: T) => React.ReactNode;
};

type EntityTableProps<T> = {
  title: string;
  subtitle: string;
  rows: T[];
  columns: Column<T>[];
  total: number;
  page: number;
  pageSize: number;
  basePath: string;
  queryParams?: Record<string, string | number | undefined>;
  toolbar?: React.ReactNode;
};

export default function EntityTable<T>({
  title,
  subtitle,
  rows,
  columns,
  total,
  page,
  pageSize,
  basePath,
  queryParams,
  toolbar,
}: EntityTableProps<T>) {
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const pageHref = (target: number) => {
    const params = new URLSearchParams();
    params.set("page", String(target));

    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined && value !== "") {
          params.set(key, String(value));
        }
      }
    }

    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {toolbar}
          <div className="rounded-xl bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
            Total: {total}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:text-slate-300">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className="px-4 py-3 font-semibold">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  No data available.
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-t border-slate-200 align-top dark:border-slate-800"
                >
                  {columns.map((column) => (
                    <td key={column.header} className="px-4 py-3">
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 p-4 text-sm dark:border-slate-800">
        <span className="text-slate-500 dark:text-slate-400">
          Page {safePage} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <Link
            href={pageHref(Math.max(safePage - 1, 1))}
            className={`rounded-lg border px-3 py-1.5 ${
              safePage === 1
                ? "pointer-events-none border-slate-200 text-slate-400 dark:border-slate-800"
                : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            Prev
          </Link>
          <Link
            href={pageHref(Math.min(safePage + 1, totalPages))}
            className={`rounded-lg border px-3 py-1.5 ${
              safePage === totalPages
                ? "pointer-events-none border-slate-200 text-slate-400 dark:border-slate-800"
                : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
