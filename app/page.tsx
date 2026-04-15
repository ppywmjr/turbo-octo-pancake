import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import ErrorNotification from '@/app/components/ErrorNotification'
import HeroCTA from '@/app/components/HeroCTA'
import CourseCard from '@/app/components/CourseCard'
import { fetchCourses } from '@/app/lib/courses'
import { fetchAllPlans } from '@/app/lib/plans'
import type { Plan, BillingInterval } from '@/app/types/plan'

const FEATURED_COURSE_NAME = 'Flutters Online Training Programme'

function formatPlanPrice(plan: Plan): string {
  if (plan.isFree) return 'Free'
  if (plan.pricePence === null) return 'Contact us'

  const pounds = plan.pricePence / 100
  const formatted = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(pounds)

  const intervalLabel: Record<BillingInterval, string> = {
    daily: 'day',
    weekly: 'week',
    monthly: 'month',
    yearly: 'year',
  }

  const interval = plan.billingInterval ? ` / ${intervalLabel[plan.billingInterval]}` : ''
  return `${formatted}${interval}`
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col flex-1 gap-3 p-6">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 leading-snug">
          {plan.name}
        </h3>
        {plan.description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 flex-1 line-clamp-3">
            {plan.description}
          </p>
        )}
        <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{formatPlanPrice(plan)}</p>
      </div>
      <div className="px-6 pb-6">
        <Link
          href={`/subscribe/${plan.id}`}
          className="flex h-10 w-full items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white transition-colors hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"
        >
          Subscribe
        </Link>
      </div>
    </div>
  )
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { error } = await searchParams
  const errorCode = typeof error === 'string' ? error : undefined

  const { userId } = await auth()

  // ── State 1: Not signed in ─────────────────────────────────────────────────
  if (!userId) {
    const plans = await fetchAllPlans()
    const featuredPlan =
      plans.find((p) => p.name === FEATURED_COURSE_NAME) ?? plans[0] ?? null

    return (
      <main className="flex flex-col items-center justify-center py-24 px-8 bg-zinc-50 dark:bg-black min-h-screen">
        <ErrorNotification error={errorCode} />
        <div className="w-full max-w-2xl flex flex-col items-center text-center gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                Online Training
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
                Learn Flutters with Catherine Taylor
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
                Join the{' '}
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {FEATURED_COURSE_NAME}
                </span>{' '}
                course today!
              </p>
            </div>
            <HeroCTA planId={featuredPlan?.id ?? null} />
          </div>
      </main>
    )
  }

  // Signed in — fetch courses and plans in parallel
  const [coursesResult, plans] = await Promise.all([
    fetchCourses().catch(() => ({
      courses: [],
      hasMore: false,
      total: 0,
      offset: 0,
      limit: 20,
    })),
    fetchAllPlans(),
  ])
  const { courses } = coursesResult

  // Plans the signed-in user is not yet subscribed to
  const subscribedIds = new Set(courses.map((c) => c.id))
  const availablePlans = plans.filter((p) => !subscribedIds.has(p.id))

  // ── State 2: Signed in, no active courses ──────────────────────────────────
  if (courses.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center py-16 px-8 bg-zinc-50 dark:bg-black min-h-screen">
        <div className="w-full max-w-5xl flex flex-col gap-10">
          <ErrorNotification error={errorCode} />
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Choose a course to get started
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Subscribe to a course below to unlock all of its content.
            </p>
          </div>

          {availablePlans.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-400">No courses are available right now.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {availablePlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
        </div>
      </main>
    )
  }

  // ── State 3: Signed in with active courses ─────────────────────────────────
  return (
    <main className="flex flex-1 flex-col items-center py-16 px-8 bg-zinc-50 dark:bg-black min-h-screen">
      <div className="w-full max-w-5xl flex flex-col gap-14">
        <ErrorNotification error={errorCode} />

        {/* Active courses */}
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            My Courses
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* Other available courses */}
        {availablePlans.length > 0 && (
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                More Courses
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Expand your skills with these additional courses.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {availablePlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
