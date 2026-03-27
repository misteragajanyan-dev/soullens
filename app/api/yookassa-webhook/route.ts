import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const event = body?.event
    const payment = body?.object

    if (!event || !payment) {
      return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 })
    }

    const readingId = payment?.metadata?.reading_id

    if (!readingId) {
      return NextResponse.json({ error: 'No reading_id' }, { status: 400 })
    }

    // 💰 успешная оплата
    if (event === 'payment.succeeded') {
      const { error } = await supabaseAdmin
        .from('readings')
        .update({
          is_paid: true,
          payment_status: 'succeeded',
          paid_at: new Date().toISOString(),
          unlocked_at: new Date().toISOString(),
        })
        .eq('id', readingId)

      if (error) {
        console.error('DB update error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    // ❌ отмена / ошибка
    if (event === 'payment.canceled') {
      await supabaseAdmin
        .from('readings')
        .update({
          payment_status: 'canceled',
        })
        .eq('id', readingId)
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}