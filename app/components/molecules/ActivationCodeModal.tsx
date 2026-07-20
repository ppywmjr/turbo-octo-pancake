'use client'

import { useState, useEffect, useRef } from 'react'
import Button from '@/app/components/atoms/Button'

interface ActivationCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (code: string) => Promise<void>
  error: string | null
}

export default function ActivationCodeModal({ isOpen, onClose, onSubmit, error: propError }: ActivationCodeModalProps) {
  const [code, setCode] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setCode('')
      setValidationError(null)
      setIsSubmitting(false)
    }
  }, [isOpen])

  useEffect(() => {
    setValidationError(propError)
  }, [propError])

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
              }}
              placeholder="Enter your activation code"
              disabled={isSubmitting}
              className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 ${
                validationError
                  ? 'border-[var(--color-error-border-light)] focus:ring-[var(--color-error-focus)]'
                  : 'border-gray-300 focus:ring-[var(--color-brand)]'
              }`}
            />
            {validationError && (
              <p className="mt-1 text-xs text-[var(--color-error-text-light)]">{validationError}</p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
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