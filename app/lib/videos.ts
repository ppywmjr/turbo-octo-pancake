import type { Video } from '@/app/types/video'

const FALLBACK_VIDEOS: Video[] = [
  {
    id: 'bjgqwBQ8-7g',
    title: 'Propulsion 2025 2-8 — Catherine Taylor',
    url: 'https://www.youtube.com/watch?v=bjgqwBQ8-7g',
    thumbnail: 'https://i.ytimg.com/vi/bjgqwBQ8-7g/hqdefault.jpg',
    channelName: 'Propulsion UK',
    watched: false,
    progress: 312,
  },
  {
    id: 'DN22xptfnes',
    title: 'Propulsion 2025 1-1 — A Singular Magic (Catherine Taylor)',
    url: 'https://www.youtube.com/watch?v=DN22xptfnes&list=RDDN22xptfnes&start_radio=1',
    thumbnail: 'https://i.ytimg.com/vi/DN22xptfnes/hqdefault.jpg',
    channelName: 'Propulsion UK',
    watched: true,
    progress: 0,
  },
  {
    id: 'BMkwmQmUa_g',
    title: 'Amy Sigil as The Gwragged Annwn',
    url: 'https://www.youtube.com/watch?v=BMkwmQmUa_g&list=RDBMkwmQmUa_g&start_radio=1',
    thumbnail: 'https://i.ytimg.com/vi/BMkwmQmUa_g/hqdefault.jpg',
    channelName: 'Amy Sigil',
    watched: false,
    progress: 0,
  },
]

export async function fetchVideos(): Promise<Video[]> {
  const apiUrl = process.env.VIDEOS_API_URL

  if (apiUrl) {
    try {
      const res = await fetch(apiUrl, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 60 },
      })

      if (!res.ok) {
        throw new Error(`External API responded with ${res.status}`)
      }

      return (await res.json()) as Video[]
    } catch (err) {
      console.error('[fetchVideos] External API failed, using fallback:', err)
    }
  }

  return FALLBACK_VIDEOS
}
