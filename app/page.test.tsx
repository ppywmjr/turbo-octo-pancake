// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('server-only', () => ({}))
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}))
vi.mock('@/app/lib/courses', () => ({
  fetchCourses: vi.fn(),
}))
vi.mock('@/app/lib/plans', () => ({
  fetchAllPlans: vi.fn(),
}))
vi.mock('@/app/components/HeroCTA', () => ({
  default: ({ planId }: { planId: string | null }) => (
    <div data-testid="hero-cta" data-plan-id={planId ?? 'null'} />
  ),
}))
vi.mock('@/app/components/ErrorNotification', () => ({
  default: () => null,
}))
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

import { auth } from '@clerk/nextjs/server'
import { fetchCourses } from '@/app/lib/courses'
import { fetchAllPlans } from '@/app/lib/plans'
import type { Course } from '@/app/types/course'
import type { Plan } from '@/app/types/plan'
import Home from '@/app/page'

const MOCK_PLAN_FLUTTER: Plan = {
  id: 'plan-flutter',
  name: 'Flutters Online Training Programme',
  description: 'Master Flutter development',
  isFree: false,
  billingInterval: 'monthly',
  pricePence: 1999,
  isActive: true,
}

const MOCK_PLAN_EXTRA: Plan = {
  id: 'plan-extra',
  name: 'Advanced React Course',
  description: 'Deep dive into React',
  isFree: false,
  billingInterval: 'yearly',
  pricePence: 9900,
  isActive: true,
}

const MOCK_COURSE: Course = {
  id: 'plan-flutter',
  title: 'Flutters Online Training Programme',
  description: 'Master Flutter development',
  thumbnail: null,
  sortOrder: 0,
}

const EMPTY_COURSES = {
  courses: [],
  hasMore: false,
  total: 0,
  offset: 0,
  limit: 20,
}

function makeSearchParams(params: Record<string, string> = {}) {
  return { searchParams: Promise.resolve(params) }
}

