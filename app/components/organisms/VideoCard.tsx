import Image from 'next/image'
import type { Video } from '@/app/types/video'
import MediaCard from '@/app/components/molecules/MediaCard'
import { StatusBadge } from '@/app/components/atoms/text'

export default function VideoCard({ video, cardHref }: { video: Video; cardHref: string }) {
  const statusLabel = video.watched
    ? 'Watched'
    : video.progressSecs > 0
      ? `In Progress, ${video.progressSecs} seconds watched`
      : null

  const ariaLabel = statusLabel
    ? `${video.title}, ${statusLabel}`
    : video.title

  const imageSection = (
    <>
      <Image
        src={video.thumbnail}
        alt={video.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        unoptimized
      />

      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-[var(--color-overlay-surface)] rounded-full p-3 group-hover:bg-[var(--color-overlay-surface-hover)] transition-colors">
          <svg
            className="w-6 h-6 text-[var(--color-white)]"
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
        <StatusBadge textContent="Watched" variant="watched" />
      )}
      {!video.watched && video.progressSecs > 0 && (
        <StatusBadge textContent="In Progress" variant="in-progress" />
      )}
    </>
  )

  return (
    <MediaCard
      imageSection={imageSection}
      title={video.title}
      description={video.description}
      href={cardHref}
      ariaLabel={ariaLabel}
    />
  )
}

