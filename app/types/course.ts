export interface Course {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  sortOrder: number
  isPublished?: boolean
}

export interface CreateCourseInput {
  title: string
  description?: string | null
  thumbnail?: string | null
  sortOrder?: number
  isPublished?: boolean
}

export interface PatchCourseInput {
  title?: string
  description?: string | null
  thumbnail?: string | null
  sortOrder?: number
  isPublished?: boolean
}

export interface CoursesResponse {
  courses: Course[]
  hasMore: boolean
  total: number
  offset: number
  limit: number
}
