import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}))

import { auth } from '@clerk/nextjs/server'
import { POST } from '@/app/api/plans/[planId]/checkout/route'

const PLAN_ID = 'plan-123'

function makeParams(planId: string) {
  return { params: Promise.resolve({ planId }) }
}

function makeRequest() {
  return new Request(`http://localhost/api/plans/${PLAN_ID}/checkout`)
}

describe('POST /api/plans/[planId]/checkout', () => {
  const originalEnv = process.env.SUBSCRIPTION_MANAGEMENT_URL
  const originalSecret = process.env.INTERNAL_API_SECRET

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.mocked(auth).mockResolvedValue({ getToken: vi.fn().mockResolvedValue('test-jwt') } as never)
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    process.env.INTERNAL_API_SECRET = 'test-internal-secret'
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    if (originalEnv === undefined) {
      delete process.env.SUBSCRIPTION_MANAGEMENT_URL
    } else {
      process.env.SUBSCRIPTION_MANAGEMENT_URL = originalEnv
    }
    if (originalSecret === undefined) {
      delete process.env.INTERNAL_API_SECRET
    } else {
      process.env.INTERNAL_API_SECRET = originalSecret
    }
  })

  it('returns 503 when SUBSCRIPTION_MANAGEMENT_URL is not set', async () => {
    delete process.env.SUBSCRIPTION_MANAGEMENT_URL

    const res = await POST(makeRequest(), makeParams(PLAN_ID))

    expect(res.status).toBe(503)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('returns 401 when there is no auth token', async () => {
    vi.mocked(auth).mockResolvedValue({ getToken: vi.fn().mockResolvedValue(null) } as never)

    const res = await POST(makeRequest(), makeParams(PLAN_ID))

    expect(res.status).toBe(401)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('calls POST /plans/:planId/subscribe with the correct URL, Bearer token, and internal key', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ checkoutUrl: 'https://stripe.com/pay/abc' }), { status: 200 }),
    )

    await POST(makeRequest(), makeParams(PLAN_ID))

    expect(fetch).toHaveBeenCalledOnce()
    const [calledUrl, calledInit] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(calledUrl).toBe(`http://localhost:3011/plans/${PLAN_ID}/subscribe`)
    expect(calledInit.method).toBe('POST')
    expect((calledInit.headers as Record<string, string>)['Authorization']).toBe('Bearer test-jwt')
    expect((calledInit.headers as Record<string, string>)['x-internal-api-key']).toBe(
      'test-internal-secret',
    )
  })

  it('interpolates different planIds into the URL correctly', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ checkoutUrl: 'https://stripe.com/pay/xyz' }), { status: 200 }),
    )

    await POST(makeRequest(), makeParams('different-plan-id'))

    const [calledUrl] = vi.mocked(fetch).mock.calls[0] as [string]
    expect(calledUrl).toBe('http://localhost:3011/plans/different-plan-id/subscribe')
  })

  it('returns the JSON body from the subscription service on success', async () => {
    const checkoutPayload = { checkoutUrl: 'https://stripe.com/pay/abc' }
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(checkoutPayload), { status: 200 }),
    )

    const res = await POST(makeRequest(), makeParams(PLAN_ID))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual(checkoutPayload)
  })

  it('forwards the error status from the subscription service on failure', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response('plan not found', { status: 404 }),
    )

    const res = await POST(makeRequest(), makeParams(PLAN_ID))

    expect(res.status).toBe(404)
    const body = await res.json() as { error: string }
    expect(body.error).toContain('404')
  })
})
