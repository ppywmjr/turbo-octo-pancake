import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Plan } from '@/app/types/plan'

vi.mock('server-only', () => ({}))

import { fetchAllPlans, fetchPlanById } from '@/app/lib/plans'

const MOCK_PLAN_ACTIVE: Plan = {
  id: 'plan-1',
  name: 'Flutters Online Training Programme',
  description: 'Learn Flutter from scratch',
  isFree: false,
  billingInterval: 'monthly',
  pricePence: 1999,
  isActive: true,
  thumbnail: null,
}

const MOCK_PLAN_INACTIVE: Plan = {
  id: 'plan-2',
  name: 'Old Plan',
  description: null,
  isFree: false,
  billingInterval: null,
  pricePence: null,
  isActive: false,
  thumbnail: null,
}

describe('fetchAllPlans', () => {
  const originalEnv = process.env.SUBSCRIPTION_MANAGEMENT_URL
  const originalSecret = process.env.INTERNAL_API_SECRET

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.spyOn(console, 'error').mockImplementation(() => { })
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

  it('returns empty array when SUBSCRIPTION_MANAGEMENT_URL is not set', async () => {
    delete process.env.SUBSCRIPTION_MANAGEMENT_URL

    const result = await fetchAllPlans()

    expect(fetch).not.toHaveBeenCalled()
    expect(result).toEqual([])
  })

  it('fetches from /plans with the correct URL and internal API key header', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([MOCK_PLAN_ACTIVE]), { status: 200 }),
    )

    await fetchAllPlans()

    expect(fetch).toHaveBeenCalledOnce()
    const [calledUrl, calledInit] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(calledUrl).toBe('http://localhost:3011/plans')
    expect((calledInit.headers as Record<string, string>)['x-internal-api-key']).toBe(
      'test-internal-secret',
    )
    expect((calledInit.headers as Record<string, string>)['Accept']).toBe('application/json')
    expect(calledInit.cache).toBe('no-store')
  })

  it('accepts a top-level array response', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([MOCK_PLAN_ACTIVE, MOCK_PLAN_INACTIVE]), { status: 200 }),
    )

    const result = await fetchAllPlans()

    // Only active plans returned
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('plan-1')
  })

  it('accepts a response with a data key', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [MOCK_PLAN_ACTIVE] }), { status: 200 }),
    )

    const result = await fetchAllPlans()

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('plan-1')
  })

  it('returns empty array when the response has neither a data key nor is an array', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({}), { status: 200 }),
    )

    const result = await fetchAllPlans()

    expect(result).toEqual([])
  })

  it('returns empty array when json.data is null', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: null }), { status: 200 }),
    )

    const result = await fetchAllPlans()

    expect(result).toEqual([])
    expect(Array.isArray(result)).toBe(true)
  })

  it('filters out plans where isActive is falsy including null', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    const mockPlanNullActive: Plan = {
      id: 'plan-null',
      name: 'Null Active Plan',
      description: null,
      isFree: false,
      isActive: null as any,
      billingInterval: null,
      pricePence: null,
      thumbnail: null,
    }
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([MOCK_PLAN_ACTIVE, mockPlanNullActive]), { status: 200 }),
    )

    const result = await fetchAllPlans()

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('plan-1')
  })

  it('filters out inactive plans', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify([MOCK_PLAN_ACTIVE, MOCK_PLAN_INACTIVE]),
        { status: 200 },
      ),
    )

    const result = await fetchAllPlans()

    expect(result.every((p) => p.isActive)).toBe(true)
    expect(result.find((p) => p.id === 'plan-2')).toBeUndefined()
  })

  it('returns empty array and logs error when the API returns non-ok status', async () => {
    process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }))

    const result = await fetchAllPlans()

    expect(result).toEqual([])
    expect(console.error).toHaveBeenCalledWith(
      '[fetchAllPlans] Plans API responded with 500',
    )
  })
})

describe('fetchPlanById', () => {
  const originalEnv = process.env.SUBSCRIPTION_MANAGEMENT_URL
  const originalSecret = process.env.INTERNAL_API_SECRET

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.spyOn(console, 'error').mockImplementation(() => { })
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

  it('returns the matching plan by id', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([MOCK_PLAN_ACTIVE]), { status: 200 }),
    )

    const result = await fetchPlanById('plan-1')

    expect(result).toEqual(MOCK_PLAN_ACTIVE)
  })

  it('returns null when the plan id is not found', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([MOCK_PLAN_ACTIVE]), { status: 200 }),
    )

    const result = await fetchPlanById('plan-999')

    expect(result).toBeNull()
  })
})
