'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn, formatRelativeTime, getInitials } from '@/lib/utils'
import { Gift, Send, Smile, Heart, Flame, Sparkles, Crown } from 'lucide-react'

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

interface ChatBoxProps {
  streamId: string
  messages: ChatMessage[]
  onSendMessage: (content: string) => void
  onSendGift?: (giftId: string, quantity: number) => void
  onSendReaction?: (type: string) => void
}

const quickReactions = [
  { type: 'heart', icon: Heart, color: 'text-red-400' },
  { type: 'fire', icon: Flame, color: 'text-orange-400' },
  { type: 'sparkles', icon: Sparkles, color: 'text-yellow-400' },
  { type: 'crown', icon: Crown, color: 'text-purple-400' },
]

export function ChatBox({ messages, onSendMessage, onSendReaction }: ChatBoxProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom()
    }
  }, [messages, autoScroll, scrollToBottom])

  const handleScroll = () => {
    const container = containerRef.current
    if (!container) return
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100
    setAutoScroll(isAtBottom)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    onSendMessage(input.trim())
    setInput('')
  }

  return (
    <div className="flex flex-col h-full">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex items-start gap-2 text-sm group',
              msg.type === 'system' && 'justify-center',
              msg.type === 'gift' && 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-lg p-2 -mx-2',
              msg.type === 'subscription' && 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-2 -mx-2',
              msg.isHighlight && 'bg-purple-500/10 rounded-lg p-2 -mx-2'
            )}
          >
            {msg.type === 'system' ? (
              <p className="text-xs text-gray-500 italic">{msg.content}</p>
            ) : (
              <>
                <Avatar src={msg.avatarUrl} alt={msg.displayName} size="sm" className="mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-purple-300 text-xs hover:underline cursor-pointer">
                    {msg.displayName}
                  </span>{' '}
                  <span className="text-gray-300 break-words">{msg.content}</span>
                  <p className="text-[10px] text-gray-600 mt-0.5">
                    {formatRelativeTime(msg.createdAt)}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-1">
          {quickReactions.map((reaction) => {
            const Icon = reaction.icon
            return (
              <button
                key={reaction.type}
                onClick={() => onSendReaction?.(reaction.type)}
                className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${reaction.color}`}
                title={reaction.type}
              >
                <Icon size={16} />
              </button>
            )
          })}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            maxLength={500}
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <Button type="submit" size="sm" disabled={!input.trim()}>
            <Send size={14} />
          </Button>
        </form>
      </div>
    </div>
  )
}
