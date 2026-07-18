import Card from '@/app/components/atoms/Card'

export default function MediaCardSkeleton() {
    return (
        <Card aspectRatio="aspect-[4/3]">
            <div className="relative w-full flex-[3] overflow-hidden bg-zinc-100 dark:bg-zinc-800 animate-pulse">
                <div className="w-full h-full bg-zinc-200 dark:bg-zinc-700" />
            </div>
            <div className="flex flex-col flex-[1] gap-2 p-4">
                <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full animate-pulse" />
            </div>
        </Card>
    )
}