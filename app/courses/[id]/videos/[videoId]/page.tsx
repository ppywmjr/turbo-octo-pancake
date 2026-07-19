import { redirect } from 'next/navigation'
import Link from 'next/link'
import { fetchCourseVideos } from '@/app/lib/courseVideos'
import YoutubePlayer from '@/app/components/organisms/YoutubePlayer'
import CenterLayout from '@/app/components/templates/CenterLayout'
import { PageHeading, BodyText, LinkText } from '@/app/components/atoms/text'

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
          <BodyText muted>Failed to load video. Please try again later.</BodyText>
          <LinkText href={`/courses/${courseId}/videos`}>← Back to videos</LinkText>
        </>
      </CenterLayout>
    )
  }

  if (!video) {
    return (
      <CenterLayout>
        <>
          <BodyText muted>Video not found.</BodyText>
          <LinkText href={`/courses/${courseId}/videos`}>← Back to videos</LinkText>
        </>
      </CenterLayout>
    )
  }

  const ytVideoId = getYouTubeVideoId(video.url)

  return (
    <CenterLayout>
      <>
        <LinkText href={`/courses/${courseId}/videos`}>← Back to videos</LinkText>

        <PageHeading className="text-2xl tracking-tight text-[var(--color-text-primary)]">{video.title}</PageHeading>

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