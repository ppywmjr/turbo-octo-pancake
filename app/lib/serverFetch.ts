import 'server-only'
import { handleMockFetch } from './serverFetch.mock'

export async function serverFetch(url: string, init?: RequestInit): Promise<Response> {
  const mockResponse = await handleMockFetch(url)
  if (mockResponse) {
    return mockResponse
  }

  return fetch(url, {
    ...init,
    headers: {
      ...(init?.headers as Record<string, string>),
      'x-internal-api-key': process.env.INTERNAL_API_SECRET!,
    },
  })
}
