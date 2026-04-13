import { auth } from '@clerk/nextjs/server'

import type { Video } from '@/app/types/video'

const FALLBACK_VIDEOS: Video[] = [
  {
    id: 'bjgqwBQ8-7g',
    title: 'NextJS stub — Catherine Taylor',
    url: 'https://www.youtube.com/watch?v=bjgqwBQ8-7g',
    thumbnail: 'https://i.ytimg.com/vi/bjgqwBQ8-7g/hqdefault.jpg',
    channelName: 'Propulsion UK',
    watched: false,
    progress: 312,
  },
  {
    id: 'DN22xptfnes',
    title: 'NextJS stub — A Singular Magic (Catherine Taylor)',
    url: 'https://www.youtube.com/watch?v=DN22xptfnes&list=RDDN22xptfnes&start_radio=1',
    thumbnail: 'https://i.ytimg.com/vi/DN22xptfnes/hqdefault.jpg',
    channelName: 'Propulsion UK',
    watched: true,
    progress: 0,
  },
  {
    id: 'BMkwmQmUa_g',
    title: 'NextJS stub — Amy Sigil as The Gwragged Annwn',
    url: 'https://www.youtube.com/watch?v=BMkwmQmUa_g&list=RDBMkwmQmUa_g&start_radio=1',
    thumbnail: 'https://i.ytimg.com/vi/BMkwmQmUa_g/hqdefault.jpg',
    channelName: 'Amy Sigil',
    watched: false,
    progress: 0,
  },
]

export async function fetchVideos(): Promise<Video[]> {
  const subscriptionManagementBaseUrl = process.env.SUBSCRIPTION_MANAGEMENT_URL

  if (subscriptionManagementBaseUrl) {
    const apiUrl = new URL('/subscriptions/flutters/videos', subscriptionManagementBaseUrl).toString()
    try {
      const { getToken } = await auth()
      const token = await getToken()
      if (!token) {
        throw new Error('User is not authenticated')
      }
      const headers: HeadersInit = { Accept: 'application/json' }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch(apiUrl, {
        headers,
        next: { revalidate: 60 },
      })

      if (!res.ok) {
        throw new Error(`External API responded with ${res.status}`)
      }

      return (await res.json()).data as Video[]
    } catch (err) {
      console.error('[fetchVideos] External API failed, using fallback:', err)
    }
  }

  return FALLBACK_VIDEOS
}
