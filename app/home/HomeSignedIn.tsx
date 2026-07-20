'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CardsSection from '@/app/components/templates/CardsSection'
import CardsGrid from '@/app/components/templates/CardsGrid'
import ErrorNotification from '@/app/components/molecules/ErrorNotification'
import CenterLayout from '@/app/components/templates/CenterLayout'
import CourseCard from '@/app/components/organisms/CourseCard'
import PlanCardWithImage from '@/app/components/organisms/PlanCardWithImage'
import { SectionHeading, BodyText } from '@/app/components/atoms/text'
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
    const router = useRouter()
    const [activationMessage, setActivationMessage] = useState<string | null>(null)

    // State: Signed in, no active courses - show "Sign up" with plan cards
    if (courses.length === 0) {
        return (
            <CenterLayout>
                {activationMessage && (
                    <div
                        role="status"
                        aria-live="polite"
                        className="w-full max-w-3xl rounded-xl border border-[var(--color-success)] bg-green-50 px-4 py-3 mb-6"
                    >
                        <p className="text-sm font-semibold text-[var(--color-success)]">{activationMessage}</p>
                    </div>
                )}
                <ErrorNotification error={errorCode} />
                <SectionHeading>Sign up</SectionHeading>

                <CardsGrid>
                    {availablePlans.map((plan) => (
                         <PlanCardWithImage
                             key={plan.id}
                             plan={plan}
                              onActivate={async (code: string) => {
                                  const res = await fetch('/api/me/subscriptions', {
                                      method: 'POST',
                                      headers: {
                                          'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify({ activationCode: code }),
                                  })

                                  // 409 = already subscribed — show message, don't refresh
                                  if (res.status === 409) {
                                      setActivationMessage('You already have a subscription to this plan. Try refreshing the page.')
                                      return
                                  }

                                  if (!res.ok) {
                                      const data = await res.json().catch(() => ({}))
                                      throw new Error(data.error ?? 'Failed to activate code')
                                  }

                                  // Successful activation — refresh the page to show new course
                                  router.refresh()
                              }}
                         />
                    ))}
                </CardsGrid>
            </CenterLayout>
        )
    }

    // State: Signed in with active courses - show "Coming soon..." for More Courses
    return (
        <CenterLayout>
            {activationMessage && (
                <div
                    role="status"
                    aria-live="polite"
                    className="w-full max-w-3xl rounded-xl border border-[var(--color-success)] bg-green-50 px-4 py-3 mb-6"
                >
                    <p className="text-sm font-semibold text-[var(--color-success)]">{activationMessage}</p>
                </div>
            )}
            <ErrorNotification error={errorCode} />

            {/* Active courses */}
            <CardsSection
                title="My Courses"
                cards={courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            />

            {/* Other available courses - Coming soon */}
            {availablePlans.length > 0 && (
                <div className="mt-8">
                    <SectionHeading>More Courses</SectionHeading>
                    <BodyText muted>Coming soon...</BodyText>
                </div>
            )}
        </CenterLayout>
    )
}