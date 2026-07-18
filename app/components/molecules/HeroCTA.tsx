'use client'

import { SignUpButton, SignInButton } from '@clerk/nextjs'

export default function HeroCTA({ planId }: { planId: string | null }) {
  const subscribeUrl = planId ? `/subscribe/${planId}` : '/courses'

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <SignUpButton forceRedirectUrl={subscribeUrl}>
        <button className="flex h-12 items-center justify-center rounded-full bg-violet-600 px-8 text-sm font-semibold text-white transition-colors hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600">
          Sign up now
        </button>
      </SignUpButton>
      <SignInButton forceRedirectUrl="/">
        <button className="flex h-12 items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-8 text-sm font-semibold text-zinc-900 dark:text-zinc-50 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-600">
          Sign in
        </button>
      </SignInButton>
    </div>
  )
}
