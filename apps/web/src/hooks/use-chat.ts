'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useChatStore } from '@/stores/chat-store'
import {
  getSocket,
  joinStreamRoom,
  leaveStreamRoom,
  sendChatMessage as socketSendMessage,
  sendGift as socketSendGift,
  sendReaction as socketSendReaction,
  onSocketEvent,
  connectSocket,
} from '@/lib/socket'
import { useAuthStore } from '@/stores/auth-store'
import { useStreamStore } from '@/stores/stream-store'

export function useChat(streamId: string) {
  const {
    messages,
    isConnected,
    addMessage,
    removeMessage,
    clearMessages,
    setConnected,
  } = useChatStore()
  const { user } = useAuthStore()
  const connectedRef = useRef(false)

  useEffect(() => {
    if (!streamId || connectedRef.current) return
    connectedRef.current = true

    const socket = getSocket()
    if (!socket.connected) {
      connectSocket()
    }

    const cleanups = [
      onSocketEvent('chat:message', (data) => {
        addMessage({
          id: data.id,
          userId: data.userId,
          username: data.username,
          displayName: data.username,
          avatarUrl: null,
          content: data.content,
          type: data.type,
          isHighlight: false,
          badges: [],
          createdAt: data.createdAt,
        })
      }),
      onSocketEvent('chat:deleted', (data) => {
        removeMessage(data.id)
      }),
      onSocketEvent('stream:viewerCount', (data) => {
        useStreamStore?.getState()?.setViewerCount(data.count)
      }),
    ]

    socket.on('connect', () => {
      setConnected(true)
      joinStreamRoom(streamId)
    })

    socket.on('disconnect', () => {
      setConnected(false)
    })

    if (socket.connected) {
      setConnected(true)
      joinStreamRoom(streamId)
    }

    return () => {
      connectedRef.current = false
      leaveStreamRoom(streamId)
      clearMessages()
      setConnected(false)
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [streamId, addMessage, removeMessage, clearMessages, setConnected])

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || !user) return
      socketSendMessage(streamId, content.trim())
    },
    [streamId, user]
  )

  const sendGift = useCallback(
    (giftId: string, quantity: number = 1) => {
      socketSendGift(streamId, giftId, quantity)
    },
    [streamId]
  )

  const sendReaction = useCallback(
    (type: string) => {
      socketSendReaction(streamId, type)
    },
    [streamId]
  )

  return {
    messages,
    isConnected,
    sendMessage,
    sendGift,
    sendReaction,
  }
}
