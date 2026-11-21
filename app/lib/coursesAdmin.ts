import { auth } from '@clerk/nextjs/server'

import type { Course, CreateCourseInput, PatchCourseInput } from '@/app/types/course'
import { serverFetch } from '@/app/lib/serverFetch'

const LIMIT = 20

export async function fetchAllCourses(offset = 0) {
  const baseUrl = process.env.SUBSCRIPTION_MANAGEMENT_URL

  if (!baseUrl) {
    return { courses: [], hasMore: false, total: 0, offset, limit: LIMIT }
  }

  const url = new URL('/courses', baseUrl)
  url.searchParams.set('limit', String(LIMIT))
  url.searchParams.set('offset', String(offset))

  const res = await serverFetch(url.toString(), {
    headers: {
      Accept: 'application/json',
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

export async function fetchCourseById(id: string): Promise<Course | null> {
  const baseUrl = process.env.SUBSCRIPTION_MANAGEMENT_URL

  if (!baseUrl) {
    return null
  }

  const url = new URL(`/courses/${id}`, baseUrl)

  const res = await serverFetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Course API responded with ${res.status}`)
  }

  const json = await res.json()
  return json.data as Course
}

export async function createCourse(data: CreateCourseInput): Promise<Course> {
  const baseUrl = process.env.SUBSCRIPTION_MANAGEMENT_URL

  if (!baseUrl) {
    throw new Error('SUBSCRIPTION_MANAGEMENT_URL not configured')
  }

  const { getToken } = await auth()
  const token = await getToken()
  if (!token) {
    throw new Error('User is not authenticated')
  }

  const url = new URL('/courses', baseUrl)

  const res = await serverFetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Course API responded with ${res.status}: ${text}`)
  }

  const json = await res.json()
  return json.data as Course
}

export async function patchCourse(id: string, data: PatchCourseInput): Promise<Course> {
  const baseUrl = process.env.SUBSCRIPTION_MANAGEMENT_URL

  if (!baseUrl) {
    throw new Error('SUBSCRIPTION_MANAGEMENT_URL not configured')
  }

  const { getToken } = await auth()
  const token = await getToken()
  if (!token) {
    throw new Error('User is not authenticated')
  }

  const url = new URL(`/courses/${id}`, baseUrl)

  const res = await serverFetch(url.toString(), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Course API responded with ${res.status}: ${text}`)
  }

  const json = await res.json()
  return json.data as Course
}
