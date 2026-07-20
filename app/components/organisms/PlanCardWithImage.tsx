import Image from 'next/image'
import type { Plan } from '@/app/types/plan'
import MediaCard from '@/app/components/molecules/MediaCard'
import Button from '@/app/components/atoms/Button'

const EXAMPLE_IMAGE_URL = 'https://i.ytimg.com/vi/BMkwmQmUa_g/hqdefault.jpg';

export default function PlanCardWithImage({ plan, onActivate }: { plan: Plan; onActivate: () => void }) {
    const imageSection = (
        <>
            <Image
                src={EXAMPLE_IMAGE_URL}
                alt={plan.name}
                fill
                className="object-cover"
            />

            {/* Activate code button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
                <Button variant="primary" size="md" onClick={onActivate}>
                    Activate code
                </Button>
            </div>
        </>
    )

    return (
        <MediaCard
            imageSection={imageSection}
            title={plan.name}
            description={plan.description ?? undefined}
        />
    )
}
