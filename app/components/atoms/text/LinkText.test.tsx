// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} data-testid="link-text" className={className ?? ''}>
      {children}
    </a>
  ),
}))

import LinkText from '@/app/components/atoms/text/LinkText'

describe('LinkText', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders the LinkText component with children', () => {
    render(<LinkText href="/policies/cookie-policy">Cookie Policy</LinkText>)

    expect(screen.getByText('Cookie Policy')).toBeTruthy()
  })

  it('links to the provided href', () => {
    render(<LinkText href="/policies/cookie-policy">Cookie Policy</LinkText>)

    const link = screen.getAllByTestId('link-text')[0] as HTMLElement
    expect(link.getAttribute('href')).toBe('/policies/cookie-policy')
  })

  it('applies default CSS classes', () => {
    render(<LinkText href="/policies/cookie-policy">Cookie Policy</LinkText>)

    const link = screen.getAllByTestId('link-text')[0] as HTMLElement
    const className = link.getAttribute('class') ?? ''
    expect(className).toContain('text-sm')
    expect(className).toContain('font-medium')
    expect(className).toContain('text-[var(--color-text-muted)]')
    expect(className).toContain('hover:text-[var(--color-text-primary)]')
    expect(className).toContain('transition-colors')
  })

  it('merges custom className with default classes', () => {
    render(<LinkText href="/policies/cookie-policy" className="custom-class">Cookie Policy</LinkText>)

    const link = screen.getAllByTestId('link-text')[0] as HTMLElement
    const className = link.getAttribute('class') ?? ''
    expect(className).toContain('custom-class')
    expect(className).toContain('text-sm')
  })

  it('handles null/undefined className gracefully', () => {
    render(<LinkText href="/policies/cookie-policy">Cookie Policy</LinkText>)

    const link = screen.getAllByTestId('link-text')[0] as HTMLElement
    expect(link).toBeTruthy()
  })
})