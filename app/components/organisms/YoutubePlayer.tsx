'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    YT: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

interface YTNamespace {
  Player: new (element: HTMLElement, options: YTPlayerOptions) => YTPlayerInstance
  PlayerState: { PLAYING: number }
}

interface YTPlayerOptions {
  videoId: string
  playerVars?: Record<string, number>
  events?: {
    onReady?: (e: { target: YTPlayerInstance }) => void
    onStateChange?: (e: { data: number }) => void
  }
}

interface YTPlayerInstance {
  playVideo(): void
  pauseVideo(): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  getCurrentTime(): number
  getDuration(): number
  setPlaybackRate(rate: number): void
  getAvailablePlaybackRates(): number[]
  destroy(): void
}

// Module-level singleton so multiple mounts don't race on the script tag
let apiReadyPromise: Promise<void> | null = null

function loadYouTubeApi(): Promise<void> {
  if (apiReadyPromise) return apiReadyPromise
  apiReadyPromise = new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve()
      return
    }
    // v8 ignore: he YouTube IFrame API script injection path), which require resetting a
    // module-level singleton — not feasible without module isolation
    /* v8 ignore start */
    window.onYouTubeIframeAPIReady = resolve
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
    /* v8 ignore stop */
  })
  return apiReadyPromise
}

