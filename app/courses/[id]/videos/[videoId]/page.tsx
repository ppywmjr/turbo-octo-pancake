import { redirect } from 'next/navigation'
import Link from 'next/link'
import { fetchCourseVideos } from '@/app/lib/courseVideos'
import YoutubePlayer from '@/app/components/organisms/YoutubePlayer'
import CenterLayout from '@/app/components/templates/CenterLayout'

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
          <p className="text-[var(--color-text-muted)]">Failed to load video. Please try again later.</p>
          <Link
            href={`/courses/${courseId}/videos`}
            className="mt-4 text-sm font-medium text-[var(--color-text-primary)] underline underline-offset-4"
          >
            ← Back to videos
          </Link>
        </>
      </CenterLayout>
    )
  }

  if (!video) {
    return (
      <CenterLayout>
        <>
          <p className="text-[var(--color-text-muted)]">Video not found.</p>
          <Link
            href={`/courses/${courseId}/videos`}
            className="mt-4 text-sm font-medium text-[var(--color-text-primary)] underline underline-offset-4"
          >
            ← Back to videos
          </Link>
        </>
      </CenterLayout>
    )
  }

  const ytVideoId = getYouTubeVideoId(video.url)

  return (
    <CenterLayout>
      <>
        <Link
          href={`/courses/${courseId}/videos`}
          className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors self-start"
        >
          ← Back to videos
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          {video.title}
        </h1>

        {ytVideoId ? (
          <YoutubePlayer videoId={videoId} ytVideoId={ytVideoId} title={video.title} initialProgressSecs={video.progressSecs} courseId={courseId} />
        ) : (
          <div className="w-full aspect-video rounded-2xl bg-[var(--color-surface)] flex items-center justify-center">
            <p className="text-[var(--color-text-muted)]">Unable to embed this video.</p>
          </div>
        )}
      </>
    </CenterLayout>
  )
}