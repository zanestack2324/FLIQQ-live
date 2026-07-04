'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

type MediaDevice = {
  id: string
  label: string
  kind: string
}

export function useMediaDevices() {
  const [audioInputs, setAudioInputs] = useState<MediaDevice[]>([])
  const [videoInputs, setVideoInputs] = useState<MediaDevice[]>([])
  const [error, setError] = useState<string | null>(null)

  const getDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      setAudioInputs(
        devices
          .filter((d) => d.kind === 'audioinput')
          .map((d) => ({ id: d.deviceId, label: d.label || `Microphone ${d.deviceId.slice(0, 4)}`, kind: d.kind }))
      )
      setVideoInputs(
        devices
          .filter((d) => d.kind === 'videoinput')
          .map((d) => ({ id: d.deviceId, label: d.label || `Camera ${d.deviceId.slice(0, 4)}`, kind: d.kind }))
      )
    } catch (err) {
      setError('Failed to enumerate media devices')
    }
  }, [])

  useEffect(() => {
    navigator.mediaDevices?.addEventListener('devicechange', getDevices)
    getDevices()
    return () => {
      navigator.mediaDevices?.removeEventListener('devicechange', getDevices)
    }
  }, [getDevices])

  return { audioInputs, videoInputs, error, refresh: getDevices }
}

type MediaStreamState = {
  stream: MediaStream | null
  isActive: boolean
  error: string | null
}

export function useUserMedia(constraints?: MediaStreamConstraints) {
  const [state, setState] = useState<MediaStreamState>({
    stream: null,
    isActive: false,
    error: null,
  })
  const streamRef = useRef<MediaStream | null>(null)

  const start = useCallback(async (overrideConstraints?: MediaStreamConstraints) => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
      const stream = await navigator.mediaDevices.getUserMedia(
        overrideConstraints || constraints || { video: true, audio: true }
      )
      streamRef.current = stream
      setState({ stream, isActive: true, error: null })
      return stream
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to access media devices'
      setState({ stream: null, isActive: false, error: message })
      return null
    }
  }, [constraints])

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    setState({ stream: null, isActive: false, error: null })
  }, [])

  const switchCamera = useCallback(async () => {
    const videoTrack = streamRef.current?.getVideoTracks()[0]
    if (!videoTrack) return
    const newFacingMode = videoTrack.getSettings().facingMode === 'user' ? 'environment' : 'user'
    await start({ video: { facingMode: newFacingMode }, audio: true })
  }, [start])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  return { ...state, start, stop, switchCamera }
}

export function useScreenShare() {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startShare = useCallback(async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' } as MediaTrackConstraints,
        audio: false,
      })
      setStream(displayStream)
      setIsSharing(true)
      setError(null)
      displayStream.getVideoTracks()[0]?.addEventListener('ended', () => {
        setStream(null)
        setIsSharing(false)
      })
      return displayStream
    } catch (err) {
      setError('Screen sharing was cancelled or failed')
      return null
    }
  }, [])

  const stopShare = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
      setStream(null)
      setIsSharing(false)
    }
  }, [stream])

  return { stream, isSharing, error, startShare, stopShare }
}

type BeautyFilter = {
  enabled: boolean
  smoothness: number
  brightness: number
  contrast: number
  saturation: number
  blur: number
  hue: number
}

export function useBeautyFilters() {
  const [filters, setFilters] = useState<BeautyFilter>({
    enabled: false,
    smoothness: 0.5,
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
    hue: 0,
  })

  const applyFilters = useCallback(
    (videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) => {
      if (!filters.enabled) return
      const ctx = canvasElement.getContext('2d')
      if (!ctx) return
      canvasElement.width = videoElement.videoWidth
      canvasElement.height = videoElement.videoHeight
      ctx.filter = [
        `brightness(${1 + filters.brightness})`,
        `contrast(${1 + filters.contrast})`,
        `saturate(${1 + filters.saturation})`,
        `blur(${filters.blur}px)`,
        `hue-rotate(${filters.hue}deg)`,
      ].join(' ')
      ctx.drawImage(videoElement, 0, 0)
    },
    [filters]
  )

  const updateFilter = useCallback(
    (key: keyof BeautyFilter, value: number | boolean) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const resetFilters = useCallback(() => {
    setFilters({
      enabled: false,
      smoothness: 0.5,
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
      hue: 0,
    })
  }, [])

  return { filters, applyFilters, updateFilter, resetFilters }
}
