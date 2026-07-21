import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { NextRequest } from 'next/server'

vi.mock('server-only', () => ({}))
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}))
vi.mock('fs/promises', () => ({}))

import { auth } from '@clerk/nextjs/server'
import { POST } from '@/app/api/me/subscriptions/route'

function makeRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/me/subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as NextRequest
}

describe('POST /api/me/subscriptions', () => {
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

  it('returns 400 when activationCode is missing', async () => {
    const res = await POST(makeRequest({}))

    expect(res.status).toBe(400)
    const body = await res.json() as { error: string }
    expect(body.error).toBe('Invalid input')
  })

  it('returns 400 when activationCode is empty string', async () => {
    const res = await POST(makeRequest({ activationCode: '' }))

    expect(res.status).toBe(400)
    const body = await res.json() as { error: string }
    expect(body.error).toBe('Invalid input')
  })

  it('returns 401 when there is no auth token', async () => {
    vi.mocked(auth).mockResolvedValue({ getToken: vi.fn().mockResolvedValue(null) } as never)

    const res = await POST(makeRequest({ activationCode: 'ABC123' }))

    expect(res.status).toBe(401)
    const body = await res.json() as { error: string }
    expect(body.error).toBe('Unauthorized')
  })

  it('returns 503 when SUBSCRIPTION_MANAGEMENT_URL is not set', async () => {
    delete process.env.SUBSCRIPTION_MANAGEMENT_URL

    const res = await POST(makeRequest({ activationCode: 'ABC123' }))

    expect(res.status).toBe(503)
    const body = await res.json() as { error: string }
    expect(body.error).toBe('Service unavailable')
  })

  it('calls POST /me/subscriptions with the correct payload and headers', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 201 }))

    await POST(makeRequest({ activationCode: 'ABC123' }))

    expect(fetch).toHaveBeenCalledOnce()
    const [calledUrl, calledInit] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(calledUrl).toBe('http://localhost:3011/me/subscriptions')
    expect(calledInit.method).toBe('POST')
    expect((calledInit.headers as Record<string, string>)['Authorization']).toBe('Bearer test-jwt')
    expect((calledInit.headers as Record<string, string>)['Content-Type']).toBe('application/json')
    expect((calledInit.headers as Record<string, string>)['Accept']).toBe('application/json')
    expect(JSON.parse(calledInit.body as string)).toEqual({ activationCode: 'ABC123' })
  })

  it('returns 204 when the subscription service responds with 201', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 201 }))

    const res = await POST(makeRequest({ activationCode: 'ABC123' }))

    expect(res.status).toBe(204)
  })

  it('returns error when the subscription service returns an error with success: false', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false, error: 'Invalid code' }), { status: 400 }),
    )

    const res = await POST(makeRequest({ activationCode: 'INVALID' }))

    expect(res.status).toBe(400)
    const body = await res.json() as { error: string }
    expect(body.error).toBe('Subscription service error: 400')
  })

  it('returns 409 when backend error mentions "already have a subscription"', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false, error: 'You already have a subscription to this plan' }), { status: 409 }),
    )

    const res = await POST(makeRequest({ activationCode: 'ABC123' }))

    expect(res.status).toBe(409)
    const body = await res.json() as { error: string }
    expect(body.error).toBe('You already have a subscription to this plan. Try refreshing the page.')
  })

  it('returns error with raw text when backend response is not JSON', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response('Internal Server Error', { status: 500 }),
    )

    const res = await POST(makeRequest({ activationCode: 'ABC123' }))

    expect(res.status).toBe(500)
    const body = await res.json() as { error: string; detail: string }
    expect(body.error).toBe('Subscription service error: 500')
    expect(body.detail).toBe('Internal Server Error')
  })

  it('returns empty detail when backend response text() throws', async () => {
    const failingResponse = new Response(null, { status: 502 })
    vi.spyOn(failingResponse, 'text').mockRejectedValueOnce(new Error('read failed'))
    vi.mocked(fetch).mockResolvedValueOnce(failingResponse)

    const res = await POST(makeRequest({ activationCode: 'ABC123' }))

    expect(res.status).toBe(502)
    const body = await res.json() as { error: string; detail: string | null }
    expect(body.error).toBe('Subscription service error: 502')
    expect(body.detail).toBe('')
  })

  it('returns 204 when backend returns success: true with non-201 but ok status', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    )

    const res = await POST(makeRequest({ activationCode: 'ABC123' }))

    // res.ok is true for 200, so it returns 204
    expect(res.status).toBe(204)
  })

  it('logs an error when the subscription service returns a non-success status', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockReturnThis()
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false, error: 'Bad request' }), { status: 400 }),
    )

    await POST(makeRequest({ activationCode: 'ABC123' }))

    expect(consoleSpy).toHaveBeenCalledWith(
      '[Subscription] POST /api/me/subscriptions failed:',
      expect.objectContaining({ status: 400, activationCode: 'ABC123' }),
    )
    consoleSpy.mockRestore()
  })

  it('logs a backend 400 response with full details', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockReturnThis()
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false, error: 'Invalid code' }), { status: 400 }),
    )

    await POST(makeRequest({ activationCode: 'INVALID' }))

    expect(consoleSpy).toHaveBeenCalledWith(
      '[Subscription] Backend 400 Bad Request response:',
      expect.objectContaining({
        status: 400,
        body: '{"success":false,"error":"Invalid code"}',
        activationCode: 'INVALID',
      }),
    )
    consoleSpy.mockRestore()
  })

  it('does not set backendError when success is false but error field is missing', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false }), { status: 400 }),
    )

    const res = await POST(makeRequest({ activationCode: 'ABC123' }))

    expect(res.status).toBe(400)
    const body = await res.json() as { error: string; detail: string }
    // backendError stays null (no json.error), so raw text is used as detail
    expect(body.detail).toBe('{"success":false}')
  })

  it('does not set backendError when success is true even if error field is present', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true, error: 'unexpected' }), { status: 400 }),
    )

    const res = await POST(makeRequest({ activationCode: 'ABC123' }))

    expect(res.status).toBe(400)
    const body = await res.json() as { error: string; detail: string }
    // backendError stays null because success !== false, so raw text is used as detail
    expect(body.detail).toBe('{"success":true,"error":"unexpected"}')
  })

  it('does not set backendError when text is empty string in catch block', async () => {
    const failingResponse = new Response('', { status: 500 })
    vi.spyOn(failingResponse, 'text').mockResolvedValueOnce('')
    vi.mocked(fetch).mockResolvedValueOnce(failingResponse)

    const res = await POST(makeRequest({ activationCode: 'ABC123' }))

    expect(res.status).toBe(500)
    const body = await res.json() as { error: string; detail: string | null }
    // backendError stays null (empty text is falsy), detail comes from the fallback
    expect(body.detail).toBe('')
  })

  it('does not log backend 400 details when the status is not 400', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockReturnThis()
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response('Internal Server Error', { status: 500 }),
    )

    await POST(makeRequest({ activationCode: 'ABC123' }))

    // The general error log should be called
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Subscription] POST /api/me/subscriptions failed:',
      expect.objectContaining({ status: 500 }),
    )
    // But the 400-specific log should NOT be called for non-400 status
    expect(consoleSpy).not.toHaveBeenCalledWith(
      '[Subscription] Backend 400 Bad Request response:',
      expect.anything(),
    )
    consoleSpy.mockRestore()
  })
})
