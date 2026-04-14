import { auth } from '@clerk/nextjs/server'

import type { Video } from '@/app/types/video'

export async function fetchCourseVideos(courseId: string): Promise<Video[]> {
  const baseUrl = process.env.SUBSCRIPTION_MANAGEMENT_URL

  if (!baseUrl) return []

  const url = new URL(`/me/courses/${courseId}/videos`, baseUrl).toString()

  const { getToken } = await auth()
  const token = await getToken()
  if (!token) {
    throw new Error('User is not authenticated')
  }

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Course videos API responded with ${res.status}`)
  }

  return (await res.json()).data as Video[]
}
