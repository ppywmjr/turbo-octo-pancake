import { auth } from '@clerk/nextjs/server'
import { serverFetch } from '@/app/lib/serverFetch'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ planId: string }> },
) {
  const { planId } = await params

  const baseUrl = process.env.SUBSCRIPTION_MANAGEMENT_URL
  if (!baseUrl) {
    return Response.json({ error: 'Service not configured' }, { status: 503 })
  }

  const { getToken } = await auth()
  const token = await getToken()
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(`/plans/${planId}/subscribe`, baseUrl)

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
    return Response.json(
      { error: `Subscription service error: ${res.status}`, detail: text },
      { status: res.status },
    )
  }

  const data = await res.json()
  return Response.json(data)
}