function formatTime(secs: number): string {
  const s = Math.floor(secs)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  const ss = String(s % 60).padStart(2, '0')
  const mm = String(m % 60).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

export default function YoutubePlayer({
  videoId,
  title,
  initialProgressSecs = 0,
  courseId,
  ytVideoId,
}: {
  videoId: string
  title: string
  initialProgressSecs?: number
  courseId: string
  ytVideoId: string
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayerInstance | null>(null)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressTickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const scrubbingRef = useRef(false)
  const currentTimeRef = useRef(initialProgressSecs)
  const durationRef = useRef(0)

  const [playing, setPlaying] = useState(false)
  const playingRef = useRef(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)

  // Keep the ref in sync with React state
  useEffect(() => {
    playingRef.current = playing
  }, [playing])

  // Poll current time while playing
  useEffect(() => {
    if (playing) {
      tickRef.current = setInterval(() => {
        if (!scrubbingRef.current && playerRef.current) {
          const t = playerRef.current.getCurrentTime()
          currentTimeRef.current = t
          setCurrentTime(t)
        }
      }, 500)
    } else {
      if (tickRef.current) clearInterval(tickRef.current)
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [playing])

  // Report progress to server every 5 seconds while playing
  useEffect(() => {
    if (playing) {
      progressTickRef.current = setInterval(() => {
        const secs = Math.floor(currentTimeRef.current)
        const dur = durationRef.current
        const watched = dur > 0 && currentTimeRef.current / dur >= 0.95
        fetch(`/api/courses/${courseId}/videos/${videoId}/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ progressSecs: secs, ...(watched && { watched: true }) }),
        }).catch(() => { /* best-effort, ignore failures */ })
      }, 5000)
    } else {
      if (progressTickRef.current) clearInterval(progressTickRef.current)
    }
    return () => {
      if (progressTickRef.current) clearInterval(progressTickRef.current)
    }
  }, [playing, courseId, videoId])

  // Apply playback rate to the YouTube player
  useEffect(() => {
    if (playerRef.current) {
      try {
        playerRef.current.setPlaybackRate(playbackRate)
      } catch {
        // ignore errors if the rate is not supported
      }
    }
  }, [playbackRate])

  useEffect(() => {
    let destroyed = false

    loadYouTubeApi().then(() => {
      if (destroyed || !playerContainerRef.current) return
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId: ytVideoId,
        playerVars: {
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (e) => {
            // Set initial duration and restore progress position if applicable.
            // Note: We do NOT call playVideo() or pauseVideo() here — YouTube may auto-start
            // before this fires during client-side navigation, so we intercept that in onStateChange.
            const dur = e.target.getDuration()
            durationRef.current = dur
            setDuration(dur)
            if (initialProgressSecs > 0) {
              e.target.seekTo(initialProgressSecs, true)
              currentTimeRef.current = initialProgressSecs
              setCurrentTime(initialProgressSecs)
            }
          },
          onStateChange: (e) => {
            const isPlaying = e.data === window.YT.PlayerState.PLAYING
            // Intercept auto-play: if YouTube starts playing but the user hasn't initiated it,
            // immediately pause. We use playingRef (not React state) because the closure may
            // have a stale value when auto-play happens during mount.
            if (isPlaying && !playingRef.current) {
              playerRef.current?.pauseVideo()
              return
            }
            setPlaying(isPlaying)
            if (playerRef.current) {
              const dur = playerRef.current.getDuration()
              const t = playerRef.current.getCurrentTime()
              durationRef.current = dur
              currentTimeRef.current = t
              setDuration(dur)
              setCurrentTime(t)
            }
          },
        },
      })
    })

    return () => {
      destroyed = true
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [ytVideoId, initialProgressSecs])

  const togglePlay = () => {
    if (!playerRef.current) return
    if (playingRef.current) {
      playerRef.current.pauseVideo()
    } else {
      playingRef.current = true
      playerRef.current.playVideo()
    }
  }

  const toggleFullscreen = () => {
    if (!wrapperRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      wrapperRef.current.requestFullscreen()
    }
  }

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setCurrentTime(value)
  }

  const handleSeekStart = () => {
    scrubbingRef.current = true
  }

  const handleSeekCommit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    scrubbingRef.current = false
    playerRef.current?.seekTo(value, true)
    setCurrentTime(value)
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={wrapperRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-[var(--color-black)]"
    >
      {/* YouTube IFrame API mounts the iframe into this div */}
      <div ref={playerContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Gradient overlay to cover YouTube end screen / "More videos" branding at bottom.
          Fades out over 2 seconds when video starts playing. */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-15 pointer-events-none transition-opacity ${
          playing ? 'opacity-0 delay-4000 duration-1000' : 'opacity-100'
        }`}
        style={{ height: '68px', background: `linear-gradient(to top, var(--color-black) 83%, transparent 100%)` }}
      />

      {/* Transparent overlay — intercepts clicks and right-clicks so the iframe URL stays hidden */}
      <div
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        role="button"
        tabIndex={0}
        className="absolute inset-0 z-20 cursor-pointer"
        onClick={togglePlay}
        onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? togglePlay() : undefined}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Custom controls — rendered above the overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col gap-1 px-4 pb-3 pt-6 bg-gradient-to-t from-[var(--color-overlay-dark)]/80 to-transparent">
        {/* Seek bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-zinc-300)] tabular-nums w-10 shrink-0">{formatTime(currentTime)}</span>
          <div className="relative flex-1 h-1 group">
            <div className="absolute inset-0 rounded-full bg-[var(--color-white)]/20" />
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-success)] pointer-events-none"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={1}
              value={currentTime}
              aria-label="Seek"
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
              onChange={handleSeekChange}
              onMouseDown={handleSeekStart}
              onTouchStart={handleSeekStart}
              onMouseUp={handleSeekCommit as unknown as React.MouseEventHandler<HTMLInputElement>}
              onTouchEnd={handleSeekCommit as unknown as React.TouchEventHandler<HTMLInputElement>}
            />
          </div>
          <span className="text-xs text-[var(--color-zinc-300)] tabular-nums w-10 shrink-0 text-right">{formatTime(duration)}</span>
        </div>

         {/* Play / speed / fullscreen */}
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlay}
            aria-label={playing ? 'Pause' : 'Play'}
            className="text-[var(--color-white)] hover:text-[var(--color-zinc-300)] transition-colors"
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>

          {/* Playback speed selector */}
          <div className="flex items-center gap-1">
            <label htmlFor="playback-rate" className="text-xs text-[var(--color-zinc-300)]">Speed</label>
            <select
              id="playback-rate"
              value={playbackRate}
              onChange={(e) => setPlaybackRate(Number(e.target.value))}
              className="bg-[var(--color-black)]/50 text-[var(--color-zinc-200)] text-xs rounded px-2 py-1 border border-[var(--color-white)]/20 focus:outline-none focus:ring-1 focus:ring-[var(--color-error-focus)] cursor-pointer"
            >
              <option value={0.25}>0.25x</option>
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>

          <button
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            className="text-[var(--color-white)] hover:text-[var(--color-zinc-300)] transition-colors"
          >
            <FullscreenIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25z" clipRule="evenodd" />
    </svg>
  )
}

function FullscreenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M15 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-3.97 3.97a.75.75 0 1 1-1.06-1.06l3.97-3.97h-2.69a.75.75 0 0 1-.75-.75zm-12 0A.75.75 0 0 1 3.75 3h4.5a.75.75 0 0 1 0 1.5H5.56l3.97 3.97a.75.75 0 0 1-1.06 1.06L4.5 5.56v2.69a.75.75 0 0 1-1.5 0v-4.5zm11.47 11.78a.75.75 0 1 1 1.06-1.06l3.97 3.97v-2.69a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5h2.69l-3.97-3.97zm-4.94-1.06a.75.75 0 0 1 0 1.06L5.56 19.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0z" clipRule="evenodd" />
    </svg>
  )
}
