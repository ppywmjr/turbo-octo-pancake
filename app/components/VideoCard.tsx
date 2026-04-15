import Link from 'next/link'
import type { Video } from '@/app/types/video'

export default function VideoCard({ video, cardHref }: { video: Video; cardHref?: string }) {
  const className = "group flex flex-col rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow"

  const inner = (
    <>
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

        {/* Status badge */}
        {video.watched && (
          <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            Watched
          </span>
        )}
        {!video.watched && video.progressSecs > 0 && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            In Progress
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
          {video.title}
        </p>
      </div>
    </>
  )

  if (cardHref) {
    return <Link href={cardHref} className={className}>{inner}</Link>
  }

  return (
    <a href={video.url} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  )
}

