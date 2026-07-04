import { create } from 'zustand'

type Stream = {
  id: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  viewerCount: number
  streamType: string
  status: string
  category: string | null
  tags: string[]
  isMature: boolean
  user: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
    isVerifiedBadge: boolean
    followerCount: number
  }
  startedAt: string | null
}

type StreamState = {
  streams: Stream[]
  activeStream: Stream | null
  viewerCount: number
  isFullscreen: boolean
  quality: string
  volume: number
  isMuted: boolean
  isPlaying: boolean
  setStreams: (streams: Stream[]) => void
  setActiveStream: (stream: Stream | null) => void
  setViewerCount: (count: number) => void
  setFullscreen: (isFullscreen: boolean) => void
  setQuality: (quality: string) => void
  setVolume: (volume: number) => void
  setMuted: (isMuted: boolean) => void
  setPlaying: (isPlaying: boolean) => void
  updateViewerCount: (count: number) => void
}

export const useStreamStore = create<StreamState>()((set) => ({
  streams: [],
  activeStream: null,
  viewerCount: 0,
  isFullscreen: false,
  quality: 'auto',
  volume: 1,
  isMuted: false,
  isPlaying: false,
  setStreams: (streams) => set({ streams }),
  setActiveStream: (stream) => set({ activeStream: stream }),
  setViewerCount: (count) => set({ viewerCount: count }),
  setFullscreen: (isFullscreen) => set({ isFullscreen }),
  setQuality: (quality) => set({ quality }),
  setVolume: (volume) => set({ volume }),
  setMuted: (isMuted) => set({ isMuted }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  updateViewerCount: (count) => set({ viewerCount: count }),
}))
