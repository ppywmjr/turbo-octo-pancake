import { auth } from '@clerk/nextjs/server'
import { serverFetch } from '@/app/lib/serverFetch'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const baseUrl = process.env.SUBSCRIPTION_MANAGEMENT_URL
  if (!baseUrl) {
    return Response.json({ error: 'Service not configured' }, { status: 503 })
  }

  const { getToken } = await auth()
  const token = await getToken()
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  const res = await serverFetch(new URL(`/courses/${id}`, baseUrl).toString(), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    return Response.json(
      { error: `Course service error: ${res.status}`, detail: text },
      { status: res.status },
    )
  }

  const data = await res.json()
  return Response.json(data)
}
