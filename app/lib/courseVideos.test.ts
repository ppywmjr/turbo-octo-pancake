import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Video } from '@/app/types/video'

vi.mock('server-only', () => ({}))
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}))

import { auth } from '@clerk/nextjs/server'
import { fetchCourseVideos } from '@/app/lib/courseVideos'

const MOCK_VIDEOS: Video[] = [
  {
    id: 'vid-1',
    title: 'Flutter Basics',
    url: 'https://www.youtube.com/watch?v=vid-1',
    thumbnail: 'https://i.ytimg.com/vi/vid-1/hqdefault.jpg',
    watched: false,
    progressSecs: 0,
  },
  {
    id: 'vid-2',
    title: 'Flutter Advanced',
    url: 'https://www.youtube.com/watch?v=vid-2',
    thumbnail: 'https://i.ytimg.com/vi/vid-2/hqdefault.jpg',
    watched: true,
    progressSecs: 0,
  },
]

describe('fetchCourseVideos', () => {
  const originalEnv = process.env.SUBSCRIPTION_MANAGEMENT_URL
  const originalSecret = process.env.INTERNAL_API_SECRET
  const COURSE_ID = 'course-abc'

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

  it('returns empty array when SUBSCRIPTION_MANAGEMENT_URL is not set', async () => {
    delete process.env.SUBSCRIPTION_MANAGEMENT_URL

    const result = await fetchCourseVideos(COURSE_ID)

    expect(fetch).not.toHaveBeenCalled()
    expect(result).toEqual([])
  })

  it('defaults progressSecs to 0 when items in the array omit progressSecs', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    const mockVideosWithoutProgress = [
      {
        id: 'vid-1',
        title: 'Flutter Basics',
        url: 'https://www.youtube.com/watch?v=vid-1',
        thumbnail: 'https://i.ytimg.com/vi/vid-1/hqdefault.jpg',
        watched: false,
      },
    ]
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockVideosWithoutProgress }), { status: 200 }),
    )

    const result = await fetchCourseVideos(COURSE_ID)

    expect(result).toEqual([{
      id: 'vid-1',
      title: 'Flutter Basics',
      url: 'https://www.youtube.com/watch?v=vid-1',
      thumbnail: 'https://i.ytimg.com/vi/vid-1/hqdefault.jpg',
      watched: false,
      progressSecs: 0,
    }])
  })

  it('fetches from /me/courses/:id/videos with correct URL and Bearer token', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: MOCK_VIDEOS }), { status: 200 }),
    )

    const result = await fetchCourseVideos(COURSE_ID)

    expect(fetch).toHaveBeenCalledOnce()
    const [calledUrl, calledInit] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(calledUrl).toBe(`http://localhost:3011/me/courses/${COURSE_ID}/videos`)
    expect((calledInit.headers as Record<string, string>)['Authorization']).toBe('Bearer test-jwt')
    expect((calledInit.headers as Record<string, string>)['x-internal-api-key']).toBe('test-internal-secret')
    expect((calledInit.headers as Record<string, string>)['Accept']).toBe('application/json')
    expect(calledInit.cache).toBe('no-store')
    expect(result).toEqual(MOCK_VIDEOS)
  })

  it('interpolates the courseId into the URL correctly', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [] }), { status: 200 }),
    )

    await fetchCourseVideos('different-course-id')

    const [calledUrl] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(calledUrl).toBe('http://localhost:3011/me/courses/different-course-id/videos')
  })

  it('throws when auth token is null', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(auth).mockResolvedValue({ getToken: vi.fn().mockResolvedValue(null) } as never)

    await expect(fetchCourseVideos(COURSE_ID)).rejects.toThrow('User is not authenticated')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('throws when the API returns a non-ok status', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 404 }))

    await expect(fetchCourseVideos(COURSE_ID)).rejects.toThrow('Course videos API responded with 404')
  })

  it('throws when fetch throws a network error', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network failure'))

    await expect(fetchCourseVideos(COURSE_ID)).rejects.toThrow('Network failure')
  })
})

describe('fetchCourseVideos (single video)', () => {
  const COURSE_ID = 'course-abc'
  const VIDEO_ID = 'vid-1'
  const originalEnv = process.env.SUBSCRIPTION_MANAGEMENT_URL
  const originalSecret = process.env.INTERNAL_API_SECRET

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.mocked(auth).mockResolvedValue({ getToken: vi.fn().mockResolvedValue('test-jwt') } as never)
    process.env.INTERNAL_API_SECRET = 'test-internal-secret'
    vi.spyOn(console, 'log').mockImplementation(() => { })
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

  it('returns null when SUBSCRIPTION_MANAGEMENT_URL is not set', async () => {
    delete process.env.SUBSCRIPTION_MANAGEMENT_URL

    const result = await fetchCourseVideos(COURSE_ID, VIDEO_ID)

    expect(fetch).not.toHaveBeenCalled()
    expect(result).toBeNull()
  })

  it('fetches from /me/courses/:id/videos/:videoId with correct URL', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    const mockVideoData = {
      data: {
        id: VIDEO_ID,
        title: 'Flutter Basics',
        url: 'https://www.youtube.com/watch?v=abc',
        thumbnail: 'https://i.ytimg.com/vi/abc/hqdefault.jpg',
        watched: false,
        progressSecs: 120,
      },
    }
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockVideoData), { status: 200 }),
    )

    const result = await fetchCourseVideos(COURSE_ID, VIDEO_ID)

    const [calledUrl] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(calledUrl).toBe(`http://localhost:3011/me/courses/${COURSE_ID}/videos/${VIDEO_ID}`)
    expect(result).toMatchObject({
      id: VIDEO_ID,
      title: 'Flutter Basics',
      watched: false,
      progressSecs: 120,
    })
  })

  it('defaults progressSecs to 0 when the API omits it', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    const mockVideoData = {
      data: {
        id: VIDEO_ID,
        title: 'Flutter Basics',
        url: 'https://www.youtube.com/watch?v=abc',
        thumbnail: 'https://i.ytimg.com/vi/abc/hqdefault.jpg',
        watched: true,
      },
    }
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockVideoData), { status: 200 }),
    )

    const result = await fetchCourseVideos(COURSE_ID, VIDEO_ID)

    expect(result).toMatchObject({ progressSecs: 0 })
  })

  it('throws when auth token is null', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(auth).mockResolvedValue({ getToken: vi.fn().mockResolvedValue(null) } as never)

    await expect(fetchCourseVideos(COURSE_ID, VIDEO_ID)).rejects.toThrow('User is not authenticated')
  })

  it('throws when the API returns a non-ok status', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 403 }))

    await expect(fetchCourseVideos(COURSE_ID, VIDEO_ID)).rejects.toThrow('Course videos API responded with 403')
  })
})
