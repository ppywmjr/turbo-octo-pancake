import HeroCTA from '@/app/components/molecules/HeroCTA'
import ErrorNotification from '@/app/components/molecules/ErrorNotification'
import HomeSignedOutLayout from './HomeSignedOutLayout'
import { PageHeading, BodyText } from '@/app/components/atoms/text'
import BrandDivider from '@/app/components/atoms/BrandDivider'

export default function HomeSignedOut({
    errorCode,
    featuredPlanId,
}: {
    errorCode: string | undefined
    featuredPlanId: string | null
}) {
    return (
        <HomeSignedOutLayout>
            <ErrorNotification error={errorCode} />
            <div className="flex flex-col items-center gap-6 text-center">
                <PageHeading className="text-5xl sm:text-6xl lg:text-7xl">
                    Catherine Idalia
                </PageHeading>
                <BrandDivider />
                <BodyText className="max-w-lg text-lg text-[var(--color-text-muted)]">
                    online dance courses
                </BodyText>
                <HeroCTA planId={featuredPlanId} />
            </div>
        </HomeSignedOutLayout>
    )
}
