'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ERROR_MESSAGES: Record<string, string> = {
  unauthorized:
    'You do not have permission to see that page. Please check that you are signed in and have signed up to the correct plan for that page.',
}

export default function ErrorNotification({ error }: { error: string | undefined }) {
  const router = useRouter()
  const [dismissed, setDismissed] = useState(false)

  if (!error || dismissed) return null

  const message = ERROR_MESSAGES[error] ?? 'Something went wrong.'

  function dismiss() {
    setDismissed(true)
    router.replace('/', { scroll: false })
  }

  return (
    <div
      role="alert"
      aria-labelledby="error-notification-heading"
      className="w-full max-w-3xl rounded-xl border border-[var(--color-error-border-light)] bg-[var(--color-error-bg-light)] px-4 py-3 mb-6"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p
            id="error-notification-heading"
            className="text-sm font-semibold text-[var(--color-error-text-light)]"
          >
            Error
          </p>
          <p className="mt-1 text-sm text-[var(--color-error-text-light)]">{message}</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss error notification"
          className="shrink-0 rounded p-0.5 text-[var(--color-error-focus)] hover:bg-[var(--color-error-bg-light)] hover:text-[var(--color-error-focus)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-error-focus)] transition-colors"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
