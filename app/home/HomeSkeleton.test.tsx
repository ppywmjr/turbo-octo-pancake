// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-testid="skeleton-link">
      {children}
    </a>
  ),
}))

import HomeSkeleton from '@/app/home/HomeSkeleton'

describe('HomeSkeleton', () => {
  it('renders the HomeSkeleton component', () => {
    const { container } = render(<HomeSkeleton />)

    expect(container.querySelector('.animate-pulse')).toBeTruthy()
  })

  it('renders skeleton for the "My Courses" section heading', () => {
    render(<HomeSkeleton />)

    // The first section has a heading skeleton with h-8 and w-40
    const { container } = render(<HomeSkeleton />)
    // We expect 2 heading skeletons (one for each section)
    const headingSkeletons = container.querySelectorAll('.h-8')
    expect(headingSkeletons.length).toBe(2)
  })

  it('renders 3 skeleton cards in the first section', () => {
    const { container } = render(<HomeSkeleton />)

    // Each MediaCardSkeleton has at least 3 animate-pulse elements
    // With 6 MediaCardSkeletons total (3 per section x 2 sections),
    // we should have many pulse elements
    const allPulseElements = container.querySelectorAll('[class*="animate-pulse"]')
    expect(allPulseElements.length).toBeGreaterThanOrEqual(18)
  })

  it('renders CardsGrid components for both sections', () => {
    const { container } = render(<HomeSkeleton />)

    // CardsGrid renders a grid with the class from its implementation
    const grids = container.querySelectorAll('[class*="grid"]')
    expect(grids.length).toBe(2)
  })

  it('applies animate-pulse class to skeleton elements', () => {
    const { container } = render(<HomeSkeleton />)

    const pulseElements = container.querySelectorAll('.animate-pulse')
    expect(pulseElements.length).toBeGreaterThan(0)
  })
})