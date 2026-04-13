import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchVideos } from '@/app/lib/videos'
import type { Video } from '@/app/types/video'

const MOCK_VIDEOS: Video[] = [
  {
    id: 'abc123',
    title: 'Remote Video',
    url: 'https://www.youtube.com/watch?v=abc123',
    thumbnail: 'https://i.ytimg.com/vi/abc123/hqdefault.jpg',
    channelName: 'Remote Channel',
    watched: false,
    progress: 0,
  },
]

describe('fetchVideos', () => {
  const originalEnv = process.env.SUBSCRIPTION_MANAGEMENT_URL

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    if (originalEnv === undefined) {
      delete process.env.SUBSCRIPTION_MANAGEMENT_URL
    } else {
      process.env.SUBSCRIPTION_MANAGEMENT_URL = originalEnv
    }
  })

  it('returns fallback data when SUBSCRIPTION_MANAGEMENT_URL is not set', async () => {
    delete process.env.SUBSCRIPTION_MANAGEMENT_URL

    const result = await fetchVideos()

    expect(fetch).not.toHaveBeenCalled()
    expect(result.length).toBeGreaterThan(0)
    // Fallback items are identifiable by their stub titles
    expect(result[0].title).toMatch(/NextJS stub/)
  })

  it('returns data from the external API when the call succeeds', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: MOCK_VIDEOS }), { status: 200 }),
    )

    const result = await fetchVideos()

    expect(fetch).toHaveBeenCalledOnce()
    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string
    expect(calledUrl).toBe('http://localhost:3011/subscriptions/flutters/videos')
    expect(result).toEqual(MOCK_VIDEOS)
  })

  it('falls back when the external API returns a non-ok status', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(null, { status: 503 }),
    )

    const result = await fetchVideos()

    expect(console.error).toHaveBeenCalled()
    expect(result[0].title).toMatch(/NextJS stub/)
  })

  it('falls back when fetch throws a network error', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network failure'))

    const result = await fetchVideos()

    expect(console.error).toHaveBeenCalled()
    expect(result[0].title).toMatch(/NextJS stub/)
  })
})
