export default function PlanCardSkeleton() {
    return (
        <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm animate-pulse">
            <div className="flex flex-col flex-1 gap-3 p-6">
                {/* Title placeholder */}
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
                {/* Description placeholder */}
                <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3" />
                {/* Price placeholder */}
                <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 mt-2" />
            </div>
            <div className="px-6 pb-6">
                {/* Button placeholder */}
                <div className="flex h-10 w-full items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700" />
            </div>
        </div>
    )
}
