export interface Video {
  id: string
  title: string
  url: string
  thumbnail: string
  description?: string | null
  watched: boolean
  progressSecs: number // seconds
}