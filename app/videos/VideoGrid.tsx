import { fetchVideos } from '@/app/lib/videos'
import VideoCard from '@/app/components/VideoCard'

export default async function VideoGrid() {
  const videos = await fetchVideos()

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}
