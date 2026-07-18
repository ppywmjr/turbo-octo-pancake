import HeroCTA from '@/app/components/molecules/HeroCTA'
import ErrorNotification from '@/app/components/molecules/ErrorNotification'
import CenterLayout from '@/app/components/templates/CenterLayout'

const FEATURED_COURSE_NAME = 'Flutters Online Training Programme'

export default function HomeSignedOut({
    errorCode,
    featuredPlanId,
}: {
    errorCode: string | undefined
    featuredPlanId: string | null
}) {
    return (
        <CenterLayout>
            <ErrorNotification error={errorCode} />
            <div className="flex flex-col gap-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-brand)] dark:text-[var(--color-zinc-400)]">
                    Online Training
                </p>
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-[var(--color-zinc-900)] dark:text-[var(--color-zinc-50)]">
                    Learn Flutters with Catherine Taylor
                </h1>
                <p className="text-lg text-[var(--color-zinc-600)] dark:text-[var(--color-zinc-400)] max-w-lg mx-auto">
                    Join the{' '}
                    <span className="font-semibold text-[var(--color-zinc-900)] dark:text-[var(--color-zinc-50)]">
                        {FEATURED_COURSE_NAME}
                    </span>{' '}
                    course today!
                </p>
            </div>
            <HeroCTA planId={featuredPlanId} />
        </CenterLayout>
    )
}