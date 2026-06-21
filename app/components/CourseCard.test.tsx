// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

import CourseCard from '@/app/components/CourseCard'
import type { Course } from '@/app/types/course'

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

const BASE_COURSE: Course = {
    id: 'course-1',
    title: 'Flutters Online Training Programme',
    description: 'Learn Flutter from scratch',
    thumbnail: 'https://example.com/thumb.jpg',
    sortOrder: 0,
}

describe('CourseCard', () => {
    afterEach(cleanup)

    it('renders the course title', () => {
        render(<CourseCard course={BASE_COURSE} />)

        expect(screen.getByText(BASE_COURSE.title)).toBeTruthy()
    })

    it('links to the course videos page', () => {
        render(<CourseCard course={BASE_COURSE} />)

        const link = screen.getByRole('link')
        expect(link.getAttribute('href')).toBe('/courses/course-1/videos')
    })

    it('renders the thumbnail image when thumbnail is set', () => {
        render(<CourseCard course={BASE_COURSE} />)

        const img = screen.getByRole('img')
        expect(img.getAttribute('src')).toBe(BASE_COURSE.thumbnail)
        expect(img.getAttribute('alt')).toBe(BASE_COURSE.title)
    })

    it('renders the fallback emoji when thumbnail is null', () => {
        render(<CourseCard course={{ ...BASE_COURSE, thumbnail: null }} />)

        expect(screen.queryByRole('img')).toBeNull()
        expect(screen.getByText('🎓')).toBeTruthy()
    })
})
