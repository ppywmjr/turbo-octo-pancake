// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { POST } from '@/app/api/courses/[id]/videos/[videoId]/progress/route'
import { auth } from '@clerk/nextjs/server'

vi.mock('@clerk/nextjs/server', () => ({
    auth: vi.fn(),
}))

vi.mock('@/app/lib/serverFetch', () => ({
    serverFetch: vi.fn(),
}))

import { serverFetch } from '@/app/lib/serverFetch'

const COURSE_ID = 'course-1'
const VIDEO_ID = 'vid-1'

function makeParams(params: { id: string; videoId: string }) {
    return { params: Promise.resolve(params) }
}

interface RequestBody {
    progressSecs?: number;
    watched?: boolean;
}

function makeRequest(body: RequestBody = {}) {
    return new Request('http://localhost/api/courses/course-1/videos/vid-1/progress', {
        method: 'POST',
        body: JSON.stringify(body),
    })
}

describe('POST /api/courses/[id]/videos/[videoId]/progress', () => {
    const originalEnv = process.env.SUBSCRIPTION_MANAGEMENT_URL

    beforeEach(() => {
        vi.clearAllMocks()
        process.env.SUBSCRIPTION_MANAGEMENT_URL = 'http://localhost:3011'
    })

    afterEach(() => {
        process.env.SUBSCRIPTION_MANAGEMENT_URL = originalEnv
    })

    it('returns 401 when there is no auth token', async () => {
        vi.mocked(auth).mockResolvedValue({ getToken: vi.fn().mockResolvedValue(null) } as never)

        const res = await POST(makeRequest(), makeParams({ id: COURSE_ID, videoId: VIDEO_ID }))

        expect(res.status).toBe(401)
        const body = await res.json()
        expect(body.error).toBe('Unauthorized')
    })

    it('returns 503 when SUBSCRIPTION_MANAGEMENT_URL is not set', async () => {
        delete process.env.SUBSCRIPTION_MANAGEMENT_URL
        vi.mocked(auth).mockResolvedValue({ getToken: vi.fn().mockResolvedValue('test-jwt') } as never)

        const res = await POST(makeRequest(), makeParams({
            id:
                COURSE_ID,
            videoId: VIDEO_ID,
        }))

        expect(res.status).toBe(503)
        const body = await res.json()
        expect(body.error).toBe('Service unavailable')
    })

    it('calls the upstream service with correct URL and token', async () => {
        vi.mocked(auth).mockResolvedValue({ getToken: vi.fn().mockResolvedValue('test-jwt') } as never)
        vi.mocked(serverFetch).mockResolvedValueOnce(new Response(null, { status: 204 }))

        const body = { progressSecs: 10, watched: true }
        const res = await POST(makeRequest(body), makeParams({ id: COURSE_ID, videoId: VIDEO_ID }))

        expect(res.status).toBe(204)
        expect(serverFetch).toHaveBeenCalledWith(
            `http://localhost:3011/me/courses/${COURSE_ID}/videos/${VIDEO_ID}/progress`,
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    Authorization: 'Bearer test-jwt',
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                }),
                body: JSON.stringify(body),
            }),
        )
    })

    it('forwards error status from the upstream service', async () => {
        vi.mocked(auth).mockResolvedValue({ getToken: vi.fn().mockResolvedValue('test-jwt') } as never)
        vi.mocked(serverFetch).mockResolvedValueOnce(new Response('error', { status: 400 }))

        const res = await POST(makeRequest(), makeParams({ id: COURSE_ID, videoId: VIDEO_ID }))

        expect(res.status).toBe(400)
        const body = await res.json()
        expect(body.error).toBe('Upstream error 400')
    })
})
