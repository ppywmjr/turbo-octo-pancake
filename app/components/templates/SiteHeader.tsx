'use client'

import { usePathname } from 'next/navigation'
import { useAuth, Show, UserButton } from '@clerk/nextjs'
import { PageHeading } from '@/app/components/atoms/text'

export default function SiteHeader() {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()

  // Hide header only on the home page when user is signed out
  if (pathname === '/' && !isSignedIn) return null

  return (
    <header className="relative flex items-center sm:justify-center justify-between p-4">
      <PageHeading className="text-2xl sm:text-3xl lg:text-4xl">
        Catherine Idalia
      </PageHeading>
      <Show when="signed-in">
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <UserButton />
        </div>
      </Show>
    </header>
  )
}
