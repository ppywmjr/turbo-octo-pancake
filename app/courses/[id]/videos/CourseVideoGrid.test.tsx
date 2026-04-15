// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('@/app/lib/courseVideos', () => ({ fetchCourseVideos: vi.fn() }))
vi.mock('next/navigation', () => ({
  redirect: vi.fn().mockImplementation((url: string) => {
    throw Object.assign(new Error('NEXT_REDIRECT'), { digest: `NEXT_REDIRECT;${url}` })
  }),
}))
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}))

import { redirect } from 'next/navigation'
import { fetchCourseVideos } from '@/app/lib/courseVideos'
import type { Video } from '@/app/types/video'
import CourseVideoGrid from '@/app/courses/[id]/videos/CourseVideoGrid'

const mockFetchVideos = vi.mocked(fetchCourseVideos) as unknown as ReturnType<typeof vi.fn<() => Promise<Video[]>>>

const MOCK_VIDEOS = [
  {
    id: 'vid-1',
    title: 'Flutter Basics',
    url: 'https://www.youtube.com/watch?v=abc',
    thumbnail: 'https://i.ytimg.com/vi/abc/hqdefault.jpg',
    watched: false,
    progressSecs: 0,
  },
  {
    id: 'vid-2',
    title: 'Flutter Advanced',
    url: 'https://www.youtube.com/watch?v=def',
    thumbnail: 'https://i.ytimg.com/vi/def/hqdefault.jpg',
    watched: true,
    progressSecs: 0,
  },
]

describe('CourseVideoGrid', () => {
  beforeEach(() => {
    mockFetchVideos.mockReset()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders a card for each video', async () => {
    mockFetchVideos.mockResolvedValue(MOCK_VIDEOS)

    render(await CourseVideoGrid({ courseId: 'course-1' }))

    expect(screen.getByText('Flutter Basics')).toBeTruthy()
    expect(screen.getByText('Flutter Advanced')).toBeTruthy()
  })

  it('shows the empty state when no videos are returned', async () => {
    mockFetchVideos.mockResolvedValue([])

    render(await CourseVideoGrid({ courseId: 'course-1' }))

    expect(screen.getByText(/no videos found/i)).toBeTruthy()
  })

  it('redirects to /?error=unauthorized when user is not authenticated', async () => {
    mockFetchVideos.mockRejectedValue(new Error('User is not authenticated'))

    await expect(CourseVideoGrid({ courseId: 'course-1' })).rejects.toThrow('NEXT_REDIRECT')
    expect(redirect).toHaveBeenCalledWith('/?error=unauthorized')
  })

  it('redirects to /?error=unauthorized on a 401 API response', async () => {
    mockFetchVideos.mockRejectedValue(
      new Error('Course videos API responded with 401'),
    )

    await expect(CourseVideoGrid({ courseId: 'course-1' })).rejects.toThrow('NEXT_REDIRECT')
    expect(redirect).toHaveBeenCalledWith('/?error=unauthorized')
  })

  it('re-throws non-auth errors', async () => {
    mockFetchVideos.mockRejectedValue(new Error('Service unavailable'))

    await expect(CourseVideoGrid({ courseId: 'course-1' })).rejects.toThrow('Service unavailable')
  })

  it('shows the Watched pill for a watched video', async () => {
    mockFetchVideos.mockResolvedValue(MOCK_VIDEOS)

    render(await CourseVideoGrid({ courseId: 'course-1' }))

    expect(screen.getByText('Watched')).toBeTruthy()
  })

  it('shows the In Progress pill for a video with partial progress', async () => {
    mockFetchVideos.mockResolvedValue([
      { ...MOCK_VIDEOS[0], progressSecs: 120 },
    ])

    render(await CourseVideoGrid({ courseId: 'course-1' }))

    expect(screen.getByText('In Progress')).toBeTruthy()
  })

  it('shows no status pill for an unwatched video with no progress', async () => {
    mockFetchVideos.mockResolvedValue([MOCK_VIDEOS[0]])

    render(await CourseVideoGrid({ courseId: 'course-1' }))

    expect(screen.queryByText('Watched')).toBeNull()
    expect(screen.queryByText('In Progress')).toBeNull()
  })

  it('links each card to the correct video URL', async () => {
    mockFetchVideos.mockResolvedValue([MOCK_VIDEOS[0]])

    render(await CourseVideoGrid({ courseId: 'course-1' }))

    const link = screen.getByText('Flutter Basics').closest('a')
    expect(link?.getAttribute('href')).toBe('/courses/course-1/videos/vid-1')
  })
})
