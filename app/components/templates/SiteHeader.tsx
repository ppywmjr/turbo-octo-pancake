'use client'

import { usePathname } from 'next/navigation'
import { useAuth, Show, UserButton } from '@clerk/nextjs'

export default function SiteHeader() {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()

  // Hide header only on the home page when user is signed out
  if (pathname === '/' && !isSignedIn) return null

  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <Show when="signed-in">
        <UserButton />
      </Show>
    </header>
  )
}
