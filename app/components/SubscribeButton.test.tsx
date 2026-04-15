// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'

import SubscribeButton from '@/app/components/SubscribeButton'

const PLAN_ID = 'plan-123'
const CHECKOUT_URL = 'https://checkout.stripe.com/pay/test-session'

describe('SubscribeButton', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.stubGlobal('location', { href: '' })
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('renders the "Proceed to payment" button initially', () => {
    render(<SubscribeButton planId={PLAN_ID} />)

    expect(screen.getByRole('button', { name: /proceed to payment/i })).toBeTruthy()
  })

  it('calls the checkout API with the correct planId on click', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ checkoutUrl: CHECKOUT_URL }), { status: 200 }),
    )

    render(<SubscribeButton planId={PLAN_ID} />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
    })

    expect(fetch).toHaveBeenCalledOnce()
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe(`/api/plans/${PLAN_ID}/checkout`)
    expect(vi.mocked(fetch).mock.calls[0][1]).toMatchObject({ method: 'POST' })
  })

  it('redirects to the checkoutUrl on a successful response', async () => {
    const locationMock = { href: '' }
    vi.stubGlobal('location', locationMock)
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ checkoutUrl: CHECKOUT_URL }), { status: 200 }),
    )

    render(<SubscribeButton planId={PLAN_ID} />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
    })

    expect(locationMock.href).toBe(CHECKOUT_URL)
  })

  it('shows an error message from the response body on a non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'Plan not found' }), { status: 404 }),
    )

    render(<SubscribeButton planId={PLAN_ID} />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
    })

    expect(screen.getByRole('alert').textContent).toBe('Plan not found')
  })

  it('shows a generic error message when the response body has no error field', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('bad gateway', { status: 502 }))

    render(<SubscribeButton planId={PLAN_ID} />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
    })

    expect(screen.getByRole('alert').textContent).toBe('Something went wrong. Please try again.')
  })

  it('shows a generic error message on network failure', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    render(<SubscribeButton planId={PLAN_ID} />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
    })

    expect(screen.getByRole('alert').textContent).toBe('Something went wrong. Please try again.')
  })

  it('shows a loading label while the request is in flight', async () => {
    let resolveResponse!: (r: Response) => void
    vi.mocked(fetch).mockReturnValueOnce(new Promise<Response>((res) => { resolveResponse = res }))

    render(<SubscribeButton planId={PLAN_ID} />)

    act(() => {
      fireEvent.click(screen.getByRole('button'))
    })

    // After click, before the fetch resolves, the button should show the loading label
    expect(screen.getByRole('button').textContent).toBe('Redirecting to payment…')

    // Resolve the fetch to avoid dangling promises
    await act(async () => {
      resolveResponse(new Response(JSON.stringify({ checkoutUrl: CHECKOUT_URL }), { status: 200 }))
    })
  })
})
