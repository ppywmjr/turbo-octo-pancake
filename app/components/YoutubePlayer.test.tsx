// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'

// ---- Mock YT player ----

const mockSeekTo = vi.fn()
const mockPlayVideo = vi.fn()
const mockPauseVideo = vi.fn()
const mockGetCurrentTime = vi.fn().mockReturnValue(0)
const mockGetDuration = vi.fn().mockReturnValue(0)
const mockDestroy = vi.fn()

const mockPlayerInstance = {
  seekTo: mockSeekTo,
  playVideo: mockPlayVideo,
  pauseVideo: mockPauseVideo,
  getCurrentTime: mockGetCurrentTime,
  getDuration: mockGetDuration,
  destroy: mockDestroy,
}

type CapturedEvents = {
  onReady?: (e: { target: typeof mockPlayerInstance }) => void
  onStateChange?: (e: { data: number }) => void
}

let capturedEvents: CapturedEvents = {}

const MockYTPlayer = vi.fn(function mockYTPlayer(
  _: HTMLElement,
  options: { videoId: string; events?: CapturedEvents },
) {
  capturedEvents = options.events ?? {}
  return mockPlayerInstance
})

import YoutubePlayer from '@/app/components/YoutubePlayer'

const PROPS = {
  videoId: 'vid-1',
  ytVideoId: 'yt-abc',
  title: 'Test Video',
  courseId: 'course-1',
}

// Helpers
const YT_PLAYING = 1
const YT_PAUSED = 2

describe('YoutubePlayer', () => {
  beforeEach(() => {
    capturedEvents = {}
    vi.stubGlobal('YT', { Player: MockYTPlayer, PlayerState: { PLAYING: YT_PLAYING } })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })))
    vi.spyOn(console, 'log').mockImplementation(() => {})
    MockYTPlayer.mockClear()
    mockSeekTo.mockClear()
    mockPlayVideo.mockClear()
    mockPauseVideo.mockClear()
    mockGetCurrentTime.mockReturnValue(0)
    mockGetDuration.mockReturnValue(0)
    vi.mocked(fetch).mockClear()
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('creates a YT.Player with the ytVideoId', async () => {
    await act(async () => { render(<YoutubePlayer {...PROPS} ytVideoId="yt-abc" />) })

    expect(MockYTPlayer).toHaveBeenCalledOnce()
    expect(MockYTPlayer.mock.calls[0][1]).toMatchObject({ videoId: 'yt-abc' })
  })

  it('does not seek when initialProgressSecs is 0', async () => {
    await act(async () => { render(<YoutubePlayer {...PROPS} initialProgressSecs={0} />) })
    await act(async () => { capturedEvents.onReady?.({ target: mockPlayerInstance }) })

    expect(mockSeekTo).not.toHaveBeenCalled()
  })

  it('seeks to initialProgressSecs on player ready', async () => {
    await act(async () => { render(<YoutubePlayer {...PROPS} initialProgressSecs={120} />) })
    await act(async () => { capturedEvents.onReady?.({ target: mockPlayerInstance }) })

    expect(mockSeekTo).toHaveBeenCalledWith(120, true)
  })

  it('calls playVideo when overlay is clicked while paused', async () => {
    await act(async () => { render(<YoutubePlayer {...PROPS} />) })

    const overlay = screen.getByRole('button', { name: /play test video/i })
    act(() => { fireEvent.click(overlay) })

    expect(mockPlayVideo).toHaveBeenCalledOnce()
  })

  it('calls pauseVideo when overlay is clicked while playing', async () => {
    await act(async () => { render(<YoutubePlayer {...PROPS} />) })
    await act(async () => { capturedEvents.onStateChange?.({ data: YT_PLAYING }) })

    const overlay = screen.getByRole('button', { name: /pause test video/i })
    act(() => { fireEvent.click(overlay) })

    expect(mockPauseVideo).toHaveBeenCalledOnce()
  })

  it('sends progress to the API every 5 seconds while playing', async () => {
    vi.useFakeTimers()
    mockGetCurrentTime.mockReturnValue(30)
    mockGetDuration.mockReturnValue(100)

    await act(async () => { render(<YoutubePlayer {...PROPS} />) })
    await act(async () => { capturedEvents.onStateChange?.({ data: YT_PLAYING }) })
    await vi.advanceTimersByTimeAsync(5000)

    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      '/api/courses/course-1/videos/vid-1/progress',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ progressSecs: 30 }),
      }),
    )
  })

  it('includes watched: true when progress is >= 95%', async () => {
    vi.useFakeTimers()
    mockGetCurrentTime.mockReturnValue(96)
    mockGetDuration.mockReturnValue(100)

    await act(async () => { render(<YoutubePlayer {...PROPS} />) })
    await act(async () => { capturedEvents.onStateChange?.({ data: YT_PLAYING }) })
    await vi.advanceTimersByTimeAsync(5000)

    const body = JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string)
    expect(body.watched).toBe(true)
    expect(body.progressSecs).toBe(96)
  })

  it('does not include watched when progress is below 95%', async () => {
    vi.useFakeTimers()
    mockGetCurrentTime.mockReturnValue(90)
    mockGetDuration.mockReturnValue(100)

    await act(async () => { render(<YoutubePlayer {...PROPS} />) })
    await act(async () => { capturedEvents.onStateChange?.({ data: YT_PLAYING }) })
    await vi.advanceTimersByTimeAsync(5000)

    const body = JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string)
    expect(body.watched).toBeUndefined()
  })

  it('stops sending progress updates when paused', async () => {
    vi.useFakeTimers()
    mockGetCurrentTime.mockReturnValue(30)
    mockGetDuration.mockReturnValue(100)

    await act(async () => { render(<YoutubePlayer {...PROPS} />) })
    await act(async () => { capturedEvents.onStateChange?.({ data: YT_PLAYING }) })
    await act(async () => { capturedEvents.onStateChange?.({ data: YT_PAUSED }) })
    await vi.advanceTimersByTimeAsync(5000)

    expect(vi.mocked(fetch)).not.toHaveBeenCalled()
  })
})
