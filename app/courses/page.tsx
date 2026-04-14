import { Suspense } from 'react'
import CourseGrid from './CourseGrid'

function CourseGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm animate-pulse"
        >
          <div className="w-full aspect-video bg-zinc-100 dark:bg-zinc-800" />
          <div className="flex flex-col gap-2 p-4">
            <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-3 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { offset: offsetParam } = await searchParams
  const offset = Math.max(0, parseInt(String(offsetParam ?? '0'), 10) || 0)

  return (
    <main className="flex flex-1 flex-col items-center py-16 px-8 bg-zinc-50 dark:bg-black min-h-screen">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-10">
        Courses
      </h1>
      <Suspense key={offset} fallback={<CourseGridSkeleton />}>
        <CourseGrid offset={offset} />
      </Suspense>
    </main>
  )
}
