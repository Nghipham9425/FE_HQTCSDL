import { NextRequest, NextResponse } from "next/server"
import { SePayPgClient } from "sepay-pg-node"

type CheckoutPayload = {
  orderId: number
  amount: number
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutPayload
    const orderId = Number(body.orderId)
    const amount = Number(body.amount)

    if (!Number.isFinite(orderId) || orderId <= 0) {
      return NextResponse.json(
        { message: "Invalid order id" },
        { status: 400 },
      )
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 })
    }

    const merchantId = process.env.SEPAY_MERCHANT_ID?.trim()
    const secretKey = process.env.SEPAY_SECRET_KEY?.trim()
    const env = (process.env.SEPAY_ENV?.trim().toLowerCase() || "sandbox") as
      | "sandbox"
      | "production"

    if (!merchantId || !secretKey) {
      return NextResponse.json(
        { message: "SePay merchant config is missing" },
        { status: 500 },
      )
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL?.trim() || request.nextUrl.origin

    const invoice = `DH${orderId}`

    const client = new SePayPgClient({
      env,
      merchant_id: merchantId,
      secret_key: secretKey,
    })

    const checkoutUrl = client.checkout.initCheckoutUrl()
    const fields = client.checkout.initOneTimePaymentFields({
      operation: "PURCHASE",
      payment_method: "BANK_TRANSFER",
      order_invoice_number: invoice,
      order_amount: amount,
      currency: "VND",
      order_description: `Thanh toan don hang ${invoice}`,
      success_url: `${appUrl}/checkout/success?orderId=${orderId}&payment=sepay&amount=${amount}`,
      error_url: `${appUrl}/checkout/success?orderId=${orderId}&payment=sepay&amount=${amount}&status=error`,
      cancel_url: `${appUrl}/checkout/success?orderId=${orderId}&payment=sepay&amount=${amount}&status=cancel`,
    })

    return NextResponse.json({ checkoutUrl, fields })
  } catch {
    return NextResponse.json(
      { message: "Cannot initialize SePay checkout" },
      { status: 500 },
    )
  }
}
