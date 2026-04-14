import Link from 'next/link'
import type { Course } from '@/app/types/course'

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.id}/videos`}
      className="group flex flex-col rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-zinc-400 dark:text-zinc-600 text-4xl select-none">🎓</span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 leading-snug line-clamp-2">
          {course.title}
        </h2>
        {course.description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3">
            {course.description}
          </p>
        )}
      </div>
    </Link>
  )
}
