'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatNumber } from '@/lib/utils'
import {
  TrendingUp,
  Music,
  Smile,
  GraduationCap,
  UtensilsCrossed,
  Gift,
  Eye,
  Video,
  Trophy,
  CheckCircle,
  Medal,
} from 'lucide-react'

const CATEGORIES = [
  { key: 'fastest_growing', label: 'Fastest Growing', icon: TrendingUp },
  { key: 'top_musician', label: 'Top Musician', icon: Music },
  { key: 'top_comedian', label: 'Top Comedian', icon: Smile },
  { key: 'best_educator', label: 'Best Educator', icon: GraduationCap },
  { key: 'best_food_creator', label: 'Best Food Creator', icon: UtensilsCrossed },
  { key: 'most_gifted', label: 'Most Gifted', icon: Gift },
  { key: 'most_viewed', label: 'Most Viewed', icon: Eye },
  { key: 'top_streamer', label: 'Top Streamer', icon: Video },
]

const PERIODS = [
  { key: 'all_time', label: 'All Time' },
  { key: 'this_month', label: 'This Month' },
  { key: 'this_week', label: 'This Week' },
  { key: 'today', label: 'Today' },
]

const MOCK_ENTRIES = [
  { rank: 1, username: 'ArianaK_Official', displayName: 'Ariana K.', avatarUrl: null, score: 28450, metric: 'followers', isVerified: true },
  { rank: 2, username: 'DJ_Vibez', displayName: 'DJ Vibez', avatarUrl: null, score: 19200, metric: 'followers', isVerified: true },
  { rank: 3, username: 'ChefMaya', displayName: 'Chef Maya', avatarUrl: null, score: 15800, metric: 'followers', isVerified: true },
  { rank: 4, username: 'ComedyKing', displayName: 'Comedy King', avatarUrl: null, score: 12400, metric: 'followers', isVerified: true },
  { rank: 5, username: 'TechGuru', displayName: 'Tech Guru', avatarUrl: null, score: 9800, metric: 'followers', isVerified: false },
  { rank: 6, username: 'FitWithLiz', displayName: 'Fit With Liz', avatarUrl: null, score: 8700, metric: 'followers', isVerified: true },
  { rank: 7, username: 'ArtByLeo', displayName: 'Art By Leo', avatarUrl: null, score: 7200, metric: 'followers', isVerified: false },
  { rank: 8, username: 'TravelSam', displayName: 'Travel Sam', avatarUrl: null, score: 6500, metric: 'followers', isVerified: true },
]

const rankColors = ['text-yellow-400', 'text-gray-300', 'text-amber-600']
const rankBgColors = ['bg-yellow-500/10', 'bg-gray-300/10', 'bg-amber-600/10']

export default function LeaderboardPage() {
  const [activeCategory, setActiveCategory] = useState('fastest_growing')
  const [activePeriod, setActivePeriod] = useState('all_time')

  const sorted = [...MOCK_ENTRIES].sort((a, b) => a.rank - b.rank)
  const top3 = sorted.slice(0, 3)
  const rest = sorted.slice(3)

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          <p className="text-gray-400 mt-1">Top creators ranked by performance</p>
        </div>
        <Trophy size={28} className="text-yellow-400" />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeCategory === cat.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Period Filter */}
      <div className="flex items-center gap-2 mb-8">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setActivePeriod(p.key)}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
              activePeriod === p.key
                ? 'bg-orange-500 text-black'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-4 mb-10 h-64">
        {top3.map((entry, i) => {
          const heights = ['h-48', 'h-36', 'h-28']
          const order = [1, 0, 2]
          return (
            <div key={entry.rank} className={`flex flex-col items-center ${i === 0 ? 'order-2' : i === 1 ? 'order-1' : 'order-3'}`}>
              <div className={`w-16 h-16 rounded-full ${rankBgColors[entry.rank - 1]} border-2 flex items-center justify-center mb-2 ${
                entry.rank === 1 ? 'border-yellow-400' : entry.rank === 2 ? 'border-gray-300' : 'border-amber-600'
              }`}>
                <span className="text-xl font-bold text-white">{entry.username[0]}</span>
              </div>
              <div className={`w-24 ${heights[i]} rounded-t-xl ${rankBgColors[entry.rank - 1]} flex flex-col items-center justify-start pt-4`}>
                <Medal size={24} className={rankColors[entry.rank - 1]} />
                <span className="text-lg font-bold text-white mt-1">{entry.score.toLocaleString()}</span>
              </div>
              <p className="text-sm font-medium text-white mt-2">{entry.displayName}</p>
              <p className="text-xs text-gray-400">{entry.metric}</p>
            </div>
          )
        })}
      </div>

      {/* Ranked List */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">All Rankings</h2>
        <div className="space-y-2">
          {rest.map((entry) => (
            <div key={entry.rank} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-400 w-8">#{entry.rank}</span>
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{entry.username[0]}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-white">{entry.displayName}</span>
                    {entry.isVerified && <CheckCircle size={14} className="text-purple-400" />}
                  </div>
                  <p className="text-xs text-gray-500">{entry.score.toLocaleString()} {entry.metric}</p>
                </div>
              </div>
              <Button size="sm" variant="secondary">Follow</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
