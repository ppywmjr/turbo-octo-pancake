import { auth, currentUser } from '@clerk/nextjs/server'
import { serverFetch } from '@/app/lib/serverFetch'

export async function POST() {
  const baseUrl = process.env.SUBSCRIPTION_MANAGEMENT_URL
  if (!baseUrl) {
    console.error('[api/auth/sync] SUBSCRIPTION_MANAGEMENT_URL is not configured')
    return Response.json(
      { error: 'Subscription service not configured' },
      { status: 503 },
    )
  }

  const { getToken } = await auth()
  const token = await getToken()
  if (!token) {
    console.error('[api/auth/sync] Clerk token not available')
    return Response.json(
      { error: 'Authentication token not available' },
      { status: 401 },
    )
  }

  const user = await currentUser()
  if (!user) {
    console.error('[api/auth/sync] Clerk user not found')
    return Response.json(
      { error: 'User not authenticated' },
      { status: 401 },
    )
  }

  const email = user.emailAddresses[0]?.emailAddress ?? ''
  const signupUrl = new URL('/signup', baseUrl).toString()

  console.log(`[api/auth/sync] Syncing user ${user.id} to subscription service`)

  try {
    const res = await serverFetch(signupUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ clerkUserId: user.id, email }),
    })

    if (res.status === 202) {
      console.log(`[api/auth/sync] Successfully synced user ${user.id}`)
      return new Response(null, { status: 204 })
    }

    // Try to parse error body for more context
    const errorBody = await res.text().catch(() => '')
    console.error(
      `[api/auth/sync] Unexpected response for user ${user.id}: status ${res.status}`,
      errorBody ? `— ${errorBody}` : '',
    )

    return Response.json(
      { error: `Subscription service returned ${res.status}` },
      { status: res.status },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[api/auth/sync] Failed to sync user ${user.id}: ${message}`)
    return Response.json(
      { error: 'Failed to sync with subscription service', detail: message },
      { status: 502 },
    )
  }
}
