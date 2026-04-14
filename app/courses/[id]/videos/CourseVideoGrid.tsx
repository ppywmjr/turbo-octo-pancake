import { fetchCourseVideos } from '@/app/lib/courseVideos'
import VideoCard from '@/app/components/VideoCard'

export default async function CourseVideoGrid({ courseId }: { courseId: string }) {
  const videos = await fetchCourseVideos(courseId)

  if (videos.length === 0) {
    return (
      <p className="text-zinc-500 dark:text-zinc-400 text-center">
        No videos found for this course.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          cardHref={`/courses/${courseId}/videos/${video.id}`}
        />
      ))}
    </div>
  )
}
