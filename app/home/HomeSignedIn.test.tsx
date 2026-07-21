// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react'

vi.mock('server-only', () => ({}))

const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRefresh,
    replace: vi.fn(),
  }),
}))

// Mock child components
vi.mock('@/app/components/organisms/PlanCardWithImage', () => ({
  default: ({ plan, onActivate }: { plan: { id: string; name: string }; onActivate: (code: string) => Promise<void> }) => (
    <div data-testid="plan-card" data-plan-id={plan.id}>
      <span>{plan.name}</span>
      <button data-testid="activate-btn" onClick={() => onActivate('TEST-CODE-123')}>
        Activate
      </button>
    </div>
  ),
}))

vi.mock('@/app/components/organisms/CourseCard', () => ({
  default: ({ course }: { course: { id: string; title: string } }) => (
    <div data-testid="course-card" data-course-id={course.id}>
      <span>{course.title}</span>
    </div>
  ),
}))

vi.mock('@/app/components/molecules/ErrorNotification', () => ({
  default: ({ error }: { error: string | undefined }) =>
    error ? <div data-testid="error-notification" data-error={error}>Error: {error}</div> : null,
}))

vi.mock('@/app/components/templates/CardsGrid', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cards-grid">{children}</div>
  ),
}))

vi.mock('@/app/components/templates/CardsSection', () => ({
  default: ({ title, cards }: { title: string; cards: React.ReactNode }) => (
    <section data-testid="cards-section">
      <h2>{title}</h2>
      <div data-testid="cards-section-children">{cards}</div>
    </section>
  ),
}))

vi.mock('@/app/components/templates/CenterLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <main data-testid="center-layout">{children}</main>,
}))

vi.mock('@/app/components/atoms/text', () => ({
  SectionHeading: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="section-heading">{children}</h2>
  ),
  BodyText: ({ children, muted }: { children: React.ReactNode; muted?: boolean }) => (
    <p data-testid="body-text" data-muted={muted ? 'true' : 'false'}>{children}</p>
  ),
}))

import HomeSignedIn from '@/app/home/HomeSignedIn'
import type { Course } from '@/app/types/course'
import type { Plan } from '@/app/types/plan'

const MOCK_PLAN: Plan = {
  id: 'plan-flutter',
  name: 'Flutter Development',
  description: 'Master Flutter',
  isFree: false,
  billingInterval: 'monthly',
  pricePence: 1999,
  isActive: true,
  thumbnail: null,
}

const MOCK_PLAN_EXTRA: Plan = {
  id: 'plan-react',
  name: 'React Advanced',
  description: 'Advanced React',
  isFree: false,
  billingInterval: 'yearly',
  pricePence: 9900,
  isActive: true,
  thumbnail: null,
}

const MOCK_COURSE: Course = {
  id: 'plan-flutter',
  title: 'Flutter Development',
  description: 'Master Flutter',
  thumbnail: null,
  sortOrder: 0,
}

const EMPTY_COURSES: Course[] = []

