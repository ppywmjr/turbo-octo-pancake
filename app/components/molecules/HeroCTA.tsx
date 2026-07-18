'use client'

import { SignUpButton, SignInButton } from '@clerk/nextjs'

export default function HeroCTA({ planId }: { planId: string | null }) {
  const subscribeUrl = planId ? `/subscribe/${planId}` : '/courses'

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <SignUpButton forceRedirectUrl={subscribeUrl}>
        <button className="flex h-12 items-center justify-center rounded-full bg-[var(--color-brand)] px-8 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-brand-focus)]">
          Sign up now
        </button>
      </SignUpButton>
      <SignInButton forceRedirectUrl="/">
        <button className="flex h-12 items-center justify-center rounded-full border border-[var(--color-zinc-300)] dark:border-[var(--color-zinc-800)] px-8 text-sm font-semibold text-[var(--color-zinc-900)] dark:text-[var(--color-zinc-50)] transition-colors hover:bg-[var(--color-zinc-100)] dark:hover:bg-[var(--color-zinc-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-zinc-600)]">
          Sign in
        </button>
      </SignInButton>
    </div>
  )
}
