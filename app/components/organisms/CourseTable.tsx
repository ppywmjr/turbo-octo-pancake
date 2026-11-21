'use client'

import type { Course } from '@/app/types/course'
import Button from '@/app/components/atoms/Button'
import { SectionHeading, BodyText } from '@/app/components/atoms/text'

type CourseAction =
  | { type: 'edit'; course: Course }
  | { type: 'delete'; course: Course }

interface CourseTableProps {
  courses: Course[]
  isLoading: boolean
  onCreateNew: () => void
  onAction: (action: CourseAction) => void
}

export default function CourseTable({ courses, isLoading, onCreateNew, onAction }: CourseTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <BodyText>Loading courses...</BodyText>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <BodyText muted>No courses yet</BodyText>
        <Button variant="primary" size="md" onClick={onCreateNew}>
          Create Course
        </Button>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse rounded-lg overflow-hidden border border-[var(--color-surface)]">
        <thead>
          <tr className="bg-[var(--color-surface-row-even)]">
            <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-primary)] border-b border-r border-[var(--color-surface)] last:border-r-0">
              Title
            </th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-primary)] border-b border-r border-[var(--color-surface)] last:border-r-0">
              Description
            </th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-primary)] border-b border-r border-[var(--color-surface)] last:border-r-0">
              Sort Order
            </th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-primary)] border-b border-r border-[var(--color-surface)] last:border-r-0">
              Published
            </th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-surface)]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, rowIndex) => (
            <tr
              key={course.id}
              className={`${rowIndex % 2 === 0 ? '' : 'bg-[var(--color-surface-row-even)]'} border-b border-r border-[var(--color-surface)] last:border-r-0`}
            >
              <td className="px-4 py-3 text-[var(--color-text-primary)] font-medium">
                {course.title}
              </td>
              <td className="px-4 py-3 text-[var(--color-text-muted)] max-w-xs truncate">
                {course.description || <span className="italic opacity-50">—</span>}
              </td>
              <td className="px-4 py-3 text-[var(--color-text-muted)]">
                {course.sortOrder}
              </td>
              <td className="px-4 py-3">
                {course.isPublished ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[var(--color-success)] text-[var(--color-white)]">
                    Published
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[var(--color-surface)] text-[var(--color-text-muted)]">
                    Draft
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onAction({ type: 'edit', course })}
                  >
                    Edit
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
