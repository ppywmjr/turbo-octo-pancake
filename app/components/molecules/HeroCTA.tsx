'use client'

import { SignUpButton, SignInButton } from '@clerk/nextjs'
import Button from '@/app/components/atoms/Button'

export default function HeroCTA({ planId }: { planId: string | null }) {

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <SignUpButton forceRedirectUrl="/">
        <Button variant="primary" size="md">
          Sign up now
        </Button>
      </SignUpButton>
      <SignInButton forceRedirectUrl="/">
        <Button variant="secondary" size="md">
          Sign in
        </Button>
      </SignInButton>
    </div>
  )
}