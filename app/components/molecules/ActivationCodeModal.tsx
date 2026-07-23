'use client'

import { useState, useEffect, useRef } from 'react'
import Button from '@/app/components/atoms/Button'

interface ActivationCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (code: string) => Promise<void>
  error: string | null
}

function ActivationCodeModalContent({ isOpen, onClose, onSubmit, error: propError }: ActivationCodeModalProps) {
  const [code, setCode] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Track whether user has interacted with the input (clears propError display)
  const [hasUserTyped, setHasUserTyped] = useState(false)

  // Determine if propError should be displayed: it's set and user hasn't typed yet
  const effectivePropError = hasUserTyped ? null : propError

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmed = code.trim()
    if (!trimmed) {
      setValidationError('Activation code is required')
      return
    }
    if (trimmed.length > 128) {
      setValidationError('Activation code is too long')
      return
    }

    setValidationError(null)
    setIsSubmitting(true)

    try {
      await onSubmit(trimmed)
    } catch {
      // error handled via propError
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="activation-code-modal-title"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--color-overlay-gradient)]" />

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-md rounded-xl bg-[var(--color-white)] p-6 shadow-xl">
        <h2
          id="activation-code-modal-title"
          className="text-lg font-semibold text-[var(--color-text-primary)]"
        >
          Activate Code
        </h2>

        <form onSubmit={handleSubmit} className="mt-4">
          <div>
            <input
              ref={inputRef}
              id="activation-code-input"
              aria-labelledby='activation-code-modal-title'
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                if (validationError) {
                  setValidationError(null)
                }
                setHasUserTyped(true)
              }}
              placeholder="Enter your activation code"
              disabled={isSubmitting}
              className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 ${
                validationError || effectivePropError
                  ? 'border-[var(--color-error-border-light)] focus:ring-[var(--color-error-focus)]'
                  : 'border-gray-300 focus:ring-[var(--color-brand)]'
              }`}
            />
            {(validationError || effectivePropError) && (
              <p className="mt-1 text-xs text-[var(--color-error-text-light)]">{validationError || effectivePropError}</p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting || !code.trim()}
            >
              {isSubmitting ? 'Activating...' : 'Activate'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ActivationCodeModal(props: ActivationCodeModalProps) {
  const [key, setKey] = useState(0)

  // Update the key when isOpen changes to force remount (in effect, not during render)
  useEffect(() => {
    if (!props.isOpen) {
      setKey(k => k + 1) // eslint-disable-line react-hooks/set-state-in-effect -- key changes in effects are a valid React pattern for forcing component remounts
    }
  }, [props.isOpen])

  return (
    <ActivationCodeModalContent
      key={key}
      {...props}
    />
  )
}