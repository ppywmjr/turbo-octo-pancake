// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('@/app/lib/courseVideos', () => ({ fetchCourseVideos: vi.fn() }))
vi.mock('@/app/components/YoutubePlayer', () => ({
  default: (props: {
    videoId: string
    ytVideoId: string
    courseId: string
    title: string
    initialProgressSecs?: number
  }) => (
    <div
      data-testid="youtube-player"
      data-video-id={props.videoId}
      data-yt-video-id={props.ytVideoId}
      data-course-id={props.courseId}
      data-initial-progress={props.initialProgressSecs}
    />
  ),
}))
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}))

import { fetchCourseVideos } from '@/app/lib/courseVideos'
import CourseVideoPage from '@/app/courses/[id]/videos/[videoId]/page'

const MOCK_VIDEO = {
  id: 'vid-1',
  title: 'Flutter Basics',
  url: 'https://www.youtube.com/watch?v=yt-abc',
  thumbnail: 'https://i.ytimg.com/vi/yt-abc/hqdefault.jpg',
  watched: false,
  progressSecs: 300,
}

describe('CourseVideoPage', () => {
  beforeEach(() => {
    vi.mocked(fetchCourseVideos).mockReset()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders the video title', async () => {
    vi.mocked(fetchCourseVideos).mockResolvedValue(MOCK_VIDEO as never)

    render(await CourseVideoPage({ params: Promise.resolve({ id: 'course-1', videoId: 'vid-1' }) }))

    expect(screen.getByText('Flutter Basics')).toBeTruthy()
  })

  it('passes progressSecs as initialProgressSecs to YoutubePlayer', async () => {
    vi.mocked(fetchCourseVideos).mockResolvedValue({ ...MOCK_VIDEO, progressSecs: 300 } as never)

    render(await CourseVideoPage({ params: Promise.resolve({ id: 'course-1', videoId: 'vid-1' }) }))

    const player = screen.getByTestId('youtube-player')
    expect(player.getAttribute('data-initial-progress')).toBe('300')
  })

  it('passes the correct courseId and videoId to YoutubePlayer', async () => {
    vi.mocked(fetchCourseVideos).mockResolvedValue(MOCK_VIDEO as never)

    render(await CourseVideoPage({ params: Promise.resolve({ id: 'course-1', videoId: 'vid-1' }) }))

    const player = screen.getByTestId('youtube-player')
    expect(player.getAttribute('data-course-id')).toBe('course-1')
    expect(player.getAttribute('data-video-id')).toBe('vid-1')
  })

  it('passes the extracted YouTube video ID to YoutubePlayer', async () => {
    vi.mocked(fetchCourseVideos).mockResolvedValue(MOCK_VIDEO as never)

    render(await CourseVideoPage({ params: Promise.resolve({ id: 'course-1', videoId: 'vid-1' }) }))

    const player = screen.getByTestId('youtube-player')
    expect(player.getAttribute('data-yt-video-id')).toBe('yt-abc')
  })

  it('shows "Video not found" when fetchCourseVideos returns null', async () => {
    vi.mocked(fetchCourseVideos).mockResolvedValue(null as never)

    render(await CourseVideoPage({ params: Promise.resolve({ id: 'course-1', videoId: 'vid-1' }) }))

    expect(screen.getByText(/video not found/i)).toBeTruthy()
  })

  it('shows the embed fallback when the URL is not a YouTube URL', async () => {
    vi.mocked(fetchCourseVideos).mockResolvedValue({
      ...MOCK_VIDEO,
      url: 'https://vimeo.com/123456',
    } as never)

    render(await CourseVideoPage({ params: Promise.resolve({ id: 'course-1', videoId: 'vid-1' }) }))

    expect(screen.getByText(/unable to embed/i)).toBeTruthy()
  })

  it('renders a back link to the course videos page', async () => {
    vi.mocked(fetchCourseVideos).mockResolvedValue(MOCK_VIDEO as never)

    render(await CourseVideoPage({ params: Promise.resolve({ id: 'course-1', videoId: 'vid-1' }) }))

    const link = screen.getByText(/back to videos/i).closest('a')
    expect(link?.getAttribute('href')).toBe('/courses/course-1/videos')
  })

  it('renders a back link when video is not found', async () => {
    vi.mocked(fetchCourseVideos).mockResolvedValue(null as never)

    render(await CourseVideoPage({ params: Promise.resolve({ id: 'course-1', videoId: 'vid-1' }) }))

    const link = screen.getByText(/back to videos/i).closest('a')
    expect(link?.getAttribute('href')).toBe('/courses/course-1/videos')
  })
})