describe('HomeSignedIn', () => {
  let unhandledRejectionHandler: (arg: any) => void

  beforeEach(() => {
    // Suppress unhandled rejections from tests that intentionally trigger errors
    unhandledRejectionHandler = () => {}
    process.on('unhandledRejection', unhandledRejectionHandler)
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
    delete (global as any).fetch
    process.off('unhandledRejection', unhandledRejectionHandler)
  })

  // ── State: No active courses (courses.length === 0) ───────────────────────

  describe('when the user has no active courses', () => {
    it('renders the "Sign up" heading', () => {
      render(<HomeSignedIn courses={EMPTY_COURSES} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)
      expect(screen.getByRole('heading', { name: /sign up/i })).toBeTruthy()
    })

    it('renders plan cards for each available plan', () => {
      render(<HomeSignedIn courses={EMPTY_COURSES} availablePlans={[MOCK_PLAN, MOCK_PLAN_EXTRA]} errorCode={undefined} />)
      const planCards = screen.getAllByTestId('plan-card')
      expect(planCards).toHaveLength(2)
      expect(planCards[0].getAttribute('data-plan-id')).toBe('plan-flutter')
    })

    it('renders CardsGrid when there are plans', () => {
      render(<HomeSignedIn courses={EMPTY_COURSES} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)
      expect(screen.getByTestId('cards-grid')).toBeTruthy()
    })

    it('renders CenterLayout wrapper', () => {
      render(<HomeSignedIn courses={EMPTY_COURSES} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)
      expect(screen.getByTestId('center-layout')).toBeTruthy()
    })

    it('does not show "My Courses" heading', () => {
      render(<HomeSignedIn courses={EMPTY_COURSES} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)
      expect(screen.queryByRole('heading', { name: /my courses/i })).toBeNull()
    })

    it('does not show "More Courses" section', () => {
      render(<HomeSignedIn courses={EMPTY_COURSES} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)
      expect(screen.queryByRole('heading', { name: /more courses/i })).toBeNull()
    })

    it('does not show BodyText', () => {
      render(<HomeSignedIn courses={EMPTY_COURSES} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)
      expect(screen.queryByTestId('body-text')).toBeNull()
    })

    // ── Error notification ───────────────────────────────────────────────────

    it('renders error notification when errorCode is provided', () => {
      render(<HomeSignedIn courses={EMPTY_COURSES} availablePlans={[MOCK_PLAN]} errorCode="unauthorized" />)
      expect(screen.getByTestId('error-notification').getAttribute('data-error')).toBe('unauthorized')
    })

    it('does not render error notification when errorCode is undefined', () => {
      render(<HomeSignedIn courses={EMPTY_COURSES} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)
      expect(screen.queryByTestId('error-notification')).toBeNull()
    })

    // ── Activation flow (lines 48-69) - tests the actual component code ─────

    it('calls fetch when Activate code button is clicked', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200 })

      render(<HomeSignedIn courses={EMPTY_COURSES} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)

      // The mock PlanCardWithImage renders a button with data-testid="activate-btn"
      const activateBtn = screen.getByTestId('activate-btn')
      fireEvent.click(activateBtn)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/me/subscriptions', expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }))
      })
    })

    it('calls router.refresh() after successful activation', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200 })

      render(<HomeSignedIn courses={EMPTY_COURSES} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)

      const activateBtn = screen.getByTestId('activate-btn')
      fireEvent.click(activateBtn)

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled()
      })
    })

    it('does not call refresh when API returns 409 (already subscribed)', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 409 })

      render(<HomeSignedIn courses={EMPTY_COURSES} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)

      const activateBtn = screen.getByTestId('activate-btn')
      fireEvent.click(activateBtn)

      // Wait for the fetch to complete
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })

      // 409 should NOT call refresh
      expect(mockRefresh).not.toHaveBeenCalled()
    })

    it('does not call refresh when API returns error status', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      })

      render(<HomeSignedIn courses={EMPTY_COURSES} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)

      const activateBtn = screen.getByTestId('activate-btn')
      fireEvent.click(activateBtn)

      // Wait for the fetch to complete
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })

      // Error should NOT call refresh (it throws instead)
      expect(mockRefresh).not.toHaveBeenCalled()
    })

    // ── Empty plans list ─────────────────────────────────────────────────────

    it('renders "Sign up" heading even when there are no plans', () => {
      render(<HomeSignedIn courses={EMPTY_COURSES} availablePlans={[]} errorCode={undefined} />)
      expect(screen.getByRole('heading', { name: /sign up/i })).toBeTruthy()
    })

    it('renders empty CardsGrid when there are no plans', () => {
      render(<HomeSignedIn courses={EMPTY_COURSES} availablePlans={[]} errorCode={undefined} />)
      expect(screen.getByTestId('cards-grid')).toBeTruthy()
    })
  })

  // ── State: Has active courses (courses.length > 0) ───────────────────────

  describe('when the user has active courses', () => {
    it('renders "My Courses" heading with course cards', () => {
      render(<HomeSignedIn courses={[MOCK_COURSE]} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)
      expect(screen.getByTestId('cards-section')).toBeTruthy()
      expect(screen.getByRole('heading', { name: /my courses/i })).toBeTruthy()
    })

    it('renders course cards for each active course', () => {
      const course2: Course = {
        id: 'plan-react',
        title: 'React Advanced',
        description: 'Advanced React',
        thumbnail: null,
        sortOrder: 1,
      }

      render(<HomeSignedIn courses={[MOCK_COURSE, course2]} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)
      const courseCards = screen.getAllByTestId('course-card')
      expect(courseCards).toHaveLength(2)
    })

    it('renders "More Courses" section when there are available plans', () => {
      render(<HomeSignedIn courses={[MOCK_COURSE]} availablePlans={[MOCK_PLAN, MOCK_PLAN_EXTRA]} errorCode={undefined} />)
      expect(screen.getByRole('heading', { name: /more courses/i })).toBeTruthy()
    })

    it('displays "Coming soon..." in the More Courses section', () => {
      render(<HomeSignedIn courses={[MOCK_COURSE]} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)
      expect(screen.getByText('Coming soon...')).toBeTruthy()
    })

    it('does not show "More Courses" when there are no available plans', () => {
      render(<HomeSignedIn courses={[MOCK_COURSE]} availablePlans={[]} errorCode={undefined} />)
      expect(screen.queryByRole('heading', { name: /more courses/i })).toBeNull()
    })

    it('does not show BodyText when there are no available plans', () => {
      render(<HomeSignedIn courses={[MOCK_COURSE]} availablePlans={[]} errorCode={undefined} />)
      expect(screen.queryByTestId('body-text')).toBeNull()
    })

    it('does not show "Sign up" heading', () => {
      render(<HomeSignedIn courses={[MOCK_COURSE]} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)
      expect(screen.queryByRole('heading', { name: /sign up/i })).toBeNull()
    })

    it('does not render CardsGrid (used for plans)', () => {
      render(<HomeSignedIn courses={[MOCK_COURSE]} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)
      // CardsGrid is only used in the no-courses branch
      expect(screen.queryByTestId('cards-grid')).toBeNull()
    })

    // ── Error notification in courses state ──────────────────────────────────

    it('renders error notification when errorCode is provided', () => {
      render(<HomeSignedIn courses={[MOCK_COURSE]} availablePlans={[MOCK_PLAN]} errorCode="unauthorized" />)
      expect(screen.getByTestId('error-notification').getAttribute('data-error')).toBe('unauthorized')
    })

    // ── Multiple courses ─────────────────────────────────────────────────────

    it('renders all active courses in My Courses section', () => {
      const course2: Course = {
        id: 'course-2',
        title: 'Second Course',
        description: 'Description 2',
        thumbnail: null,
        sortOrder: 1,
      }

      render(<HomeSignedIn courses={[MOCK_COURSE, course2]} availablePlans={[]} errorCode={undefined} />)
      const sectionChildren = screen.getByTestId('cards-section-children')
      expect(sectionChildren).toBeTruthy()
    })
  })

  // ── Activation message display (both states) ─────────────────────────────

  describe('activation message display', () => {
    it('does not show status banner when activationMessage is null (initial state)', () => {
      const { container } = render(<HomeSignedIn courses={EMPTY_COURSES} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)
      // The banner should not be visible initially (activationMessage starts as null)
      const banners = container.querySelectorAll('[role="status"]')
      expect(banners).toHaveLength(0)
    })
  })

  // ── Layout structure ─────────────────────────────────────────────────────

  describe('layout structure', () => {
    it('wraps content in CenterLayout', () => {
      render(<HomeSignedIn courses={EMPTY_COURSES} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)
      expect(screen.getByTestId('center-layout')).toBeTruthy()
    })

    it('uses CardsGrid for plans (no courses state)', () => {
      render(<HomeSignedIn courses={EMPTY_COURSES} availablePlans={[MOCK_PLAN]} errorCode={undefined} />)
      expect(screen.getByTestId('cards-grid')).toBeTruthy()
    })

    it('uses CardsSection for courses (has courses state)', () => {
      render(<HomeSignedIn courses={[MOCK_COURSE]} availablePlans={[]} errorCode={undefined} />)
      expect(screen.getByTestId('cards-section')).toBeTruthy()
    })
  })
})