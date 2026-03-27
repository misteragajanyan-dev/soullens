import crypto from 'crypto'

type CreatePaymentInput = {
  amount: number
  description: string
  returnUrl: string
  metadata?: Record<string, string>
}

export type YooKassaCreatePaymentResponse = {
  id: string
  status: string
  paid: boolean
  confirmation?: {
    type: string
    confirmation_url?: string
  }
}

function getBasicAuth() {
  const shopId = process.env.YOOKASSA_SHOP_ID
  const secretKey = process.env.YOOKASSA_SECRET_KEY

  if (!shopId || !secretKey) {
    throw new Error('Missing YooKassa credentials')
  }

  return Buffer.from(`${shopId}:${secretKey}`).toString('base64')
}

export async function createYooKassaPayment(
  input: CreatePaymentInput
): Promise<YooKassaCreatePaymentResponse> {
  const idempotenceKey = crypto.randomUUID()

  const res = await fetch('https://api.yookassa.ru/v3/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${getBasicAuth()}`,
      'Idempotence-Key': idempotenceKey,
    },
    body: JSON.stringify({
      amount: {
        value: input.amount.toFixed(2),
        currency: 'RUB',
      },
      capture: true,
      description: input.description,
      confirmation: {
        type: 'redirect',
        return_url: input.returnUrl,
      },
      metadata: input.metadata ?? {},
    }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`YooKassa create payment failed: ${res.status} ${errorText}`)
  }

  return res.json()
}