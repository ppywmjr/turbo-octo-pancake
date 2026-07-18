import { Suspense } from 'react'
import { auth } from '@clerk/nextjs/server'
import HomeSignedOut from '@/app/home/HomeSignedOut'
import HomeSignedIn from '@/app/home/HomeSignedIn'
import HomeSkeleton from '@/app/home/HomeSkeleton'
import { fetchCourses } from '@/app/lib/courses'
import { fetchAllPlans } from '@/app/lib/plans'

export default async function HomeContent({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { error } = await searchParams
    const errorCode = typeof error === 'string' ? error : undefined

    const { userId } = await auth()

    // Not signed in — show hero + featured plan
    if (!userId) {
        const plans = await fetchAllPlans()
        const featuredPlan = plans.find((p) => p.name === 'Flutters Online Training Programme') ?? plans[0] ?? null

        return (
            <HomeSignedOut errorCode={errorCode} featuredPlanId={featuredPlan?.id ?? null} />
        )
    }

    // Signed in — fetch data and pass to client component wrapped in Suspense
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
    const subscribedIds = new Set(courses.map((c) => c.id))
    const availablePlans = plans.filter((p) => !subscribedIds.has(p.id))

    return (
        <Suspense fallback={<HomeSkeleton />}>
            <HomeSignedIn errorCode={errorCode} courses={courses} availablePlans={availablePlans} />
        </Suspense>
    )
}