'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { LayoutPanelTop, Settings } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { UserPlus, CalendarDays, Mail, Link2, MapPin } from 'lucide-react'

const tabs = ['Streams', 'Videos', 'Clips', 'About']

export default function ProfilePage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState('Streams')
  const [isFollowing, setIsFollowing] = useState(false)

  const isOwnProfile = false // TODO: check if viewing own profile

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Profile Header */}
      <Card className="overflow-hidden mb-6">
        <div className="h-48 bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-gray-900 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>
        <div className="px-6 pb-6 -mt-16 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-4">
            <Avatar src={null} alt="Creator" size="2xl" isVerified className="border-4 border-gray-950" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white">Creator Name</h1>
              <p className="text-gray-400">@creator_username</p>
              <p className="text-sm text-gray-500 mt-1">Just a creator who loves streaming</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isFollowing ? 'secondary' : 'primary'}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                <UserPlus size={16} />
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              {isOwnProfile && (
                <Button variant="ghost" size="sm">
                  <Settings size={16} />
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <span className="font-semibold text-white">{formatNumber(12430)}</span>
              followers
            </span>
            <span className="flex items-center gap-1">
              <span className="font-semibold text-white">{formatNumber(856)}</span>
              following
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays size={14} />
              Joined July 2026
            </span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/10 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-purple-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="text-center py-20">
          <LayoutPanelTop size={48} className="mx-auto text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">No {activeTab.toLowerCase()} yet</h3>
        <p className="text-gray-500">Content will appear here</p>
      </div>
    </div>
  )
}
