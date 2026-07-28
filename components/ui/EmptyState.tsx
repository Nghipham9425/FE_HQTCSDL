"use client"

import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Heart,
  Home,
  PackageSearch,
  RefreshCw,
  SearchX,
  ShoppingBag,
  Sparkles,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type EmptyStateIcon =
  | "cart"
  | "wishlist"
  | "orders"
  | "search"
  | "not-found"
  | "error"

type ActionIcon = "arrow" | "home" | "refresh" | "shopping"

export type EmptyStateAction = {
  label: string
  href?: string
  onClick?: () => void
  icon?: ActionIcon
}

type EmptyStateProps = {
  title: string
  description: string
  icon?: EmptyStateIcon
  eyebrow?: string
  code?: string
  details?: string[]
  primaryAction?: EmptyStateAction
  secondaryAction?: EmptyStateAction
  compact?: boolean
  className?: string
}

const stateIcons: Record<EmptyStateIcon, LucideIcon> = {
  cart: ShoppingBag,
  wishlist: Heart,
  orders: PackageSearch,
  search: SearchX,
  "not-found": Compass,
  error: TriangleAlert,
}

const actionIcons: Record<ActionIcon, LucideIcon> = {
  arrow: ArrowRight,
  home: Home,
  refresh: RefreshCw,
  shopping: ShoppingBag,
}

function StateAction({
  action,
  primary,
}: {
  action: EmptyStateAction
  primary?: boolean
}) {
  const Icon = actionIcons[action.icon ?? "arrow"]
  const className = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-navy)] focus-visible:ring-offset-2",
    primary
      ? "bg-[var(--brand-navy)] text-white shadow-[0_10px_24px_rgba(0,48,135,0.2)] hover:-translate-y-0.5 hover:bg-[var(--brand-navy-dark)]"
      : "border border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50",
  )

  const content = (
    <>
      <span>{action.label}</span>
      <Icon aria-hidden="true" className="h-4 w-4" />
    </>
  )

  if (action.href) {
    return (
      <Link href={action.href} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={action.onClick} className={className}>
      {content}
    </button>
  )
}

export default function EmptyState({
  title,
  description,
  icon = "search",
  eyebrow,
  code,
  details,
  primaryAction,
  secondaryAction,
  compact = false,
  className,
}: EmptyStateProps) {
  const Icon = stateIcons[icon]
  const isError = icon === "error"
  const isWishlist = icon === "wishlist"

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white text-center shadow-[0_20px_55px_rgba(15,23,42,0.07)]",
        compact ? "px-5 py-10 sm:px-8" : "px-5 py-14 sm:px-10 sm:py-16",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute -left-20 -top-24 h-56 w-56 rounded-full bg-blue-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-28 -right-16 h-60 w-60 rounded-full bg-rose-100/60 blur-3xl"
      />
      {code ? (
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 text-[clamp(8rem,23vw,15rem)] font-black tracking-[-0.08em] text-slate-950/[0.035]"
        >
          {code}
        </span>
      ) : null}

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
        <div
          className={cn(
            "relative flex h-20 w-20 items-center justify-center rounded-[1.65rem] text-white shadow-[0_18px_38px_rgba(0,48,135,0.22)]",
            isError
              ? "bg-gradient-to-br from-rose-500 to-red-700"
              : isWishlist
                ? "bg-gradient-to-br from-rose-500 to-[var(--brand-red-dark)]"
                : "bg-gradient-to-br from-[#1458c5] to-[var(--brand-navy-dark)]",
          )}
        >
          <Icon aria-hidden="true" className="h-9 w-9" strokeWidth={1.8} />
          <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-[var(--brand-yellow)] text-[var(--brand-navy-dark)]">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
          </span>
        </div>

        {eyebrow ? (
          <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--brand-red)]">
            {eyebrow}
          </p>
        ) : null}

        <h1
          className={cn(
            "text-balance font-extrabold text-slate-950",
            eyebrow ? "mt-2" : "mt-7",
            compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl",
          )}
        >
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-pretty text-sm leading-7 text-slate-600 sm:text-base">
          {description}
        </p>

        {details?.length ? (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {details.map((detail) => (
              <span
                key={detail}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/90 px-3 py-1.5 text-xs font-semibold text-slate-600"
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-emerald-600"
                />
                {detail}
              </span>
            ))}
          </div>
        ) : null}

        {primaryAction || secondaryAction ? (
          <div className="mt-8 flex w-full flex-col-reverse justify-center gap-3 sm:w-auto sm:flex-row">
            {secondaryAction ? (
              <StateAction action={secondaryAction} />
            ) : null}
            {primaryAction ? (
              <StateAction action={primaryAction} primary />
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}
