import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { fetchCourseVideos } from '@/app/lib/courseVideos'
import VideoCard from '@/app/components/organisms/VideoCard'
import MediaCardSkeleton from '@/app/components/molecules/MediaCardSkeleton'
import CenterLayout from '@/app/components/templates/CenterLayout'
import CardsGrid from '@/app/components/templates/CardsGrid'

function VideoGridSkeleton() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Videos</h2>
      <CardsGrid>
        {Array.from({ length: 3 }).map((_, i) => (
          <MediaCardSkeleton key={i} />
        ))}
      </CardsGrid>
    </section>
  )
}

async function VideoGrid({ courseId }: { courseId: string }) {
  let videos
  try {
    videos = await fetchCourseVideos(courseId)
  } catch (err) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'User is not authenticated' || msg.includes('responded with 401')) {
      redirect('/?error=unauthorized')
    }
    throw err
  }

  if (videos.length === 0) {
    return <p className="text-zinc-500 dark:text-zinc-400 text-center">No videos found for this course.</p>
  }

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Videos</h2>
      <CardsGrid>
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} cardHref={`/courses/${courseId}/videos/${video.id}`} />
        ))}
      </CardsGrid>
    </section>
  )
}

export default async function CourseVideosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = await params
  return (
    <CenterLayout>
      <Suspense fallback={<VideoGridSkeleton />}>
        <VideoGrid courseId={courseId} />
      </Suspense>
    </CenterLayout>
  )
}