import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}))

import { auth, currentUser } from '@clerk/nextjs/server'
import { POST } from '@/app/api/auth/sync/route'

const MOCK_USER = {
  id: 'user_abc123',
  emailAddresses: [{ emailAddress: 'test@example.com' }],
}

describe('POST /api/auth/sync', () => {
  const originalEnv = process.env.SUBSCRIPTION_MANAGEMENT_URL

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.spyOn(console, 'error').mockImplementation(() => {})

    vi.mocked(auth).mockResolvedValue({ getToken: vi.fn().mockResolvedValue('test-jwt') } as never)
    vi.mocked(currentUser).mockResolvedValue(MOCK_USER as never)
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    if (originalEnv === undefined) {
      delete process.env.SUBSCRIPTION_MANAGEMENT_URL
    } else {
      process.env.SUBSCRIPTION_MANAGEMENT_URL = originalEnv
    }
  })

  it('returns 503 when SUBSCRIPTION_MANAGEMENT_URL is not set', async () => {
    delete process.env.SUBSCRIPTION_MANAGEMENT_URL

    const res = await POST()

    expect(res.status).toBe(503)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('returns 401 when there is no auth token', async () => {
    vi.mocked(auth).mockResolvedValue({ getToken: vi.fn().mockResolvedValue(null) } as never)

    const res = await POST()

    expect(res.status).toBe(401)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('returns 401 when there is no current user', async () => {
    vi.mocked(currentUser).mockResolvedValue(null)

    const res = await POST()

    expect(res.status).toBe(401)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('calls SUBSCRIPTION_MANAGEMENT_URL/signup with the correct payload and headers', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 202 }))

    await POST()

    expect(fetch).toHaveBeenCalledOnce()
    const [calledUrl, calledInit] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(calledUrl).toBe('http://localhost:3011/signup')
    expect(calledInit.method).toBe('POST')
    expect((calledInit.headers as Record<string, string>)['Authorization']).toBe('Bearer test-jwt')
    expect((calledInit.headers as Record<string, string>)['Content-Type']).toBe('application/json')
    expect(JSON.parse(calledInit.body as string)).toEqual({
      clerkUserId: 'user_abc123',
      email: 'test@example.com',
    })
  })

  it('returns 204 when the subscription service responds with 202', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 202 }))

    const res = await POST()

    expect(res.status).toBe(204)
    expect(console.error).not.toHaveBeenCalled()
  })

  it('still returns 204 but logs an error when subscription service returns a non-202 status', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }))

    const res = await POST()

    expect(res.status).toBe(204)
    expect(console.error).toHaveBeenCalled()
  })

  it('uses empty string for email when user has no email addresses', async () => {
    vi.mocked(currentUser).mockResolvedValue({ ...MOCK_USER, emailAddresses: [] } as never)
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 202 }))

    await POST()

    const body = JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string)
    expect(body.email).toBe('')
  })
})
