import { auth } from '@clerk/nextjs/server'

import type { Video } from '@/app/types/video'
import { serverFetch } from '@/app/lib/serverFetch'

export async function fetchCourseVideos(courseId: string): Promise<Video[]>
export async function fetchCourseVideos(courseId: string, videoId: string): Promise<Video | null>
export async function fetchCourseVideos(
  courseId: string,
  videoId?: string,
): Promise<Video[] | Video | null> {
  const baseUrl = process.env.SUBSCRIPTION_MANAGEMENT_URL

  if (!baseUrl) return videoId ? null : []

  const path = videoId
    ? `/me/courses/${courseId}/videos/${videoId}`
    : `/me/courses/${courseId}/videos`
  const url = new URL(path, baseUrl).toString()
  console.log('Fetching course videos from URL:', url)

  const { getToken } = await auth()
  const token = await getToken()
  console.log('Fetching course videos with token:', !!token)
  if (!token) {
    throw new Error('User is not authenticated')
  }

  const res = await serverFetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  })
  console.log('Course videos API responded with status:', res.status)
  if (!res.ok) {
    throw new Error(`Course videos API responded with ${res.status}`)
  }

  const json = await res.json()
  console.log('Course videos API responded with data:', json)
  if (videoId) {
    console.log('Looking for video with ID:', videoId)
    return {
      id: json.data.id,
      title: json.data.title,
      url: json.data.url,
      thumbnail: json.data.thumbnail,
      watched: json.data.watched,
      progressSecs: json.data.progressSecs ?? 0,
    } satisfies Video
  }

  return json.data as Video[]
}
