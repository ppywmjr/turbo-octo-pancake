'use client'

import CardsSection from '@/app/components/templates/CardsSection'
import CardsGrid from '@/app/components/templates/CardsGrid'
import ErrorNotification from '@/app/components/molecules/ErrorNotification'
import CenterLayout from '@/app/components/templates/CenterLayout'
import CourseCard from '@/app/components/organisms/CourseCard'
import PlanCard from '@/app/components/organisms/PlanCard'
import type { Course } from '@/app/types/course'
import type { Plan } from '@/app/types/plan'

export default function HomeSignedIn({
    errorCode,
    courses,
    availablePlans,
}: {
    errorCode: string | undefined
    courses: Course[]
    availablePlans: Plan[]
}) {
    // State: Signed in, no active courses
    if (courses.length === 0) {
        return (
            <CenterLayout>
                <ErrorNotification error={errorCode} />
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold tracking-tight text-[var(--color-zinc-900)]">
                        Choose a course to get started
                    </h2>
                    <p className="text-[var(--color-zinc-500)]">
                        Subscribe to a course below to unlock all of its content.
                    </p>
                </div>

                {availablePlans.length === 0 ? (
                    <p className="text-[var(--color-zinc-500)]">No courses are available right now.</p>
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

    // State: Signed in with active courses
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