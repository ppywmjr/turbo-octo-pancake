// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('@clerk/nextjs', () => ({
  SignUpButton: ({
    children,
    forceRedirectUrl,
  }: {
    children: React.ReactNode
    forceRedirectUrl?: string
  }) => (
    <div data-testid="sign-up-button" data-redirect-url={forceRedirectUrl}>
      {children}
    </div>
  ),
  SignInButton: ({
    children,
    forceRedirectUrl,
  }: {
    children: React.ReactNode
    forceRedirectUrl?: string
  }) => (
    <div data-testid="sign-in-button" data-redirect-url={forceRedirectUrl}>
      {children}
    </div>
  ),
}))

import HeroCTA from '@/app/components/HeroCTA'

describe('HeroCTA', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders the sign-up button', () => {
    render(<HeroCTA planId={null} />)

    expect(screen.getByText('Sign up now')).toBeTruthy()
  })

  it('renders the sign-in button', () => {
    render(<HeroCTA planId={null} />)

    expect(screen.getByText('Sign in')).toBeTruthy()
  })

  it('sets the SignUpButton redirect URL to /subscribe/:planId when a planId is given', () => {
    render(<HeroCTA planId="plan-abc" />)

    const wrapper = screen.getByTestId('sign-up-button')
    expect(wrapper.getAttribute('data-redirect-url')).toBe('/subscribe/plan-abc')
  })

  it('sets the SignUpButton redirect URL to /courses when planId is null', () => {
    render(<HeroCTA planId={null} />)

    const wrapper = screen.getByTestId('sign-up-button')
    expect(wrapper.getAttribute('data-redirect-url')).toBe('/courses')
  })

  it('always sets the SignInButton redirect URL to /', () => {
    render(<HeroCTA planId="plan-xyz" />)

    const wrapper = screen.getByTestId('sign-in-button')
    expect(wrapper.getAttribute('data-redirect-url')).toBe('/')
  })
})
