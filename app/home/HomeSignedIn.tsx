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
    const [activePlanError, setActivePlanError] = useState<{ planId: string; error: string } | null>(null)
    const [openPlanModalFor, setOpenPlanModalFor] = useState<string | null>(null)
    // Force modal remount when showing error
    const [errorRemountKey, setErrorRemountKey] = useState(0)

    function closePlanModal() {
        setOpenPlanModalFor(null)
    }

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
                             key={`${plan.id}-${errorRemountKey}`}
                             plan={plan}
                             error={activePlanError?.planId === plan.id ? activePlanError.error : null}
                             isOpen={openPlanModalFor === plan.id}
                             onModalClose={openPlanModalFor === plan.id ? closePlanModal : undefined}
                             onOpen={() => setOpenPlanModalFor(plan.id)}
                              onActivate={async (code: string) => {
                                  // Clear any existing error for this plan when trying again
                                  if (activePlanError?.planId === plan.id) {
                                      setActivePlanError(null)
                                  }

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
                                      // The API returns the actual error in `detail` and a generic message in `error`
                                      const message = data.detail || data.error === "Invalid activation code" ? 'The activation code you entered is incorrect. Please check and try again.' : `Something went wrong, please try again later.`;
                                      setActivePlanError({ planId: plan.id, error: message })
                                      setOpenPlanModalFor(plan.id)
                                      setErrorRemountKey(k => k + 1)
                                      return
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
            {/* Error banner - shown when activation fails */}
            {activePlanError && (
                <div
                    role="alert"
                    aria-live="assertive"
                    className="w-full max-w-3xl rounded-xl border border-[var(--color-error-border-light)] bg-[var(--color-error-bg-light)] px-4 py-3 mb-6"
                >
                    <p className="text-sm font-semibold text-[var(--color-error-text-light)]">{activePlanError.error}</p>
                </div>
            )}
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