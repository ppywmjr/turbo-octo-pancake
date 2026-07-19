import HeroCTA from '@/app/components/molecules/HeroCTA'
import ErrorNotification from '@/app/components/molecules/ErrorNotification'
import CenterLayout from '@/app/components/templates/CenterLayout'
import { PageLabel, PageHeading, BodyText } from '@/app/components/atoms/text'

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
                <PageLabel>Online Training</PageLabel>
                <PageHeading>Learn Flutters with Catherine Taylor</PageHeading>
                <BodyText className="max-w-lg mx-auto">
                    Join the{' '}
                    <span className="font-semibold text-[var(--color-text-primary)]">
                        {FEATURED_COURSE_NAME}
                    </span>{' '}
                    course today!
                </BodyText>
            </div>
            <HeroCTA planId={featuredPlanId} />
        </CenterLayout>
    )
}
