// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('next/image', () => ({
    default: ({ src, alt }: { src: string; alt: string }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} />
    ),
}))
vi.mock('next/link', () => ({
    default: ({ href, children, ...rest }: { href: string; children: React.ReactNode; className?: string }) => (
        <a href={href} {...rest}>{children}</a>
    ),
}))

import VideoCard from '@/app/components/organisms/VideoCard'
import type { Video } from '@/app/types/video'

const BASE_VIDEO: Video = {
    id: 'vid-1',
    title: 'Flutter Basics',
    url: 'https://www.youtube.com/watch?v=abc123',
    thumbnail: 'https://i.ytimg.com/vi/abc123/hqdefault.jpg',
    watched: false,
    progressSecs: 0,
}

describe('VideoCard', () => {
    afterEach(cleanup)

    it('renders the video title', () => {
        render(<VideoCard video={BASE_VIDEO} cardHref="/courses/1/videos/vid-1" />)

        expect(screen.getByText('Flutter Basics')).toBeTruthy()
    })

    it('renders a Next.js Link when cardHref is provided', () => {
        render(<VideoCard video={BASE_VIDEO} cardHref="/courses/1/videos/vid-1" />)

        const link = screen.getByRole('link')
        expect(link.getAttribute('href')).toBe('/courses/1/videos/vid-1')
    })

    it('renders an anchor tag to the video URL when cardHref is not provided', () => {
        render(<VideoCard video={BASE_VIDEO} cardHref={BASE_VIDEO.url} />)

        const link = screen.getByRole('link', { name: /flutter basics/i })
        expect(link.getAttribute('href')).toBe('https://www.youtube.com/watch?v=abc123')
    })

    it('shows the Watched badge when video.watched is true', () => {
        render(<VideoCard video={{ ...BASE_VIDEO, watched: true }} cardHref="/courses/1/videos/vid-1" />)

        expect(screen.getByText('Watched')).toBeTruthy()
    })

    it('shows the In Progress badge when video has progress but is not watched', () => {
        render(<VideoCard video={{ ...BASE_VIDEO, watched: false, progressSecs: 120 }} cardHref="/courses/1/videos/vid-1" />)

        expect(screen.getByText('In Progress')).toBeTruthy()
    })

    it('shows no status badge when video has no progress and is not watched', () => {
        render(<VideoCard video={BASE_VIDEO} cardHref="/courses/1/videos/vid-1" />)

        expect(screen.queryByText('Watched')).toBeNull()
        expect(screen.queryByText('In Progress')).toBeNull()
    })
})
