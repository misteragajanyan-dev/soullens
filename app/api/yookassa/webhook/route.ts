import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

type YooKassaWebhookPayload = {
  event?: string
  object?: {
    id?: string
    status?: string
    paid?: boolean
    metadata?: {
      reading_id?: string
    }
  }
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as YooKassaWebhookPayload

    const event = payload?.event
    const paymentId = payload?.object?.id
    const status = payload?.object?.status
    const readingId = payload?.object?.metadata?.reading_id

    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId missing' }, { status: 400 })
    }

    // Обновляем статус даже если это не succeeded
    await supabaseAdmin
      .from('readings')
      .update({
        payment_status: status ?? 'unknown',
      })
      .eq('payment_id', paymentId)

    if (event === 'payment.succeeded') {
      const query = supabaseAdmin
        .from('readings')
        .update({
          is_paid: true,
          payment_status: 'succeeded',
          paid_at: new Date().toISOString(),
          unlocked_at: new Date().toISOString(),
        })
        .eq('payment_id', paymentId)

      const { error } = readingId
        ? await query.eq('id', readingId)
        : await query

      if (error) {
        console.error('Failed to unlock reading:', error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    if (event === 'payment.canceled') {
      await supabaseAdmin
        .from('readings')
        .update({
          payment_status: 'canceled',
        })
        .eq('payment_id', paymentId)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}