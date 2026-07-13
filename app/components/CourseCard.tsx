import Image from 'next/image'
import type { Course } from '@/app/types/course'
import MediaCard from '@/app/components/MediaCard'

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
    <span className="text-zinc-400 dark:text-zinc-600 text-4xl select-none">🎓</span>
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
