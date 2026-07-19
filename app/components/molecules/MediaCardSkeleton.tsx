import Card from '@/app/components/atoms/Card'

export default function MediaCardSkeleton() {
    return (
        <Card aspectRatio="aspect-[4/3]">
            <div className="relative w-full flex-[3] overflow-hidden bg-[var(--color-zinc-100)] animate-pulse">
                <div className="w-full h-full bg-[var(--color-zinc-200)]" />
            </div>
            <div className="flex flex-col flex-[1] gap-2 p-4">
                <div className="h-5 bg-[var(--color-zinc-200)] rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-[var(--color-zinc-200)] rounded w-full animate-pulse" />
            </div>
        </Card>
    )
}