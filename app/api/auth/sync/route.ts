import { auth, currentUser } from '@clerk/nextjs/server'

export async function POST() {
  const baseUrl = process.env.SUBSCRIPTION_MANAGEMENT_URL
  if (!baseUrl) {
    return new Response('SUBSCRIPTION_MANAGEMENT_URL not configured', { status: 503 })
  }

  const { getToken } = await auth()
  const token = await getToken()
  if (!token) {
    return new Response('Unauthorized', { status: 401 })
  }

  const user = await currentUser()
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const email = user.emailAddresses[0]?.emailAddress ?? ''
  const signupUrl = new URL('/signup', baseUrl).toString()

  const res = await fetch(signupUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ clerkUserId: user.id, email }),
  })

  if (res.status !== 202) {
    console.error(`[api/auth/sync] Subscription management returned unexpected status ${res.status}`)
  }

  return new Response(null, { status: 204 })
}
