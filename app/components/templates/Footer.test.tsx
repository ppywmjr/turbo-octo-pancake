// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-testid="footer-link">
      {children}
    </a>
  ),
}))

import Footer from '@/app/components/templates/Footer'

describe('Footer', () => {
  it('renders the Footer component', () => {
    const { container } = render(<Footer />)

    expect(container.querySelector('footer')).toBeTruthy()
  })

  it('renders a link to the cookie policy page', () => {
    render(<Footer />)

    const link = screen.getByRole('link' , { name: 'Cookie policy'})
    expect(link.getAttribute('href')).toBe('/policies/cookie-policy')
  })

  it('renders a link to the terms of use page', () => {
    render(<Footer />)

    const link = screen.getByRole('link' , { name: 'Terms of use'})
    expect(link.getAttribute('href')).toBe('/policies/terms-of-use')
  })

})