import { create } from 'zustand'

type ChatMessage = {
  id: string
  userId: string
  username: string
  displayName: string
  avatarUrl: string | null
  content: string
  type: string
  isHighlight: boolean
  badges: string[]
  createdAt: string
}

type ChatState = {
  messages: ChatMessage[]
  isConnected: boolean
  slowMode: boolean
  slowModeInterval: number
  subOnly: boolean
  followerOnly: boolean
  emoteOnly: boolean
  addMessage: (message: ChatMessage) => void
  addMessages: (messages: ChatMessage[]) => void
  removeMessage: (id: string) => void
  clearMessages: () => void
  setConnected: (connected: boolean) => void
  setSlowMode: (enabled: boolean, interval?: number) => void
  setSubOnly: (enabled: boolean) => void
  setFollowerOnly: (enabled: boolean) => void
  setEmoteOnly: (enabled: boolean) => void
}

const MAX_MESSAGES = 200

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  isConnected: false,
  slowMode: false,
  slowModeInterval: 30,
  subOnly: false,
  followerOnly: false,
  emoteOnly: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages.slice(-(MAX_MESSAGES - 1)), message],
    })),
  addMessages: (messages) =>
    set((state) => ({
      messages: [...state.messages, ...messages].slice(-MAX_MESSAGES),
    })),
  removeMessage: (id) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content: '[message deleted]', type: 'deleted' } : m
      ),
    })),
  clearMessages: () => set({ messages: [] }),
  setConnected: (isConnected) => set({ isConnected }),
  setSlowMode: (enabled, interval) =>
    set({ slowMode: enabled, slowModeInterval: interval || 30 }),
  setSubOnly: (enabled) => set({ subOnly: enabled }),
  setFollowerOnly: (enabled) => set({ followerOnly: enabled }),
  setEmoteOnly: (enabled) => set({ emoteOnly: enabled }),
}))
