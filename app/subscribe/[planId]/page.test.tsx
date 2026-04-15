// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('server-only', () => ({}))
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}))
vi.mock('@/app/lib/plans', () => ({
  fetchPlanById: vi.fn(),
}))
vi.mock('@/app/components/SubscribeButton', () => ({
  default: ({ planId }: { planId: string }) => (
    <button data-testid="subscribe-button" data-plan-id={planId}>
      Subscribe
    </button>
  ),
}))
vi.mock('next/navigation', () => ({
  redirect: vi.fn().mockImplementation((url: string) => {
    throw Object.assign(new Error('NEXT_REDIRECT'), { digest: `NEXT_REDIRECT;${url}` })
  }),
}))

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchPlanById } from '@/app/lib/plans'
import type { Plan } from '@/app/types/plan'
import SubscribePage from '@/app/subscribe/[planId]/page'

const MOCK_PLAN: Plan = {
  id: 'plan-1',
  name: 'Flutters Online Training Programme',
  description: 'Learn Flutter with Catherine Taylor',
  isFree: false,
  billingInterval: 'monthly',
  pricePence: 1999,
  isActive: true,
}

function makeParams(planId: string) {
  return { params: Promise.resolve({ planId }) }
}

describe('SubscribePage', () => {
  beforeEach(() => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user-abc' } as never)
    vi.mocked(fetchPlanById).mockResolvedValue(MOCK_PLAN)
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('redirects to /?error=unauthorized when the user is not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never)

    await expect(SubscribePage(makeParams('plan-1'))).rejects.toThrow('NEXT_REDIRECT')
    expect(redirect).toHaveBeenCalledWith('/?error=unauthorized')
  })

  it('redirects to /?error=plan_not_found when the plan does not exist', async () => {
    vi.mocked(fetchPlanById).mockResolvedValue(null)

    await expect(SubscribePage(makeParams('plan-999'))).rejects.toThrow('NEXT_REDIRECT')
    expect(redirect).toHaveBeenCalledWith('/?error=plan_not_found')
  })

  it('renders the plan name as a heading', async () => {
    render(await SubscribePage(makeParams('plan-1')))

    expect(screen.getByRole('heading', { name: MOCK_PLAN.name })).toBeTruthy()
  })

  it('renders the plan description when present', async () => {
    render(await SubscribePage(makeParams('plan-1')))

    expect(screen.getByText(MOCK_PLAN.description!)).toBeTruthy()
  })

  it('does not render a description paragraph when description is null', async () => {
    vi.mocked(fetchPlanById).mockResolvedValue({ ...MOCK_PLAN, description: null })

    render(await SubscribePage(makeParams('plan-1')))

    expect(screen.queryByText('Learn Flutter with Catherine Taylor')).toBeNull()
  })

  it('renders "Free" for a free plan', async () => {
    vi.mocked(fetchPlanById).mockResolvedValue({
      ...MOCK_PLAN,
      isFree: true,
      pricePence: null,
      billingInterval: null,
    })

    render(await SubscribePage(makeParams('plan-1')))

    expect(screen.getByText('Free')).toBeTruthy()
  })

  it('renders "Contact us" when pricePence is null and plan is not free', async () => {
    vi.mocked(fetchPlanById).mockResolvedValue({
      ...MOCK_PLAN,
      isFree: false,
      pricePence: null,
      billingInterval: null,
    })

    render(await SubscribePage(makeParams('plan-1')))

    expect(screen.getByText('Contact us')).toBeTruthy()
  })

  it('renders the billing interval text when billingInterval is set', async () => {
    render(await SubscribePage(makeParams('plan-1')))

    expect(screen.getByText(/billed per month/i)).toBeTruthy()
  })

  it('renders "Billed per year" for a yearly plan', async () => {
    vi.mocked(fetchPlanById).mockResolvedValue({ ...MOCK_PLAN, billingInterval: 'yearly' })

    render(await SubscribePage(makeParams('plan-1')))

    expect(screen.getByText(/billed per year/i)).toBeTruthy()
  })

  it('renders the SubscribeButton with the planId', async () => {
    render(await SubscribePage(makeParams('plan-1')))

    const btn = screen.getByTestId('subscribe-button')
    expect(btn.getAttribute('data-plan-id')).toBe('plan-1')
  })

  it('passes the correct planId from params to fetchPlanById', async () => {
    render(await SubscribePage(makeParams('plan-42')))

    expect(fetchPlanById).toHaveBeenCalledWith('plan-42')
  })
})
