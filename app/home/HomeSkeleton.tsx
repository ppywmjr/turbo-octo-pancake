import CardsGrid from '@/app/components/templates/CardsGrid'
import CenterLayout from '@/app/components/templates/CenterLayout'
import MediaCardSkeleton from '@/app/components/molecules/MediaCardSkeleton'

export default function HomeSkeleton() {
    return (
        <CenterLayout>
            <div className="flex flex-col gap-10">
                {/* Skeleton for "My Courses" section */}
                <div className="flex flex-col gap-6">
                    <div className="h-8 bg-[var(--color-surface)] rounded w-40 animate-pulse" />
                    <CardsGrid>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <MediaCardSkeleton key={i} />
                        ))}
                    </CardsGrid>
                </div>

                {/* Skeleton for "More Courses" section */}
                <div className="flex flex-col gap-6">
                    <div className="h-8 bg-[var(--color-surface)] rounded w-40 animate-pulse" />
                    <CardsGrid>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <MediaCardSkeleton key={i} />
                        ))}
                    </CardsGrid>
                </div>
            </div>
        </CenterLayout>
    )
}