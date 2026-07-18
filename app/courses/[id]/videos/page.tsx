import { Suspense } from 'react'
import VideoCardSkeleton from '@/app/components/VideoCardSkeleton'
import CourseVideoGrid from './CourseVideoGrid'
import CenterLayout from '@/app/components/CenterLayout'
import CardsSection, { CardsGrid } from '@/app/components/CardsSection'

function VideoGridSkeleton() {
  return (
    <CardsGrid>
      {Array.from({ length: 3 }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </CardsGrid>
  )
}

export default async function CourseVideosPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: courseId } = await params

  return (
    <CenterLayout>
      <Suspense fallback={<VideoGridSkeleton />}>
        <CourseVideoGrid courseId={courseId} />
      </Suspense>
    </CenterLayout>
  )
}
