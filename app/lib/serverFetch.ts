import 'server-only'

const REQUEST_TIMEOUT = parseInt(process.env.API_REQUEST_TIMEOUT ?? '15000', 10)

/**
 * Fetch wrapper for calls to the external subscription management service.
 * Adds logging, a timeout, and the internal API key header.
 */
export async function serverFetch(url: string, init?: RequestInit): Promise<Response> {
  const method = init?.method ?? 'GET'
  const startTime = Date.now()

  const INTERNAL_API_KEY = process.env.INTERNAL_API_SECRET
  if (!INTERNAL_API_KEY) {
    throw new Error('[serverFetch] INTERNAL_API_SECRET is not configured')
  }

  // Build headers with the internal API key
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
    'x-internal-api-key': INTERNAL_API_KEY,
  }

  try {
    const fetchPromise = fetch(url, {
      ...init,
      headers,
    })

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request to subscription service timed out after ${REQUEST_TIMEOUT}ms`))
      }, REQUEST_TIMEOUT)
    })

    const response = await Promise.race([fetchPromise, timeoutPromise])
    const duration = Date.now() - startTime

    console.log(
      `[serverFetch] ${method} ${url} → ${response.status} (${duration}ms)`,
    )

    return response
  } catch (error) {
    const duration = Date.now() - startTime
    const message = error instanceof Error ? error.message : String(error)

    if (message.includes('timed out')) {
      console.error(`[serverFetch] ${method} ${url} → TIMEOUT after ${duration}ms`)
      throw new Error(`[serverFetch] Request to subscription service timed out after ${REQUEST_TIMEOUT}ms`)
    }

    console.error(`[serverFetch] ${method} ${url} → ERROR after ${duration}ms: ${message}`)
    throw new Error(`[serverFetch] Failed to reach subscription service: ${message}`)
  }
}