describe('Home page', () => {
  beforeEach(() => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never)
    vi.mocked(fetchAllPlans).mockResolvedValue([MOCK_PLAN_FLUTTER])
    vi.mocked(fetchCourses).mockResolvedValue(EMPTY_COURSES)
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  // ── State 1: Not signed in ─────────────────────────────────────────────────

  describe('when the user is not signed in', () => {
    it('renders the HeroCTA component', async () => {
      render(await Home(makeSearchParams()))

      expect(screen.getByTestId('hero-cta')).toBeTruthy()
    })

    it('passes the featured plan id to HeroCTA', async () => {
      render(await Home(makeSearchParams()))

      expect(screen.getByTestId('hero-cta').getAttribute('data-plan-id')).toBe('plan-flutter')
    })

    it('passes null to HeroCTA when there are no plans', async () => {
      vi.mocked(fetchAllPlans).mockResolvedValue([])

      render(await Home(makeSearchParams()))

      expect(screen.getByTestId('hero-cta').getAttribute('data-plan-id')).toBe('null')
    })

    it('prefers the plan named "Flutters Online Training Programme" as featured', async () => {
      vi.mocked(fetchAllPlans).mockResolvedValue([MOCK_PLAN_EXTRA, MOCK_PLAN_FLUTTER])

      render(await Home(makeSearchParams()))

      expect(screen.getByTestId('hero-cta').getAttribute('data-plan-id')).toBe('plan-flutter')
    })

    it('falls back to the first plan when the featured plan is not in the list', async () => {
      vi.mocked(fetchAllPlans).mockResolvedValue([MOCK_PLAN_EXTRA])

      render(await Home(makeSearchParams()))

      expect(screen.getByTestId('hero-cta').getAttribute('data-plan-id')).toBe('plan-extra')
    })

    it('does not show a "My Courses" heading', async () => {
      render(await Home(makeSearchParams()))

      expect(screen.queryByText('My Courses')).toBeNull()
    })

    it('does not call fetchCourses', async () => {
      render(await Home(makeSearchParams()))

      expect(fetchCourses).not.toHaveBeenCalled()
    })

    it('displays the featured course name in the hero text', async () => {
      render(await Home(makeSearchParams()))

      expect(screen.getByText('Flutters Online Training Programme')).toBeTruthy()
    })
  })

  // ── State 2: Signed in, no active courses ──────────────────────────────────

  describe('when the user is signed in with no active subscriptions', () => {
    beforeEach(() => {
      vi.mocked(auth).mockResolvedValue({ userId: 'user-abc' } as never)
      vi.mocked(fetchCourses).mockResolvedValue(EMPTY_COURSES)
      vi.mocked(fetchAllPlans).mockResolvedValue([MOCK_PLAN_FLUTTER, MOCK_PLAN_EXTRA])
    })

    it('shows the "Choose a course to get started" heading', async () => {
      render(await Home(makeSearchParams()))

      expect(screen.getByRole('heading', { name: /choose a course to get started/i })).toBeTruthy()
    })

    it('renders a card for each available plan', async () => {
      render(await Home(makeSearchParams()))

      expect(screen.getByText('Flutters Online Training Programme')).toBeTruthy()
      expect(screen.getByText('Advanced React Course')).toBeTruthy()
    })

    it('renders Subscribe links pointing to /subscribe/:planId', async () => {
      render(await Home(makeSearchParams()))

      const links = screen.getAllByRole('link', { name: /subscribe/i })
      const hrefs = links.map((l) => l.getAttribute('href'))
      expect(hrefs).toContain('/subscribe/plan-flutter')
      expect(hrefs).toContain('/subscribe/plan-extra')
    })

    it('shows "No courses are available right now." when the plan list is empty', async () => {
      vi.mocked(fetchAllPlans).mockResolvedValue([])

      render(await Home(makeSearchParams()))

      expect(screen.getByText(/no courses are available right now/i)).toBeTruthy()
    })

    it('does not show a "My Courses" heading', async () => {
      render(await Home(makeSearchParams()))

      expect(screen.queryByText('My Courses')).toBeNull()
    })
  })

  // ── State 3: Signed in with active courses ─────────────────────────────────

  describe('when the user is signed in with active subscriptions', () => {
    beforeEach(() => {
      vi.mocked(auth).mockResolvedValue({ userId: 'user-abc' } as never)
      vi.mocked(fetchCourses).mockResolvedValue({
        courses: [MOCK_COURSE],
        hasMore: false,
        total: 1,
        offset: 0,
        limit: 20,
      })
      vi.mocked(fetchAllPlans).mockResolvedValue([MOCK_PLAN_FLUTTER, MOCK_PLAN_EXTRA])
    })

    it('shows the "My Courses" heading', async () => {
      render(await Home(makeSearchParams()))

      expect(screen.getByRole('heading', { name: /my courses/i })).toBeTruthy()
    })

    it('renders the subscribed course title', async () => {
      render(await Home(makeSearchParams()))

      expect(screen.getByText(MOCK_COURSE.title)).toBeTruthy()
    })

    it('shows "More Courses" for plans the user is not subscribed to', async () => {
      render(await Home(makeSearchParams()))

      expect(screen.getByRole('heading', { name: /more courses/i })).toBeTruthy()
      expect(screen.getByText('Advanced React Course')).toBeTruthy()
    })

    it('does not show the already-subscribed plan in "More Courses"', async () => {
      render(await Home(makeSearchParams()))

      // plan-flutter is subscribed (MOCK_COURSE.id === 'plan-flutter')
      // Its name appears once (in My Courses via CourseCard), not again in More Courses
      const allLinks = screen.getAllByRole('link')
      const subscribeLinks = allLinks.filter((l) =>
        l.getAttribute('href')?.startsWith('/subscribe/'),
      )
      expect(subscribeLinks.every((l) => l.getAttribute('href') !== '/subscribe/plan-flutter')).toBe(
        true,
      )
    })

    it('does not show "More Courses" when all plans are subscribed', async () => {
      vi.mocked(fetchAllPlans).mockResolvedValue([MOCK_PLAN_FLUTTER])

      render(await Home(makeSearchParams()))

      expect(screen.queryByText('More Courses')).toBeNull()
    })
  })
})
