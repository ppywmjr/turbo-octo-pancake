export default function VideoCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm animate-pulse">
      {/* Thumbnail placeholder */}
      <div className="w-full aspect-video bg-zinc-200 dark:bg-zinc-700" />

      {/* Body placeholder */}
      <div className="p-4 flex flex-col gap-2">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
      </div>
    </div>
  )
}
