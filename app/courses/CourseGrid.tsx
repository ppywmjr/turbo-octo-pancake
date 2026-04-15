import Link from 'next/link'
import { redirect } from 'next/navigation'
import { fetchCourses } from '@/app/lib/courses'
import CourseCard from '@/app/components/CourseCard'

export default async function CourseGrid({ offset }: { offset: number }) {
  let courses, hasMore, total, limit
  try {
    ;({ courses, hasMore, total, limit } = await fetchCourses(offset))
  } catch (err) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'User is not authenticated' || msg.includes('responded with 401')) {
      redirect('/?error=unauthorized')
    }
    throw err
  }

  const prevOffset = offset - limit
  const nextOffset = offset + limit
  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(total / limit)

  if (courses.length === 0) {
    return (
      <p className="text-zinc-500 dark:text-zinc-400 text-center">
        No courses found.
      </p>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-5xl">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {(offset > 0 || hasMore) && (
        <div className="flex items-center gap-4">
          {offset > 0 ? (
            <Link
              href={prevOffset > 0 ? `/courses?offset=${prevOffset}` : '/courses'}
              className="px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              ← Previous
            </Link>
          ) : (
            <span className="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-400 cursor-not-allowed">
              ← Previous
            </span>
          )}

          {totalPages > 1 && (
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Page {page} of {totalPages}
            </span>
          )}

          {hasMore ? (
            <Link
              href={`/courses?offset=${nextOffset}`}
              className="px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Next →
            </Link>
          ) : (
            <span className="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-400 cursor-not-allowed">
              Next →
            </span>
          )}
        </div>
      )}
    </div>
  )
}
