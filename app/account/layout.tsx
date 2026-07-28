import AccountBreadcrumb from "@/components/account/AccountBreadcrumb"

export default function AccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <AccountBreadcrumb />
        </div>
      </div>
      {children}
    </>
  )
}
