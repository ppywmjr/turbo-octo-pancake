import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import * as serverFetchModule from './serverFetch'

// Mock fs module at module level
vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
  },
}))

// Mock global fetch
const originalFetch = global.fetch

import fs from 'fs/promises'

const mockReadFile = vi.mocked(fs.readFile)

describe('serverFetch', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
    vi.clearAllMocks()
    global.fetch = originalFetch
  })

  afterEach(() => {
    process.env = originalEnv
    vi.restoreAllMocks()
  })

  describe('mock mode enabled', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_USE_MOCKS = 'true'
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3010'
    })

    it('returns courses array when fetching /api/courses', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [{ id: 'c1', title: 'Course 1' }],
        pagination: { total: 1, limit: 20, offset: 0, hasMore: false },
      }))

      const response = await serverFetchModule.serverFetch('/api/courses')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toContain('application/json')
      expect(data.data).toEqual([{ id: 'c1', title: 'Course 1' }])
    })

    it('returns a specific course by ID when fetching /api/courses/c1', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [
          { id: 'c1', title: 'Course 1' },
          { id: 'c2', title: 'Course 2' },
        ],
        pagination: { total: 2, limit: 20, offset: 0, hasMore: false },
      }))

      const response = await serverFetchModule.serverFetch('/api/courses/c1')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      expect(data).toEqual({ id: 'c1', title: 'Course 1' })
    })

    it('returns videos array when fetching /api/videos', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [
          { id: 'v1', title: 'Video 1' },
          { id: 'v2', title: 'Video 2' },
        ],
        pagination: { total: 2, limit: 20, offset: 0, hasMore: false },
      }))

      const response = await serverFetchModule.serverFetch('/api/videos')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      expect(data.data).toEqual([
        { id: 'v1', title: 'Video 1' },
        { id: 'v2', title: 'Video 2' },
      ])
    })

    it('returns a specific video by ID when fetching /api/videos/v1', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [
          { id: 'v1', title: 'Video 1' },
          { id: 'v2', title: 'Video 2' },
        ],
        pagination: { total: 2, limit: 20, offset: 0, hasMore: false },
      }))

      const response = await serverFetchModule.serverFetch('/api/videos/v1')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      expect(data).toEqual({ id: 'v1', title: 'Video 1' })
    })

    it('returns videos for a specific course when fetching /api/courses/{id}/videos', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [
          { id: 'v1', title: 'Video 1', courseId: 'c1' },
          { id: 'v2', title: 'Video 2', courseId: 'c1' },
        ],
        pagination: { total: 2, limit: 20, offset: 0, hasMore: false },
      }))

      const response = await serverFetchModule.serverFetch('/api/courses/c1/videos')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      expect(data.data).toEqual([
        { id: 'v1', title: 'Video 1', courseId: 'c1' },
        { id: 'v2', title: 'Video 2', courseId: 'c1' },
      ])
    })

    it('returns plans array when fetching /api/plans', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [
          { id: 'p1', name: 'Plan 1' },
          { id: 'p2', name: 'Plan 2' },
        ],
        pagination: { total: 2, limit: 20, offset: 0, hasMore: false },
      }))

      const response = await serverFetchModule.serverFetch('/api/plans')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      expect(data.data).toEqual([
        { id: 'p1', name: 'Plan 1' },
        { id: 'p2', name: 'Plan 2' },
      ])
    })

    it('returns a specific plan by ID when fetching /api/plans/p1', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [
          { id: 'p1', name: 'Plan 1' },
          { id: 'p2', name: 'Plan 2' },
        ],
        pagination: { total: 2, limit: 20, offset: 0, hasMore: false },
      }))

      const response = await serverFetchModule.serverFetch('/api/plans/p1')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      expect(data).toEqual({ id: 'p1', name: 'Plan 1' })
    })

    it('returns full response with pagination when no specific ID matches', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [{ id: 'c1', title: 'Course 1' }],
        pagination: { total: 1, limit: 20, offset: 0, hasMore: false },
      }))

      const response = await serverFetchModule.serverFetch('/api/courses/unknown-id')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: true,
        data: [{ id: 'c1', title: 'Course 1' }],
        pagination: { total: 1, limit: 20, offset: 0, hasMore: false },
      })
    })

    it('returns array wrapped in data when no pagination and ID does not match', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [{ id: 'c1', title: 'Course 1' }],
      }))

      const response = await serverFetchModule.serverFetch('/api/courses/unknown-id')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      expect(data).toEqual({ data: [{ id: 'c1', title: 'Course 1' }] })
    })

    it('falls through to real fetch when resource is not a known type', async () => {
      const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ subscriptions: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }))
      global.fetch = mockFetch

      const response = await serverFetchModule.serverFetch('/api/me/subscriptions')

      expect(mockFetch).toHaveBeenCalledWith('/api/me/subscriptions', expect.objectContaining({
        headers: expect.any(Object),
      }))
      expect(response.status).toBe(200)
    })

    it('uses default APP_URL when NEXT_PUBLIC_APP_URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_APP_URL
      process.env.NEXT_PUBLIC_USE_MOCKS = 'true'

      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [{ id: 'c1', title: 'Course 1' }],
        pagination: { total: 1, limit: 20, offset: 0, hasMore: false },
      }))

      const response = await serverFetchModule.serverFetch('/api/courses')

      expect(response.status).toBe(200)
    })

    it('falls through to real fetch when mock file read throws an error', async () => {
      const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ result: 'ok' }), {
        status: 200,
      }))
      global.fetch = mockFetch

      // Make the readFile throw so it falls through to real fetch
      mockReadFile.mockRejectedValue(new Error('ENOENT: no such file'))

      const response = await serverFetchModule.serverFetch('/api/courses')

      expect(response.status).toBe(200)
      const data = await response.json() as Record<string, unknown>
      expect(data).toEqual({ result: 'ok' })
    })

    it('handles empty data array in mock response', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [],
        pagination: { total: 0, limit: 20, offset: 0, hasMore: false },
      }))

      const response = await serverFetchModule.serverFetch('/api/courses')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      // Empty array with pagination: dataArray is [], isArray is true, but no items match
      // Since dataArray.length is 0, the idSegment finder returns undefined (no matches)
      // Then since pagination exists, it returns the full response
      expect(data).toEqual({
        success: true,
        data: [],
        pagination: { total: 0, limit: 20, offset: 0, hasMore: false },
      })
    })

    it('handles mock data without pagination field and with matching ID', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [{ id: 'c1', title: 'Course 1' }],
      }))

      const response = await serverFetchModule.serverFetch('/api/courses/c1')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      expect(data).toEqual({ id: 'c1', title: 'Course 1' })
    })

    it('returns direct array when mock data is an array instead of object', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify([
        { id: 'c1', title: 'Course 1' },
        { id: 'c2', title: 'Course 2' },
      ]))

      const response = await serverFetchModule.serverFetch('/api/courses')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      // When json is an array directly, dataArray = json (the array), and it's an array
      // so it goes into the Array.isArray branch
      expect(Array.isArray(data.data)).toBe(true)
    })

    it('handles courses/{id}/videos/{videoId} pattern by returning specific video', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [
          { id: 'v1', title: 'Video 1' },
          { id: 'v2', title: 'Video 2' },
        ],
        pagination: { total: 2, limit: 20, offset: 0, hasMore: false },
      }))

      const response = await serverFetchModule.serverFetch('/api/courses/c1/videos/v2')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      // The code looks for videos resource, finds v2 matching ID
      expect(data).toEqual({ id: 'v2', title: 'Video 2' })
    })

    it('identifies videos resource from courses/{id}/videos pattern', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [
          { id: 'v1', title: 'Video 1' },
        ],
        pagination: { total: 1, limit: 20, offset: 0, hasMore: false },
      }))

      const response = await serverFetchModule.serverFetch('/api/courses/abc123/videos')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      // Should target videos resource, not courses
      expect(data.data).toEqual([{ id: 'v1', title: 'Video 1' }])
    })
  })

  describe('mock mode behavior verification', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_USE_MOCKS = 'true'
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3010'
    })

    it('reads mock files when mock mode is enabled', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [{ id: 'c1', title: 'Course 1' }],
        pagination: { total: 1, limit: 20, offset: 0, hasMore: false },
      }))

      const response = await serverFetchModule.serverFetch('/api/courses')

      expect(response.status).toBe(200)
      // Verify fs.readFile was actually called (mock branch is taken)
      expect(mockReadFile).toHaveBeenCalledWith(
        expect.stringContaining('courses.json'),
        'utf-8',
      )
    })
  })

  describe('mock mode disabled', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_USE_MOCKS = 'false'
    })

    it('calls real fetch when mock mode is disabled', async () => {
      const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }))
      global.fetch = mockFetch

      process.env.INTERNAL_API_SECRET = 'test-secret'

      const response = await serverFetchModule.serverFetch('https://api.example.com/data', {
        method: 'GET',
      })

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
        method: 'GET',
        headers: {
          'x-internal-api-key': 'test-secret',
        },
      })

      const data = await response.json() as Record<string, unknown>
      expect(data).toEqual({ success: true })
    })

    it('does not read mock files when mock mode is disabled', async () => {
      const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ result: 'ok' }), {
        status: 200,
      }))
      global.fetch = mockFetch

      process.env.INTERNAL_API_SECRET = 'test-secret'

      const response = await serverFetchModule.serverFetch('https://api.example.com/data')

      expect(mockFetch).toHaveBeenCalled()
      // Verify fs.readFile was NOT called (mock branch is skipped)
      expect(mockReadFile).not.toHaveBeenCalled()
    })

    it('merges provided headers with internal API key header', async () => {
      const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({}), {
        status: 200,
      }))
      global.fetch = mockFetch

      process.env.INTERNAL_API_SECRET = 'my-secret'

      await serverFetchModule.serverFetch('https://api.example.com/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token123',
        },
      })

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token123',
          'x-internal-api-key': 'my-secret',
        },
      })
    })

    it('passes through the init options to fetch', async () => {
      const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({}), {
        status: 200,
      }))
      global.fetch = mockFetch

      process.env.INTERNAL_API_SECRET = 'secret'

      await serverFetchModule.serverFetch('https://api.example.com/data', {
        method: 'DELETE',
        credentials: 'include',
      })

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'x-internal-api-key': 'secret',
        },
      })
    })

    it('handles undefined init parameter', async () => {
      const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({}), {
        status: 200,
      }))
      global.fetch = mockFetch

      process.env.INTERNAL_API_SECRET = 'secret'

      await serverFetchModule.serverFetch('https://api.example.com/data')

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
        headers: {
          'x-internal-api-key': 'secret',
        },
      })
    })
  })

  describe('mock mode not set (undefined)', () => {
    it('calls real fetch when USE_MOCKS is not set', async () => {
      const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ result: 'ok' }), {
        status: 200,
      }))
      global.fetch = mockFetch

      process.env.INTERNAL_API_SECRET = 'real-secret'

      const response = await serverFetchModule.serverFetch('https://real-api.com/endpoint')
      const data = await response.json() as Record<string, unknown>

      expect(mockFetch).toHaveBeenCalledWith('https://real-api.com/endpoint', {
        headers: {
          'x-internal-api-key': 'real-secret',
        },
      })
      expect(data).toEqual({ result: 'ok' })
    })

    it('calls real fetch when USE_MOCKS is explicitly undefined', async () => {
      delete process.env.NEXT_PUBLIC_USE_MOCKS

      const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: 'test' }), {
        status: 200,
      }))
      global.fetch = mockFetch

      process.env.INTERNAL_API_SECRET = 'key'

      const response = await serverFetchModule.serverFetch('https://api.test.com/resource')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      expect(data).toEqual({ data: 'test' })
    })
  })

  describe('URL parsing', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_USE_MOCKS = 'true'
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3010'
    })

    it('correctly parses URL with custom APP_URL', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [{ id: 'c1', title: 'Course 1' }],
        pagination: { total: 1, limit: 20, offset: 0, hasMore: false },
      }))

      const response = await serverFetchModule.serverFetch('/api/courses')

      expect(response.status).toBe(200)
    })

    it('handles URL with query parameters', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [{ id: 'c1', title: 'Course 1' }],
        pagination: { total: 1, limit: 20, offset: 0, hasMore: false },
      }))

      const response = await serverFetchModule.serverFetch('/api/courses?limit=10')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      expect(data.data).toEqual([{ id: 'c1', title: 'Course 1' }])
    })
  })

  describe('uncovered edge cases', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_USE_MOCKS = 'true'
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3010'
    })

    it('hits the nested courses/videos pattern when segments are courses/videos', async () => {
      // This hits line 21-23: courseIndex !== -1 && segments[courseIndex + 1] === 'videos'
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [{ id: 'v1', title: 'Video 1' }],
        pagination: { total: 1, limit: 20, offset: 0, hasMore: false },
      }))

      const response = await serverFetchModule.serverFetch('/api/courses/videos')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      // Should target videos resource due to the nested pattern
      expect(data.data).toEqual([{ id: 'v1', title: 'Video 1' }])
    })

    it('returns full response when idSegment matches but item not found in array', async () => {
      // This hits lines 70-77: idSegment is truthy but item not found, and pagination exists
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [
          { id: 'c1', title: 'Course 1' },
          { id: 'c2', title: 'Course 2' },
        ],
        pagination: { total: 2, limit: 20, offset: 0, hasMore: false },
      }))

      // Use an ID that appears in segments but doesn't match any item
      const response = await serverFetchModule.serverFetch('/api/courses/nonexistent')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      // idSegment is 'nonexistent', but no item has that ID, so it falls to pagination branch
      expect(data).toEqual({
        success: true,
        data: [
          { id: 'c1', title: 'Course 1' },
          { id: 'c2', title: 'Course 2' },
        ],
        pagination: { total: 2, limit: 20, offset: 0, hasMore: false },
      })
    })

    it('handles non-array data object in mock response', async () => {
      // This hits line 90: dataArray exists but is not an array
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: { id: 'c1', title: 'Single Course' },
      }))

      const response = await serverFetchModule.serverFetch('/api/courses/c1')
      const data = await response.json() as Record<string, unknown>

      expect(response.status).toBe(200)
      // dataArray = { id: 'c1', title: 'Single Course' }, not an array
      // so it goes to line 90: responseData = dataArray
      expect(data).toEqual({ id: 'c1', title: 'Single Course' })
    })

    it('returns correct Content-Type header', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [{ id: 'c1', title: 'Course 1' }],
        pagination: { total: 1, limit: 20, offset: 0, hasMore: false },
      }))

      const response = await serverFetchModule.serverFetch('/api/courses')

      expect(response.headers.get('Content-Type')).toBe('application/json')
    })

    it('returns status 200 for all mock responses', async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({
        success: true,
        data: [{ id: 'c1', title: 'Course 1' }],
        pagination: { total: 1, limit: 20, offset: 0, hasMore: false },
      }))

      const response = await serverFetchModule.serverFetch('/api/courses')

      expect(response.status).toBe(200)
    })
  })
})