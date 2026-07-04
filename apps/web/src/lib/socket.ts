import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3001', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })
  }
  return socket
}

export function connectSocket(token?: string) {
  const s = getSocket()
  if (token) {
    s.auth = { token }
  }
  if (!s.connected) {
    s.connect()
  }
  return s
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect()
  }
}

export function joinStreamRoom(streamId: string) {
  const s = getSocket()
  s.emit('stream:join', { streamId })
}

export function leaveStreamRoom(streamId: string) {
  const s = getSocket()
  s.emit('stream:leave', { streamId })
}

export function sendChatMessage(streamId: string, message: string) {
  const s = getSocket()
  s.emit('chat:message', { streamId, message })
}

export function sendGift(streamId: string, giftId: string, quantity: number) {
  const s = getSocket()
  s.emit('gift:send', { streamId, giftId, quantity })
}

export function sendReaction(streamId: string, type: string) {
  const s = getSocket()
  s.emit('stream:reaction', { streamId, type })
}

export function joinQueue(streamId: string) {
  const s = getSocket()
  s.emit('stream:joinQueue', { streamId })
}

export type SocketEvent = {
  'chat:message': (data: { id: string; userId: string; username: string; content: string; type: string; createdAt: string }) => void
  'chat:deleted': (data: { id: string }) => void
  'gift:received': (data: { id: string; senderId: string; senderName: string; giftName: string; quantity: number; coinAmount: number }) => void
  'stream:viewerCount': (data: { count: number }) => void
  'stream:reaction': (data: { userId: string; type: string; count: number }) => void
  'stream:ended': (data: { streamId: string }) => void
  'stream:statusChange': (data: { status: string }) => void
  'stream:raid': (data: { fromStream: string; fromUser: string; viewerCount: number }) => void
  'notification': (data: { type: string; title: string; body?: string }) => void
  'user:online': (data: { userId: string }) => void
  'user:offline': (data: { userId: string }) => void
  'moderation:action': (data: { action: string; duration?: number }) => void
}

export function onSocketEvent(event: string, handler: (...args: any[]) => void): () => void {
  const s = getSocket() as any
  s.on(event, handler)
  return () => {
    s.off(event, handler)
  }
}

export default getSocket
