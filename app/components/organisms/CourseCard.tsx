import Image from 'next/image'
import type { Course } from '@/app/types/course'
import MediaCard from '@/app/components/molecules/MediaCard'

export default function CourseCard({ course }: { course: Course }) {
  const imageSection = course.thumbnail ? (
    <Image
      src={course.thumbnail}
      alt={course.title}
      fill
      className="object-cover"
      unoptimized
    />
  ) : (
    <span className="text-[var(--color-text-muted)] text-4xl select-none">🎓</span>
  )

  return (
    <MediaCard
      imageSection={imageSection}
      title={course.title}
      description={course.description}
      href={`/courses/${course.id}/videos`}
    />
  )
}
