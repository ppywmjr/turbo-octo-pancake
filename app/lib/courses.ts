import { auth } from '@clerk/nextjs/server'

import type { Course, CoursesResponse } from '@/app/types/course'
import { serverFetch } from '@/app/lib/serverFetch'

const LIMIT = 20

export async function fetchCourse(courseId: string): Promise<Course | null> {
  const baseUrl = process.env.SUBSCRIPTION_MANAGEMENT_URL

  if (!baseUrl) {
    return null
  }

  const url = new URL(`/courses/${courseId}`, baseUrl)

  const { getToken } = await auth()
  const token = await getToken()
  if (!token) {
    throw new Error('User is not authenticated')
  }

  const res = await serverFetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Course API responded with ${res.status}`)
  }

  const json = await res.json()
  // Real API returns { success: true, data: {...} }, mocks return the course directly
  const courseData = json.data ?? json
  return courseData as Course
}

export async function fetchCourses(offset = 0): Promise<CoursesResponse> {
  const baseUrl = process.env.SUBSCRIPTION_MANAGEMENT_URL

  if (!baseUrl) {
    return { courses: [], hasMore: false, total: 0, offset, limit: LIMIT }
  }

  const url = new URL('/me/courses', baseUrl)
  url.searchParams.set('limit', String(LIMIT))
  url.searchParams.set('offset', String(offset))

  const { getToken } = await auth()
  const token = await getToken()
  if (!token) {
    throw new Error('User is not authenticated')
  }

  const res = await serverFetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Courses API responded with ${res.status}`)
  }

  const json = await res.json()
  const data = json.data as Course[]
  const pagination = json.pagination as {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }

  return {
    courses: data,
    hasMore: pagination.hasMore,
    total: pagination.total,
    offset: pagination.offset,
    limit: pagination.limit,
  }
}
