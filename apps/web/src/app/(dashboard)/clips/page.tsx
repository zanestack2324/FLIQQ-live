'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatNumber } from '@/lib/utils'
import { Film, Video, Play, Eye, Search } from 'lucide-react'

const MOCK_CLIPS = [
  { id: '1', title: 'Ariana hits the high note!', creator: 'ArianaK_Official', views: 12400, duration: '0:32', time: '2 hours ago' },
  { id: '2', title: 'DJ Vibez drops the beat', creator: 'DJ_Vibez', views: 8900, duration: '0:45', time: '5 hours ago' },
  { id: '3', title: 'Chef Maya taste test fail', creator: 'ChefMaya', views: 15200, duration: '0:28', time: '1 day ago' },
  { id: '4', title: 'Comedy King roast session', creator: 'ComedyKing', views: 22100, duration: '1:02', time: '2 days ago' },
]

const MOCK_VODS = [
  { id: '1', title: 'Weekend Stream - July 2026', creator: 'ArianaK_Official', views: 3400, duration: '2:15:30', time: '3 days ago' },
  { id: '2', title: 'Late Night Chat with Fans', creator: 'DJ_Vibez', views: 2100, duration: '1:45:00', time: '1 week ago' },
]

export default function ClipsPage() {
  const [activeTab, setActiveTab] = useState<'clips' | 'vods'>('clips')

  const items = activeTab === 'clips' ? MOCK_CLIPS : MOCK_VODS

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Clips & VODs</h1>
          <p className="text-gray-400 mt-1">Watch highlights and full streams</p>
        </div>
        <Film size={24} className="text-purple-400" />
      </div>

      <div className="flex items-center gap-2 mb-6">
        {(['clips', 'vods'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            {tab === 'clips' ? <Film size={16} /> : <Video size={16} />}
            {tab === 'clips' ? 'Clips' : 'VODs'}
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          className="w-full bg-white/5 rounded-lg pl-10 pr-4 py-3 border border-white/10 text-white text-sm"
        />
      </div>

      <Button fullWidth className="mb-6" icon={<Film size={16} />}>
        {activeTab === 'clips' ? 'Create a Clip' : 'Upload VOD'}
      </Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:border-purple-500/30 transition-all cursor-pointer">
            <div className="relative aspect-video bg-gray-800 flex items-center justify-center">
              <Play size={40} className="text-white/50" />
              <Badge variant="secondary" className="absolute bottom-2 right-2">{item.duration}</Badge>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">{item.title}</h3>
              <p className="text-xs text-purple-400 mb-2">{item.creator}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Eye size={12} />
                <span>{formatNumber(item.views)} views</span>
                <span>·</span>
                <span>{item.time}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
