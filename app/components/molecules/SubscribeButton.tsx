'use client'

import { useState } from 'react'

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
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="flex h-12 w-full items-center justify-center rounded-full bg-[var(--color-brand)] text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-hover)] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-brand)]"
      >
        {loading ? 'Redirecting to payment…' : 'Proceed to payment'}
      </button>
      {error && (
        <p role="alert" className="text-sm text-[var(--color-error-focus)] text-center">
          {error}
        </p>
      )}
    </div>
  )
}
