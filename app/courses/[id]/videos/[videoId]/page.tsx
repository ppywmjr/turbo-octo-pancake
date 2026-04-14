import Link from 'next/link'
import { fetchCourseVideos } from '@/app/lib/courseVideos'

function getYouTubeEmbedId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1)
    return u.searchParams.get('v')
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

  const videos = await fetchCourseVideos(courseId)
  const video = videos.find((v) => v.id === videoId)

  if (!video) {
    return (
      <main className="flex flex-1 flex-col items-center py-16 px-8 bg-zinc-50 dark:bg-black min-h-screen">
        <p className="text-zinc-500 dark:text-zinc-400">Video not found.</p>
        <Link
          href={`/courses/${courseId}/videos`}
          className="mt-4 text-sm font-medium text-zinc-900 dark:text-zinc-100 underline underline-offset-4"
        >
          ← Back to videos
        </Link>
      </main>
    )
  }

  const embedId = getYouTubeEmbedId(video.url)

  return (
    <main className="flex flex-1 flex-col items-center py-16 px-8 bg-zinc-50 dark:bg-black min-h-screen">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        <Link
          href={`/courses/${courseId}/videos`}
          className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors self-start"
        >
          ← Back to videos
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {video.title}
        </h1>

        {embedId ? (
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${embedId}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ) : (
          <div className="w-full aspect-video rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <p className="text-zinc-500 dark:text-zinc-400">Unable to embed this video.</p>
          </div>
        )}

        <p className="text-sm text-zinc-500 dark:text-zinc-400">{video.channelName}</p>
      </div>
    </main>
  )
}
