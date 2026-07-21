// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import MediaCardSkeleton from '@/app/components/molecules/MediaCardSkeleton'

describe('MediaCardSkeleton', () => {
  it('renders the skeleton component', () => {
    const { container } = render(<MediaCardSkeleton />)

    expect(container.querySelector('.rounded')).toBeTruthy()
  })

  it('renders a skeleton for the image area', () => {
    const { container } = render(<MediaCardSkeleton />)

    // The image area has the class that creates the animated pulse block
    const pulseElements = container.querySelectorAll('.animate-pulse')
    expect(pulseElements.length).toBeGreaterThan(0)
  })

  it('renders a skeleton for the title placeholder', () => {
    const { container } = render(<MediaCardSkeleton />)

    // The title placeholder has w-3/4 class and h-5 height
    const titleSkeleton = container.querySelector('.h-5')
    expect(titleSkeleton).toBeTruthy()
  })

  it('renders a skeleton for the description placeholder', () => {
    const { container } = render(<MediaCardSkeleton />)

    // There should be multiple skeleton elements (image + title + description)
    const skeletonElements = container.querySelectorAll('[class*="animate-pulse"]')
    expect(skeletonElements.length).toBeGreaterThanOrEqual(3)
  })
})