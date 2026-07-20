import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { fetchCourse } from '@/app/lib/courses'
import { fetchCourseVideos } from '@/app/lib/courseVideos'
import VideoCard from '@/app/components/organisms/VideoCard'
import MediaCardSkeleton from '@/app/components/molecules/MediaCardSkeleton'
import CenterLayout from '@/app/components/templates/CenterLayout'
import CardsSection from '@/app/components/templates/CardsSection'
import ButtonBack from '@/app/components/atoms/ButtonBack'
import { BodyText } from '@/app/components/atoms/text'

function VideoGridSkeleton() {
  return (
    <section className="flex flex-col gap-6">
      <div className="h-8 w-20 bg-[var(--color-surface)] rounded animate-pulse" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <MediaCardSkeleton key={i} />
        ))}
      </div>
    </section>
  )
}

async function VideoGrid({ courseId, courseTitle }: { courseId: string; courseTitle: string }) {
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
    return <BodyText muted className="text-center">No videos found for this course.</BodyText>
  }

  return (
    <>
      <ButtonBack href="/">Back to home</ButtonBack>
      <CardsSection
        title={courseTitle}
        cards={videos.map((video) => (
          <VideoCard key={video.id} video={video} cardHref={`/courses/${courseId}/videos/${video.id}`} />
        ))}
      />
    </>
  )
}

export default async function CourseVideosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = await params
  let courseTitle = 'Course videos'
  try {
    const course = await fetchCourse(courseId)
    if (course) {
      courseTitle = course.title
    }
  } catch {
    // If we can't fetch the course, fall back to a default title
  }

  return (
    <CenterLayout>
      <Suspense fallback={<VideoGridSkeleton />}>
        <VideoGrid courseId={courseId} courseTitle={courseTitle} />
      </Suspense>
    </CenterLayout>
  )
}
