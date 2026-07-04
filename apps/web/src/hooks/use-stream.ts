'use client'

import { useEffect, useCallback } from 'react'
import { useStreamStore } from '@/stores/stream-store'
import api from '@/lib/api'

export function useStreams(category?: string) {
  const { streams, setStreams } = useStreamStore()

  const fetchStreams = useCallback(async () => {
    try {
      const data = await api.get<{ streams: typeof streams }>('/live/streams', {
        params: category ? { category } : undefined,
      })
      setStreams(data.streams)
    } catch {
      // handle error
    }
  }, [category, setStreams])

  useEffect(() => {
    fetchStreams()
  }, [fetchStreams])

  return { streams, refetch: fetchStreams }
}

export function useActiveStream(streamId: string) {
  const {
    activeStream,
    viewerCount,
    setActiveStream,
    setViewerCount,
    isFullscreen,
    quality,
    volume,
    isMuted,
    isPlaying,
    setFullscreen,
    setQuality,
    setVolume,
    setMuted,
    setPlaying,
    updateViewerCount,
  } = useStreamStore()

  const fetchStream = useCallback(async () => {
    try {
      const data = await api.get<{ stream: typeof activeStream }>(`/live/streams/${streamId}`)
      setActiveStream(data.stream)
      setViewerCount(data.stream?.viewerCount || 0)
    } catch {
      setActiveStream(null)
    }
  }, [streamId, setActiveStream, setViewerCount])

  useEffect(() => {
    fetchStream()
  }, [fetchStream])

  const toggleFullscreen = useCallback(() => {
    setFullscreen(!isFullscreen)
  }, [isFullscreen, setFullscreen])

  const toggleMute = useCallback(() => {
    setMuted(!isMuted)
  }, [isMuted, setMuted])

  const togglePlay = useCallback(() => {
    setPlaying(!isPlaying)
  }, [isPlaying, setPlaying])

  return {
    stream: activeStream,
    viewerCount,
    isFullscreen,
    quality,
    volume,
    isMuted,
    isPlaying,
    setQuality,
    setVolume,
    toggleFullscreen,
    toggleMute,
    togglePlay,
    updateViewerCount,
    refetch: fetchStream,
  }
}
