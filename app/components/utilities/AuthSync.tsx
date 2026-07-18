'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export default function AuthSync() {
  const { isSignedIn, user } = useUser()

  useEffect(() => {
    if (!isSignedIn || !user) return

    // Fire once per browser session per user — avoids re-firing on every page load
    const key = `auth-synced-${user.id}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')

    fetch('/api/auth/sync', { method: 'POST' }).catch((err: unknown) => {
      console.error('[AuthSync] Failed to sync user with subscription service:', err)
    })
  }, [isSignedIn, user])

  return null
}
