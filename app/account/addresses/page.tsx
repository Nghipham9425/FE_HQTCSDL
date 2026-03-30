"use client"

import { useEffect, useState } from "react"
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type UserAddress,
  type AddressUpsertPayload,
} from "@/lib/api/addresses"

type AddressFormData = {
  addressName: string
  recipientName: string
  fullAddress: string
  city: string
  district: string
  ward: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
}

const emptyForm: AddressFormData = {
  addressName: "",
  recipientName: "",
  fullAddress: "",
  city: "",
  district: "",
  ward: "",
  postalCode: "",
  country: "Vietnam",
  phone: "",
  isDefault: false,
}

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<AddressFormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    loadAddresses()
  }, [])

  async function loadAddresses() {
    setLoading(true)
    setError(null)
    try {
      const data = await getAddresses()
      setAddresses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được danh sách địa chỉ.")
    } finally {
      setLoading(false)
    }
  }

  function openNewForm() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
    setError(null)
    setSuccess(null)
  }

  function openEditForm(address: UserAddress) {
    setForm({
      addressName: address.addressName ?? "",
      recipientName: address.recipientName ?? "",
      fullAddress: address.fullAddress,
      city: address.city ?? "",
      district: address.district ?? "",
      ward: address.ward ?? "",
      postalCode: address.postalCode ?? "",
      country: address.country ?? "Vietnam",
      phone: address.phone ?? "",
      isDefault: address.isDefault,
    })
    setEditingId(address.id)
    setShowForm(true)
    setError(null)
    setSuccess(null)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!form.fullAddress.trim()) {
      setError("Địa chỉ không được để trống.")
      return
    }

    setSaving(true)

    try {
      const payload: AddressUpsertPayload = {
        addressName: form.addressName.trim() || null,
        recipientName: form.recipientName.trim() || null,
        fullAddress: form.fullAddress.trim(),
        city: form.city.trim() || null,
        district: form.district.trim() || null,
        ward: form.ward.trim() || null,
        postalCode: form.postalCode.trim() || null,
        country: form.country.trim() || "Vietnam",
        phone: form.phone.trim() || null,
        isDefault: form.isDefault,
      }

      if (editingId) {
        await updateAddress(editingId, payload)
        setSuccess("Đã cập nhật địa chỉ thành công.")
      } else {
        await createAddress(payload)
        setSuccess("Đã thêm địa chỉ mới thành công.")
      }

      closeForm()
      await loadAddresses()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu địa chỉ thất bại.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return

    setDeleting(id)
    setError(null)
    setSuccess(null)

    try {
      await deleteAddress(id)
      setSuccess("Đã xóa địa chỉ.")
      await loadAddresses()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xóa địa chỉ thất bại.")
    } finally {
      setDeleting(null)
    }
  }

  async function handleSetDefault(id: number) {
    setError(null)
    setSuccess(null)

    try {
      await setDefaultAddress(id)
      setSuccess("Đã đặt làm địa chỉ mặc định.")
      await loadAddresses()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật thất bại.")
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Sổ địa chỉ</h1>
            <p className="mt-1 text-slate-600">
              Quản lý địa chỉ nhận hàng của bạn.
            </p>
          </div>
          {!showForm && (
            <button
              onClick={openNewForm}
              className="rounded-xl bg-(--brand-red) px-4 py-2 text-sm font-semibold text-white hover:bg-(--brand-red-dark)"
            >
              + Thêm địa chỉ
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              {editingId ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm">
                <div className="mb-1 font-medium">Tên địa chỉ</div>
                <input
                  value={form.addressName}
                  onChange={(e) => setForm((prev) => ({ ...prev, addressName: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="VD: Nhà, Công ty, ..."
                />
              </label>

              <label className="text-sm">
                <div className="mb-1 font-medium">Người nhận</div>
                <input
                  value={form.recipientName}
                  onChange={(e) => setForm((prev) => ({ ...prev, recipientName: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Tên người nhận hàng"
                />
              </label>

              <label className="text-sm md:col-span-2">
                <div className="mb-1 font-medium">Địa chỉ đầy đủ *</div>
                <textarea
                  required
                  value={form.fullAddress}
                  onChange={(e) => setForm((prev) => ({ ...prev, fullAddress: e.target.value }))}
                  className="min-h-20 w-full rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Số nhà, tên đường, ..."
                />
              </label>

              <label className="text-sm">
                <div className="mb-1 font-medium">Phường/Xã</div>
                <input
                  value={form.ward}
                  onChange={(e) => setForm((prev) => ({ ...prev, ward: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm">
                <div className="mb-1 font-medium">Quận/Huyện</div>
                <input
                  value={form.district}
                  onChange={(e) => setForm((prev) => ({ ...prev, district: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm">
                <div className="mb-1 font-medium">Tỉnh/Thành phố</div>
                <input
                  value={form.city}
                  onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm">
                <div className="mb-1 font-medium">Mã bưu điện</div>
                <input
                  value={form.postalCode}
                  onChange={(e) => setForm((prev) => ({ ...prev, postalCode: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm">
                <div className="mb-1 font-medium">Quốc gia</div>
                <input
                  value={form.country}
                  onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm">
                <div className="mb-1 font-medium">Số điện thoại</div>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="0901234567"
                />
              </label>

              <label className="flex items-center gap-2 text-sm md:col-span-2">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <span>Đặt làm địa chỉ mặc định</span>
              </label>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-(--brand-red) px-4 py-2 text-sm font-semibold text-white hover:bg-(--brand-red-dark) disabled:opacity-60"
              >
                {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm địa chỉ"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Hủy
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="mt-6 text-sm text-slate-600">Đang tải...</div>
        ) : addresses.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-slate-600">Bạn chưa có địa chỉ nào.</p>
            {!showForm && (
              <button
                onClick={openNewForm}
                className="mt-3 rounded-xl bg-(--brand-red) px-4 py-2 text-sm font-semibold text-white hover:bg-(--brand-red-dark)"
              >
                + Thêm địa chỉ đầu tiên
              </button>
            )}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`rounded-xl border p-4 ${
                  addr.isDefault
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {addr.addressName && (
                        <span className="font-semibold text-slate-900">
                          {addr.addressName}
                        </span>
                      )}
                      {addr.isDefault && (
                        <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-medium text-white">
                          Mặc định
                        </span>
                      )}
                    </div>
                    {addr.recipientName && (
                      <p className="mt-1 text-sm text-slate-700">
                        Người nhận: {addr.recipientName}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-slate-600">
                      {addr.fullAddress}
                    </p>
                    <p className="text-sm text-slate-500">
                      {[addr.ward, addr.district, addr.city, addr.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {addr.phone && (
                      <p className="mt-1 text-sm text-slate-500">
                        SĐT: {addr.phone}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        Đặt mặc định
                      </button>
                    )}
                    <button
                      onClick={() => openEditForm(addr)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      disabled={deleting === addr.id}
                      className="text-sm text-rose-600 hover:text-rose-700 disabled:opacity-50"
                    >
                      {deleting === addr.id ? "Đang xóa..." : "Xóa"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
