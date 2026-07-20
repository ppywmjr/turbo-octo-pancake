import { redirect } from 'next/navigation'
import { fetchCourse } from '@/app/lib/courses'
import { fetchCourseVideos } from '@/app/lib/courseVideos'
import YoutubePlayer from '@/app/components/organisms/YoutubePlayer'
import CenterLayout from '@/app/components/templates/CenterLayout'
import ButtonBack from '@/app/components/atoms/ButtonBack'
import { SectionHeading, BodyText } from '@/app/components/atoms/text'

function getYouTubeVideoId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1)
    if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com') {
      return u.searchParams.get('v')
    }
    return null
  } catch {
    return null
  }
}

export default async function CourseVideoPage({
  params,
}: {
  params: Promise<{ id: string; videoId: string }>
}) {
  const { id: courseId, videoId } = await params

  let courseTitle = 'Course videos'
  try {
    const course = await fetchCourse(courseId)
    if (course) {
      courseTitle = course.title
    }
  } catch {
    // If we can't fetch the course, fall back to a default title
  }

  let video
  try {
    video = await fetchCourseVideos(courseId, videoId)
  } catch (err) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'User is not authenticated' || msg.includes('responded with 401')) {
      redirect('/?error=unauthorized')
    }
    return (
      <CenterLayout>
        <>
          <ButtonBack href={`/courses/${courseId}/videos`}>Back to videos</ButtonBack>
          <BodyText muted>Failed to load video. Please try again later.</BodyText>
        </>
      </CenterLayout>
    )
  }

  if (!video) {
    return (
      <CenterLayout>
        <>
          <ButtonBack href={`/courses/${courseId}/videos`}>Back to videos</ButtonBack>
          <BodyText muted>Video not found.</BodyText>
        </>
      </CenterLayout>
    )
  }

  const ytVideoId = getYouTubeVideoId(video.url)

  return (
    <CenterLayout>
      <>
        <ButtonBack href={`/courses/${courseId}/videos`}>Back to videos</ButtonBack>

        <SectionHeading>{courseTitle} - {video.title}</SectionHeading>

        {ytVideoId ? (
          <YoutubePlayer videoId={videoId} ytVideoId={ytVideoId} title={video.title} initialProgressSecs={video.progressSecs} courseId={courseId} />
        ) : (
          <div className="w-full aspect-video rounded-2xl bg-[var(--color-surface)] flex items-center justify-center">
            <BodyText muted>Unable to embed this video.</BodyText>
          </div>
        )}
      </>
    </CenterLayout>
  )
}