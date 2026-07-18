import { Suspense } from 'react'
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

function VideoNotFound({ backHref }: { backHref: string }) {
  return (
    <>
      <p className="text-zinc-500 dark:text-zinc-400">Video not found.</p>
      <Link
        href={backHref}
        className="mt-4 text-sm font-medium text-zinc-900 dark:text-zinc-100 underline underline-offset-4"
      >
        ← Back to videos
      </Link>
    </>
  )
}

function VideoErrorFallback({ backHref }: { backHref: string }) {
  return (
    <>
      <p className="text-zinc-500 dark:text-zinc-400">Failed to load video. Please try again later.</p>
      <Link
        href={backHref}
        className="mt-4 text-sm font-medium text-zinc-900 dark:text-zinc-100 underline underline-offset-4"
      >
        ← Back to videos
      </Link>
    </>
  )
}

async function VideoContent({ courseId, videoId }: { courseId: string; videoId: string }) {
  let video
  try {
    video = await fetchCourseVideos(courseId, videoId)
  } catch (err) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'User is not authenticated' || msg.includes('responded with 401')) {
      redirect('/?error=unauthorized')
    }
    return <VideoErrorFallback backHref={`/courses/${courseId}/videos`} />
  }

  if (!video) {
    return <VideoNotFound backHref={`/courses/${courseId}/videos`} />
  }

  const ytVideoId = getYouTubeVideoId(video.url)

  return (
    <>
      <Link
        href={`/courses/${courseId}/videos`}
        className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors self-start"
      >
        ← Back to videos
      </Link>

      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {video.title}
      </h1>

      {ytVideoId ? (
        <YoutubePlayer videoId={videoId} ytVideoId={ytVideoId} title={video.title} initialProgressSecs={video.progressSecs} courseId={courseId} />
      ) : (
        <div className="w-full aspect-video rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <p className="text-zinc-500 dark:text-zinc-400">Unable to embed this video.</p>
        </div>
      )}
    </>
  )
}

export default async function CourseVideoPage({
  params,
}: {
  params: Promise<{ id: string; videoId: string }>
}) {
  const { id: courseId, videoId } = await params

  return (
    <CenterLayout>
      <Suspense fallback={
        <div className="flex flex-col gap-6">
          <div className="h-8 w-40 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
          <div className="h-80 w-full bg-zinc-200 dark:bg-zinc-700 rounded-2xl animate-pulse" />
        </div>
      }>
        <VideoContent courseId={courseId} videoId={videoId} />
      </Suspense>
    </CenterLayout>
  )
}
