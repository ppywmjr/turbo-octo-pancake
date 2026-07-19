'use client'

import { useState } from 'react'
import Button from '@/app/components/atoms/Button'

export default function SubscribeButton({ planId }: { planId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubscribe() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/plans/${planId}/checkout`, { method: 'POST' })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError((data as { error?: string }).error ?? 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      const data = await res.json()
      window.location.href = (data as { checkoutUrl: string }).checkoutUrl
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={handleSubscribe}
        disabled={loading}
        variant="primary"
        size="md"
      >
        {loading ? 'Redirecting to payment…' : 'Proceed to payment'}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-[var(--color-error-focus)] text-center">
          {error}
        </p>
      )}
    </div>
  )
}