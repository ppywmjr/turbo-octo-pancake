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
      className="w-full max-w-3xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-950 mb-6"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p
            id="error-notification-heading"
            className="text-sm font-semibold text-red-800 dark:text-red-200"
          >
            Error
          </p>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">{message}</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss error notification"
          className="shrink-0 rounded p-0.5 text-red-400 hover:bg-red-100 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 dark:text-red-500 dark:hover:bg-red-900 dark:hover:text-red-300 transition-colors"
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
