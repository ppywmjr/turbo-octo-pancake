import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { serverFetch } from '@/app/lib/serverFetch'
import { activationCodeSchema } from '@/app/lib/schemas'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const parsed = activationCodeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.issues },
      { status: 400 },
    )
  }

  const { getToken } = await auth()
  const token = await getToken()
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const baseUrl = process.env.SUBSCRIPTION_MANAGEMENT_URL
  if (!baseUrl) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  const url = new URL('/me/subscriptions', baseUrl).toString()

  const res = await serverFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ activationCode: parsed.data.activationCode }),
  })

  // Handle backend success (201 Created)
  if (res.ok) {
    return new NextResponse(null, { status: 204 })
  }

  // Log subscription creation errors for debugging
  console.error('[Subscription] POST /api/me/subscriptions failed:', {
    status: res.status,
    url,
    activationCode: parsed.data.activationCode,
  })

  // Parse backend response to detect known error cases
  const text = await res.text().catch(() => '')

  // Log the full backend response for 400 errors
  if (res.status === 400) {
    console.error('[Subscription] Backend 400 Bad Request response:', {
      url,
      status: res.status,
      body: text,
      activationCode: parsed.data.activationCode,
    })
  }
  let backendError: string | null = null

  try {
    const json = JSON.parse(text)
    if (json.success === false && json.error) {
      backendError = json.error
    }
  } catch {
    // Not JSON — use raw text
    if (text) {
      backendError = text
    }
  }

  // Known error: user already has a subscription to this plan
  if (backendError?.includes('already have a subscription')) {
    return NextResponse.json(
      { error: 'You already have a subscription to this plan. Try refreshing the page.' },
      { status: 409 },
    )
  }

  // All other errors — forward status and message
  return NextResponse.json(
    { error: `Subscription service error: ${res.status}`, detail: backendError || text },
    { status: res.status },
  )
}