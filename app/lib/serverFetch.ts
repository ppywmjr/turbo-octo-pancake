import 'server-only'

export function serverFetch(url: string, init?: RequestInit): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      ...(init?.headers as Record<string, string>),
      'x-internal-api-key': process.env.INTERNAL_API_SECRET!,
    },
  })
}
