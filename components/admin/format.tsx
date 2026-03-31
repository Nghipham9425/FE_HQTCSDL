export function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) return "-"
  return `${value.toLocaleString("vi-VN")}đ`
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "-"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString("vi-VN")
}

export function boolBadge(value: boolean) {
  return value ? (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
      Active
    </span>
  ) : (
    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
      Inactive
    </span>
  )
}
