'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton, StreamCardSkeleton } from '@/components/ui/skeleton'
import { formatNumber } from '@/lib/utils'
import { Play, Users, TrendingUp, Clock, Flame, Filter } from 'lucide-react'

const sortOptions = [
  { value: 'trending', label: 'Trending', icon: Flame },
  { value: 'popular', label: 'Popular', icon: TrendingUp },
  { value: 'recent', label: 'Recent', icon: Clock },
]

const categories = [
  { value: 'all', label: 'All' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'music', label: 'Music' },
  { value: 'just-chatting', label: 'Just Chatting' },
  { value: 'art', label: 'Art' },
  { value: 'sports', label: 'Sports' },
  { value: 'irl', label: 'IRL' },
  { value: 'tech', label: 'Tech' },
  { value: 'podcast', label: 'Podcast' },
]

const mockStreams = Array.from({ length: 20 }, (_, i) => ({
  id: `stream-${i + 1}`,
  title: [
    'Late Night Vibes & Chill Music',
    'Pro Ranked Push - Road to Radiant',
    'Piano Improvisation Session',
    'Digital Art Speedpaint',
    'Cooking Stream - Making Pasta',
    'React Tutorial - Full Stack App',
    'Guitar Cover Requests',
    'Valorant Tournament Finals',
    'Book Review & Discussion',
    'Fitness Training Live',
    'Gaming Marathon - 24 Hours',
    'Podcast - Tech Trends 2026',
  ][i % 12],
  username: `creator${i + 1}`,
  displayName: ['Luna', 'Shadow', 'Melody', 'Akira', 'ChefRay', 'DevMike', 'Strummer', 'ProGamer', 'BookWorm', 'FitLife', 'NoLifeGrind', 'TechTalk'][i % 12],
  category: ['Just Chatting', 'Gaming', 'Music', 'Art', 'IRL', 'Tech', 'Music', 'Gaming', 'Just Chatting', 'Sports', 'Gaming', 'Podcast'][i % 12],
  viewerCount: Math.floor(Math.random() * 50000) + 100,
  avatarUrl: null,
  thumbnailUrl: null,
  tags: ['live', 'trending'],
  isLive: Math.random() > 0.3,
}))

function FeedContent() {
  const searchParams = useSearchParams()
  const [sort, setSort] = useState(searchParams.get('sort') || 'trending')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [isLoading] = useState(false)

  const filteredStreams = mockStreams.filter(
    (s) => (category === 'all' || s.category.toLowerCase().includes(category)) && s.isLive
  )

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Sort & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                category === cat.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {sortOptions.map((opt) => {
            const Icon = opt.icon
            return (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  sort === opt.value
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Stream Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <StreamCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredStreams.length === 0 ? (
        <div className="text-center py-20">
          <Users size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No live streams right now</h3>
          <p className="text-gray-500">Check back later or try a different category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStreams.map((stream) => (
            <Link key={stream.id} href={`/live/${stream.id}`}>
              <Card hover className="group h-full">
                <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <Play size={48} className="text-white/20 group-hover:text-white/60 transition-all group-hover:scale-110" />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-md">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      LIVE
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-black/70 text-white text-xs rounded-md">
                      <Users size={12} />
                      {formatNumber(stream.viewerCount)}
                    </span>
                  </div>
                  <Badge variant="default" className="absolute bottom-2 left-2 text-xs">
                    {stream.category}
                  </Badge>
                </div>
                <div className="p-3">
                  <div className="flex items-start gap-3">
                    <Avatar src={stream.avatarUrl} alt={stream.displayName} size="md" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors text-sm">
                        {stream.title}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">{stream.displayName}</p>
                      <p className="text-xs text-gray-500">{formatNumber(stream.viewerCount)} viewers</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FeedPage() {
  return (
    <Suspense fallback={
      <div className="p-4 lg:p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <StreamCardSkeleton key={i} />)}
        </div>
      </div>
    }>
      <FeedContent />
    </Suspense>
  )
}
