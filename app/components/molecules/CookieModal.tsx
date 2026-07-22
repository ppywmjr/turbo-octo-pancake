'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Button from '@/app/components/atoms/Button'
import BodyText from '@/app/components/atoms/text/BodyText'
import { deleteNonEssentialStorage } from '@/app/lib/cookies/utils'

const COOKIE_CONSENT_KEY = 'cookie_consent_given'
const COOKIE_CONSENT_REJECTED_KEY = 'cookie_consent_rejected'

function getCookieConsentGiven(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(COOKIE_CONSENT_KEY) === 'true'
}

function getCookieConsentRejected(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(COOKIE_CONSENT_REJECTED_KEY) === 'true'
}

function setCookieConsentGiven(value: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(COOKIE_CONSENT_KEY, String(value))
}

function setCookieConsentRejected(value: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(COOKIE_CONSENT_REJECTED_KEY, String(value))
}

const isHomeRoute = (path: string): boolean => path === '/' || path === ''

export default function CookieModal() {
  const pathname = usePathname()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [isRePrompt, setIsRePrompt] = useState(false)

  useEffect(() => {
    // Never show the modal on any policies page
    if (pathname.startsWith('/policies/')) {
      return
    }

    const hasConsent = getCookieConsentGiven()
    const hasRejected = getCookieConsentRejected()

    if (!hasConsent && !hasRejected) {
      // First time visitor — show initial modal
      setIsVisible(true)
      setIsRePrompt(false)
    } else if (hasRejected && !isHomeRoute(pathname)) {
      // Cookies were rejected and user navigated to a non-home page — reopen modal
      setIsVisible(true)
      setIsRePrompt(true)
    }
  }, [pathname])

  const handleAccept = () => {
    setCookieConsentGiven(true)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(COOKIE_CONSENT_REJECTED_KEY)
    }
    setIsVisible(false)
  }

  const handleReject = async () => {
    setCookieConsentRejected(true)
    await deleteNonEssentialStorage()
    setIsVisible(false)
    router.push('/')
  }

  if (!isVisible) return null

  const title = isRePrompt ? 'Cookie Consent Required' : 'Cookie Consent'

  const initialBodyText = isRePrompt
    ? 'You previously rejected cookies. To continue using this website, you must accept cookies.'
    : 'We use cookies to provide a better browsing experience, content personalization, and site analytics.'

  const termsBodyText = (
    <>
      All cookies must be accepted as per the terms of use of this website. Read more in our{' '}
      <span
        onClick={(e) => {
          e.preventDefault()
          setIsVisible(false)
          router.push('/policies/cookie-policy')
        }}
        className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
      >
        Cookie Policy
      </span>.
    </>
  )

  const acceptButtonText = isRePrompt ? 'Accept all' : 'Accept all'
  const rejectButtonText = isRePrompt ? 'Reject all & leave' : 'Reject all'

  return (
    <div className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[var(--color-overlay-gradient)]"
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-[var(--color-white)] rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-xl mt-24 sm:my-8 overflow-y-auto max-h-[90vh] sm:max-h-none">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
            {title}
          </h2>
          <BodyText muted>
            {initialBodyText}
          </BodyText>
          <BodyText muted className="mt-3">
            {termsBodyText}
          </BodyText>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={handleAccept}
            className="flex-1"
          >
            {acceptButtonText}
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={handleReject}
            className="flex-1"
          >
            {rejectButtonText}
          </Button>
        </div>
      </div>
    </div>
  )
}
