import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Course } from '@/app/types/course'

vi.mock('server-only', () => ({}))
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}))

import { auth } from '@clerk/nextjs/server'
import { fetchCourses } from '@/app/lib/courses'

const MOCK_COURSES: Course[] = [
  { id: 'course-1', title: 'Intro to Flutter', description: 'A beginner course', thumbnail: null, sortOrder: 0 },
  { id: 'course-2', title: 'Advanced Flutter', description: null, thumbnail: 'https://example.com/thumb.jpg', sortOrder: 1 },
]

const MOCK_RESPONSE = {
  success: true,
  data: MOCK_COURSES,
  pagination: { total: 2, limit: 20, offset: 0, hasMore: false },
}

describe('fetchCourses', () => {
  const originalEnv = process.env.SUBSCRIPTION_MANAGEMENT_URL
  const originalSecret = process.env.INTERNAL_API_SECRET

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.mocked(auth).mockResolvedValue({ getToken: vi.fn().mockResolvedValue('test-jwt') } as never)
    process.env.INTERNAL_API_SECRET = 'test-internal-secret'
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    if (originalEnv === undefined) {
      delete process.env.SUBSCRIPTION_MANAGEMENT_URL
    } else {
      process.env.SUBSCRIPTION_MANAGEMENT_URL = originalEnv
    }
    if (originalSecret === undefined) {
      delete process.env.INTERNAL_API_SECRET
    } else {
      process.env.INTERNAL_API_SECRET = originalSecret
    }
  })

  it('returns empty result when SUBSCRIPTION_MANAGEMENT_URL is not set', async () => {
    delete process.env.SUBSCRIPTION_MANAGEMENT_URL

    const result = await fetchCourses()

    expect(fetch).not.toHaveBeenCalled()
    expect(result.courses).toHaveLength(0)
    expect(result.hasMore).toBe(false)
  })

  it('fetches from /me/courses with correct URL, limit, offset, and Bearer token', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(MOCK_RESPONSE), { status: 200 }),
    )

    const result = await fetchCourses(0)

    expect(fetch).toHaveBeenCalledOnce()
    const [calledUrl, calledInit] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(calledUrl).toBe('http://localhost:3011/me/courses?limit=20&offset=0')
    expect((calledInit.headers as Record<string, string>)['Authorization']).toBe('Bearer test-jwt')
    expect((calledInit.headers as Record<string, string>)['x-internal-api-key']).toBe('test-internal-secret')
    expect(result.courses).toEqual(MOCK_COURSES)
    expect(result.hasMore).toBe(false)
    expect(result.total).toBe(2)
  })

  it('passes offset query param correctly', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    const pagedResponse = {
      ...MOCK_RESPONSE,
      pagination: { total: 40, limit: 20, offset: 20, hasMore: false },
    }
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(pagedResponse), { status: 200 }),
    )

    await fetchCourses(20)

    const [calledUrl] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(calledUrl).toBe('http://localhost:3011/me/courses?limit=20&offset=20')
  })

  it('reflects hasMore: true from the API response', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    const pagedResponse = {
      ...MOCK_RESPONSE,
      pagination: { total: 40, limit: 20, offset: 0, hasMore: true },
    }
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(pagedResponse), { status: 200 }),
    )

    const result = await fetchCourses(0)

    expect(result.hasMore).toBe(true)
  })

  it('throws when auth token is null', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(auth).mockResolvedValue({ getToken: vi.fn().mockResolvedValue(null) } as never)

    await expect(fetchCourses()).rejects.toThrow('User is not authenticated')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('throws when the API returns a non-ok status', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 503 }))

    await expect(fetchCourses()).rejects.toThrow('Courses API responded with 503')
  })
})
