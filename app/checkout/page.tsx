"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronRight, MapPin, Plus } from "lucide-react"
import { toast } from "sonner"
import { useCartStore } from "@/lib/stores/cartStore"
import { placeOrder } from "@/lib/api/orders"
import { getAccessToken } from "@/lib/api/auth"
import { getAddresses, type UserAddress } from "@/lib/api/addresses"
import {
  listActivePaymentMethods,
  type PaymentMethodItem,
} from "@/lib/api/payment-methods"
import {
  previewVoucher,
  type VoucherPreviewResponse,
} from "@/lib/api/vouchers"

function formatPrice(value: number) {
  return value.toLocaleString("vi-VN") + "đ"
}

function isUnauthorizedError(err: unknown) {
  if (!(err instanceof Error)) return false
  const message = err.message.toLowerCase()
  return (
    message.includes("401") ||
    message.includes("unauthorized") ||
    message.includes("session expired")
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalItems, totalPrice, clearCart } = useCartStore()

  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [loadingAddresses, setLoadingAddresses] = useState(true)
  const [selectedAddressId, setSelectedAddressId] = useState<number | "new">("new")

  const [shippingAddress, setShippingAddress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [orderEmail, setOrderEmail] = useState("")
  const [note, setNote] = useState("")
  const [voucherCode, setVoucherCode] = useState("")
  const [voucherPreview, setVoucherPreview] =
    useState<VoucherPreviewResponse | null>(null)
  const [voucherFeedback, setVoucherFeedback] = useState<string | null>(null)
  const [applyingVoucher, setApplyingVoucher] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodItem[]>([])
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true)
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] =
    useState<number | null>(null)

  const canCheckout = items.length > 0
  const subTotal = totalPrice()
  const discountAmount = voucherPreview?.discount ?? 0
  const finalAmount = voucherPreview?.discountedAmount ?? subTotal

  useEffect(() => {
    async function loadAddresses() {
      if (!getAccessToken()) {
        setLoadingAddresses(false)
        return
      }

      try {
        const data = await getAddresses()
        setAddresses(data)

        const defaultAddr = data.find((a) => a.isDefault)
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id)
          applyAddress(defaultAddr)
        } else if (data.length > 0) {
          setSelectedAddressId(data[0].id)
          applyAddress(data[0])
        }
      } catch {
        // Ignore errors - user might not be logged in
      } finally {
        setLoadingAddresses(false)
      }
    }

    loadAddresses()
  }, [])

  useEffect(() => {
    async function loadPaymentMethods() {
      try {
        const methods = await listActivePaymentMethods()
        setPaymentMethods(methods)

        const cod = methods.find(
          (m) => m.methodName.toUpperCase() === "COD",
        )
        setSelectedPaymentMethodId(cod?.id ?? methods[0]?.id ?? null)
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Không tải được phương thức thanh toán."
        setError(message)
        toast.error(message)
      } finally {
        setLoadingPaymentMethods(false)
      }
    }

    void loadPaymentMethods()
  }, [])

  function applyAddress(address: UserAddress) {
    const parts = [
      address.fullAddress,
      address.ward,
      address.district,
      address.city,
      address.country,
    ].filter(Boolean)
    setShippingAddress(parts.join(", "))
    setPhoneNumber(address.phone ?? "")
  }

  function handleAddressChange(value: string) {
    if (value === "new") {
      setSelectedAddressId("new")
      setShippingAddress("")
      setPhoneNumber("")
    } else {
      const id = Number(value)
      setSelectedAddressId(id)
      const addr = addresses.find((a) => a.id === id)
      if (addr) applyAddress(addr)
    }
  }

  const lineItems = useMemo(
    () =>
      items
        .map((item) => ({
          productId: Number(item.product.id),
          quantity: item.quantity,
          name: item.product.name,
          price: item.product.price ?? 0,
        }))
        .filter(
          (item) =>
            Number.isFinite(item.productId) &&
            item.productId > 0 &&
            item.quantity > 0,
        ),
    [items],
  )

  useEffect(() => {
    if (typeof window === "undefined") return

    const raw = window.sessionStorage.getItem("sepay_pending_order")
    if (!raw) return

    try {
      const pending = JSON.parse(raw) as {
        orderId: number
        amount: number
      }

      if (
        Number.isFinite(pending.orderId) &&
        pending.orderId > 0 &&
        Number.isFinite(pending.amount) &&
        pending.amount > 0
      ) {
        window.sessionStorage.removeItem("sepay_pending_order")
        router.replace(
          `/checkout/success?orderId=${pending.orderId}&payment=sepay&amount=${pending.amount}&status=cancel`,
        )
      }
    } catch {
      window.sessionStorage.removeItem("sepay_pending_order")
    }
  }, [router])

  async function redirectToSePayGateway(orderId: number, amount: number) {
    const response = await fetch("/api/sepay/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ orderId, amount }),
    })

    if (!response.ok) {
      let message = "Không thể khởi tạo cổng thanh toán SePay"
      try {
        const body = (await response.json()) as { message?: string }
        if (body.message) message = body.message
      } catch {
        // keep fallback message
      }
      throw new Error(message)
    }

    const data = (await response.json()) as {
      checkoutUrl: string
      fields: Record<string, string | number>
    }

    const form = document.createElement("form")
    form.method = "POST"
    form.action = data.checkoutUrl

    Object.entries(data.fields).forEach(([name, value]) => {
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = name
      input.value = String(value)
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!canCheckout) {
      const message = "Giỏ hàng đang trống."
      setError(message)
      toast.error(message)
      return
    }

    if (!shippingAddress.trim()) {
      const message = "Vui lòng nhập địa chỉ nhận hàng."
      setError(message)
      toast.error(message)
      return
    }

    if (!phoneNumber.trim()) {
      const message = "Vui lòng nhập số điện thoại nhận hàng."
      setError(message)
      toast.error(message)
      return
    }

    if (lineItems.length === 0) {
      const message = "Không có sản phẩm hợp lệ để đặt hàng."
      setError(message)
      toast.error(message)
      return
    }

    if (!selectedPaymentMethodId) {
      const message = "Vui lòng chọn phương thức thanh toán."
      setError(message)
      toast.error(message)
      return
    }

    if (!getAccessToken()) {
      router.push(`/auth/login?next=${encodeURIComponent("/checkout")}`)
      return
    }

    setLoading(true)

    try {
      const order = await placeOrder({
        shippingAddress: shippingAddress.trim(),
        phoneNumber: phoneNumber.trim(),
        orderEmail: orderEmail.trim() || undefined,
        note: note.trim() || undefined,
        voucherCode: voucherCode.trim() || undefined,
        paymentMethodId: selectedPaymentMethodId,
        items: lineItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      })

      const isSePay =
        (order.paymentMethodName ?? "").trim().toUpperCase() === "SEPAY"

      clearCart()
      if (isSePay) {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(
            "sepay_pending_order",
            JSON.stringify({
              orderId: order.id,
              amount: order.finalAmount,
            }),
          )
        }

        toast.success("Đang chuyển sang cổng thanh toán SePay...")
        await redirectToSePayGateway(order.id, order.finalAmount)
        return
      }

      router.push(`/checkout/success?orderId=${order.id}`)
    } catch (err) {
      if (isUnauthorizedError(err)) {
        router.push(`/auth/login?next=${encodeURIComponent("/checkout")}`)
        return
      }
      const message = err instanceof Error ? err.message : "Đặt hàng thất bại."
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  async function onApplyVoucher() {
    const code = voucherCode.trim().toUpperCase()
    if (!code) {
      setVoucherPreview(null)
      const message = "Vui lòng nhập mã voucher để áp dụng."
      setVoucherFeedback(message)
      toast.error(message)
      return
    }

    setApplyingVoucher(true)
    setVoucherFeedback(null)
    try {
      const preview = await previewVoucher(subTotal, code)
      setVoucherCode(preview.voucherCode)
      setVoucherPreview(preview)
      setVoucherFeedback(`Đã áp dụng voucher ${preview.voucherCode}.`)
      toast.success(`Đã áp dụng voucher ${preview.voucherCode}`)
    } catch (err) {
      setVoucherPreview(null)
      const message =
        err instanceof Error ? err.message : "Không thể áp dụng voucher."
      setVoucherFeedback(message)
      toast.error(message)
    } finally {
      setApplyingVoucher(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-(--brand-red)">
          Trang chủ
        </Link>
        <ChevronRight size={14} />
        <Link href="/cart" className="hover:text-(--brand-red)">
          Giỏ hàng
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-gray-800">Thanh toán</span>
      </nav>

      <h1 className="mb-6 text-2xl font-extrabold text-gray-900">Thanh toán</h1>

      {!canCheckout ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-600">Giỏ hàng của bạn đang trống.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex rounded-xl bg-(--brand-red) px-4 py-2 text-sm font-semibold text-white hover:bg-(--brand-red-dark)"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2"
          >
            <h2 className="text-lg font-bold text-gray-900">
              Thông tin nhận hàng
            </h2>

            {/* Address Selector */}
            {!loadingAddresses && addresses.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <MapPin size={16} />
                  Chọn địa chỉ đã lưu
                </div>
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                        selectedAddressId === addr.id
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1 text-sm">
                        <div className="flex items-center gap-2">
                          {addr.addressName && (
                            <span className="font-semibold text-slate-900">
                              {addr.addressName}
                            </span>
                          )}
                          {addr.isDefault && (
                            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs text-white">
                              Mặc định
                            </span>
                          )}
                        </div>
                        {addr.recipientName && (
                          <p className="text-slate-600">{addr.recipientName}</p>
                        )}
                        <p className="text-slate-600">
                          {addr.fullAddress}
                          {addr.ward && `, ${addr.ward}`}
                          {addr.district && `, ${addr.district}`}
                          {addr.city && `, ${addr.city}`}
                        </p>
                        {addr.phone && (
                          <p className="text-slate-500">SĐT: {addr.phone}</p>
                        )}
                      </div>
                    </label>
                  ))}

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                      selectedAddressId === "new"
                        ? "border-blue-400 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value="new"
                      checked={selectedAddressId === "new"}
                      onChange={(e) => handleAddressChange(e.target.value)}
                    />
                    <div className="flex items-center gap-2 text-sm">
                      <Plus size={16} />
                      <span>Nhập địa chỉ mới</span>
                    </div>
                  </label>
                </div>

                <Link
                  href="/account/addresses"
                  className="mt-3 inline-block text-sm text-blue-600 hover:underline"
                >
                  Quản lý địa chỉ →
                </Link>
              </div>
            )}

            {loadingAddresses && getAccessToken() && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Đang tải địa chỉ đã lưu...
              </div>
            )}

            <label className="block text-sm">
              <div className="mb-1 font-medium">Địa chỉ nhận hàng</div>
              <textarea
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="min-h-24 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-(--brand-navy) focus:outline-none focus:ring-2 focus:ring-(--brand-navy)/20"
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              />
            </label>

            <label className="block text-sm">
              <div className="mb-1 font-medium">Số điện thoại nhận hàng</div>
              <input
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-(--brand-navy) focus:outline-none focus:ring-2 focus:ring-(--brand-navy)/20"
                placeholder="Ví dụ: 0901234567"
              />
            </label>

            <label className="block text-sm">
              <div className="mb-1 font-medium">
                Email nhận hóa đơn (tuỳ chọn)
              </div>
              <input
                type="email"
                value={orderEmail}
                onChange={(e) => setOrderEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-(--brand-navy) focus:outline-none focus:ring-2 focus:ring-(--brand-navy)/20"
                placeholder="you@example.com"
              />
            </label>

            <label className="block text-sm">
              <div className="mb-1 font-medium">Mã voucher (tuỳ chọn)</div>
              <div className="flex gap-2">
                <input
                  value={voucherCode}
                  onChange={(e) => {
                    setVoucherCode(e.target.value.toUpperCase())
                    setVoucherPreview(null)
                    setVoucherFeedback(null)
                  }}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-(--brand-navy) focus:outline-none focus:ring-2 focus:ring-(--brand-navy)/20"
                  placeholder="VD: SALE10"
                />
                <button
                  type="button"
                  onClick={onApplyVoucher}
                  disabled={applyingVoucher || !voucherCode.trim()}
                  className="rounded-xl border border-emerald-600 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {applyingVoucher ? "Đang kiểm tra..." : "Áp dụng"}
                </button>
              </div>
              {voucherFeedback && (
                <p
                  className={`mt-1 text-xs ${
                    voucherPreview ? "text-emerald-700" : "text-rose-600"
                  }`}
                >
                  {voucherFeedback}
                </p>
              )}
            </label>

            <label className="block text-sm">
              <div className="mb-1 font-medium">
                Ghi chú đơn hàng (tuỳ chọn)
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-20 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-(--brand-navy) focus:outline-none focus:ring-2 focus:ring-(--brand-navy)/20"
                placeholder="Ví dụ: giao giờ hành chính"
              />
            </label>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <p className="mb-2 text-sm font-semibold text-slate-800">
                Phương thức thanh toán
              </p>
              {loadingPaymentMethods ? (
                <p className="text-sm text-slate-600">Đang tải phương thức thanh toán...</p>
              ) : paymentMethods.length === 0 ? (
                <p className="text-sm text-rose-700">Không có phương thức thanh toán khả dụng.</p>
              ) : (
                <div className="space-y-2">
                  {paymentMethods.map((method) => {
                    const key = method.methodName.toUpperCase()
                    const helper =
                      key === "SEPAY"
                        ? "Thanh toán qua cổng SePay (sandbox/production)"
                        : "Thanh toán khi nhận hàng"

                    return (
                      <label
                        key={method.id}
                        className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={selectedPaymentMethodId === method.id}
                          onChange={() => setSelectedPaymentMethodId(method.id)}
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{method.methodName}</p>
                          <p className="text-xs text-slate-500">{helper}</p>
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <button
                disabled={loading}
                className="rounded-xl bg-(--brand-red) px-5 py-2.5 text-sm font-semibold text-white hover:bg-(--brand-red-dark) disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Đang đặt hàng..." : "Đặt hàng"}
              </button>

              <Link
                href="/cart"
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Quay lại giỏ hàng
              </Link>
            </div>
          </form>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-extrabold text-gray-800">
              Tóm tắt đơn
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              {lineItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-start justify-between gap-2"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              <hr className="my-3 border-gray-200" />
              <div className="flex justify-between">
                <span>Tạm tính ({totalItems()} SP)</span>
                <span className="font-medium">{formatPrice(subTotal)}</span>
              </div>
              {voucherPreview && (
                <div className="flex justify-between text-emerald-700">
                  <span>Giảm giá ({voucherPreview.voucherCode})</span>
                  <span className="font-semibold">- {formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Vận chuyển</span>
                <span className="font-medium text-green-600">Miễn phí</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-gray-900">
                <span>Tổng cộng</span>
                <span className="text-(--brand-red)">
                  {formatPrice(finalAmount)}
                </span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
