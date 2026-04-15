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
    window.onYouTubeIframeAPIReady = resolve
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
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

export default function YoutubePlayer({ videoId, title, initialProgressSecs = 0 }: { videoId: string; title: string; initialProgressSecs?: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayerInstance | null>(null)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const scrubbingRef = useRef(false)

  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Poll current time while playing
  useEffect(() => {
    if (playing) {
      tickRef.current = setInterval(() => {
        if (!scrubbingRef.current && playerRef.current) {
          setCurrentTime(playerRef.current.getCurrentTime())
        }
      }, 500)
    } else {
      if (tickRef.current) clearInterval(tickRef.current)
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [playing])

  useEffect(() => {
    let destroyed = false

    loadYouTubeApi().then(() => {
      if (destroyed || !playerContainerRef.current) return
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId,
        playerVars: {
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (e) => {
            setDuration(e.target.getDuration())
            if (initialProgressSecs > 0) {
              e.target.seekTo(initialProgressSecs, true)
              setCurrentTime(initialProgressSecs)
            }
          },
          onStateChange: (e) => {
            const isPlaying = e.data === window.YT.PlayerState.PLAYING
            setPlaying(isPlaying)
            if (playerRef.current) {
              setDuration(playerRef.current.getDuration())
              setCurrentTime(playerRef.current.getCurrentTime())
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
  }, [videoId])

  const togglePlay = () => {
    if (!playerRef.current) return
    playing ? playerRef.current.pauseVideo() : playerRef.current.playVideo()
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
      className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-black"
    >
      {/* YouTube IFrame API mounts the iframe into this div */}
      <div ref={playerContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Transparent overlay — intercepts clicks and right-clicks so the iframe URL stays hidden */}
      <div
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        role="button"
        tabIndex={0}
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={togglePlay}
        onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? togglePlay() : undefined}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Custom controls — rendered above the overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col gap-1 px-4 pb-3 pt-6 bg-gradient-to-t from-black/80 to-transparent">
        {/* Seek bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-300 tabular-nums w-10 shrink-0">{formatTime(currentTime)}</span>
          <div className="relative flex-1 h-1 group">
            <div className="absolute inset-0 rounded-full bg-white/20" />
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-red-500 pointer-events-none"
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
          <span className="text-xs text-zinc-300 tabular-nums w-10 shrink-0 text-right">{formatTime(duration)}</span>
        </div>

        {/* Play / fullscreen */}
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlay}
            aria-label={playing ? 'Pause' : 'Play'}
            className="text-white hover:text-zinc-300 transition-colors"
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            className="text-white hover:text-zinc-300 transition-colors"
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
