import { Suspense } from 'react'
import { auth } from '@clerk/nextjs/server'
import ErrorNotification from '@/app/components/ErrorNotification'
import HeroCTA from '@/app/components/HeroCTA'
import PlanCard from '@/app/components/PlanCard'
import CourseCard from '@/app/components/CourseCard'
import CenterLayout from '@/app/components/CenterLayout'
import CardsSection, { CardsGrid } from '@/app/components/CardsSection'
import { fetchCourses } from '@/app/lib/courses'
import { fetchAllPlans } from '@/app/lib/plans'
import type { Plan } from '@/app/types/plan'
import PlanCardSkeleton from '@/app/components/PlanCardSkeleton'
import CourseCardSkeleton from '@/app/components/CourseCardSkeleton'

const FEATURED_COURSE_NAME = 'Flutters Online Training Programme'

function SignedInContent({ errorCode, coursesResult, plans }: { errorCode: string | undefined; coursesResult: Awaited<ReturnType<typeof fetchCourses>>; plans: Plan[] }) {
    const { courses } = coursesResult

    // Plans the signed-in user is not yet subscribed to
    const subscribedIds = new Set(courses.map((c) => c.id))
    const availablePlans = plans.filter((p) => !subscribedIds.has(p.id))

    // ── State 2: Signed in, no active courses ──────────────────────────────────
    if (courses.length === 0) {
        return (
            <CenterLayout>
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
                    <CardsGrid>
                        {availablePlans.map((plan) => (
                            <PlanCard key={plan.id} plan={plan} />
                        ))}
                    </CardsGrid>
                )}
            </CenterLayout>
        )
    }

    // ── State 3: Signed in with active courses ─────────────────────────────────
    return (
        <CenterLayout>
            <ErrorNotification error={errorCode} />

            {/* Active courses */}
            <CardsSection
                title="My Courses"
                cards={courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            />

            {/* Other available courses */}
            {availablePlans.length > 0 && (
                <CardsSection
                    title="More Courses"
                    cards={availablePlans.map((plan) => (
                        <PlanCard key={plan.id} plan={plan} />
                    ))}
                />
            )}
        </CenterLayout>
    )
}

function SignedInSkeleton() {
    return (
        <CenterLayout>
            <div className="flex flex-col gap-10">
                {/* Skeleton for "My Courses" section */}
                <div className="flex flex-col gap-6">
                    <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-40 animate-pulse" />
                    <CardsGrid>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <CourseCardSkeleton key={i} />
                        ))}
                    </CardsGrid>
                </div>

                {/* Skeleton for "More Courses" section */}
                <div className="flex flex-col gap-6">
                    <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-40 animate-pulse" />
                    <CardsGrid>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <PlanCardSkeleton key={i} />
                        ))}
                    </CardsGrid>
                </div>
            </div>
        </CenterLayout>
    )
}

export default async function HomeContent({
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
            <CenterLayout>
                <ErrorNotification error={errorCode} />
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
            </CenterLayout>
        )
    }

    // Signed in — fetch data and pass to sync component wrapped in Suspense
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

    return (
        <Suspense fallback={<SignedInSkeleton />}>
            <SignedInContent errorCode={errorCode} coursesResult={coursesResult} plans={plans} />
        </Suspense>
    )
}
