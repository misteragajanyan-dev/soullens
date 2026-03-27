import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createYooKassaPayment } from '@/lib/yookassa'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const readingId = body?.readingId as string | undefined

    if (!readingId) {
      return NextResponse.json(
        { error: 'readingId is required' },
        { status: 400 }
      )
    }

    const { data: reading, error: readingError } = await supabaseAdmin
      .from('readings')
      .select('id, user1_name, user2_name, is_paid, price_rub')
      .eq('id', readingId)
      .single()

    if (readingError || !reading) {
      return NextResponse.json(
        { error: 'Reading not found' },
        { status: 404 }
      )
    }

    if (reading.is_paid) {
      return NextResponse.json({
        success: true,
        alreadyPaid: true,
        redirectUrl: `/result/${reading.id}`,
      })
    }

    const appUrl = process.env.NEXT_PUBLIC_BASE_URL
    if (!appUrl) {
      return NextResponse.json(
        { error: 'Missing NEXT_PUBLIC_BASE_URL' },
        { status: 500 }
      )
    }

    const payment = await createYooKassaPayment({
      amount: reading.price_rub ?? 99,
      description: 'SoulLens: полный разбор совместимости',
      returnUrl: `${appUrl}/result/${reading.id}?payment=return`,
      metadata: {
        reading_id: reading.id,
      },
    })

    const { error: updateError } = await supabaseAdmin
      .from('readings')
      .update({
        payment_provider: 'yookassa',
        payment_id: payment.id,
        payment_status: payment.status,
      })
      .eq('id', reading.id)

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }

    const redirectUrl = payment.confirmation?.confirmation_url

    if (!redirectUrl) {
      return NextResponse.json(
        { error: 'Missing confirmation_url' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      redirectUrl,
    })
  } catch (error) {
    console.error('create-payment error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}