import { auth } from '@clerk/nextjs/server'
import { serverFetch } from '@/app/lib/serverFetch'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ planId: string }> },
) {
  const { planId } = await params

  const baseUrl = process.env.SUBSCRIPTION_MANAGEMENT_URL
  if (!baseUrl) {
    console.error('[api/plans/checkout] SUBSCRIPTION_MANAGEMENT_URL is not configured')
    return Response.json(
      { error: 'Subscription service not configured' },
      { status: 503 },
    )
  }

  const { getToken } = await auth()
  const token = await getToken()
  if (!token) {
    console.error('[api/plans/checkout] Clerk token not available')
    return Response.json(
      { error: 'Authentication token not available' },
      { status: 401 },
    )
  }

  const url = new URL(`/plans/${planId}/subscribe`, baseUrl)
  console.log(`[api/plans/checkout] Creating checkout for plan ${planId}`)

  try {
    const res = await serverFetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error(
        `[api/plans/checkout] Subscription service returned ${res.status} for plan ${planId}`,
        text ? `— ${text}` : '',
      )
      return Response.json(
        {
          error: `Subscription service error (${res.status})`,
          detail: text || 'No details provided',
        },
        { status: res.status },
      )
    }

    const data = await res.json()
    console.log(`[api/plans/checkout] Checkout created successfully for plan ${planId}`)
    return Response.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[api/plans/checkout] Failed to create checkout for plan ${planId}: ${message}`)
    return Response.json(
      { error: 'Failed to create checkout', detail: message },
      { status: 502 },
    )
  }
}
