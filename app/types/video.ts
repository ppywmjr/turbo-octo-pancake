export interface Video {
  id: string
  title: string
  url: string
  thumbnail: string
  channelName: string
  watched: boolean
  progress: number // seconds
}
