'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  Settings,
  Gamepad2,
  Image,
  Tag,
  Globe,
  Users,
  Lock,
  Sparkles,
  ChevronDown,
  Copy,
} from 'lucide-react'

type StreamType = 'standard' | 'multi_guest' | 'pk_battle' | 'screen_share'

const streamTypes: { value: StreamType; label: string; icon: React.ElementType; description: string }[] = [
  { value: 'standard', label: 'Standard Stream', icon: Video, description: 'Go live solo with your camera and mic' },
  { value: 'multi_guest', label: 'Multi-Guest', icon: Users, description: 'Invite guests to join your stream' },
  { value: 'pk_battle', label: 'PK Battle', icon: Gamepad2, description: 'Battle another creator live' },
  { value: 'screen_share', label: 'Screen Share', icon: Monitor, description: 'Share your screen with viewers' },
]

export function GoLiveForm() {
  const [streamType, setStreamType] = useState<StreamType>('standard')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isMature, setIsMature] = useState(false)
  const [micEnabled, setMicEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const streamKey = 'live_' + Math.random().toString(36).substring(2, 16)

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleGoLive = () => {
    if (!title.trim()) {
      toast.error('Please enter a stream title')
      return
    }
    toast.success('Going live!')
  }

  const copyStreamKey = () => {
    navigator.clipboard.writeText(streamKey)
    toast.success('Stream key copied')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stream Type Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {streamTypes.map((type) => {
          const Icon = type.icon
          const isSelected = streamType === type.value
          return (
            <button
              key={type.value}
              onClick={() => setStreamType(type.value)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center',
                isSelected
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/10 hover:border-white/20 bg-white/5'
              )}
            >
              <Icon size={24} className={isSelected ? 'text-purple-400' : 'text-gray-400'} />
              <span className="text-sm font-medium text-white">{type.label}</span>
              <span className="text-xs text-gray-500 leading-tight">{type.description}</span>
            </button>
          )
        })}
      </div>

      {/* Stream Details */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Stream Details</h2>

        <Input
          label="Stream Title"
          placeholder="Enter your stream title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          icon={<Video size={16} />}
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select a category</option>
            <option value="gaming">Gaming</option>
            <option value="music">Music</option>
            <option value="just-chatting">Just Chatting</option>
            <option value="art">Art</option>
            <option value="sports">Sports</option>
            <option value="irl">IRL</option>
            <option value="tech">Tech</option>
            <option value="podcast">Podcast</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="primary">
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-1 text-purple-300 hover:text-white">&times;</button>
              </Badge>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add tags (press Enter)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isMature}
            onChange={(e) => setIsMature(e.target.checked)}
            className="w-4 h-4 rounded border-white/10 bg-white/5 accent-purple-500"
          />
          <span className="text-sm text-gray-300">Contains mature content (18+)</span>
        </label>
      </Card>

      {/* Source Settings */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Source Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMicEnabled(!micEnabled)}
            className={cn(
              'flex items-center justify-center gap-3 p-4 rounded-xl border transition-all',
              micEnabled
                ? 'border-green-500/50 bg-green-500/10'
                : 'border-white/10 bg-white/5'
            )}
          >
            {micEnabled ? <Mic size={20} className="text-green-400" /> : <MicOff size={20} className="text-gray-400" />}
            <span className="text-sm font-medium text-white">Microphone</span>
          </button>
          <button
            onClick={() => setCameraEnabled(!cameraEnabled)}
            className={cn(
              'flex items-center justify-center gap-3 p-4 rounded-xl border transition-all',
              cameraEnabled
                ? 'border-green-500/50 bg-green-500/10'
                : 'border-white/10 bg-white/5'
            )}
          >
            {cameraEnabled ? <Camera size={20} className="text-green-400" /> : <CameraOff size={20} className="text-gray-400" />}
            <span className="text-sm font-medium text-white">Camera</span>
          </button>
        </div>
      </Card>

      {/* Stream Key */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Stream Key</h2>
            <p className="text-sm text-gray-400">Use this in OBS or other streaming software</p>
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Settings size={14} />
            Advanced
          </button>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 font-mono">
            {streamKey}
          </code>
          <Button variant="secondary" size="sm" onClick={copyStreamKey}>
            <Copy size={14} />
            Copy
          </Button>
        </div>
        {showAdvanced && (
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">RTMP Endpoint</label>
              <code className="block px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 font-mono">
                rtmp://live.fliqq.com/stream
              </code>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Max Bitrate (kbps)</label>
                <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="6000">6000 (Recommended)</option>
                  <option value="8000">8000</option>
                  <option value="10000">10000</option>
                  <option value="12000">12000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Resolution</label>
                <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="1080p">1080p (Recommended)</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Button size="xl" fullWidth onClick={handleGoLive}>
        <Sparkles size={20} />
        Go Live
      </Button>
    </div>
  )
}
