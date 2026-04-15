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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const baseUrl = process.env.SUBSCRIPTION_MANAGEMENT_URL
  if (!baseUrl) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  const { id, videoId } = await params
  const url = new URL(`/me/courses/${id}/videos/${videoId}/progress`, baseUrl).toString()

  const body = await req.json()

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
    return NextResponse.json({ error: `Upstream error ${res.status}` }, { status: res.status })
  }

  return new NextResponse(null, { status: 204 })
}
