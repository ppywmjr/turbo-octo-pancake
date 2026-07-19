'use client'

import { SignUpButton, SignInButton } from '@clerk/nextjs'

export default function HeroCTA({ planId }: { planId: string | null }) {
  const subscribeUrl = planId ? `/subscribe/${planId}` : '/courses'

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <SignUpButton forceRedirectUrl={subscribeUrl}>
        <button className="flex h-12 items-center justify-center rounded-full bg-[var(--color-brand)] px-8 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-brand)]">
          Sign up now
        </button>
      </SignUpButton>
      <SignInButton forceRedirectUrl="/">
        <button className="flex h-12 items-center justify-center rounded-full border border-[var(--color-surface)] px-8 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface)]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-text-muted)]">
          Sign in
        </button>
      </SignInButton>
    </div>
  )
}
