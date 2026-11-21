import { fetchAllCourses } from "@/app/lib/coursesAdmin"

import ClientCourseAdmin from "./ClientCourseAdmin"
import { PageHeading } from "@/app/components/atoms/text"

export default async function AdminCoursesPage() {
  const { courses } = await fetchAllCourses()

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <PageHeading>Courses Admin</PageHeading>
        </div>

        <ClientCourseAdmin courses={courses} />
      </div>
    </div>
  )
}
