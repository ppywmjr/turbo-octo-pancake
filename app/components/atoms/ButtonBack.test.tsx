// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-testid="button-back-link">
      {children}
    </a>
  ),
}))

import ButtonBack from '@/app/components/atoms/ButtonBack'

describe('ButtonBack', () => {
  it('renders the default "Back" text when no children are provided', () => {
    render(<ButtonBack href="/previous">Back</ButtonBack>)

    expect(screen.getByText('Back')).toBeTruthy()
  })

  it('renders custom children when provided', () => {
    render(<ButtonBack href="/previous">Go back</ButtonBack>)

    expect(screen.getByText('Go back')).toBeTruthy()
  })

  it('links to the provided href', () => {
    render(<ButtonBack href="/courses">Go back</ButtonBack>)

    const link = screen.getByTestId('button-back-link')
    expect(link.getAttribute('href')).toBe('/courses')
  })

  it('renders the arrow SVG icon', () => {
    const { container } = render(<ButtonBack href="/previous" />)

    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
  })
})