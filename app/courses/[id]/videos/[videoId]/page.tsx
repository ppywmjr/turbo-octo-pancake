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

  const video = await fetchCourseVideos(courseId, videoId)
  console.log('Fetched video:', video)

  if (!video) {
    return (
      <CenterLayout>
        <p className="text-zinc-500 dark:text-zinc-400">Video not found.</p>
        <Link
          href={`/courses/${courseId}/videos`}
          className="mt-4 text-sm font-medium text-zinc-900 dark:text-zinc-100 underline underline-offset-4"
        >
          ← Back to videos
        </Link>
      </CenterLayout>
    )
  }

  const ytVideoId = getYouTubeVideoId(video.url)

  return (
    <CenterLayout>
      <Link
        href={`/courses/${courseId}/videos`}
        className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors self-start"
      >
        ← Back to videos
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {video.title}
      </h1>

      {ytVideoId ? (
        <YoutubePlayer videoId={videoId} ytVideoId={ytVideoId} title={video.title} initialProgressSecs={video.progressSecs} courseId={courseId} />
      ) : (
        <div className="w-full aspect-video rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <p className="text-zinc-500 dark:text-zinc-400">Unable to embed this video.</p>
        </div>
      )}

    </CenterLayout>
  )
}
