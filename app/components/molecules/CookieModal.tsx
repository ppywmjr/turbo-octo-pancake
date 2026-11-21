'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Button from '@/app/components/atoms/Button'
import BodyText from '@/app/components/atoms/text/BodyText'

const COOKIE_CONSENT_KEY = 'cookie_consent_given'

function getCookieConsentGiven(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(COOKIE_CONSENT_KEY) === 'true'
}

function setCookieConsentGiven(value: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(COOKIE_CONSENT_KEY, String(value))
}

export default function CookieModal() {
  const pathname = usePathname()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Never show the modal on any policies page
    if (pathname.startsWith('/policies/')) {
      return
    }

    // The site requires all cookies to function, so the modal is shown until consent is given
    if (!getCookieConsentGiven()) {
      setIsVisible(true)
    }
  }, [pathname])

  const handleContinue = () => {
    setCookieConsentGiven(true)
    setIsVisible(false)
  }

  if (!isVisible) return null

  const bodyText = (
    <>
      This website uses cookies, including third-party YouTube cookies, which are required for the site to function. By clicking "Continue" you accept all cookies as per our{' '}
      <span
        onClick={(e) => {
          e.preventDefault()
          setIsVisible(false)
          router.push('/policies/terms-of-use')
        }}
        className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
      >
        Terms of Use
      </span>.
      Read more in our{' '}
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
            Cookie Consent
          </h2>
          <BodyText muted>{bodyText}</BodyText>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="primary" size="md" onClick={handleContinue} className="flex-1">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
