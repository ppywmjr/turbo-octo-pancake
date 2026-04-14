import { Suspense } from 'react'
import VideoCardSkeleton from '@/app/components/VideoCardSkeleton'
import CourseVideoGrid from './CourseVideoGrid'

function VideoGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
      {Array.from({ length: 3 }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default async function CourseVideosPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: courseId } = await params

  return (
    <main className="flex flex-1 flex-col items-center py-16 px-8 bg-zinc-50 dark:bg-black min-h-screen">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-10">
        Videos
      </h1>
      <Suspense fallback={<VideoGridSkeleton />}>
        <CourseVideoGrid courseId={courseId} />
      </Suspense>
    </main>
  )
}
