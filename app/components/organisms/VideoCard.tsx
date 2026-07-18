import Image from 'next/image'
import type { Video } from '@/app/types/video'
import MediaCard from '@/app/components/molecules/MediaCard'

export default function VideoCard({ video, cardHref }: { video: Video; cardHref: string }) {
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
        <div className="bg-black/60 rounded-full p-3 group-hover:bg-green-600 transition-colors">
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
    </>
  )

  return (
    <MediaCard
      imageSection={imageSection}
      title={video.title}
      description={video.description}
      href={cardHref}
    />
  )
}

