'use client'

import { useState } from 'react'

type Props = {
  readingId: string
  priceRub?: number
}

export default function UnlockButton({ readingId, priceRub = 990 }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePay = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ readingId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || 'Не удалось создать оплату')
      }

      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl
        return
      }

      throw new Error('Нет ссылки на оплату')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка оплаты')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <button
        onClick={handlePay}
        disabled={loading}
        style={{
          width: '100%',
          border: 'none',
          borderRadius: 16,
          padding: '16px 18px',
          fontSize: 16,
          fontWeight: 700,
          cursor: loading ? 'default' : 'pointer',
          background: 'linear-gradient(135deg, #111827 0%, #7c3aed 100%)',
          color: '#fff',
          boxShadow: '0 12px 30px rgba(124, 58, 237, 0.28)',
          opacity: loading ? 0.75 : 1,
        }}
      >
        {loading ? 'Переходим к оплате...' : `Открыть полный разбор — ${priceRub} ₽`}
      </button>

      {error ? (
        <p
          style={{
            marginTop: 10,
            fontSize: 14,
            color: '#b91c1c',
            lineHeight: 1.5,
          }}
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}