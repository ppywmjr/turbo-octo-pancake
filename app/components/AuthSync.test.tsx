// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@clerk/nextjs', () => ({
  useUser: vi.fn(),
}))

import { useUser } from '@clerk/nextjs'
import AuthSync from '@/app/components/AuthSync'

const MOCK_USER = { id: 'user_abc123' }

describe('AuthSync', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    vi.mocked(useUser).mockReset()
  })

  it('renders nothing', () => {
    vi.mocked(useUser).mockReturnValue({ isSignedIn: false, user: null } as never)

    const { container } = render(<AuthSync />)

    expect(container.firstChild).toBeNull()
  })

  it('does not call fetch when the user is not signed in', () => {
    vi.mocked(useUser).mockReturnValue({ isSignedIn: false, user: null } as never)

    render(<AuthSync />)

    expect(fetch).not.toHaveBeenCalled()
  })

  it('calls /api/auth/sync when the user is signed in', async () => {
    vi.mocked(useUser).mockReturnValue({ isSignedIn: true, user: MOCK_USER } as never)

    render(<AuthSync />)

    await vi.waitFor(() => expect(fetch).toHaveBeenCalledOnce())
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe('/api/auth/sync')
    expect(vi.mocked(fetch).mock.calls[0][1]).toMatchObject({ method: 'POST' })
  })

  it('only calls /api/auth/sync once per session even if re-rendered', async () => {
    vi.mocked(useUser).mockReturnValue({ isSignedIn: true, user: MOCK_USER } as never)

    const { rerender } = render(<AuthSync />)
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledOnce())

    rerender(<AuthSync />)
    await vi.waitFor(() => {}) // flush effects

    expect(fetch).toHaveBeenCalledOnce()
  })

  it('calls /api/auth/sync again after sessionStorage is cleared (new session)', async () => {
    vi.mocked(useUser).mockReturnValue({ isSignedIn: true, user: MOCK_USER } as never)

    render(<AuthSync />)
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledOnce())

    sessionStorage.clear()
    render(<AuthSync />)
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(2))
  })

  it('logs but does not throw when the fetch fails', async () => {
    vi.mocked(useUser).mockReturnValue({ isSignedIn: true, user: MOCK_USER } as never)
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    render(<AuthSync />)

    await vi.waitFor(() => expect(console.error).toHaveBeenCalled())
  })
})
