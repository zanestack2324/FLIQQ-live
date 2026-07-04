'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useActiveStream } from '@/hooks/use-stream'
import { useChat } from '@/hooks/use-chat'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ChatBox } from '@/components/chat/chat-box'
import { formatNumber, formatRelativeTime } from '@/lib/utils'
import {
  Heart,
  Share2,
  Flag,
  Users,
  MessageCircle,
  Maximize2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Gift,
  Link2,
  UserPlus,
  Settings,
  ChevronDown,
} from 'lucide-react'

export default function LiveStreamPage() {
  const params = useParams()
  const streamId = params.id as string
  const { stream: activeStream, viewerCount, quality, volume, isMuted, isPlaying, isFullscreen, setQuality, setVolume, toggleMute, togglePlay, toggleFullscreen } = useActiveStream(streamId)
  const { messages, isConnected, sendMessage, sendGift, sendReaction } = useChat(streamId)
  const [showGiftPicker, setShowGiftPicker] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  if (!activeStream) {
    return (
      <div className="min-h-screen bg-black pt-16">
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Users size={32} className="text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-400 mb-2">Stream not found</h2>
            <p className="text-gray-500">This stream may have ended or doesn&apos;t exist</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Video Player */}
          <div className="relative bg-black flex-shrink-0" style={{ maxHeight: '70vh' }}>
            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center group cursor-pointer" onClick={togglePlay}>
              <Play size={64} className="text-white/30 group-hover:text-white/50 transition-colors" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Stream Info Overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-3">
                <Badge variant="danger" size="md">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-1.5" />
                  LIVE
                </Badge>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/70 text-white text-sm rounded-lg backdrop-blur-sm">
                  <Users size={14} />
                  {formatNumber(viewerCount || activeStream.viewerCount)}
                </div>
              </div>

              {/* Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-4">
                  <button onClick={(e) => { e.stopPropagation(); togglePlay() }} className="text-white hover:text-purple-400 transition-colors">
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); toggleMute() }} className="text-white hover:text-purple-400 transition-colors">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume * 100}
                    onChange={(e) => { setVolume(Number(e.target.value) / 100) }}
                    className="w-24 accent-purple-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1" />
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="bg-black/50 text-white text-sm border border-white/10 rounded-lg px-2 py-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="auto">Auto</option>
                    <option value="source">Source</option>
                    <option value="1080p">1080p</option>
                    <option value="720p">720p</option>
                    <option value="480p">480p</option>
                    <option value="360p">360p</option>
                  </select>
                  <button onClick={(e) => { e.stopPropagation(); toggleFullscreen() }} className="text-white hover:text-purple-400 transition-colors">
                    <Maximize2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stream Details */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-4xl">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl lg:text-2xl font-bold text-white mb-2">{activeStream.title}</h1>
                  <div className="flex items-center gap-3 text-sm">
                    <Badge variant="primary">{activeStream.category || 'General'}</Badge>
                    <span className="text-gray-500">
                      Started {formatRelativeTime(activeStream.startedAt || new Date().toISOString())}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant={isFollowing ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    <UserPlus size={16} />
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button
                    variant={isSubscribed ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setIsSubscribed(!isSubscribed)}
                  >
                    Subscribe
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowGiftPicker(true)}>
                    <Gift size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 size={16} />
                  </Button>
                </div>
              </div>

              {/* Creator Info */}
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl mb-4">
                <Avatar src={activeStream.user?.avatarUrl} alt={activeStream.user?.displayName || ''} size="xl" isVerified={activeStream.user?.isVerifiedBadge} />
                <div>
                  <h3 className="text-lg font-semibold text-white">{activeStream.user?.displayName}</h3>
                  <p className="text-sm text-gray-400">@{activeStream.user?.username}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatNumber(activeStream.user?.followerCount || 0)} followers
                  </p>
                </div>
              </div>

              {/* Description */}
              {activeStream.description && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">{activeStream.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 lg:w-96 border-l border-white/10 flex flex-col bg-gray-950/50 hidden md:flex">
          <div className="p-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-white">Live Chat</span>
              {isConnected && <span className="w-2 h-2 bg-green-500 rounded-full" />}
            </div>
            <span className="text-xs text-gray-500">{messages.length} messages</span>
          </div>
          <ChatBox
            streamId={streamId}
            messages={messages}
            onSendMessage={sendMessage}
            onSendGift={sendGift}
            onSendReaction={sendReaction}
          />
        </div>
      </div>
    </div>
  )
}
