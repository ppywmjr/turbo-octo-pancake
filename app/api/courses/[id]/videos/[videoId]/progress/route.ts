import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { serverFetch } from '@/app/lib/serverFetch'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; videoId: string }> },
) {
  const { getToken } = await auth()
  const token = await getToken()
  if (!token) {
    console.error('[api/courses/progress] Clerk token not available')
    return NextResponse.json(
      { error: 'Authentication token not available' },
      { status: 401 },
    )
  }

  const baseUrl = process.env.SUBSCRIPTION_MANAGEMENT_URL
  if (!baseUrl) {
    console.error('[api/courses/progress] SUBSCRIPTION_MANAGEMENT_URL is not configured')
    return NextResponse.json(
      { error: 'Subscription service not configured' },
      { status: 503 },
    )
  }

  const { id, videoId } = await params
  const url = new URL(`/me/courses/${id}/videos/${videoId}/progress`, baseUrl).toString()

  let body: unknown
  try {
    body = await req.json()
  } catch {
    console.error('[api/courses/progress] Invalid JSON body in request')
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    )
  }

  console.log(`[api/courses/progress] Updating progress for course ${id}, video ${videoId}`, JSON.stringify(body))

  try {
    const res = await serverFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error(
        `[api/courses/progress] Subscription service returned ${res.status} for course ${id}, video ${videoId}`,
        text ? `— ${text}` : '',
      )
      return NextResponse.json(
        {
          error: `Subscription service error (${res.status})`,
          detail: text || 'No details provided',
        },
        { status: res.status },
      )
    }

    console.log(`[api/courses/progress] Progress updated for course ${id}, video ${videoId}`)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[api/courses/progress] Failed to update progress for course ${id}, video ${videoId}: ${message}`)
    return NextResponse.json(
      { error: 'Failed to update progress', detail: message },
      { status: 502 },
    )
  }
}
