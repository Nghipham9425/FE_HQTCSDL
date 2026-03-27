"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EntityTable from "@/components/admin/EntityTable";
import { formatCurrency, formatDate } from "@/components/admin/format";
import { listOrders } from "@/lib/api/admin";
import type { AdminOrder } from "@/lib/types/admin";

function statusBadge(status: string) {
  const upper = status.toUpperCase();
  if (upper === "PENDING") return "bg-amber-100 text-amber-800";
  if (upper === "CONFIRMED") return "bg-blue-100 text-blue-800";
  if (upper === "SHIPPED") return "bg-indigo-100 text-indigo-800";
  if (upper === "DONE") return "bg-green-100 text-green-800";
  if (upper === "CANCELLED") return "bg-rose-100 text-rose-800";
  return "bg-slate-100 text-slate-700";
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Math.max(Number(searchParams.get("page") || 1), 1);
  const q = searchParams.get("q")?.trim() || "";
  const status = searchParams.get("status")?.trim().toUpperCase() || "";

  const [rows, setRows] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [draftQ, setDraftQ] = useState(q);
  const [draftStatus, setDraftStatus] = useState(status);

  useEffect(() => {
    setDraftQ(q);
    setDraftStatus(status);
  }, [q, status]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await listOrders(page, 20, q || undefined, status || undefined);
        if (!mounted) return;

        setRows(data.items);
        setTotal(data.total);
        setPageSize(data.pageSize);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Load orders failed");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [page, q, status]);

  const subtitle = useMemo(() => {
    if (loading) return "Loading orders...";
    if (error) return `Error: ${error}`;
    return "Manage customer orders and update status";
  }, [loading, error]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("page", "1");
    if (draftQ.trim()) params.set("q", draftQ.trim());
    if (draftStatus.trim()) params.set("status", draftStatus.trim());
    router.push(`/admin/orders?${params.toString()}`);
  }

  return (
    <EntityTable
      title="Orders"
      subtitle={subtitle}
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      basePath="/admin/orders"
      queryParams={{ q: q || undefined, status: status || undefined }}
      toolbar={
        <form onSubmit={submitSearch} className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={draftQ}
            onChange={(e) => setDraftQ(e.target.value)}
            placeholder="Search id / name / email / phone"
            className="w-64 rounded-xl border border-slate-300 px-3 py-1.5 text-sm"
          />
          <select
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm"
          >
            <option value="">All status</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DONE">DONE</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          <button
            type="submit"
            className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm font-semibold"
          >
            Search
          </button>
        </form>
      }
      columns={[
        { header: "ID", render: (row) => <span className="font-semibold">#{row.id}</span> },
        {
          header: "Customer",
          render: (row) => (
            <div>
              <p className="text-sm font-semibold text-slate-900">{row.customerName ?? "-"}</p>
              <p className="text-xs text-slate-500">{row.customerPhone ?? "-"}</p>
            </div>
          ),
        },
        { header: "Email", render: (row) => row.customerEmail ?? "-" },
        {
          header: "Status",
          render: (row) => (
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(row.orderStatus)}`}>
              {row.orderStatus}
            </span>
          ),
        },
        { header: "Items", render: (row) => row.itemCount },
        { header: "Final", render: (row) => formatCurrency(row.finalAmount) },
        { header: "Date", render: (row) => formatDate(row.orderDate) },
        {
          header: "Action",
          render: (row) => (
            <Link href={`/admin/orders/${row.id}`} className="text-indigo-600 underline">
              Detail
            </Link>
          ),
        },
      ]}
    />
  );
}
