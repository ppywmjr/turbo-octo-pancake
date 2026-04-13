import type { Video } from '@/app/types/video'

function formatProgress(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function VideoCard({ video }: { video: Video }) {
  const progressPercent =
    video.progress > 0
      ? Math.min(100, Math.round((video.progress / 3600) * 100))
      : 0

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/60 rounded-full p-3 group-hover:bg-red-600 transition-colors">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Watched badge */}
        {video.watched && (
          <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            Watched
          </span>
        )}

        {/* Progress bar */}
        {video.progress > 0 && !video.watched && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div
              className="h-full bg-red-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-1">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
          {video.title}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {video.channelName}
        </p>
        {video.progress > 0 && !video.watched && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {formatProgress(video.progress)} watched
          </p>
        )}
      </div>
    </a>
  )
}
