export interface Course {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  sortOrder: number
}

export interface CoursesResponse {
  courses: Course[]
  hasMore: boolean
  total: number
  offset: number
  limit: number
}
