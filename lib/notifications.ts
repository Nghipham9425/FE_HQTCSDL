import { toast } from "sonner"

const defaultDuration = 3200

export const notify = {
  cartAdded(productName: string, quantity = 1) {
    toast.success("Đã thêm vào giỏ hàng", {
      description:
        quantity > 1 ? `${quantity} × ${productName}` : productName,
      duration: defaultDuration,
    })
  },

  cartUpdated(message: string) {
    toast.success(message, { duration: defaultDuration })
  },

  orderPlaced(orderId: number) {
    toast.success("Đặt hàng thành công", {
      description: `Đơn hàng #${orderId} đã được ghi nhận.`,
      duration: 4500,
    })
  },

  paymentRedirect() {
    toast.loading("Đang mở cổng thanh toán SePay…", {
      id: "sepay-redirect",
      description: "Vui lòng không đóng cửa sổ.",
    })
  },

  dismissPaymentRedirect() {
    toast.dismiss("sepay-redirect")
  },

  error(message: string, description?: string) {
    toast.error(message, {
      description,
      duration: 4500,
    })
  },
}
